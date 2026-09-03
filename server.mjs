import { createReadStream, realpathSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import a2aHandler from "./api/a2a.js";
import mcpHandler from "./api/mcp.js";

const DEFAULT_PORT = 3000;
const MAX_BODY_BYTES = 1024 * 1024;
const DISCOVERY_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"',
  '</.well-known/mcp.json>; rel="service-meta"; type="application/json"',
  '</.well-known/agent-card.json>; rel="describedby"; type="application/a2a+json"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
].join(", ");

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".webm", "video/webm"],
  [".wasm", "application/wasm"],
  [".xml", "application/xml; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const SPECIAL_MIME_TYPES = new Map([
  ["/.well-known/api-catalog", 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"; charset=utf-8'],
  ["/.well-known/agent-card.json", "application/a2a+json; charset=utf-8"],
  ["/openapi.json", "application/vnd.oai.openapi+json;version=3.1; charset=utf-8"],
  ["/api/version", "application/json; charset=utf-8"],
  ["/api/youtube", "application/json; charset=utf-8"],
]);

function endText(response, status, message, headers = {}) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  response.end(message);
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw;
}

function acceptsMarkdown(request) {
  return String(request.headers.accept ?? "")
    .split(",")
    .some((range) => {
      const [mediaType, ...parameters] = range.split(";");
      const quality = parameters.find((parameter) => parameter.trim().toLowerCase().startsWith("q="));
      return mediaType.trim().toLowerCase() === "text/markdown" && (!quality || Number.parseFloat(quality.split("=")[1]) > 0);
    });
}

function resolveStaticPath(staticRoot, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes("\0") || decoded.includes("\\")) return null;
  const relative = decoded.replace(/^\/+/, "");
  let candidate = resolve(staticRoot, relative || "index.html");
  if (candidate !== staticRoot && !candidate.startsWith(`${staticRoot}${sep}`)) return null;
  try {
    candidate = realpathSync(candidate);
    if (candidate !== staticRoot && !candidate.startsWith(`${staticRoot}${sep}`)) return null;
    const stats = statSync(candidate);
    if (stats.isDirectory()) {
      const index = realpathSync(resolve(candidate, "index.html"));
      return index.startsWith(`${staticRoot}${sep}`) && statSync(index).isFile() ? index : null;
    }
    return stats.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

function serveStatic(request, response, staticRoot, pathname) {
  const negotiatedPath = pathname === "/" && acceptsMarkdown(request) ? "/index.md" : pathname;
  const filePath = resolveStaticPath(staticRoot, negotiatedPath);
  if (!filePath) return endText(response, 404, "Not Found\n");

  const stats = statSync(filePath);
  const contentType = SPECIAL_MIME_TYPES.get(negotiatedPath)
    ?? MIME_TYPES.get(extname(filePath).toLowerCase())
    ?? "application/octet-stream";
  const headers = {
    "Content-Type": contentType,
    "Content-Length": stats.size,
    "X-Content-Type-Options": "nosniff",
  };
  if (pathname === "/") {
    headers.Link = DISCOVERY_LINKS;
    headers.Vary = "Accept";
  }
  if (negotiatedPath.startsWith("/.well-known/")) headers["Access-Control-Allow-Origin"] = "*";
  response.writeHead(200, headers);
  if (request.method === "HEAD") return response.end();
  createReadStream(filePath).on("error", () => {
    if (!response.headersSent) endText(response, 500, "Internal Server Error\n");
    else response.destroy();
  }).pipe(response);
}

export function createPortfolioServer({ staticRoot = resolve(import.meta.dirname, "dist") } = {}) {
  const root = realpathSync(resolve(staticRoot));
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      const pathname = url.pathname;

      if (pathname === "/healthz") {
        if (request.method !== "GET" && request.method !== "HEAD") {
          return endText(response, 405, "Method Not Allowed\n", { Allow: "GET, HEAD" });
        }
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
        return response.end(request.method === "HEAD" ? undefined : "ok\n");
      }

      const handler = pathname === "/api/mcp" ? mcpHandler : pathname === "/api/a2a" ? a2aHandler : null;
      if (handler) {
        if (request.method === "POST") request.body = await readBody(request);
        return handler(request, response);
      }

      if (request.method !== "GET" && request.method !== "HEAD") {
        return endText(response, 405, "Method Not Allowed\n", { Allow: "GET, HEAD" });
      }
      return serveStatic(request, response, root, pathname);
    } catch (error) {
      if (!response.headersSent) {
        const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
        endText(response, status, status === 413 ? "Payload Too Large\n" : "Internal Server Error\n");
      } else {
        response.destroy();
      }
    }
  });
}

const isEntryPoint = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("PORT must be an integer between 0 and 65535");
  createPortfolioServer().listen(port, "0.0.0.0", () => console.log(`Portfolio server listening on port ${port}`));
}
