import { handleMcpMessage, MCP_PROTOCOL_VERSION } from "../src/protocols/mcp.js";
import { readJsonBody, sendJson } from "../src/protocols/http.js";

export default function handler(request, response) {
  if (request.method === "OPTIONS") return sendJson(response, 204, null);
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return sendJson(response, 405, { error: "Method Not Allowed" });
  }

  const protocolVersion = request.headers["mcp-protocol-version"];
  if (protocolVersion && protocolVersion !== MCP_PROTOCOL_VERSION) {
    return sendJson(response, 400, { error: `Unsupported MCP-Protocol-Version: ${protocolVersion}` });
  }
  try {
    const result = handleMcpMessage(readJsonBody(request));
    return sendJson(response, result.status, result.body, { "MCP-Protocol-Version": MCP_PROTOCOL_VERSION });
  } catch (error) {
    return sendJson(response, 400, { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
}
