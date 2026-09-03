import assert from "node:assert/strict";
import test from "node:test";
import a2aHandler from "../api/a2a.js";
import mcpHandler from "../api/mcp.js";

function invoke(handler, { method = "POST", headers = {}, body } = {}) {
  const responseHeaders = new Map();
  return new Promise((resolve) => {
    handler(
      { method, headers, body },
      {
        statusCode: 200,
        setHeader(name, value) { responseHeaders.set(name.toLowerCase(), value); },
        end(payload = "") {
          resolve({
            status: this.statusCode,
            headers: Object.fromEntries(responseHeaders),
            body: payload ? JSON.parse(payload) : null,
          });
        },
      },
    );
  });
}

const rpc = (id, method, params = {}) => ({ jsonrpc: "2.0", id, method, params });

test("MCP performs stateless initialize, tool discovery and useful tool calls", async () => {
  const initialized = await invoke(mcpHandler, {
    body: rpc(1, "initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "test-client", version: "1.0.0" },
    }),
  });
  assert.equal(initialized.status, 200);
  assert.equal(initialized.body.result.protocolVersion, "2025-06-18");
  assert.ok(initialized.body.result.capabilities.tools);
  assert.equal(initialized.headers["mcp-protocol-version"], "2025-06-18");
  assert.equal(initialized.headers["mcp-session-id"], undefined);

  const notification = await invoke(mcpHandler, {
    headers: { "mcp-protocol-version": "2025-06-18" },
    body: { jsonrpc: "2.0", method: "notifications/initialized" },
  });
  assert.equal(notification.status, 202);
  assert.equal(notification.body, null);

  const listed = await invoke(mcpHandler, { body: rpc(2, "tools/list") });
  assert.deepEqual(listed.body.result.tools.map(({ name }) => name), ["get_portfolio_info", "list_public_resources"]);

  const called = await invoke(mcpHandler, {
    body: rpc(3, "tools/call", { name: "list_public_resources", arguments: {} }),
  });
  assert.equal(called.body.result.isError, false);
  assert.ok(called.body.result.structuredContent.resources.some(({ url }) => url.endsWith("/openapi.json")));
});

test("MCP rejects unsupported transport methods, versions and unknown RPC methods", async () => {
  assert.equal((await invoke(mcpHandler, { method: "GET" })).status, 405);
  assert.equal((await invoke(mcpHandler, {
    headers: { "mcp-protocol-version": "1999-01-01" },
    body: rpc(1, "tools/list"),
  })).status, 400);
  assert.equal((await invoke(mcpHandler, { body: rpc(4, "unknown") })).body.error.code, -32601);
});

test("A2A v1 SendMessage returns a conforming read-only agent Message", async () => {
  const result = await invoke(a2aHandler, {
    headers: { "a2a-version": "1.0" },
    body: rpc("a2a-1", "SendMessage", {
      message: {
        messageId: "message-1",
        role: "ROLE_USER",
        parts: [{ text: "Lista los recursos públicos", mediaType: "text/plain" }],
      },
    }),
  });
  assert.equal(result.status, 200);
  assert.equal(result.headers["a2a-version"], "1.0");
  assert.equal(result.body.result.message.role, "ROLE_AGENT");
  assert.equal(result.body.result.message.parts[0].mediaType, "text/plain");
  assert.match(result.body.result.message.parts[0].text, /openapi\.json/);
});

test("A2A validates messages and exposes no unadvertised operations", async () => {
  const invalid = await invoke(a2aHandler, { body: rpc(1, "SendMessage", { message: { role: "ROLE_USER", parts: [] } }) });
  assert.equal(invalid.body.error.code, -32602);
  const unsupported = await invoke(a2aHandler, { body: rpc(2, "GetTask", { id: "none" }) });
  assert.equal(unsupported.body.error.code, -32601);
  assert.equal((await invoke(a2aHandler, { method: "GET" })).status, 405);
});
