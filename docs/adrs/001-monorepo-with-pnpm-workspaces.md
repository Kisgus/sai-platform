# ADR-001: Monorepo with pnpm Workspaces

**Status:** Accepted  
**Date:** 2026-04-10

## Context

We need a repository structure that supports multiple packages (agent starters, MCP servers, shared libraries) while keeping dependency management simple and builds fast.

## Decision

Use a pnpm workspace monorepo with the following layout:

- `packages/` — shared libraries (future)
- `starters/` — project templates (agent-starter, mcp-server-starter)

We chose pnpm workspaces over Turborepo for now because:
- pnpm workspaces handle dependency hoisting and workspace linking natively
- We don't yet have enough packages to benefit from Turborepo's caching/pipeline features
- Adding Turborepo later is a non-breaking change (just add `turbo.json`)

## Consequences

- All packages share a root `tsconfig.base.json` for consistency
- CI runs `pnpm -r build/lint/test` to execute across all packages
- New packages are added by creating a directory in `packages/` or `starters/` with a `package.json`
