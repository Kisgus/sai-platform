# sai-platform

MCP-first, eval-driven starter architecture for agent systems.

This is a public technical workbench from the SAIBA direction: small, inspectable
agent services with explicit tool boundaries, TypeScript-first conventions, and
evals before production claims.

## Status

Public starter/workbench. Not a production product.

Use this repo to inspect the architecture choices behind the current SAIBA
agent work. Production client implementation details live elsewhere.

## What It Shows

- A pnpm monorepo layout for agent services and MCP servers.
- TypeScript ESM as the default runtime style.
- MCP as the boundary between agent logic and external tools.
- A starter eval harness for checking agent behavior against concrete cases.
- Lightweight templates that can become client-specific systems without
  starting from a blank folder.

## Repository Map

| Path | Purpose |
| --- | --- |
| `starters/agent-starter` | Minimal agent service with config, tools, server entrypoint, and eval harness. |
| `starters/mcp-server-starter` | Minimal MCP server template for exposing tools/resources to agent clients. |
| `docs/adrs` | Architecture decision records for monorepo, TypeScript, MCP, and eval choices. |
| `tsconfig.base.json` | Shared TypeScript baseline. |
| `pnpm-workspace.yaml` | Workspace package map. |

## Architecture Decisions

- [ADR-001: Monorepo with pnpm workspaces](docs/adrs/001-monorepo-with-pnpm-workspaces.md)
- [ADR-002: TypeScript ESM first](docs/adrs/002-typescript-esm-first.md)
- [ADR-003: MCP-first tool integration](docs/adrs/003-mcp-first-tool-integration.md)
- [ADR-004: Eval-driven development](docs/adrs/004-eval-driven-development.md)

## Local Inspection

```bash
pnpm install
pnpm -r typecheck
pnpm -r test
pnpm -r lint
```

Eval runs may require API keys and can cost money. They are intentionally not
treated as always-on CI by default.

## Safety Model

This repo is a starter surface, not an autopilot.

- Tool access should be exposed through MCP servers with narrow permissions.
- Customer-facing sends require a human approval gate.
- Agent outputs should have receipts, source references, and review status.
- Client-specific secrets, raw customer data, and private implementation details
  do not belong in this public repo.

## Related

- [SAIBA Agency OS](https://github.com/Kisgus/saiba-agency-os)
- [Customer Event Flywheel](https://github.com/Kisgus/customer-event-flywheel)
- [Gus profile](https://github.com/Kisgus)
