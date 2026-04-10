import { Agent } from "../agent.js";
import type { AgentConfig } from "../config.js";
import type { Tool } from "../tools.js";
import type { EvalCase, EvalResult, EvalSuiteResult } from "./types.js";

export async function runEvalSuite(
  config: AgentConfig,
  tools: Tool[],
  cases: EvalCase[]
): Promise<EvalSuiteResult> {
  const agent = new Agent(config, tools);
  const results: EvalResult[] = [];

  for (const tc of cases) {
    try {
      const run = await agent.run(tc.input);
      const pass =
        tc.expected instanceof RegExp
          ? tc.expected.test(run.finalResponse)
          : run.finalResponse.includes(tc.expected);

      results.push({
        name: tc.name,
        pass,
        turnsUsed: run.turnsUsed,
        actual: run.finalResponse.slice(0, 500),
      });
    } catch (err) {
      results.push({
        name: tc.name,
        pass: false,
        turnsUsed: 0,
        actual: "",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const passed = results.filter((r) => r.pass).length;
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
  };
}
