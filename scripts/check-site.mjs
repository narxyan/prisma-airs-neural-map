import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(repositoryRoot, "dist");
const htmlPath = path.join(distRoot, "index.html");
const appPath = path.join(distRoot, "app.js");
const cssPath = path.join(distRoot, "styles.css");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const file of [htmlPath, appPath, cssPath, path.join(repositoryRoot, ".openai", "hosting.json")]) {
  check(existsSync(file), `Missing required file: ${path.relative(repositoryRoot, file)}`);
}

if (!failures.length) {
  const html = readFileSync(htmlPath, "utf8");
  const app = readFileSync(appPath, "utf8");
  const dataStart = app.indexOf("const COLORS");
  const dataEnd = app.indexOf("const byId");

  check(dataStart >= 0 && dataEnd > dataStart, "Could not locate the application data block");

  if (dataStart >= 0 && dataEnd > dataStart) {
    const sandbox = {};
    vm.runInNewContext(
      `${app.slice(dataStart, dataEnd)}\nglobalThis.__siteData = { nodes, edges, integrationGuides, views };`,
      sandbox,
      { filename: "dist/app.js", timeout: 1_000 },
    );

    const { nodes, edges, integrationGuides, views } = sandbox.__siteData;
    const nodeIds = new Set(nodes.map(({ id }) => id));
    const edgeIds = new Set(edges.map(({ id }) => id));
    const officialPillars = ["gateway", "runtime", "agentIdentity", "supplyChain", "redTeam"];

    check(nodeIds.size === nodes.length, "Node IDs must be unique");
    check(edgeIds.size === edges.length, "Edge IDs must be unique");
    check(officialPillars.every((id) => nodeIds.has(id)), "All five official AIRS pillar nodes must be present");
    check(
      officialPillars.every((id) => views.platform.nodes.includes(id)) && views.platform.nodes.includes("airs"),
      "The Platform view must include Prisma AIRS and all five official pillars",
    );

    for (const node of nodes) {
      const asset = path.resolve(distRoot, node.asset.replace(/^\.\//, ""));
      check(existsSync(asset), `Missing node asset for ${node.id}: ${node.asset}`);
      check(/^https:\/\//.test(node.source), `Node ${node.id} must link to an HTTPS source`);
      for (const subcap of node.subcaps ?? []) {
        const subcapAsset = path.resolve(distRoot, subcap.asset.replace(/^\.\//, ""));
        check(existsSync(subcapAsset), `Missing sub-capability asset for ${node.id}: ${subcap.asset}`);
      }
    }

    for (const edge of edges) {
      check(nodeIds.has(edge.from), `Edge ${edge.id} has unknown source node ${edge.from}`);
      check(nodeIds.has(edge.to), `Edge ${edge.id} has unknown target node ${edge.to}`);
      check(!edge.via || nodeIds.has(edge.via), `Edge ${edge.id} has unknown via node ${edge.via}`);
      check(Boolean(integrationGuides[edge.id]), `Edge ${edge.id} is missing an integration guide`);
    }

    for (const [viewId, view] of Object.entries(views)) {
      for (const nodeId of view.nodes) check(nodeIds.has(nodeId), `View ${viewId} references unknown node ${nodeId}`);
      for (const edgeId of view.edges) check(edgeIds.has(edgeId), `View ${viewId} references unknown edge ${edgeId}`);
    }

    for (const [guideId, guide] of Object.entries(integrationGuides)) {
      check(edgeIds.has(guideId), `Integration guide ${guideId} has no matching edge`);
      check(Array.isArray(guide.sources) && guide.sources.length > 0, `Integration guide ${guideId} needs at least one source`);
      for (const source of guide.sources ?? []) {
        check(/^https:\/\//.test(source.url), `Integration guide ${guideId} contains a non-HTTPS source`);
      }
    }
  }

  check(/<html\s+lang="en"/.test(html), "index.html must declare an English document language");
  check(/<meta\s+name="viewport"/.test(html), "index.html must include a viewport meta tag");
  check(/<meta[\s\S]*?name="description"/.test(html), "index.html must include a description meta tag");
  check(/styles\.css\?v=(\d+)/.test(html), "Stylesheet must use a cache-busting version");
  check(/app\.js\?v=(\d+)/.test(html), "Application script must use a cache-busting version");
  const cssVersion = html.match(/styles\.css\?v=(\d+)/)?.[1];
  const jsVersion = html.match(/app\.js\?v=(\d+)/)?.[1];
  check(cssVersion === jsVersion, "CSS and JavaScript cache-busting versions must match");
}

if (failures.length) {
  console.error(`Site checks failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Site checks passed: five AIRS pillars, graph integrity, assets, sources, and HTML metadata verified.");
