import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createPortfolioServer } from "../server.mjs";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

async function withServer(run) {
  const root = await mkdtemp(join(tmpdir(), "portfolio-server-"));
  await mkdir(join(root, ".well-known"), { recursive: true });
  await mkdir(join(root, "_astro"), { recursive: true });
  await mkdir(join(root, "api"), { recursive: true });
  await writeFile(join(root, "index.html"), "<!doctype html><title>Portfolio</title>");
  await writeFile(join(root, "index.md"), "# Portfolio\n");
  await writeFile(join(root, ".well-known", "api-catalog"), "{\"linkset\":[]}");
  await writeFile(join(root, "_astro", "app.js"), "console.log('ok')");
  await writeFile(join(root, "api", "version"), "{\"version\":\"test\"}");
  const server = createPortfolioServer({ staticRoot: root });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await rm(root, { recursive: true, force: true });
  }
}

const rpc = (id, method, params = {}) => ({ jsonrpc: "2.0", id, method, params });

async function availablePort() {
  const server = createNetServer();
  await new Promise((resolve, reject) => server.listen(0, "127.0.0.1", resolve).once("error", reject));
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

test("production entry point boots and serves /healthz", async () => {
  const dist = join(projectRoot, "dist");
  const createdDist = !existsSync(dist);
  if (createdDist) {
    await mkdir(dist);
    await writeFile(join(dist, "index.html"), "<!doctype html><title>Portfolio</title>");
  }

  const port = await availablePort();
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });

  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Server did not start: ${stderr}`)), 5000);
      child.once("exit", (code) => {
        clearTimeout(timeout);
        reject(new Error(`Server exited with code ${code}: ${stderr}`));
      });
      child.stdout.setEncoding("utf8").on("data", (chunk) => {
        if (chunk.includes("Portfolio server listening")) {
          clearTimeout(timeout);
          resolve();
        }
      });
    });
    const response = await fetch(`http://127.0.0.1:${port}/healthz`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "ok\n");
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => child.once("exit", resolve));
    if (createdDist) await rm(dist, { recursive: true, force: true });
  }
});

test("HTTP server negotiates Markdown and exposes discovery headers for GET and HEAD", () => withServer(async (base) => {
  const html = await fetch(`${base}/`);
  assert.equal(html.status, 200);
  assert.match(html.headers.get("content-type"), /^text\/html/);
  assert.equal(html.headers.get("vary"), "Accept");
  assert.match(html.headers.get("link"), /rel="api-catalog"/);
  assert.match(await html.text(), /Portfolio/);

  const markdown = await fetch(`${base}/`, { headers: { Accept: "text/markdown, text/html;q=0.8" } });
  assert.equal(markdown.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(markdown.headers.get("vary"), "Accept");
  assert.equal(await markdown.text(), "# Portfolio\n");

  const rejectedMarkdown = await fetch(`${base}/`, { headers: { Accept: "text/markdown;q=0, text/html" } });
  assert.match(rejectedMarkdown.headers.get("content-type"), /^text\/html/);

  const head = await fetch(`${base}/`, { method: "HEAD", headers: { Accept: "text/markdown" } });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-length"), String(Buffer.byteLength("# Portfolio\n")));
  assert.equal(await head.text(), "");
}));

test("HTTP server assigns special MIME types and preserves assets and real 404s", () => withServer(async (base) => {
  const catalog = await fetch(`${base}/.well-known/api-catalog`);
  assert.match(catalog.headers.get("content-type"), /^application\/linkset\+json/);
  assert.equal(catalog.headers.get("access-control-allow-origin"), "*");
  assert.equal((await fetch(`${base}/_astro/app.js`)).headers.get("content-type"), "text/javascript; charset=utf-8");
  assert.equal((await fetch(`${base}/api/version`)).headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal((await fetch(`${base}/missing`)).status, 404);
  assert.equal((await fetch(`${base}/..%2fserver.mjs`)).status, 404);
  assert.equal((await fetch(`${base}/`, { method: "POST" })).status, 405);
}));

test("HTTP server runs MCP and A2A handlers over actual requests", () => withServer(async (base) => {
  const initialized = await fetch(`${base}/api/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rpc(1, "initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "integration", version: "1" } })),
  });
  assert.equal(initialized.status, 200);
  assert.equal(initialized.headers.get("mcp-protocol-version"), "2025-06-18");
  assert.equal((await initialized.json()).result.protocolVersion, "2025-06-18");

  const a2a = await fetch(`${base}/api/a2a`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "A2A-Version": "1.0" },
    body: JSON.stringify(rpc("http-1", "SendMessage", { message: { messageId: "m-1", role: "ROLE_USER", parts: [{ text: "Recursos", mediaType: "text/plain" }] } })),
  });
  assert.equal(a2a.status, 200);
  assert.equal(a2a.headers.get("a2a-version"), "1.0");
  assert.equal((await a2a.json()).result.message.role, "ROLE_AGENT");

  assert.equal((await fetch(`${base}/api/mcp`, { method: "OPTIONS" })).status, 204);
  const invalid = await fetch(`${base}/api/mcp`, { method: "POST", body: "{" });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, -32700);
}));

test("healthcheck is available without caching", () => withServer(async (base) => {
  const response = await fetch(`${base}/healthz`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(await response.text(), "ok\n");
}));
