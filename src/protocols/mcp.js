import { portfolioInfo, publicResources } from "./portfolio-data.js";

export const MCP_PROTOCOL_VERSION = "2025-06-18";

export const mcpTools = [
  {
    name: "get_portfolio_info",
    title: "Información del portafolio",
    description: "Obtiene información pública y estable sobre Andrés López y los temas de su portafolio.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object",
      required: ["name", "description", "topics", "website", "youtube"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        topics: { type: "array", items: { type: "string" } },
        website: { type: "string", format: "uri" },
        youtube: { type: "string", format: "uri" },
      },
    },
  },
  {
    name: "list_public_resources",
    title: "Recursos públicos",
    description: "Lista recursos machine-readable públicos del portafolio con sus URLs y tipos MIME.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object",
      required: ["resources"],
      properties: {
        resources: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "url", "mediaType"],
            properties: {
              name: { type: "string" },
              url: { type: "string", format: "uri" },
              mediaType: { type: "string" },
            },
          },
        },
      },
    },
  },
];

const response = (id, result) => ({ jsonrpc: "2.0", id, result });
const error = (id, code, message, data) => ({
  jsonrpc: "2.0",
  id: id ?? null,
  error: { code, message, ...(data === undefined ? {} : { data }) },
});

export function handleMcpMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return { status: 400, body: error(message?.id, -32600, "Invalid Request") };
  }

  if (!("id" in message)) {
    if (message.method === "notifications/initialized" || message.method === "notifications/cancelled") {
      return { status: 202, body: null };
    }
    return { status: 202, body: null };
  }

  if (message.method === "initialize") {
    if (!message.params || typeof message.params.protocolVersion !== "string") {
      return { status: 200, body: error(message.id, -32602, "Invalid params") };
    }
    return {
      status: 200,
      body: response(message.id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "andreslopezco-portfolio", title: "Portafolio de Andrés López", version: "1.0.0" },
        instructions: "Servidor público, stateless y de solo lectura para consultar el portafolio y descubrir sus recursos.",
      }),
    };
  }

  if (message.method === "ping") return { status: 200, body: response(message.id, {}) };
  if (message.method === "tools/list") return { status: 200, body: response(message.id, { tools: mcpTools }) };
  if (message.method === "tools/call") {
    const name = message.params?.name;
    const args = message.params?.arguments ?? {};
    if (!name || typeof args !== "object" || Array.isArray(args) || Object.keys(args).length > 0) {
      return { status: 200, body: error(message.id, -32602, "Invalid params") };
    }
    const structuredContent = name === "get_portfolio_info"
      ? portfolioInfo
      : name === "list_public_resources"
        ? { resources: publicResources }
        : null;
    if (!structuredContent) {
      return { status: 200, body: error(message.id, -32602, `Unknown tool: ${name}`) };
    }
    return {
      status: 200,
      body: response(message.id, {
        content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }],
        structuredContent,
        isError: false,
      }),
    };
  }

  return { status: 200, body: error(message.id, -32601, "Method not found") };
}
