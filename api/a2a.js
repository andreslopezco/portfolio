import { handleA2aMessage } from "../src/protocols/a2a.js";
import { readJsonBody, sendJson } from "../src/protocols/http.js";

export default function handler(request, response) {
  if (request.method === "OPTIONS") return sendJson(response, 204, null);
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return sendJson(response, 405, { error: "Method Not Allowed" });
  }
  const version = request.headers["a2a-version"];
  if (version && version !== "1.0") {
    return sendJson(response, 400, { error: "Protocol version not supported", supportedVersions: ["1.0"] });
  }
  try {
    const result = handleA2aMessage(readJsonBody(request));
    return sendJson(response, result.status, result.body, { "A2A-Version": "1.0" });
  } catch (error) {
    return sendJson(response, 400, { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Invalid JSON payload" } });
  }
}
