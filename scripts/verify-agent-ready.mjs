import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const json = (path) => JSON.parse(read(path));

const requiredFiles = [
  "public/robots.txt",
  "public/sitemap.xml",
  "public/index.md",
  "public/llms.txt",
  "public/llms-full.txt",
  "public/auth.md",
  "public/openapi.json",
  "public/.well-known/api-catalog",
  "public/.well-known/ai-catalog.json",
  "public/.well-known/agent-skills/index.json",
  "public/.well-known/agent-skills/portfolio-discovery/SKILL.md",
  "public/.well-known/mcp.json",
  "public/.well-known/agent-card.json",
  "api/mcp.js",
  "api/a2a.js",
  "server.mjs",
  "nixpacks.toml",
  "vercel.json",
];
for (const path of requiredFiles) assert.ok(existsSync(resolve(root, path)), `Falta ${path}`);

const robots = read("public/robots.txt");
assert.match(robots, /^User-agent: \*$/m);
for (const bot of ["GPTBot", "OAI-SearchBot", "Claude-Web", "Google-Extended", "Amazonbot", "anthropic-ai", "Bytespider", "CCBot", "Applebot-Extended"]) {
  assert.match(robots, new RegExp(`^User-agent: ${bot}$`, "m"), `Falta regla para ${bot}`);
}
const contentSignals = robots.match(/^Content-Signal: .*$/gm) ?? [];
assert.equal(contentSignals.length, 10, "Cada grupo de robots debe declarar Content-Signal");
for (const signal of contentSignals) {
  assert.match(signal, /^Content-Signal: search=yes, ai-input=no, ai-train=no$/);
}
assert.match(robots, /^Sitemap: https:\/\/andreslopez\.co\/sitemap\.xml$/m);
assert.match(robots, /^Agentmap: https:\/\/andreslopez\.co\/\.well-known\/ai-catalog\.json$/m);

const sitemap = read("public/sitemap.xml");
assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.match(sitemap, /<loc>https:\/\/andreslopez\.co\/<\/loc>/);
assert.equal((sitemap.match(/<url>/g) ?? []).length, (sitemap.match(/<\/url>/g) ?? []).length);

const openapi = json("public/openapi.json");
assert.match(openapi.openapi, /^3\.1\./);
assert.deepEqual(Object.keys(openapi.paths).sort(), ["/api/a2a", "/api/mcp", "/api/version", "/api/youtube"]);
assert.ok(openapi.paths["/api/version"].get && openapi.paths["/api/youtube"].get);
assert.ok(openapi.paths["/api/mcp"].post && openapi.paths["/api/a2a"].post);

const apiCatalog = json("public/.well-known/api-catalog");
assert.ok(Array.isArray(apiCatalog.linkset) && apiCatalog.linkset.length > 0);
for (const entry of apiCatalog.linkset) {
  assert.ok(entry.anchor && entry["service-desc"]?.length && entry["service-doc"]?.length);
  assert.ok(openapi.paths[new URL(entry.anchor).pathname], `El anchor no es un endpoint OpenAPI real: ${entry.anchor}`);
}
assert.deepEqual(apiCatalog.linkset.map((entry) => new URL(entry.anchor).pathname).sort(), Object.keys(openapi.paths).sort());

const ard = json("public/.well-known/ai-catalog.json");
assert.equal(ard.specVersion, "1.0");
assert.ok(ard.host?.displayName && ard.host?.identifier);
assert.ok(Array.isArray(ard.entries) && ard.entries.length > 0);
for (const entry of ard.entries) {
  assert.match(entry.identifier, /^urn:air:andreslopez\.co:(?:[a-zA-Z0-9._-]+:)*[a-zA-Z0-9._-]+$/);
  assert.ok(entry.displayName && entry.type);
  assert.match(entry.type, /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i, `${entry.type} no tiene forma de media type IANA`);
  assert.notEqual(Boolean(entry.url), Boolean(entry.data), `${entry.identifier} debe tener exactamente url o data`);
  if (entry.url) assert.doesNotThrow(() => new URL(entry.url));
  assert.ok(entry.representativeQueries?.length >= 2 && entry.representativeQueries.length <= 5);
}

const skills = json("public/.well-known/agent-skills/index.json");
assert.equal(skills.$schema, "https://schemas.agentskills.io/discovery/0.2.0/schema.json");
assert.ok(skills.skills.length > 0);
for (const skill of skills.skills) {
  assert.match(skill.name, /^(?!-)(?!.*--)[a-z0-9-]{1,64}(?<!-)$/);
  assert.equal(skill.type, "skill-md");
  assert.ok(typeof skill.description === "string" && skill.description.length <= 1024);
  assert.ok(typeof skill.url === "string" && skill.url.length > 0);
  assert.match(skill.digest, /^sha256:[0-9a-f]{64}$/);
  const artifact = read(`public/.well-known/agent-skills/${skill.name}/SKILL.md`);
  const frontmatterDescription = artifact.match(/^description:\s*(.+)$/m)?.[1];
  assert.equal(skill.description, frontmatterDescription, `Description no coincide para ${skill.name}`);
  const digest = createHash("sha256").update(artifact).digest("hex");
  assert.equal(skill.digest, `sha256:${digest}`, `Digest incorrecto para ${skill.name}`);
}

