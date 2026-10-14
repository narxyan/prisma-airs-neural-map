# Prisma AIRS Neural Map

An interactive, responsive 3D map of the five official Prisma AIRS capability pillars and the documented workflows between them.

## AIRS pillars

- AI Red Teaming
- AI Supply Chain Security
- AI Runtime Security
- AI Gateway
- AI Agent Identity

AI Supply Chain Security connects to independently interactive Model Security and AI Skill Security nodes. AI Agent Identity connects to independently interactive SaaS Agent Security and MCP Security nodes. Each child node has its own function, controls, prerequisites, integration workflow, and official Palo Alto Networks documentation tab. Cortex Agentic Endpoint Security is retained as a supporting Runtime Security integration rather than presented as a core AIRS pillar.

## Weekly documentation refresh

The production Site includes a D1-backed documentation monitor, a private Site MCP writer, and a private service-access fallback for unattended jobs. A linked cloud schedule runs every Monday morning in `America/Chicago` and:

1. fetches every official Palo Alto Networks source currently surfaced by a node or integration path;
2. normalizes and hashes the readable page content;
3. keeps failed fetches retryable without replacing the last verified live copy;
4. reviews substantive changes before updating node summaries, functions, controls, prerequisites, and official-documentation links; and
5. publishes the reviewed structured content directly to the live Site data store without requiring a code deployment.

Observed and applied hashes are stored separately. A detected change remains pending across future runs until it is explicitly reviewed and applied, so a partial run cannot silently lose an update.

## Run locally

The browser-only visualization can still be previewed without dependencies:

```bash
npm run serve
```

Open <http://127.0.0.1:4173/>.

Build the production Worker artifact with:

```bash
npm run build
```

The local static preview uses the verified built-in copy when the hosted D1 API is unavailable.

## Verify

```bash
npm run check
```

The checks validate JavaScript syntax, the five-pillar Platform view, all four interactive child nodes and hierarchy edges, graph references, integration-guide coverage, official documentation sources, local assets, and essential HTML metadata. The same command runs in GitHub Actions for pushes to `main` and pull requests.

## Structure

- `dist/index.html` — application shell and accessible controls
- `dist/app.js` — pillar data, integration guides, 3D projection, and interaction behavior
- `dist/styles.css` — responsive light/dark presentation and animated flow paths
- `dist/assets/official/` — Palo Alto Networks feature artwork with source notes
- `worker/index.js` — production HTTP API, documentation fetch service, and Site MCP tools
- `drizzle/0000_documentation_monitor.sql` — persistent source, node-content, and run-audit schema
- `scripts/build-worker.mjs` — deterministic Worker packager that embeds the verified UI and derives the monitored-source catalog
- `scripts/check-site.mjs` — dependency-free production integrity checks
- `.openai/hosting.json` — OpenAI Sites deployment manifest

## Source boundaries

Product relationships and implementation notes are derived from public Palo Alto Networks documentation. Each node and connection inspector links to its supporting source. The visualization distinguishes native capabilities, configuration workflows, and manual operational handoffs so an illustrated edge is not mistaken for an undocumented automatic connector.

Product names and marks remain the property of Palo Alto Networks and their respective owners.
