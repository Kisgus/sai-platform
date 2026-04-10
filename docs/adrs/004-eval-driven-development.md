# ADR-004: Eval-Driven Development

**Status:** Accepted  
**Date:** 2026-04-10

## Context

Agent behavior is non-deterministic. Traditional unit tests can verify tool implementations and configuration, but they cannot validate end-to-end agent quality.

## Decision

Every agent engagement ships with an eval suite:

- Eval cases define an input prompt and expected output pattern (substring or regex)
- The eval harness runs cases against a live LLM and reports pass/fail with turn counts
- No agent goes to production without measurable quality baselines

The eval framework is built into the `agent-starter` template at `src/eval/`.

## Consequences

- Eval runs require API keys and cost money — they are not part of CI by default
- Teams define eval cases specific to their agent's domain
- Regression tracking is manual for now (compare eval output between runs)
- Future: automated eval in CI with cost budgets
