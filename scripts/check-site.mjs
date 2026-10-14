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
  const css = readFileSync(cssPath, "utf8");
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
    const childNodes = {
      modelSecurity: "supplyChain",
      skillSecurity: "supplyChain",
      saasAgentSecurity: "agentIdentity",
      mcpSecurity: "agentIdentity",
    };
    const childEdges = {
      "supply-model": ["supplyChain", "modelSecurity"],
      "supply-skill": ["supplyChain", "skillSecurity"],
      "identity-saas": ["agentIdentity", "saasAgentSecurity"],
      "identity-mcp": ["agentIdentity", "mcpSecurity"],
    };

    check(nodeIds.size === nodes.length, "Node IDs must be unique");
    check(edgeIds.size === edges.length, "Edge IDs must be unique");
    check(officialPillars.every((id) => nodeIds.has(id)), "All five official AIRS pillar nodes must be present");
    check(
      officialPillars.every((id) => views.platform.nodes.includes(id)) && views.platform.nodes.includes("airs"),
      "The Platform view must include Prisma AIRS and all five official pillars",
    );
    check(
      views.platform.nodes.includes("endpointSecurity") && views.platform.edges.includes("airs-endpoint"),
      "The Platform view must initially reveal the Endpoint Security integration",
    );
    check(
      Object.keys(childNodes).every((id) => views.platform.nodes.includes(id)),
      "The Platform view must include every independently inspectable child node",
    );
    check(
      views.platform.nodes.every((id) => Array.isArray(nodes.find((node) => node.id === id)?.compactPos)),
      "Every Platform node must provide a compact-panel position",
    );

    for (const [childId, parentId] of Object.entries(childNodes)) {
      const child = nodes.find(({ id }) => id === childId);
      check(Boolean(child), `Missing child node ${childId}`);
      check(child?.childOf === parentId, `Child node ${childId} must declare ${parentId} as its parent`);
      check(Array.isArray(child?.prerequisites) && child.prerequisites.length > 0, `Child node ${childId} needs prerequisites`);
      check(Array.isArray(child?.docs) && child.docs.length > 0, `Child node ${childId} needs dedicated official documentation`);
      for (const document of child?.docs ?? []) {
        check(/^https:\/\/docs\.paloaltonetworks\.com\//.test(document.url), `Child node ${childId} has a non-official documentation URL`);
      }
    }

    for (const [edgeId, [from, to]] of Object.entries(childEdges)) {
      const edge = edges.find(({ id }) => id === edgeId);
      check(edge?.from === from && edge?.to === to, `Child edge ${edgeId} must connect ${from} to ${to}`);
      check(edge?.labelOnFocusOnly === true, `Child edge ${edgeId} must keep its redundant label contextual`);
    }

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
  check(/\.space-stage\s*\{[\s\S]*?overflow:\s*clip;/.test(css), "The graph stage must not become a scroll container");
  check(/responsiveIconScale\s*\*\s*\.82/.test(app), "The compact node-icon scale must remain enabled");
  check(/stage\.addEventListener\("scroll",\s*resetStageScroll/.test(app), "The graph stage must reset unexpected focus scrolling");
  check(/function\s+toggleNode\(nodeId\)/.test(app), "Node selection must support same-node click toggling");
  check(/state\.selected\s*===\s*nodeId[\s\S]*?clearSelection\(\)/.test(app), "A second click on the selected node must close the inspector");
  check(/return\s+state\.selected\s*\|\|\s*state\.hovered/.test(app), "An open selection must not be overridden by incidental hover after graph reflow");
  check(/hasDockedInspector[\s\S]*?dockedFitCap/.test(app), "The graph must fit beside the docked inspector");
  check(/hasSheetInspector[\s\S]*?selectedRotated/.test(app), "The selected node must remain reachable above the compact inspector sheet");
}

if (failures.length) {
  console.error(`Site checks failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Site checks passed: five AIRS pillars, four interactive child nodes, graph integrity, official docs, assets, and metadata verified.");
