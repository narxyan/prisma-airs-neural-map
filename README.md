# Prisma AIRS Neural Map

An interactive, responsive 3D map of the five official Prisma AIRS capability pillars and the documented workflows between them.

## AIRS pillars

- AI Red Teaming
- AI Supply Chain Security
- AI Runtime Security
- AI Gateway
- AI Agent Identity

## Weekly documentation refresh

The production Cloudflare Worker includes a D1-backed documentation monitor, protected maintenance APIs, and a native Cron Trigger. Two UTC triggers cover daylight-saving changes; the Worker proceeds only when the local time is Monday at 09:00 in `America/Chicago`. Each run:

1. fetches every official Palo Alto Networks source currently surfaced by a node or integration path;
2. normalizes and hashes the readable page content;
3. keeps failed fetches retryable without replacing the last verified live copy;
4. uses a constrained Cloudflare Workers AI review to distinguish substantive product changes from navigation or wording noise;
5. validates the structured result against the application's existing content rules; and
6. publishes reviewed node summaries, functions, controls, and prerequisites directly to D1 without requiring a code deployment.

Observed and applied hashes are stored separately. A detected change remains pending across future runs until it is explicitly reviewed and applied, so a partial run cannot silently lose an update.

The public map only has read access to published overrides. Manual refresh, apply, MCP, and full-run endpoints fail closed in Cloudflare unless a valid `AUTOMATION_TOKEN` bearer secret is configured. The native Cron path does not require that public credential.

## Cloudflare deployment

Production is defined by `wrangler.jsonc`:

- Worker: `prisma-airs-map`
- generated entry point: `dist/server/index.js`
- D1 binding: `DB` → `prisma-airs-docs`
- Workers AI binding: `AI`
- Cron coverage: Monday at 14:00 and 15:00 UTC, guarded to exactly 09:00 `America/Chicago`
- observability: enabled

Cloudflare Workers Builds is connected to the GitHub `main` branch. Its build command is `npm run check` and its deploy command is `npx wrangler deploy`. Pull requests continue to run the repository's read-only GitHub Actions quality workflow before merge.
