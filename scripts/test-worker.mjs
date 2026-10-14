import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const database = new DatabaseSync(":memory:");
database.exec(await readFile(path.join(projectRoot, "drizzle", "0000_documentation_monitor.sql"), "utf8"));

class D1StatementMock {
  constructor(sql, bindings = []) {
    this.sql = sql;
    this.bindings = bindings;
  }

  bind(...bindings) {
    return new D1StatementMock(this.sql, bindings);
  }

  first() {
    return database.prepare(this.sql).get(...this.bindings) ?? null;
  }

  all() {
    return { results: database.prepare(this.sql).all(...this.bindings) };
  }

  run() {
    const result = database.prepare(this.sql).run(...this.bindings);
    return { success: true, meta: { changes: result.changes } };
  }
}

const DB = {
  prepare(sql) {
    return new D1StatementMock(sql);
  },
  async batch(statements) {
    database.exec("BEGIN");
    try {
      const results = await Promise.all(statements.map((statement) => statement.run()));
      database.exec("COMMIT");
      return results;
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  },
};

const { default: worker } = await import(pathToFileURL(path.join(projectRoot, "dist", "server", "index.js")));
const env = { DB };
const authHeaders = {
  "content-type": "application/json",
};

async function callTool(name, args = {}) {
  const response = await worker.fetch(new Request("https://site.test/mcp", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  }), env, {});
  const payload = await response.json();
  if (payload.result?.isError) throw new Error(payload.result.content?.[0]?.text ?? `${name} failed`);
  return JSON.parse(payload.result.content[0].text);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const status = await callTool("get_documentation_status");
assert(status.monitoring.sourceCount >= 20, "Expected the generated official-source catalog");
assert(status.monitoring.pendingChanges === 0, "A new monitor should not start with pending changes");
const source = status.sources[0];
const serviceStatusResponse = await worker.fetch(new Request("https://site.test/api/automation/status"), env, {});
const serviceStatus = await serviceStatusResponse.json();
assert(serviceStatus.monitoring.sourceCount === status.monitoring.sourceCount, "Service-access status must match the MCP tool status");

const originalFetch = globalThis.fetch;
let revision = 1;
globalThis.fetch = async () => new Response(`<!doctype html><html><head><title>${source.label}</title></head><body><main><h1>${source.label}</h1><p>Verified Prisma AIRS documentation revision ${revision}. This test paragraph is intentionally long enough to pass the readable-content safety threshold. It describes supported controls, prerequisites, and documented integration behavior without relying on a network request.</p></main></body></html>`, {
  status: 200,
  headers: {
    "content-type": "text/html; charset=utf-8",
    etag: `\"test-${revision}\"`,
  },
});

try {
  const baseline = await callTool("refresh_documentation_sources", { source_ids: [source.sourceId] });
  assert(baseline.results[0].status === "baseline_created", "First fetch should create a reviewed baseline");

  revision = 2;
  const changed = await callTool("refresh_documentation_sources", { source_ids: [source.sourceId] });
  assert(changed.results[0].status === "pending_review", "Changed content should remain pending review");

  const nodeId = changed.results[0].nodeIds[0];
  const applied = await callTool("apply_documentation_updates", {
    source_ids: [source.sourceId],
    change_summary: "Production check applied a reviewed documentation revision.",
    nodes: [{ node_id: nodeId, summary: "Reviewed documentation content from the hosted update service." }],
  });
  assert(applied.pendingChanges === 0, "Applied content should clear the pending revision");

  const apiResponse = await worker.fetch(new Request("https://site.test/api/documentation"), env, {});
  const api = await apiResponse.json();
  assert(api.ok === true, "Documentation API should be healthy");
  assert(api.nodes[nodeId]?.summary === "Reviewed documentation content from the hosted update service.", "Live API should expose the reviewed node update");
} finally {
  globalThis.fetch = originalFetch;
  database.close();
}

console.log("Documentation service checks passed: baseline, change detection, pending retention, reviewed apply, and live API verified.");
