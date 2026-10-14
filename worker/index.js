const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const APPROVED_DOCUMENTATION_HOSTS = new Set([
  "docs.paloaltonetworks.com",
  "www.paloaltonetworks.com",
  "pan.dev",
]);

const sourcesById = new Map(DOCUMENTATION_SOURCES.map((source) => [source.sourceId, source]));
const defaultsByNodeId = new Map(DEFAULT_NODES.map((node) => [node.id, node]));

function jsonResponse(value, init = {}) {
  return new Response(JSON.stringify(value), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers ?? {}) },
  });
}

function mcpResult(id, value, isError = false) {
  return jsonResponse({
    jsonrpc: "2.0",
    id,
    result: {
      content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value) }],
      ...(isError ? { isError: true } : {}),
    },
  });
}

function mcpError(id, code, message) {
  return jsonResponse({ jsonrpc: "2.0", id, error: { code, message } });
}

function requireDatabase(env) {
  if (!env.DB?.prepare) throw new Error("The documentation database is unavailable.");
  return env.DB;
}

function cleanString(value, field, { required = false, max = 1_500 } = {}) {
  if (value == null && !required) return undefined;
  if (typeof value !== "string") throw new Error(`${field} must be a string.`);
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (required && !cleaned) throw new Error(`${field} is required.`);
  if (cleaned.length > max) throw new Error(`${field} exceeds ${max} characters.`);
  return cleaned;
}

function cleanStringArray(value, field, { maxItems = 12, itemMax = 500 } = {}) {
  if (value == null) return undefined;
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new Error(`${field} must contain at most ${maxItems} strings.`);
  }
  return value.map((item, index) => cleanString(item, `${field}[${index}]`, { required: true, max: itemMax }));
}

function cleanDocumentation(value, field) {
  if (value == null) return undefined;
  if (!Array.isArray(value) || value.length > 16) {
    throw new Error(`${field} must contain at most 16 documentation links.`);
  }
  return value.map((document, index) => {
    if (!document || typeof document !== "object") throw new Error(`${field}[${index}] must be an object.`);
    const url = cleanString(document.url, `${field}[${index}].url`, { required: true, max: 2_000 });
    let parsed;
    try { parsed = new URL(url); } catch { throw new Error(`${field}[${index}].url is invalid.`); }
    if (parsed.protocol !== "https:" || !APPROVED_DOCUMENTATION_HOSTS.has(parsed.hostname)) {
      throw new Error(`${field}[${index}].url must be an approved Palo Alto Networks documentation URL.`);
    }
    return {
      label: cleanString(document.label, `${field}[${index}].label`, { required: true, max: 180 }),
      type: cleanString(document.type ?? "Official technical documentation", `${field}[${index}].type`, { required: true, max: 180 }),
      url: parsed.toString(),
    };
  });
}

