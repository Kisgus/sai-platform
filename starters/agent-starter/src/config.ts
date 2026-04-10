export interface AgentConfig {
  anthropicApiKey: string;
  model: string;
  port: number;
  logLevel: string;
  systemPrompt: string;
  maxTurns: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AgentConfig {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required");
  }

  return {
    anthropicApiKey: apiKey,
    model: env.MODEL ?? "claude-sonnet-4-6",
    port: Number(env.PORT ?? 3000),
    logLevel: env.LOG_LEVEL ?? "info",
    systemPrompt:
      env.SYSTEM_PROMPT ?? "You are a helpful AI assistant agent.",
    maxTurns: Number(env.MAX_TURNS ?? 10),
  };
}
