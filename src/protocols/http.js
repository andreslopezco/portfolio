export function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body);
  throw new SyntaxError("Missing JSON body");
}

export function sendJson(response, status, body, extraHeaders = {}) {
  response.statusCode = status;
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, MCP-Protocol-Version, A2A-Version");
  for (const [name, value] of Object.entries(extraHeaders)) response.setHeader(name, value);
  if (body === null) return response.end();
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  return response.end(JSON.stringify(body));
}
