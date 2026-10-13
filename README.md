# Prisma AIRS Neural Map

An interactive, responsive 3D map of the five official Prisma AIRS capability pillars and the documented workflows between them.

## AIRS pillars

- AI Red Teaming
- AI Supply Chain Security
- AI Runtime Security
- AI Gateway
- AI Agent Identity

AI Supply Chain Security expands into Model Security and AI Skill Security. AI Agent Identity expands into SaaS Agent Security and MCP Security. Cortex Agentic Endpoint Security is retained as a supporting Runtime Security integration rather than presented as a core AIRS pillar.

## Run locally

No dependency installation or build step is required.

```bash
npm run serve
```

Open <http://127.0.0.1:4173/>.

## Verify

```bash
npm run check
```

The checks validate JavaScript syntax, the five-pillar Platform view, graph references, integration-guide coverage, local assets, HTTPS documentation sources, and essential HTML metadata. The same command runs in GitHub Actions for pushes to `main` and pull requests.

## Structure

- `dist/index.html` — application shell and accessible controls
- `dist/app.js` — pillar data, integration guides, 3D projection, and interaction behavior
- `dist/styles.css` — responsive light/dark presentation and animated flow paths
- `dist/assets/official/` — Palo Alto Networks feature artwork with source notes
- `scripts/check-site.mjs` — dependency-free production integrity checks
- `.openai/hosting.json` — OpenAI Sites deployment manifest

## Source boundaries

Product relationships and implementation notes are derived from public Palo Alto Networks documentation. Each node and connection inspector links to its supporting source. The visualization distinguishes native capabilities, configuration workflows, and manual operational handoffs so an illustrated edge is not mistaken for an undocumented automatic connector.

Product names and marks remain the property of Palo Alto Networks and their respective owners.