function decodeEntities(value) {
  const named = {
    amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ",
    ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘",
    ldquo: "“", rdquo: "”", copy: "©", reg: "®", trade: "™",
  };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const hex = entity[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}

function textFromHtml(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
    ?? html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    ?? html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]
    ?? html;
  return decodeEntities(main
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<(script|style|svg|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|li|h1|h2|h3|h4|tr|section|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function titleFromHtml(html, fallback) {
  const raw = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    ?? html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (!raw) return fallback;
  return decodeEntities(raw.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 300) || fallback;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function existingSourceRow(db, sourceId) {
  return db.prepare(`
    SELECT source_id, observed_hash, applied_hash, title, excerpt, etag, last_modified,
           last_checked_at, last_changed_at, applied_at, fetch_error, status_code
    FROM documentation_sources WHERE source_id = ?
  `).bind(sourceId).first();
}

async function fetchOfficialPage(source, previous) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18_000);
    try {
      const headers = {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Prisma-AIRS-Documentation-Monitor/1.0",
      };
      if (previous?.etag) headers["if-none-match"] = previous.etag;
      if (previous?.last_modified) headers["if-modified-since"] = previous.last_modified;
      const response = await fetch(source.url, {
        headers,
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.status === 304 && previous?.observed_hash) {
        return {
          notModified: true,
          statusCode: 304,
          hash: previous.observed_hash,
          title: previous.title || source.label,
          excerpt: previous.excerpt || "",
          reviewText: previous.excerpt || "",
          etag: previous.etag,
          lastModified: previous.last_modified,
        };
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentLength = Number(response.headers.get("content-length") || 0);
      if (contentLength > 5_000_000) throw new Error("Page exceeds the 5 MB monitor limit");
      const html = (await response.text()).slice(0, 5_000_000);
      const text = textFromHtml(html);
      if (text.length < 120) throw new Error("Page did not contain enough readable documentation text");
      const normalized = text.normalize("NFKC");
      return {
        notModified: false,
        statusCode: response.status,
        hash: await sha256(normalized),
        title: titleFromHtml(html, source.label),
        excerpt: normalized.slice(0, 2_400),
        reviewText: normalized.slice(0, 8_000),
        etag: response.headers.get("etag"),
        lastModified: response.headers.get("last-modified"),
      };
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
  throw lastError ?? new Error("Documentation fetch failed");
}

async function readNodeOverrides(db) {
  const result = await db.prepare(`
    SELECT node_id, content_json, updated_at, change_summary
    FROM documentation_nodes ORDER BY node_id
  `).all();
  const output = {};
  for (const row of result.results ?? []) {
    try {
      output[row.node_id] = {
        ...JSON.parse(row.content_json),
        updatedAt: row.updated_at,
        changeSummary: row.change_summary,
      };
    } catch {
      // Preserve the built-in node copy when a stored row cannot be decoded.
    }
  }
  return output;
}

async function documentationStatus(env, { includeNodeContent = true } = {}) {
  const db = requireDatabase(env);
  const sourceResult = await db.prepare(`
    SELECT source_id, observed_hash, applied_hash, title, excerpt, last_checked_at,
           last_changed_at, applied_at, fetch_error, status_code
    FROM documentation_sources
  `).all();
  const stored = new Map((sourceResult.results ?? []).map((row) => [row.source_id, row]));
  const sources = DOCUMENTATION_SOURCES.map((source) => {
    const row = stored.get(source.sourceId);
    const pending = Boolean(row?.observed_hash && row.observed_hash !== row.applied_hash);
    return {
      ...source,
      status: row?.fetch_error ? "failed" : pending ? "pending_review" : row?.observed_hash ? "current" : "not_checked",
      observedHash: row?.observed_hash ?? null,
      appliedHash: row?.applied_hash ?? null,
      title: row?.title ?? source.label,
      lastCheckedAt: row?.last_checked_at ?? null,
      lastChangedAt: row?.last_changed_at ?? null,
      appliedAt: row?.applied_at ?? null,
      fetchError: row?.fetch_error ?? null,
      statusCode: row?.status_code ?? null,
    };
  });
  const checkedTimes = sources.map((source) => source.lastCheckedAt).filter(Boolean).sort();
  const status = {
    monitoring: {
      sourceCount: sources.length,
      lastCheckedAt: checkedTimes.at(-1) ?? null,
      pendingChanges: sources.filter((source) => source.status === "pending_review").length,
      failedSources: sources.filter((source) => source.status === "failed").length,
    },
    sources,
  };
  if (includeNodeContent) {
    const overrides = await readNodeOverrides(db);
    status.nodes = DEFAULT_NODES.map((node) => ({
      ...node,
      ...(overrides[node.id] ?? {}),
    }));
  }
  return status;
}

async function refreshDocumentationSources(env, args = {}) {
  const db = requireDatabase(env);
  const sourceIds = args.source_ids;
  if (!Array.isArray(sourceIds) || sourceIds.length < 1 || sourceIds.length > 8) {
    throw new Error("source_ids must contain between 1 and 8 source IDs from get_documentation_status.");
  }
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error("source_ids must not contain duplicates.");
  const selected = sourceIds.map((sourceId) => {
    const source = sourcesById.get(sourceId);
    if (!source) throw new Error(`Unknown documentation source: ${sourceId}`);
    return source;
  });

  const checkedAt = new Date().toISOString();
  const fetched = await Promise.all(selected.map(async (source) => {
    const previous = await existingSourceRow(db, source.sourceId);
    try {
      return { source, previous, page: await fetchOfficialPage(source, previous) };
    } catch (error) {
      return { source, previous, error: error instanceof Error ? error.message : "Documentation fetch failed" };
    }
  }));

  const results = [];
  for (const item of fetched) {
    const { source, previous } = item;
    if (item.error) {
      await db.prepare(`
        INSERT INTO documentation_sources (source_id, last_checked_at, fetch_error)
        VALUES (?, ?, ?)
        ON CONFLICT(source_id) DO UPDATE SET
          last_checked_at = excluded.last_checked_at,
          fetch_error = excluded.fetch_error
      `).bind(source.sourceId, checkedAt, item.error).run();
      results.push({
        sourceId: source.sourceId,
        label: source.label,
        url: source.url,
        status: "failed",
        error: item.error,
      });
      continue;
    }

    const page = item.page;
    const isBaseline = !previous?.observed_hash;
    const contentChanged = !isBaseline && previous.observed_hash !== page.hash;
    const appliedHash = previous?.applied_hash ?? page.hash;
    const pendingReview = page.hash !== appliedHash;
    const changedAt = contentChanged ? checkedAt : (previous?.last_changed_at ?? checkedAt);
    const appliedAt = previous?.applied_at ?? (isBaseline ? checkedAt : null);
    await db.prepare(`
      INSERT INTO documentation_sources (
        source_id, observed_hash, applied_hash, title, excerpt, etag, last_modified,
        last_checked_at, last_changed_at, applied_at, fetch_error, status_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
      ON CONFLICT(source_id) DO UPDATE SET
        observed_hash = excluded.observed_hash,
        applied_hash = excluded.applied_hash,
        title = excluded.title,
        excerpt = excluded.excerpt,
        etag = excluded.etag,
        last_modified = excluded.last_modified,
        last_checked_at = excluded.last_checked_at,
        last_changed_at = excluded.last_changed_at,
        applied_at = excluded.applied_at,
        fetch_error = NULL,
        status_code = excluded.status_code
    `).bind(
      source.sourceId, page.hash, appliedHash, page.title, page.excerpt,
      page.etag, page.lastModified, checkedAt, changedAt, appliedAt, page.statusCode,
    ).run();

    results.push({
      sourceId: source.sourceId,
      label: source.label,
      url: source.url,
      nodeIds: source.nodeIds,
      status: isBaseline ? "baseline_created" : pendingReview ? "pending_review" : "current",
      changed: contentChanged,
      pendingReview,
      observedHash: page.hash,
      appliedHash,
      title: page.title,
      lastModified: page.lastModified,
      reviewText: pendingReview ? page.reviewText : undefined,
    });
  }

  const failures = results.filter((result) => result.status === "failed").length;
  const pending = results.filter((result) => result.pendingReview).length;
  await db.prepare(`
    INSERT INTO documentation_runs (run_id, run_type, status, started_at, finished_at, summary_json)
    VALUES (?, 'refresh', ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), failures ? "partial_failure" : "succeeded", checkedAt,
    new Date().toISOString(), JSON.stringify({ checked: results.length, pending, failures }),
  ).run();

  return {
    checkedAt,
    checked: results.length,
    pendingReview: pending,
    failures,
    results,
    instruction: pending
      ? "Review every pending source against the current node content, then call apply_documentation_updates."
      : "No unapplied documentation change was detected in this batch.",
  };
}

async function applyDocumentationUpdates(env, args = {}) {
  const db = requireDatabase(env);
  const sourceIds = args.source_ids;
  if (!Array.isArray(sourceIds) || sourceIds.length < 1 || sourceIds.length > 24) {
    throw new Error("source_ids must contain between 1 and 24 pending source IDs.");
  }
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error("source_ids must not contain duplicates.");
  const summary = cleanString(args.change_summary, "change_summary", { required: true, max: 1_500 });
  const reviewedNoContentChange = args.reviewed_no_content_change === true;
  const updates = args.nodes ?? [];
  if (!Array.isArray(updates) || updates.length > DEFAULT_NODES.length) {
    throw new Error(`nodes must contain at most ${DEFAULT_NODES.length} updates.`);
  }
  if (!updates.length && !reviewedNoContentChange) {
    throw new Error("Provide at least one node update, or set reviewed_no_content_change to true after review.");
  }

  const sourceRows = [];
  for (const sourceId of sourceIds) {
    if (!sourcesById.has(sourceId)) throw new Error(`Unknown documentation source: ${sourceId}`);
    const row = await existingSourceRow(db, sourceId);
    if (!row?.observed_hash) throw new Error(`${sourceId} has not been fetched successfully.`);
    if (row.fetch_error) throw new Error(`${sourceId} currently has a fetch error and cannot be marked applied.`);
    if (row.observed_hash === row.applied_hash) throw new Error(`${sourceId} has no pending change.`);
    sourceRows.push(row);
  }

  const existingOverrides = await readNodeOverrides(db);
  const cleanedUpdates = updates.map((update, index) => {
    if (!update || typeof update !== "object") throw new Error(`nodes[${index}] must be an object.`);
    const nodeId = cleanString(update.node_id, `nodes[${index}].node_id`, { required: true, max: 80 });
    const defaults = defaultsByNodeId.get(nodeId);
    if (!defaults) throw new Error(`Unknown node: ${nodeId}`);
    const previous = existingOverrides[nodeId] ?? defaults;
    const content = {
      summary: cleanString(update.summary, `nodes[${index}].summary`, { max: 1_500 }) ?? previous.summary,
      role: cleanString(update.role, `nodes[${index}].role`, { max: 1_500 }) ?? previous.role,
      facts: cleanStringArray(update.facts, `nodes[${index}].facts`) ?? previous.facts,
      prerequisites: cleanStringArray(update.prerequisites, `nodes[${index}].prerequisites`) ?? previous.prerequisites,
      docs: cleanDocumentation(update.docs, `nodes[${index}].docs`) ?? previous.docs,
    };
    return { nodeId, content };
  });
  if (new Set(cleanedUpdates.map((update) => update.nodeId)).size !== cleanedUpdates.length) {
    throw new Error("Each node may be updated only once per apply operation.");
  }

  const affectedNodeIds = new Set(sourceIds.flatMap((sourceId) => sourcesById.get(sourceId).nodeIds));
  for (const update of cleanedUpdates) {
    if (!affectedNodeIds.has(update.nodeId)) {
      throw new Error(`${update.nodeId} is not associated with the pending sources in this apply operation.`);
    }
  }

  const appliedAt = new Date().toISOString();
  const statements = cleanedUpdates.map((update) => db.prepare(`
    INSERT INTO documentation_nodes (node_id, content_json, updated_at, change_summary)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(node_id) DO UPDATE SET
      content_json = excluded.content_json,
      updated_at = excluded.updated_at,
      change_summary = excluded.change_summary
  `).bind(update.nodeId, JSON.stringify(update.content), appliedAt, summary));

  for (const row of sourceRows) {
    statements.push(db.prepare(`
      UPDATE documentation_sources
      SET applied_hash = observed_hash, applied_at = ?, fetch_error = NULL
      WHERE source_id = ?
    `).bind(appliedAt, row.source_id));
  }
  statements.push(db.prepare(`
    INSERT INTO documentation_runs (run_id, run_type, status, started_at, finished_at, summary_json)
    VALUES (?, 'apply', 'succeeded', ?, ?, ?)
  `).bind(
    crypto.randomUUID(), appliedAt, appliedAt,
    JSON.stringify({ sourceIds, nodeIds: cleanedUpdates.map((update) => update.nodeId), reviewedNoContentChange, summary }),
  ));
  await db.batch(statements);

  const status = await documentationStatus(env, { includeNodeContent: false });
  return {
    appliedAt,
    sourceIds,
    updatedNodeIds: cleanedUpdates.map((update) => update.nodeId),
    reviewedNoContentChange,
    pendingChanges: status.monitoring.pendingChanges,
    message: "The live Overview and Official Documentation data now reflects this reviewed source revision.",
  };
}

const MCP_TOOLS = [
  {
    name: "get_documentation_status",
    description: "List every official Prisma AIRS source monitored by the Site, show pending or failed checks, and return the current Overview and Official Documentation content for each node.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "refresh_documentation_sources",
    description: "Fetch one batch of official Palo Alto Networks documentation, compare normalized content with the last applied revision, persist the observation, and return review text for pending changes. Failed sources keep their previous live content and remain retryable.",
    inputSchema: {
      type: "object",
      properties: {
        source_ids: {
          type: "array",
          minItems: 1,
          maxItems: 8,
          uniqueItems: true,
          items: { type: "string" },
          description: "Source IDs returned by get_documentation_status. Process all sources in batches of no more than eight.",
        },
      },
      required: ["source_ids"],
      additionalProperties: false,
    },
  },
  {
    name: "apply_documentation_updates",
    description: "Publish reviewed changes into the live node Overview and Official Documentation tabs, then mark the associated source revisions applied. Use reviewed_no_content_change only after confirming a detected difference is non-substantive.",
    inputSchema: {
      type: "object",
      properties: {
        source_ids: {
          type: "array",
          minItems: 1,
          maxItems: 24,
          uniqueItems: true,
          items: { type: "string" },
        },
        change_summary: { type: "string", minLength: 1, maxLength: 1500 },
        reviewed_no_content_change: { type: "boolean" },
        nodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              node_id: { type: "string" },
              summary: { type: "string" },
              role: { type: "string" },
              facts: { type: "array", items: { type: "string" }, maxItems: 12 },
              prerequisites: { type: "array", items: { type: "string" }, maxItems: 12 },
              docs: {
                type: "array",
                maxItems: 16,
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    type: { type: "string" },
                    url: { type: "string", format: "uri" },
                  },
                  required: ["label", "url"],
                  additionalProperties: false,
                },
              },
            },
            required: ["node_id"],
            additionalProperties: false,
          },
        },
      },
      required: ["source_ids", "change_summary"],
      additionalProperties: false,
    },
  },
];

async function handleMcp(request, env) {
  // Sites dispatch enforces this project's owner-private access policy before
  // forwarding browser, plugin, or unattended service requests to the Worker.
  // Service access intentionally supplies no visitor identity, so this shared
  // documentation updater relies on that confirmed platform boundary.
  let message;
  try { message = await request.json(); }
  catch { return mcpError(null, -32700, "Invalid JSON."); }
  const { id = null, method, params = {} } = message ?? {};

  if (method === "server/discover") {
    return jsonResponse({
      jsonrpc: "2.0",
      id,
      result: { supportedVersions: ["2026-07-28"], capabilities: { tools: {} } },
    });
  }
  if (method === "initialize") {
    return jsonResponse({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2026-07-28",
        capabilities: { tools: {} },
        serverInfo: { name: "Prisma AIRS Documentation Monitor", version: "1.0.0" },
      },
    });
  }
  if (method === "notifications/initialized") return new Response(null, { status: 204 });
  if (method === "ping") return jsonResponse({ jsonrpc: "2.0", id, result: {} });
  if (method === "tools/list") return jsonResponse({ jsonrpc: "2.0", id, result: { tools: MCP_TOOLS } });
  if (method !== "tools/call") return mcpError(id, -32601, "Method not found.");

  try {
    const toolName = params?.name;
    const args = params?.arguments ?? {};
    if (toolName === "get_documentation_status") return mcpResult(id, await documentationStatus(env));
    if (toolName === "refresh_documentation_sources") return mcpResult(id, await refreshDocumentationSources(env, args));
    if (toolName === "apply_documentation_updates") return mcpResult(id, await applyDocumentationUpdates(env, args));
    return mcpResult(id, { error: `Unknown tool: ${toolName}` }, true);
  } catch (error) {
    return mcpResult(id, { error: error instanceof Error ? error.message : "Tool execution failed" }, true);
  }
}

async function handleDocumentationApi(env) {
  try {
    const status = await documentationStatus(env, { includeNodeContent: false });
    return jsonResponse({
      ok: true,
      nodes: await readNodeOverrides(requireDatabase(env)),
      monitoring: status.monitoring,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      nodes: {},
      monitoring: {
        sourceCount: DOCUMENTATION_SOURCES.length,
        lastCheckedAt: null,
        pendingChanges: 0,
        failedSources: 0,
        error: error instanceof Error ? error.message : "Documentation service unavailable",
      },
    }, { status: 503 });
  }
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function serveSiteFile(pathname) {
  const file = SITE_FILES[pathname];
  if (!file) return null;
  const body = file.encoding === "base64" ? decodeBase64(file.body) : file.body;
  const immutable = pathname.startsWith("/assets/");
  return new Response(body, {
    headers: {
      "content-type": file.contentType,
      "cache-control": pathname === "/" || pathname === "/index.html"
        ? "no-cache"
        : immutable ? "public, max-age=31536000, immutable" : "public, max-age=3600",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/mcp") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      return handleMcp(request, env);
    }
    if (url.pathname === "/api/documentation") {
      if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
      return handleDocumentationApi(env);
    }
    if (url.pathname === "/health") {
      return jsonResponse({ ok: true, service: "prisma-airs-neural-map", monitoredSources: DOCUMENTATION_SOURCES.length });
    }
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
    const response = serveSiteFile(url.pathname === "" ? "/" : url.pathname);
    if (!response) return new Response("Not found", { status: 404 });
    return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
  },
};