assert.match(read("public/auth.md"), /^# .*auth\.md/im);
assert.match(read("public/auth.md"), /no (?:existe|se emiten).*OAuth|no opera un authorization server/i);
assert.match(read("src/layouts/Layout.astro"), /navigator\.modelContext/);
assert.match(read("src/layouts/Layout.astro"), /document\.modelContext/);
assert.match(read("src/layouts/Layout.astro"), /registerTool/);

const server = read("server.mjs");
assert.match(server, /createPortfolioServer/);
assert.match(server, /text\/markdown/);
assert.match(server, /Vary/);
assert.match(server, /api\/mcp/);
assert.match(server, /api\/a2a/);
assert.match(server, /healthz/);
const nixpacks = read("nixpacks.toml");
assert.match(nixpacks, /NIXPACKS_NODE_VERSION\s*=\s*"22"/);
assert.match(nixpacks, /\[phases\.install\][\s\S]*cmds\s*=\s*\["npm ci"\]/);
assert.match(nixpacks, /\[phases\.build\][\s\S]*cmds\s*=\s*\["npm run build"\]/);
assert.match(nixpacks, /\[start\][\s\S]*cmd\s*=\s*"npm start"/);
assert.equal(json("package.json").scripts?.start, "node server.mjs");
assert.equal(json("package.json").engines?.node, ">=22.12.0");
for (const obsolete of ["Dockerfile", ".dockerignore"]) {
  assert.ok(!existsSync(resolve(root, obsolete)), `No debe existir ${obsolete}: producción usa Nixpacks`);
}

const mcpCard = json("public/.well-known/mcp.json");
assert.ok(mcpCard.name && mcpCard.description && mcpCard.version);
assert.match(mcpCard.$schema, /modelcontextprotocol\.io\/schemas\/v1\/server-card\.schema\.json$/);
assert.deepEqual(mcpCard.remotes, [{ type: "streamable-http", url: "https://andreslopez.co/api/mcp", supportedProtocolVersions: ["2025-06-18"] }]);

const a2aCard = json("public/.well-known/agent-card.json");
for (const field of ["name", "description", "version", "capabilities", "supportedInterfaces", "defaultInputModes", "defaultOutputModes", "skills"]) {
  assert.ok(field in a2aCard, `Falta campo A2A 1.0: ${field}`);
}
assert.ok(a2aCard.skills.length > 0 && a2aCard.skills.every((skill) => skill.id && skill.name && skill.description && skill.tags?.length));
assert.deepEqual(a2aCard.supportedInterfaces, [{ url: "https://andreslopez.co/api/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }]);
assert.equal(a2aCard.capabilities.streaming, false);
assert.equal(a2aCard.capabilities.pushNotifications, false);

const vercel = json("vercel.json");
const markdownRewrite = vercel.rewrites?.find((route) => route.source === "/" && route.destination === "/index.md");
assert.ok(markdownRewrite?.has?.some((condition) => condition.type === "header" && condition.key === "accept" && condition.value.includes("text/markdown")));
const homepageHeaders = vercel.headers?.find((route) => route.source === "/")?.headers ?? [];
assert.ok(homepageHeaders.some((header) => header.key.toLowerCase() === "link" && header.value.includes('rel="api-catalog"')));
assert.ok(homepageHeaders.some((header) => header.key.toLowerCase() === "link" && header.value.includes('rel="agent-skills"')));
assert.ok(homepageHeaders.some((header) => header.key.toLowerCase() === "link" && header.value.includes("/.well-known/mcp.json")));
assert.ok(homepageHeaders.some((header) => header.key.toLowerCase() === "link" && header.value.includes("/.well-known/agent-card.json")));
const conditionalMarkdownHeaders = vercel.headers?.find((route) => route.source === "/" && route.has?.some((condition) => condition.type === "header" && condition.key === "accept" && condition.value.includes("text/markdown")))?.headers ?? [];
assert.ok(conditionalMarkdownHeaders.some((header) => header.key.toLowerCase() === "content-type" && header.value.startsWith("text/markdown")));
const apiCatalogHeaders = vercel.headers?.find((route) => route.source === "/.well-known/api-catalog")?.headers ?? [];
assert.ok(apiCatalogHeaders.some((header) => header.key.toLowerCase() === "content-type" && header.value.startsWith("application/linkset+json")));
assert.ok(apiCatalogHeaders.some((header) => header.key.toLowerCase() === "content-type" && header.value.includes('profile="https://www.rfc-editor.org/info/rfc9727"')));
const ardHeaders = vercel.headers?.find((route) => route.source === "/.well-known/ai-catalog.json")?.headers ?? [];
assert.ok(ardHeaders.some((header) => header.key.toLowerCase() === "access-control-allow-origin" && header.value === "*"));
const apiHeaders = vercel.headers?.find((route) => route.source === "/api/(.*)")?.headers ?? [];
assert.ok(apiHeaders.some((header) => header.key.toLowerCase() === "content-type" && header.value.startsWith("application/json")));

for (const forbidden of [
  "public/.well-known/oauth-authorization-server",
  "public/.well-known/openid-configuration",
  "public/.well-known/oauth-protected-resource",
]) {
  assert.ok(!existsSync(resolve(root, forbidden)), `No publicar capacidad inexistente: ${forbidden}`);
}

console.log(`Agent-ready: ${requiredFiles.length} archivos requeridos, ${skills.skills.length} skill y ${ard.entries.length} entradas ARD verificados.`);
