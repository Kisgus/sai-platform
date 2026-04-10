import { loadConfig } from "../config.js";
import { echoTool } from "../tools.js";
import { runEvalSuite } from "./harness.js";
import type { EvalCase } from "./types.js";

/**
 * Define your eval cases here. These run against a live LLM,
 * so keep them focused and deterministic where possible.
 */
const cases: EvalCase[] = [
  {
    name: "basic-greeting",
    input: "Say hello",
    expected: /hello/i,
  },
  {
    name: "tool-use-echo",
    input: "Use the echo tool to echo 'test123'",
    expected: "test123",
  },
];

async function main() {
  const config = loadConfig();
  const result = await runEvalSuite(config, [echoTool], cases);

  console.log(`\nEval results: ${result.passed}/${result.total} passed\n`);
  for (const r of result.results) {
    const icon = r.pass ? "PASS" : "FAIL";
    console.log(`  [${icon}] ${r.name} (${r.turnsUsed} turns)`);
    if (!r.pass) {
      console.log(`         actual: ${r.actual.slice(0, 200)}`);
      if (r.error) console.log(`         error: ${r.error}`);
    }
  }

  process.exit(result.failed > 0 ? 1 : 0);
}

main();
