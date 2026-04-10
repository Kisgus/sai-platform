import Anthropic from "@anthropic-ai/sdk";
import type { AgentConfig } from "./config.js";
import type { Tool, ToolResult } from "./tools.js";

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentRunResult {
  messages: AgentMessage[];
  finalResponse: string;
  turnsUsed: number;
}

export class Agent {
  private client: Anthropic;
  private config: AgentConfig;
  private tools: Map<string, Tool>;

  constructor(config: AgentConfig, tools: Tool[] = []) {
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
    this.config = config;
    this.tools = new Map(tools.map((t) => [t.name, t]));
  }

  async run(userMessage: string): Promise<AgentRunResult> {
    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: userMessage },
    ];
    const history: AgentMessage[] = [
      { role: "user", content: userMessage },
    ];

    const toolDefs: Anthropic.Tool[] = Array.from(this.tools.values()).map(
      (t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema as Anthropic.Tool["input_schema"],
      })
    );

    let turns = 0;

    while (turns < this.config.maxTurns) {
      turns++;

      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: 4096,
        system: this.config.systemPrompt,
        messages,
        tools: toolDefs.length > 0 ? toolDefs : undefined,
      });

      if (response.stop_reason === "end_turn" || !this.hasToolUse(response)) {
        const text = this.extractText(response);
        history.push({ role: "assistant", content: text });
        return { messages: history, finalResponse: text, turnsUsed: turns };
      }

      // Process tool calls
      const assistantContent = response.content;
      messages.push({ role: "assistant", content: assistantContent });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of assistantContent) {
        if (block.type === "tool_use") {
          const tool = this.tools.get(block.name);
          let result: ToolResult;
          if (tool) {
            result = await tool.execute(block.input as Record<string, unknown>);
          } else {
            result = { content: `Unknown tool: ${block.name}`, isError: true };
          }
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result.content,
            is_error: result.isError,
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
      history.push({
        role: "assistant",
        content: `[tool calls processed, turn ${turns}]`,
      });
    }

    return {
      messages: history,
      finalResponse: "[max turns reached]",
      turnsUsed: turns,
    };
  }

  private hasToolUse(response: Anthropic.Message): boolean {
    return response.content.some((block) => block.type === "tool_use");
  }

  private extractText(response: Anthropic.Message): string {
    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");
  }
}
