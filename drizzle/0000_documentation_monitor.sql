CREATE TABLE documentation_sources (
  source_id TEXT PRIMARY KEY NOT NULL,
  observed_hash TEXT,
  applied_hash TEXT,
  title TEXT,
  excerpt TEXT,
  etag TEXT,
  last_modified TEXT,
  last_checked_at TEXT,
  last_changed_at TEXT,
  applied_at TEXT,
  fetch_error TEXT,
  status_code INTEGER
);

CREATE TABLE documentation_nodes (
  node_id TEXT PRIMARY KEY NOT NULL,
  content_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  change_summary TEXT NOT NULL
);

CREATE TABLE documentation_runs (
  run_id TEXT PRIMARY KEY NOT NULL,
  run_type TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  summary_json TEXT NOT NULL
);

CREATE INDEX documentation_sources_checked_at_idx
  ON documentation_sources (last_checked_at);

CREATE INDEX documentation_runs_finished_at_idx
  ON documentation_runs (finished_at);
