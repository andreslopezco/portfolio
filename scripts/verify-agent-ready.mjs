import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
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
assert.deepEqual(Object.keys(openapi.paths).sort(), ["/api/version", "/api/youtube"]);
for (const path of Object.values(openapi.paths)) assert.ok(path.get, "Solo se catalogan operaciones GET reales");

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
assert.doesNotMatch(read("src/layouts/Layout.astro"), /navigator\.modelContext/);
assert.match(read("src/layouts/Layout.astro"), /document\.modelContext/);
assert.match(read("src/layouts/Layout.astro"), /registerTool/);

const vercel = json("vercel.json");
const markdownRewrite = vercel.rewrites?.find((route) => route.source === "/" && route.destination === "/index.md");
assert.ok(markdownRewrite?.has?.some((condition) => condition.type === "header" && condition.key === "accept" && condition.value.includes("text/markdown")));
const homepageHeaders = vercel.headers?.find((route) => route.source === "/")?.headers ?? [];
assert.ok(homepageHeaders.some((header) => header.key.toLowerCase() === "link" && header.value.includes('rel="api-catalog"')));
assert.ok(homepageHeaders.some((header) => header.key.toLowerCase() === "link" && header.value.includes('rel="agent-skills"')));
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
  "public/.well-known/mcp/server-card.json",
  "public/.well-known/agent-card.json",
  "public/.well-known/oauth-authorization-server",
  "public/.well-known/openid-configuration",
  "public/.well-known/oauth-protected-resource",
]) {
  assert.ok(!existsSync(resolve(root, forbidden)), `No publicar capacidad inexistente: ${forbidden}`);
}

console.log(`Agent-ready: ${requiredFiles.length} archivos requeridos, ${skills.skills.length} skill y ${ard.entries.length} entradas ARD verificados.`);
