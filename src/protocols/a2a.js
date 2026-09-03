import { randomUUID } from "node:crypto";
import { portfolioAnswer } from "./portfolio-data.js";

const error = (id, code, message, data) => ({
  jsonrpc: "2.0",
  id: id ?? null,
  error: { code, message, ...(data ? { data } : {}) },
});

export function handleA2aMessage(request) {
  if (!request || typeof request !== "object" || Array.isArray(request) || request.jsonrpc !== "2.0" || !("id" in request) || typeof request.method !== "string") {
    return { status: 400, body: error(request?.id, -32600, "Request payload validation error") };
  }
  if (request.method !== "SendMessage") {
    return { status: 200, body: error(request.id, -32601, "Method not found") };
  }

  const message = request.params?.message;
  const textParts = Array.isArray(message?.parts)
    ? message.parts.filter((part) => part && typeof part.text === "string").map((part) => part.text.trim()).filter(Boolean)
    : [];
  if (message?.role !== "ROLE_USER" || typeof message.messageId !== "string" || textParts.length === 0) {
    return {
      status: 200,
      body: error(request.id, -32602, "Invalid parameters", [{
        "@type": "type.googleapis.com/google.rpc.BadRequest",
        fieldViolations: [{ field: "message", description: "ROLE_USER, messageId y al menos una parte de texto son obligatorios" }],
      }]),
    };
  }

  return {
    status: 200,
    body: {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        message: {
          messageId: randomUUID(),
          contextId: message.contextId ?? randomUUID(),
          role: "ROLE_AGENT",
          parts: [{ text: portfolioAnswer(textParts.join("\n")), mediaType: "text/plain" }],
        },
      },
    },
  };
}
