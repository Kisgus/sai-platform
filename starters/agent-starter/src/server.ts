import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AgentConfig } from "./config.js";
import { Agent } from "./agent.js";
import type { Tool } from "./tools.js";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function createAgentServer(config: AgentConfig, tools: Tool[]) {
  const agent = new Agent(config, tools);

  const server = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      return json(res, 200, { status: "ok" });
    }

    if (req.method === "POST" && req.url === "/run") {
      try {
        const body = JSON.parse(await readBody(req));
        const message = body.message;
        if (typeof message !== "string" || !message) {
          return json(res, 400, { error: "message is required" });
        }
        const result = await agent.run(message);
        return json(res, 200, result);
      } catch (err) {
        console.error("Agent run error:", err);
        return json(res, 500, {
          error: err instanceof Error ? err.message : "Internal error",
        });
      }
    }

    json(res, 404, { error: "Not found" });
  });

  return server;
}
