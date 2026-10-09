const NS = "http://www.w3.org/2000/svg";

const COLORS = {
  gateway: "#1fe6c2",
  runtime: "#4b8dff",
  agent: "#b778ff",
  lifecycle: "#ffbd5d",
  telemetry: "#8bdcff",
};

const ROUTE_COLORS = {
  data: "#1fe6c2",
  policy: "#b778ff",
  lifecycle: "#ffbd5d",
  telemetry: "#8bdcff",
  capability: "#b7c7ca",
};

const nodes = [
  {
    id: "workspaces", code: "AC-01", label: "Workspaces & keys", meta: "scope access", cluster: "gateway",
    x: 78, y: 74, w: 170, h: 68, glyph: "WK", eyebrow: "Scoped consumption",
    summary: "Logical workspaces and security keys define who can reach AI resources and which policy applies.",
    role: "Create isolation boundaries for teams and applications, then bind access, limits and routing to scoped keys.",
    facts: ["Keys inherit workspace controls", "Budgets and rate limits per workspace", "Reusable routing configurations"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-workspaces",
  },
  {
    id: "gateway", code: "GW-01", label: "AI Gateway", meta: "govern traffic", cluster: "gateway", prime: true,
    x: 295, y: 60, w: 190, h: 96, glyph: "GW", eyebrow: "Central AI traffic control",
    summary: "A unified control and data plane for routing, governing and observing AI requests.",
    role: "Place consistent access, routing, cost and security controls in the path of AI traffic.",
    facts: ["SaaS and hybrid deployment", "Workspace and key-scoped policy", "LLM, MCP and agent gateway controls"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-overview",
  },
  {
    id: "guardrails", code: "PL-02", label: "Gateway guardrails", meta: "inline policy", cluster: "gateway",
    x: 535, y: 74, w: 184, h: 68, glyph: "GR", eyebrow: "Request and response policy",
    summary: "Inline policies inspect requests and responses before traffic reaches its next hop.",
    role: "Detect prompt injection, sensitive data and topic violations, with optional deeper AIRS Runtime Security inspection.",
    facts: ["Request and response checks", "Allow, block or redact outcomes", "Can invoke Runtime Security inspection"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-policies-profiles",
  },
  {
    id: "securityProfiles", code: "PL-04", label: "Security profiles", meta: "define policy", cluster: "runtime",
    x: 780, y: 74, w: 185, h: 68, glyph: "SP", eyebrow: "Detection policy",
    summary: "Reusable profiles select protections and define allow, block, masking and latency behavior.",
    role: "Configure the threat detectors and actions used by runtime scans and MCP security workflows.",
    facts: ["Model, app, data and agent protections", "Allow or block per protection", "Fail-open or fail-closed latency behavior"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/api-intercept-create-configure-security-profile",
  },
  {
    id: "gatewayObservability", code: "TM-01", label: "Gateway observability", meta: "measure traffic", cluster: "telemetry",
    x: 1020, y: 74, w: 185, h: 68, glyph: "OB", eyebrow: "Transaction visibility",
    summary: "Analytics and logs track cost, tokens, latency, errors, cache behavior and guardrail activity.",
    role: "Make gateway traffic measurable and trace policy outcomes across workspaces.",
    facts: ["Analytics, logs and exports", "Original and transformed payload views", "Guardrail firing activity"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-observability",
  },
  {
    id: "apiIntercept", code: "IN-01", label: "API Intercept", meta: "security in code", cluster: "runtime",
    x: 78, y: 245, w: 175, h: 68, glyph: "API", eyebrow: "Code-level enforcement",
    summary: "A REST API and Python SDK embed prompt and response inspection directly in application logic.",
    role: "Submit content to AIRS before an application processes a prompt or returns a model response.",
    facts: ["Synchronous and asynchronous scanning", "REST and Python interfaces", "Named security profiles"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/ai-runtime-security-api-intercept-overview",
  },
  {
    id: "networkIntercept", code: "IN-02", label: "Network Intercept", meta: "inline enforcement", cluster: "runtime",
    x: 78, y: 322, w: 175, h: 68, glyph: "NI", eyebrow: "Network-level enforcement",
    summary: "An inline deployment inspects AI traffic without requiring application-code changes.",
    role: "Protect AI traffic at the network layer while sharing the platform's policy and detection intelligence.",
    facts: ["Cloud, Kubernetes and private models", "Works alongside API Intercept", "Inline allow and block outcomes"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-vm-firewall/ai-runtime-security-overview",
  },
  {
    id: "runtime", code: "RT-01", label: "AI Runtime Security", meta: "enforce", cluster: "runtime", prime: true,
    x: 310, y: 255, w: 190, h: 92, glyph: "RT", eyebrow: "Real-time enforcement",
    summary: "Detects and blocks AI-specific threats as traffic moves through applications and agents.",
    role: "Apply the same security intelligence through code-level API interception, network interception, or both.",
    facts: ["Prompt, response, agent and data protection", "API and network interception", "Actionable allow or block verdicts"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-vm-firewall/ai-runtime-security-overview",
  },
  {
    id: "scanEngine", code: "SV-01", label: "Scan engine & verdicts", meta: "analyze", cluster: "runtime", prime: true,
    x: 595, y: 255, w: 195, h: 92, glyph: "SV", eyebrow: "Threat decision point",
    summary: "Runtime inspection evaluates content against a selected profile and returns a security verdict and action.",
    role: "Centralize AI threat analysis for API, gateway and MCP-mediated workflows.",
    facts: ["Prompt injection and data detection", "Agent, URL, code and content controls", "Allow, block, mask or fallback"],
    source: "https://pan.dev/airs/",
  },
  {
    id: "scanLogs", code: "TM-02", label: "Scan logs", meta: "retain evidence", cluster: "telemetry",
    x: 895, y: 267, w: 175, h: 68, glyph: "LOG", eyebrow: "Runtime evidence",
    summary: "API scan records preserve application, profile, direction, verdict and action details.",
    role: "Provide investigation and validation evidence for runtime security decisions.",
    facts: ["Benign and threat categorization", "Scan, profile and application IDs", "Request-versus-response context"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/ai-runtime-security-intercept-scan-logs",
  },
  {
    id: "agentIdentity", code: "AG-01", label: "AI Agent Identity", meta: "govern agents", cluster: "agent",
    x: 180, y: 423, w: 190, h: 70, glyph: "AI", eyebrow: "Agent governance",
    summary: "AIRS establishes visibility and policy around agents and MCP-based workflows.",
    role: "Extend platform policy from model traffic to agent identities, tool use and communication paths.",
    facts: ["Enterprise and SaaS agent visibility", "MCP-centered security workflows", "Runtime protection for agent activity"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity",
  },
  {
    id: "mcpSecurity", code: "AG-02", label: "MCP Security", meta: "protect tool calls", cluster: "agent",
    x: 460, y: 423, w: 190, h: 70, glyph: "MCP", eyebrow: "Tool-call security",
    summary: "The AIRS MCP Server exposes runtime-security scanning as tools that agents invoke before processing content.",
    role: "Apply AIRS security profiles to prompt, response and tool-invocation stages in an agent workflow.",
    facts: ["Uses AIRS Runtime API services", "Two-stage prompt and response validation", "Allow or block actions with logs"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/understanding-the-prisma-airs-mcp-server",
  },
  {
    id: "inventory", code: "LC-01", label: "AI Inventory", meta: "discover", cluster: "lifecycle",
    x: 78, y: 550, w: 170, h: 68, glyph: "IN", eyebrow: "AI asset awareness",
    summary: "Discovers AI models, endpoints, datasets and agents, then shows dependencies and security coverage.",
    role: "Identify what exists, where risk is concentrated and which AIRS workflow should be initiated next.",
    facts: ["Asset dependency and coverage maps", "Can initiate red-team coverage", "Recommends runtime protection"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-inventory/agent-discovery/ai-agent-discovery-with-cortex-cloud",
  },
  {
    id: "redTeam", code: "LC-02", label: "AI Red Teaming", meta: "stress test", cluster: "lifecycle",
    x: 296, y: 550, w: 180, h: 68, glyph: "RTM", eyebrow: "Adversarial validation",
    summary: "Automated scans test applications, models and agents against real-world attack techniques.",
    role: "Turn discovered AI endpoints into targets, run attacks and feed findings back into protection decisions.",
    facts: ["Application, model and agentic targets", "Custom and multi-turn scenarios", "Findings and remediation guidance"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming",
  },
  {
    id: "supplyChain", code: "LC-03", label: "AI Supply Chain", meta: "validate artifacts", cluster: "lifecycle",
    x: 530, y: 550, w: 180, h: 68, glyph: "SC", eyebrow: "Pre-deployment assurance",
    summary: "Protects models and agent artifacts before they enter production AI pipelines.",
    role: "Stop malicious or unsafe AI artifacts before runtime controls ever need to process them.",
    facts: ["Model and agent artifact coverage", "Backdoor and unsafe-code analysis", "Policy-driven deployment decisions"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
  },
  {
    id: "modelSecurity", code: "AS-01", label: "Model Security", meta: "scan models", cluster: "lifecycle",
    x: 764, y: 530, w: 170, h: 62, glyph: "MS", eyebrow: "Model artifact scanning",
    summary: "Scans model files for malicious code, backdoors, unsafe deserialization and policy violations.",
    role: "Gate model artifacts before they are approved for use or deployment.",
    facts: ["Security groups, rules and scans", "Blocking and non-blocking rules", "File-level violations and metadata"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models",
  },
  {
    id: "skillSecurity", code: "AS-02", label: "Skill Security", meta: "scan agent artifacts", cluster: "lifecycle",
    x: 764, y: 600, w: 170, h: 62, glyph: "SK", eyebrow: "Agent artifact scanning", status: "PREVIEW",
    summary: "Evaluates agent source, skills and tools for critical attack paths and unsafe capabilities.",
    role: "Apply pre-deployment trust decisions to the packages that give agents new capabilities.",
    facts: ["Rule-based skill assessment", "Trust and remove-trust workflows", "Preview capability in current docs"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
  },
];

const edges = [
  { id: "workspaces-gateway", from: "workspaces", to: "gateway", type: "policy", label: "scoped key" },
  { id: "gateway-guardrails", from: "gateway", to: "guardrails", type: "data", label: "request / response" },
  { id: "gateway-observability", from: "gateway", to: "gatewayObservability", type: "telemetry", label: "transactions", start: "bottom", end: "bottom", via: [[390, 172], [1112, 172]], labelAt: [750, 167] },
  { id: "guardrails-observability", from: "guardrails", to: "gatewayObservability", type: "telemetry", label: "policy hits", start: "bottom", end: "bottom", via: [[627, 180], [1112, 180]], labelAt: [880, 176] },
  { id: "gateway-runtime", from: "gateway", to: "runtime", type: "capability", label: "runtime service", start: "bottom", end: "top", via: [[390, 199], [405, 199]], labelAt: [438, 197] },
  { id: "guardrails-scan", from: "guardrails", to: "scanEngine", type: "data", label: "deep inspection", start: "bottom", end: "top", via: [[627, 211], [692, 211]], labelAt: [660, 207] },
  { id: "profiles-scan", from: "securityProfiles", to: "scanEngine", type: "policy", label: "selected profile", start: "bottom", end: "top", via: [[872, 217], [692, 217]], labelAt: [785, 213] },
  { id: "profiles-runtime", from: "securityProfiles", to: "runtime", type: "policy", label: "protection policy", start: "bottom", end: "top", via: [[872, 202], [405, 202]], labelAt: [545, 198] },
  { id: "runtime-api", from: "runtime", to: "apiIntercept", type: "capability", label: "code path", start: "left", end: "right", via: [[280, 301], [280, 279]], labelAt: [278, 290] },
  { id: "runtime-network", from: "runtime", to: "networkIntercept", type: "capability", label: "network path", start: "left", end: "right", via: [[270, 301], [270, 356]], labelAt: [268, 330] },
  { id: "api-scan", from: "apiIntercept", to: "scanEngine", type: "data", label: "prompt + response", via: [[430, 279], [430, 301]], labelAt: [428, 275] },
  { id: "network-scan", from: "networkIntercept", to: "scanEngine", type: "data", label: "inline traffic", via: [[520, 356], [520, 320], [595, 320]], labelAt: [516, 351] },
  { id: "scan-logs", from: "scanEngine", to: "scanLogs", type: "telemetry", label: "verdict evidence" },
  { id: "inventory-redteam", from: "inventory", to: "redTeam", type: "lifecycle", label: "creates target" },
  { id: "redteam-runtime", from: "redTeam", to: "runtime", type: "lifecycle", label: "hardens controls", start: "top", end: "bottom", via: [[386, 518], [405, 518]], labelAt: [428, 515] },
  { id: "inventory-runtime", from: "inventory", to: "runtime", type: "lifecycle", label: "recommends protection", start: "top", end: "bottom", via: [[163, 510], [405, 510]], labelAt: [260, 506] },
  { id: "supply-model", from: "supplyChain", to: "modelSecurity", type: "capability", label: "model scans", via: [[736, 584], [736, 561]], labelAt: [735, 575] },
  { id: "supply-skill", from: "supplyChain", to: "skillSecurity", type: "capability", label: "skill scans", via: [[728, 584], [728, 631]], labelAt: [727, 616] },
  { id: "agent-mcp", from: "agentIdentity", to: "mcpSecurity", type: "data", label: "MCP workflow" },
  { id: "mcp-profiles", from: "mcpSecurity", to: "securityProfiles", type: "policy", label: "uses profile", start: "top", end: "bottom", via: [[555, 397], [872, 397]], labelAt: [720, 393] },
  { id: "mcp-scan", from: "mcpSecurity", to: "scanEngine", type: "data", label: "invokes scan", start: "top", end: "bottom", via: [[555, 373], [692, 373]], labelAt: [622, 369] },
  { id: "api-agent", from: "apiIntercept", to: "agentIdentity", type: "data", label: "protects agent", start: "bottom", end: "top", via: [[165, 404], [275, 404]], labelAt: [220, 400] },
];

const lenses = {
  request: {
    code: "FLOW / 01",
    title: "Inspect a live AI request",
    description: "Trace policy from a scoped key through gateway controls, deeper inspection, verdict, and evidence.",
    nodes: ["workspaces", "gateway", "guardrails", "gatewayObservability", "securityProfiles", "runtime", "apiIntercept", "networkIntercept", "scanEngine", "scanLogs"],
    edges: ["workspaces-gateway", "gateway-guardrails", "gateway-observability", "guardrails-observability", "gateway-runtime", "guardrails-scan", "profiles-scan", "profiles-runtime", "runtime-api", "runtime-network", "api-scan", "network-scan", "scan-logs"],
    sequence: ["workspaces", "gateway", "guardrails", "scanEngine", "scanLogs"],
    verdict: "POLICY → INSPECT → RECORD",
    defaultNode: "gateway",
  },
  agent: {
    code: "FLOW / 02",
    title: "Secure an agent and its tool calls",
    description: "Follow an agent-to-MCP interaction as profiles and Runtime Security inspect prompts, responses, and downstream actions.",
    nodes: ["agentIdentity", "mcpSecurity", "securityProfiles", "scanEngine", "scanLogs", "apiIntercept", "runtime"],
    edges: ["agent-mcp", "mcp-profiles", "mcp-scan", "scan-logs", "api-agent", "runtime-api", "profiles-runtime"],
    sequence: ["agentIdentity", "mcpSecurity", "securityProfiles", "scanEngine", "scanLogs"],
    verdict: "IDENTIFY → VALIDATE → ENFORCE",
    defaultNode: "mcpSecurity",
  },
  lifecycle: {
    code: "FLOW / 03",
    title: "Reduce risk before production",
    description: "Move from discovered assets through adversarial testing and artifact assurance, then feed protection decisions into runtime.",
    nodes: ["inventory", "redTeam", "supplyChain", "modelSecurity", "skillSecurity", "runtime", "securityProfiles"],
    edges: ["inventory-redteam", "inventory-runtime", "redteam-runtime", "supply-model", "supply-skill", "profiles-runtime"],
    sequence: ["inventory", "redTeam", "supplyChain", "modelSecurity", "runtime"],
    verdict: "DISCOVER → TEST → TRUST",
    defaultNode: "inventory",
  },
  fabric: {
    code: "FLOW / 04",
    title: "See the complete AIRS control fabric",
    description: "View governance, runtime enforcement, agent trust, and pre-deployment assurance as coordinated security planes.",
    nodes: nodes.map((node) => node.id),
    edges: edges.map((edge) => edge.id),
    sequence: ["gateway", "runtime", "agentIdentity", "supplyChain", "scanLogs"],
    verdict: "GOVERN → ENFORCE → PROVE",
    defaultNode: "runtime",
  },
};

const byId = new Map(nodes.map((node) => [node.id, node]));
const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
const edgeLayer = document.querySelector("#edgeLayer");
const signalLayer = document.querySelector("#signalLayer");
const moduleLayer = document.querySelector("#moduleLayer");

let activeLens = "request";
let selectedNode = null;

function makeSvg(tag, attributes = {}) {
  const element = document.createElementNS(NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function endpoint(node, side) {
  if (side === "left") return [node.x, node.y + node.h / 2];
  if (side === "right") return [node.x + node.w, node.y + node.h / 2];
  if (side === "top") return [node.x + node.w / 2, node.y];
  return [node.x + node.w / 2, node.y + node.h];
}

function edgeGeometry(edge) {
  const from = byId.get(edge.from);
  const to = byId.get(edge.to);
  const defaultForward = to.x >= from.x;
  const startSide = edge.start || (defaultForward ? "right" : "left");
  const endSide = edge.end || (defaultForward ? "left" : "right");
  const start = endpoint(from, startSide);
  const end = endpoint(to, endSide);
  const points = [start, ...(edge.via || []), end];

  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i += 1) {
    const [previousX, previousY] = points[i - 1];
    const [x, y] = points[i];
    if (previousY === y) d += ` H ${x}`;
    else if (previousX === x) d += ` V ${y}`;
    else d += ` H ${x} V ${y}`;
  }

  const labelAt = edge.labelAt || [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 - 7];
  return { d, labelAt };
}

function drawEdges() {
  edges.forEach((edge) => {
    const geometry = edgeGeometry(edge);
    const path = makeSvg("path", {
      id: `edge-${edge.id}`,
      d: geometry.d,
      class: `edge-path ${edge.type}`,
      "data-edge": edge.id,
    });
    const label = makeSvg("text", {
      x: geometry.labelAt[0],
      y: geometry.labelAt[1],
      class: "edge-label",
      "data-edge-label": edge.id,
    });
    label.textContent = edge.label.toUpperCase();
    edgeLayer.append(path, label);
  });
}

function drawModules() {
  nodes.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `fabric-module${node.prime ? " is-prime" : ""}`;
    button.dataset.node = node.id;
    button.style.cssText = `left:${node.x}px;top:${node.y}px;width:${node.w}px;height:${node.h}px;--node-color:${COLORS[node.cluster]}`;
    button.setAttribute("aria-label", `${node.label}. ${node.summary}`);

    const code = document.createElement("span");
    code.className = "module-code";
    code.textContent = node.code;
    const state = document.createElement("span");
    state.className = "module-state";
    state.innerHTML = `<i aria-hidden="true"></i>${node.status || "LINKED"}`;
    const title = document.createElement("strong");
    title.textContent = node.label;
    const meta = document.createElement("small");
    meta.textContent = node.meta;
    const portLeft = document.createElement("i");
    portLeft.className = "port-left";
    portLeft.setAttribute("aria-hidden", "true");
    const portRight = document.createElement("i");
    portRight.className = "port-right";
    portRight.setAttribute("aria-hidden", "true");

    button.append(code, state, title, meta, portLeft, portRight);
    button.addEventListener("click", () => selectNode(node.id));
    moduleLayer.append(button);
  });
}

function connectionsFor(nodeId) {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .map((edge) => ({ edge, node: byId.get(edge.from === nodeId ? edge.to : edge.from) }));
}

function updateInspector(node) {
  const ribbon = document.querySelector(".inspector-ribbon");
  ribbon.style.setProperty("--module-accent", COLORS[node.cluster]);
  document.querySelector("#detailGlyph").textContent = node.glyph;
  document.querySelector("#detailCluster").textContent = `${node.cluster.toUpperCase()} / ${node.code}`;
  document.querySelector("#detailStatus").textContent = node.status || "DOCUMENTED";
  document.querySelector("#detailTitle").textContent = node.label;
  document.querySelector("#detailEyebrow").textContent = node.eyebrow;
  document.querySelector("#detailRole").textContent = node.role;

  const factItems = node.facts.map((fact) => {
    const item = document.createElement("li");
    item.textContent = fact;
    return item;
  });
  document.querySelector("#detailFacts").replaceChildren(...factItems);

  const connections = connectionsFor(node.id);
  document.querySelector("#connectionCount").textContent = String(connections.length).padStart(2, "0");
  const connectionButtons = connections.map(({ edge, node: connected }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "connection-button";
    button.style.setProperty("--connection-color", COLORS[connected.cluster]);
    button.textContent = connected.label;
    button.title = `${edge.label}: ${connected.label}`;
    button.addEventListener("click", () => selectNode(connected.id));
    return button;
  });
  document.querySelector("#connectionList").replaceChildren(...connectionButtons);

  const source = document.querySelector("#sourceLink");
  source.href = node.source;
  source.setAttribute("aria-label", `Open official documentation for ${node.label}`);
}

function renderSignals(edgeIds) {
  signalLayer.replaceChildren();
  edgeIds.forEach((edgeId, index) => {
    const edge = edgeById.get(edgeId);
    if (!edge) return;
    const packet = makeSvg("rect", {
      x: -3,
      y: -3,
      width: 6,
      height: 6,
      rx: 1,
      fill: ROUTE_COLORS[edge.type],
      class: "signal-packet",
    });
    const motion = makeSvg("animateMotion", {
      dur: `${3 + (index % 4) * 0.5}s`,
      begin: `${-(index % 5) * 0.55}s`,
      repeatCount: "indefinite",
      rotate: "auto",
    });
    motion.append(makeSvg("mpath", { href: `#edge-${edgeId}` }));
    packet.append(motion);
    signalLayer.append(packet);
  });
}

function paintFabric({ visibleNodes, activeEdges, focusNode = null }) {
  const visible = new Set(visibleNodes);
  const active = new Set(activeEdges);
  const connections = focusNode ? connectionsFor(focusNode) : [];
  const focusEdges = new Set(connections.map(({ edge }) => edge.id));
  const focusNodes = new Set([focusNode, ...connections.map(({ node }) => node.id)]);

  document.querySelectorAll(".fabric-module").forEach((element) => {
    const id = element.dataset.node;
    const dimmed = focusNode ? !focusNodes.has(id) : !visible.has(id);
    element.classList.toggle("is-selected", id === focusNode);
    element.classList.toggle("is-dimmed", dimmed);
  });

  document.querySelectorAll(".edge-path").forEach((element) => {
    const id = element.dataset.edge;
    const edge = edgeById.get(id);
    const inView = visible.has(edge.from) && visible.has(edge.to);
    const highlighted = focusNode ? focusEdges.has(id) : active.has(id);
    element.classList.toggle("is-active", highlighted);
    element.classList.toggle("is-dimmed", focusNode ? !focusEdges.has(id) : !inView);
  });

  document.querySelectorAll(".edge-label").forEach((element) => {
    const id = element.dataset.edgeLabel;
    element.classList.toggle("is-active", focusNode ? focusEdges.has(id) : active.has(id));
  });

  renderSignals(focusNode ? [...focusEdges] : activeEdges);
}

function renderSequence(lens) {
  const steps = lens.sequence.map((nodeId) => {
    const node = byId.get(nodeId);
    const step = document.createElement("span");
    step.className = "sequence-step";
    step.style.setProperty("--step-color", COLORS[node.cluster]);
    const light = document.createElement("i");
    light.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = node.glyph;
    step.append(light, text);
    return step;
  });
  document.querySelector("#sequenceSteps").replaceChildren(...steps);
  document.querySelector("#verdictChip").textContent = lens.verdict;
}

function selectNode(nodeId) {
  selectedNode = nodeId;
  const lens = lenses[activeLens];
  updateInspector(byId.get(nodeId));
  paintFabric({ visibleNodes: lens.nodes, activeEdges: lens.edges, focusNode: nodeId });
}

function setLens(lensId) {
  activeLens = lensId;
  selectedNode = null;
  const lens = lenses[lensId];

  document.querySelectorAll(".trace-tab").forEach((button) => {
    const active = button.dataset.lens === lensId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  document.querySelector("#traceCode").textContent = lens.code;
  document.querySelector("#traceTitle").textContent = lens.title;
  document.querySelector("#traceDescription").textContent = lens.description;
  renderSequence(lens);
  updateInspector(byId.get(lens.defaultNode));
  paintFabric({ visibleNodes: lens.nodes, activeEdges: lens.edges });
}

drawEdges();
drawModules();

document.querySelector("#capabilityCount").textContent = nodes.length;
document.querySelector("#linkCount").textContent = edges.length;

document.querySelectorAll(".trace-tab").forEach((button) => {
  button.addEventListener("click", () => setLens(button.dataset.lens));
});

document.querySelector("#clearFocus").addEventListener("click", () => setLens(activeLens));

setLens("request");
