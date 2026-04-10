import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-mcp-server",
  version: "0.1.0",
});

// --- Register your tools here ---

server.tool(
  "hello",
  "Returns a greeting. Replace this with your own tools.",
  { name: z.string().describe("Name to greet") },
  async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
  })
);

// --- Register your resources here ---

server.resource("status", "server://status", async () => ({
  contents: [
    {
      uri: "server://status",
      text: JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
    },
  ],
}));

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
