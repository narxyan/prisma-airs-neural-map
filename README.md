# Prisma AIRS Neural Map

An interactive, responsive 3D map of the five official Prisma AIRS capability pillars and the documented workflows between them.

## AIRS pillars

- AI Red Teaming
- AI Supply Chain Security
- AI Runtime Security
- AI Gateway
- AI Agent Identity

## Weekly documentation refresh

The production Site includes a D1-backed documentation monitor, a private Site MCP writer, and a private service-access fallback for unattended jobs. A linked cloud schedule runs every Monday morning in `America/Chicago` and:

1. fetches every official Palo Alto Networks source currently surfaced by a node or integration path;
2. normalizes and hashes the readable page content;
3. keeps failed fetches retryable without replacing the last verified live copy;
4. reviews substantive changes before updating node summaries, functions, controls, prerequisites, and official-documentation links; and
5. publishes the reviewed structured content directly to the live Site data store without requiring a code deployment.
