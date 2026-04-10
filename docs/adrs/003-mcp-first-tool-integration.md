# ADR-003: MCP-First Tool Integration

**Status:** Accepted  
**Date:** 2026-04-10

## Context

Agent services need to interact with external systems (databases, APIs, file systems). We need a standardized interface for these integrations that is portable across agents and client environments.

## Decision

Standardize on MCP (Model Context Protocol) for all tool interfaces:

- Each integration becomes an MCP server (a standalone process exposing tools/resources via the MCP protocol)
- Agent services connect to MCP servers as clients
- MCP servers are built on demand for client engagements, not speculatively

## Consequences

- Tools are portable: any MCP-compatible agent can use any MCP server
- Clear separation of concerns: agent logic vs. tool implementation
- MCP servers can be tested independently of agents
- The `mcp-server-starter` template provides the scaffolding for new servers
