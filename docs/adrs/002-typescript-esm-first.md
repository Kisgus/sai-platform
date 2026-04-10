# ADR-002: TypeScript with ESM-First

**Status:** Accepted  
**Date:** 2026-04-10

## Context

We need a consistent language and module system across all packages for agent services and MCP servers.

## Decision

- TypeScript as the primary language for all agent harnesses, APIs, and tooling
- ESM (`"type": "module"`) as the default module system
- Target ES2023 for modern Node.js features
- `Node16` module resolution for proper ESM interop

## Consequences

- All imports must use `.js` extensions (TypeScript ESM requirement)
- Packages that need CJS consumers can add a dual-build later
- Python is used only where ML/data ecosystem demands it (not in this repo yet)
