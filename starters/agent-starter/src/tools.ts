export interface ToolResult {
  content: string;
  isError?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute(input: Record<string, unknown>): Promise<ToolResult>;
}

/** Example tool — replace with your own. */
export const echoTool: Tool = {
  name: "echo",
  description: "Echoes back the input message. Replace this with real tools.",
  inputSchema: {
    type: "object" as const,
    properties: {
      message: { type: "string", description: "Message to echo" },
    },
    required: ["message"],
  },
  async execute(input) {
    return { content: String(input.message) };
  },
};
