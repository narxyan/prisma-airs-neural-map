const NS = "http://www.w3.org/2000/svg";

const COLORS = {
  core: "#ff4f64",
  gateway: "#38d9ff",
  runtime: "#a878ff",
  lifecycle: "#ffbd4a",
  telemetry: "#35e2a2",
  agent: "#5e8cff",
  structure: "#8b96ad",
};

const nodes = [
  {
    id: "airs",
    label: "Prisma AIRS",
    meta: "platform core",
    cluster: "core",
    x: 600, y: 365, r: 34,
    glyph: "A",
    eyebrow: "Unified AI security",
    summary: "A modular platform that secures AI applications, models, agents, data and infrastructure across the AI lifecycle.",
    role: "Coordinate independent security pillars while sharing policy, telemetry and lifecycle context across AIRS.",
    facts: ["Four core pillars can run independently or together", "Extends from pre-deployment artifact validation to runtime enforcement", "Adds inventory and agent-security surfaces around the core platform"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
  },
  {
    id: "gateway",
    label: "AI Gateway",
    meta: "govern",
    cluster: "gateway",
    x: 347, y: 250, r: 26,
    glyph: "GW",
    eyebrow: "Central AI traffic control",
    summary: "A unified control and data plane for routing, governing and observing AI requests.",
    role: "Place consistent access, routing, cost and security controls in the path of AI traffic.",
    facts: ["Supports SaaS and hybrid deployment modes", "Applies workspace and key-scoped policies", "Includes LLM, MCP and agent gateway capabilities"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-overview",
  },
  {
    id: "workspaces",
    label: "Workspaces & keys",
    meta: "scope access",
    cluster: "gateway",
    x: 235, y: 112, r: 18,
    glyph: "WK",
    eyebrow: "Scoped consumption",
    summary: "Logical workspaces and security keys define who can reach AI resources and which policy applies.",
    role: "Create isolation boundaries for teams and applications, then bind access, limits and routing to scoped keys.",
    facts: ["Keys inherit workspace controls", "Budgets and rate limits can be applied per workspace", "Keys can carry reusable routing configurations"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-workspaces",
  },
  {
    id: "guardrails",
    label: "Gateway guardrails",
    meta: "inline policy",
    cluster: "gateway",
    x: 170, y: 335, r: 20,
    glyph: "GR",
    eyebrow: "Request and response policy",
    summary: "Inline policies inspect every request and response before traffic reaches its next hop.",
    role: "Detect prompt injection, sensitive data and topic violations, with optional deeper inspection by AIRS Runtime Security.",
    facts: ["Runs before provider requests and caller responses", "Can redact, allow or block content", "Can invoke AIRS Runtime Security inspection"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-policies-profiles",
  },
  {
    id: "gatewayObservability",
    label: "Gateway observability",
    meta: "measure",
    cluster: "telemetry",
    x: 455, y: 112, r: 19,
    glyph: "OB",
    eyebrow: "Transaction visibility",
    summary: "Analytics and logs track cost, tokens, latency, errors, cache behavior and guardrail activity.",
    role: "Make gateway traffic measurable and trace policy outcomes across workspaces.",
    facts: ["Analytics, logs and exports", "Stores original and transformed payload views", "Includes guardrail firing activity"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-observability",
  },
  {
    id: "runtime",
    label: "AI Runtime Security",
    meta: "protect",
    cluster: "runtime",
    x: 825, y: 250, r: 27,
    glyph: "RT",
    eyebrow: "Real-time enforcement",
    summary: "Detects and blocks AI-specific threats as traffic moves through applications and agents.",
    role: "Apply the same security intelligence through code-level API interception, network interception, or both.",
    facts: ["Protects prompts, responses, agents and data", "Supports API and network interception", "Returns actionable allow or block verdicts"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-vm-firewall/ai-runtime-security-overview",
  },
  {
    id: "securityProfiles",
    label: "Security profiles",
    meta: "define policy",
    cluster: "runtime",
    x: 740, y: 105, r: 19,
    glyph: "SP",
    eyebrow: "Detection policy",
    summary: "Reusable profiles select protections and define allow, block, masking and latency behavior.",
    role: "Configure the threat detectors and actions used by runtime scans and MCP security workflows.",
    facts: ["Model, application, data and agent protections", "Allow or block actions per protection", "Latency threshold can fail open or closed"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/api-intercept-create-configure-security-profile",
  },
  {
    id: "apiIntercept",
    label: "API Intercept",
    meta: "security in code",
    cluster: "runtime",
    x: 1015, y: 148, r: 21,
    glyph: "API",
    eyebrow: "Code-level enforcement",
    summary: "A REST API and Python SDK embed prompt and response inspection directly in application logic.",
    role: "Submit content to AIRS before an application processes a prompt or returns a model response.",
    facts: ["Synchronous and asynchronous scan patterns", "Model-agnostic REST and Python interfaces", "Uses API keys and named security profiles"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/ai-runtime-security-api-intercept-overview",
  },
  {
    id: "networkIntercept",
    label: "Network Intercept",
    meta: "inline enforcement",
    cluster: "runtime",
    x: 1050, y: 325, r: 21,
    glyph: "NI",
    eyebrow: "Network-level enforcement",
    summary: "An inline deployment inspects AI traffic without requiring application-code changes.",
    role: "Protect AI traffic at the network layer while sharing the platform's policy and detection intelligence.",
    facts: ["Public cloud, Kubernetes and private deployment models", "Can operate alongside API Intercept", "Enforces inline allow and block outcomes"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-vm-firewall/ai-runtime-security-overview",
  },
  {
    id: "scanEngine",
    label: "Scan engine & verdicts",
    meta: "analyze",
    cluster: "runtime",
    x: 895, y: 420, r: 22,
    glyph: "SV",
    eyebrow: "Threat decision point",
    summary: "Runtime inspection evaluates content against a selected profile and returns a security verdict and action.",
    role: "Centralize AI threat analysis for API, gateway and MCP-mediated workflows.",
    facts: ["Prompt injection and sensitive-data detection", "Agent, URL, code and content protections", "Verdicts drive allow, block, mask or fallback behavior"],
    source: "https://pan.dev/airs/",
  },
  {
    id: "scanLogs",
    label: "Scan logs",
    meta: "evidence",
    cluster: "telemetry",
    x: 1040, y: 530, r: 18,
    glyph: "LOG",
    eyebrow: "Runtime evidence",
    summary: "API scan records preserve application, profile, request or response direction, verdict and action details.",
    role: "Provide investigation and validation evidence for runtime security decisions.",
    facts: ["Benign and threat categorization", "Scan, report, profile and application identifiers", "Request-versus-response detection context"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/ai-runtime-security-intercept-scan-logs",
  },
  {
    id: "inventory",
    label: "AI Inventory",
    meta: "discover",
    cluster: "telemetry",
    x: 210, y: 535, r: 23,
    glyph: "IN",
    eyebrow: "AI asset awareness",
    summary: "Discovers AI models, endpoints, datasets and agents, then shows dependencies and security coverage.",
    role: "Identify what exists, where risk is concentrated and which AIRS workflow should be initiated next.",
    facts: ["Maps asset dependencies and protection status", "Can initiate red-team coverage from discovered assets", "Recommends runtime guardrails and protection"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-inventory/agent-discovery/ai-agent-discovery-with-cortex-cloud",
  },
  {
    id: "supplyChain",
    label: "AI Supply Chain",
    meta: "validate artifacts",
    cluster: "lifecycle",
    x: 390, y: 625, r: 23,
    glyph: "SC",
    eyebrow: "Pre-deployment assurance",
    summary: "Protects models and agent artifacts before they enter production AI pipelines.",
    role: "Stop malicious or unsafe AI artifacts before runtime controls ever need to process them.",
    facts: ["Covers model files and agent artifacts", "Evaluates hidden code, backdoors and unsafe capabilities", "Supports policy-driven pre-deployment decisions"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
  },
  {
    id: "modelSecurity",
    label: "Model Security",
    meta: "scan models",
    cluster: "lifecycle",
    x: 205, y: 700, r: 17,
    glyph: "MS",
    eyebrow: "Model artifact scanning",
    summary: "Scans model files for malicious code, backdoors, unsafe deserialization and policy violations.",
    role: "Gate model artifacts before they are approved for use or deployment.",
    facts: ["Security groups, sources, rules and scans", "Blocking and non-blocking rules", "File-level violations and metadata checks"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models",
  },
  {
    id: "skillSecurity",
    label: "Skill Security",
    meta: "scan agent artifacts",
    cluster: "lifecycle",
    x: 485, y: 715, r: 17,
    glyph: "SK",
    eyebrow: "Agent artifact scanning",
    summary: "Evaluates agent source, skills and tools for critical attack paths and unsafe capabilities before deployment.",
    role: "Apply pre-deployment trust decisions to the packages that give agents new capabilities.",
    facts: ["Rule-based skill package assessment", "Trust and remove-trust workflows", "Preview capability in current documentation"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
    status: "PREVIEW",
  },
  {
    id: "redTeam",
    label: "AI Red Teaming",
    meta: "stress test",
    cluster: "lifecycle",
    x: 515, y: 525, r: 23,
    glyph: "RTM",
    eyebrow: "Adversarial validation",
    summary: "Automated scans test applications, models and agents against real-world attack techniques before production.",
    role: "Turn discovered or registered AI endpoints into targets, run attacks and feed coverage findings back into lifecycle decisions.",
    facts: ["Supports applications, models and agentic targets", "Custom, multi-turn and agent attack scenarios", "Reports findings and remediation guidance"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming",
  },
  {
    id: "agentIdentity",
    label: "AI Agent Identity",
    meta: "govern agents",
    cluster: "agent",
    x: 690, y: 585, r: 23,
    glyph: "AI",
    eyebrow: "Agent governance",
    summary: "AIRS agent-security capabilities establish visibility and policy around agents and MCP-based workflows.",
    role: "Extend platform policy from model traffic to agent identities, tool use and agent communication paths.",
    facts: ["Covers enterprise and SaaS agent visibility", "Includes MCP-centered security workflows", "Connects agent activity to runtime protections"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity",
  },
  {
    id: "mcpSecurity",
    label: "MCP Security",
    meta: "protect tools",
    cluster: "agent",
    x: 850, y: 650, r: 21,
    glyph: "MCP",
    eyebrow: "Tool-call security",
    summary: "The AIRS MCP Server exposes runtime-security scanning as tools that agents invoke before processing content or using other tools.",
    role: "Apply AIRS security profiles to prompt, response and tool-invocation stages in an agent workflow.",
    facts: ["Uses AIRS Runtime API security services", "Supports mandatory two-stage prompt and response validation", "Returns allow or block actions and detailed logs"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/understanding-the-prisma-airs-mcp-server",
  },
];

const edges = [
  { id: "airs-gateway", from: "airs", to: "gateway", type: "structure", label: "gateway pillar", curve: 15 },
  { id: "airs-runtime", from: "airs", to: "runtime", type: "structure", label: "runtime pillar", curve: -15 },
  { id: "airs-inventory", from: "airs", to: "inventory", type: "structure", label: "inventory", curve: -30 },
  { id: "airs-supply", from: "airs", to: "supplyChain", type: "structure", label: "supply chain", curve: 18 },
  { id: "airs-redteam", from: "airs", to: "redTeam", type: "structure", label: "red teaming", curve: -12 },
  { id: "airs-agent", from: "airs", to: "agentIdentity", type: "structure", label: "agent security", curve: 15 },
  { id: "workspaces-gateway", from: "workspaces", to: "gateway", type: "policy", label: "scopes keys", curve: -22 },
  { id: "gateway-guardrails", from: "gateway", to: "guardrails", type: "policy", label: "applies guardrails", curve: 25 },
  { id: "gateway-observability", from: "gateway", to: "gatewayObservability", type: "telemetry", label: "emits transactions", curve: -30 },
  { id: "guardrails-observability", from: "guardrails", to: "gatewayObservability", type: "telemetry", label: "records hits", curve: 58 },
  { id: "gateway-runtime", from: "gateway", to: "runtime", type: "data", label: "governed traffic", curve: -48 },
  { id: "guardrails-scan", from: "guardrails", to: "scanEngine", type: "data", label: "deep inspection", curve: 95 },
  { id: "runtime-api", from: "runtime", to: "apiIntercept", type: "structure", label: "code path", curve: -24 },
  { id: "runtime-network", from: "runtime", to: "networkIntercept", type: "structure", label: "network path", curve: 24 },
  { id: "profiles-scan", from: "securityProfiles", to: "scanEngine", type: "policy", label: "configures", curve: -35 },
  { id: "api-scan", from: "apiIntercept", to: "scanEngine", type: "data", label: "prompt + response", curve: -34 },
  { id: "network-scan", from: "networkIntercept", to: "scanEngine", type: "data", label: "inline traffic", curve: 32 },
  { id: "scan-logs", from: "scanEngine", to: "scanLogs", type: "telemetry", label: "writes verdict", curve: 20 },
  { id: "inventory-redteam", from: "inventory", to: "redTeam", type: "lifecycle", label: "creates target", curve: -24 },
  { id: "redteam-runtime", from: "redTeam", to: "runtime", type: "lifecycle", label: "hardens policy", curve: 40 },
  { id: "inventory-runtime", from: "inventory", to: "runtime", type: "lifecycle", label: "recommends protection", curve: -88 },
  { id: "supply-model", from: "supplyChain", to: "modelSecurity", type: "structure", label: "model scans", curve: 18 },
  { id: "supply-skill", from: "supplyChain", to: "skillSecurity", type: "structure", label: "skill scans", curve: -15 },
  { id: "agent-mcp", from: "agentIdentity", to: "mcpSecurity", type: "structure", label: "MCP controls", curve: -10 },
  { id: "mcp-profiles", from: "mcpSecurity", to: "securityProfiles", type: "policy", label: "uses profile", curve: 84 },
  { id: "mcp-scan", from: "mcpSecurity", to: "scanEngine", type: "data", label: "invokes scan", curve: -45 },
  { id: "api-agent", from: "apiIntercept", to: "agentIdentity", type: "data", label: "protects agents", curve: 78 },
];

const lenses = {
  overview: {
    index: "01",
    title: "One platform, modular capabilities",
    description: "Select a neuron to inspect its role and documented AIRS connections.",
    nodes: nodes.map((node) => node.id),
    edges: ["airs-gateway", "airs-runtime", "airs-inventory", "airs-supply", "airs-redteam", "airs-agent", "gateway-runtime", "scan-logs"],
  },
  runtime: {
    index: "02",
    title: "Policy becomes an inline verdict",
    description: "Follow traffic from a scoped gateway key through guardrails, Runtime Security and scan evidence.",
    nodes: ["workspaces", "gateway", "guardrails", "securityProfiles", "runtime", "apiIntercept", "networkIntercept", "scanEngine", "scanLogs", "gatewayObservability"],
    edges: ["workspaces-gateway", "gateway-guardrails", "guardrails-scan", "profiles-scan", "api-scan", "network-scan", "scan-logs", "gateway-observability"],
  },
  agent: {
    index: "03",
    title: "Agent interactions inherit runtime policy",
    description: "MCP security invokes AIRS detection services before prompts, responses or downstream tools proceed.",
    nodes: ["agentIdentity", "mcpSecurity", "securityProfiles", "scanEngine", "scanLogs", "apiIntercept", "runtime"],
    edges: ["agent-mcp", "mcp-profiles", "mcp-scan", "scan-logs", "api-agent", "runtime-api"],
  },
  lifecycle: {
    index: "04",
    title: "Discover, validate, test, protect",
    description: "Inventory reveals the asset; supply-chain scans and red teaming reduce risk before runtime enforcement.",
    nodes: ["inventory", "supplyChain", "modelSecurity", "skillSecurity", "redTeam", "runtime", "scanLogs", "airs"],
    edges: ["airs-inventory", "airs-supply", "airs-redteam", "inventory-redteam", "inventory-runtime", "redteam-runtime", "supply-model", "supply-skill", "scan-logs"],
  },
};

const byId = new Map(nodes.map((node) => [node.id, node]));
const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
const nodeLayer = document.querySelector("#nodeLayer");
const edgeLayer = document.querySelector("#edgeLayer");
const signalLayer = document.querySelector("#signalLayer");
const ambientLayer = document.querySelector("#ambientLayer");

let activeLens = "overview";
let selectedNode = "airs";

function makeSvg(tag, attributes = {}) {
  const element = document.createElementNS(NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function edgeGeometry(edge) {
  const a = byId.get(edge.from);
  const b = byId.get(edge.to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / length;
  const ny = dx / length;
  const curve = edge.curve || 0;
  return {
    d: `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2 + nx * curve} ${(a.y + b.y) / 2 + ny * curve} ${b.x} ${b.y}`,
    labelX: (a.x + b.x) / 2 + nx * curve * 0.52,
    labelY: (a.y + b.y) / 2 + ny * curve * 0.52 - 5,
  };
}

function drawAmbient() {
  [92, 170, 255].forEach((radius) => {
    ambientLayer.append(makeSvg("circle", { cx: 600, cy: 365, r: radius, class: "ambient-ring" }));
  });
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
      x: geometry.labelX,
      y: geometry.labelY,
      class: "edge-label",
      "data-edge-label": edge.id,
    });
    label.textContent = edge.label;
    edgeLayer.append(path, label);
  });
}

function wrapLabel(label) {
  if (label.length <= 17) return [label];
  const words = label.split(" ");
  const lines = [""];
  words.forEach((word) => {
    const current = lines[lines.length - 1];
    if ((current + " " + word).trim().length > 18 && lines.length < 2) lines.push(word);
    else lines[lines.length - 1] = (current + " " + word).trim();
  });
  return lines;
}

function drawNodes() {
  nodes.forEach((node) => {
    const color = COLORS[node.cluster];
    const group = makeSvg("g", {
      class: `neuron${node.id === "airs" ? " is-core" : ""}`,
      transform: `translate(${node.x} ${node.y})`,
      tabindex: "0",
      role: "button",
      "aria-label": `${node.label}. ${node.summary}`,
      "data-node": node.id,
      style: `--ring-radius:${node.r + 10}px`,
    });
    group.append(
      makeSvg("circle", { class: "node-halo", r: node.r + 21, fill: color }),
      makeSvg("circle", { class: "node-ring-outer", r: node.r + 10, stroke: color }),
      makeSvg("circle", { class: "node-ring", r: node.r + 3, stroke: color }),
      makeSvg("circle", { class: "node-core", r: Math.max(7, node.r * 0.48), fill: node.id === "airs" ? "url(#coreGradient)" : color }),
    );

    const lines = wrapLabel(node.label);
    const label = makeSvg("text", { class: "node-label", y: node.r + 26 - (lines.length - 1) * 7 });
    lines.forEach((line, index) => {
      const tspan = makeSvg("tspan", { x: 0, dy: index === 0 ? 0 : 15 });
      tspan.textContent = line;
      label.append(tspan);
    });
    const meta = makeSvg("text", { class: "node-meta", y: node.r + 48 + (lines.length - 1) * 12 });
    meta.textContent = node.meta;
    group.append(label, meta);
    group.addEventListener("click", () => selectNode(node.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(node.id);
      }
    });
    nodeLayer.append(group);
  });
}

function connectionsFor(nodeId) {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .map((edge) => ({ edge, node: byId.get(edge.from === nodeId ? edge.to : edge.from) }));
}

function updatePanel(node) {
  document.querySelector("#detailCluster").textContent = `${node.cluster.toUpperCase()} · ${node.meta.toUpperCase()}`;
  document.querySelector("#detailCluster").style.color = COLORS[node.cluster];
  document.querySelector("#detailStatus").textContent = node.status || "DOCUMENTED";
  document.querySelector("#detailGlyph").textContent = node.glyph;
  document.querySelector("#detailEyebrow").textContent = node.eyebrow;
  document.querySelector("#detailTitle").textContent = node.label;
  document.querySelector("#detailSummary").textContent = node.summary;
  document.querySelector("#detailRole").textContent = node.role;
  document.querySelector("#detailFacts").replaceChildren(...node.facts.map((fact) => {
    const li = document.createElement("li");
    li.textContent = fact;
    return li;
  }));

  const connections = connectionsFor(node.id);
  document.querySelector("#connectionCount").textContent = String(connections.length).padStart(2, "0");
  document.querySelector("#connectionList").replaceChildren(...connections.map(({ edge, node: connected }) => {
    const button = document.createElement("button");
    button.className = "connection-button";
    button.type = "button";
    button.style.setProperty("--connection-color", COLORS[connected.cluster]);
    button.innerHTML = `<i aria-hidden="true"></i><span class="connection-name"></span><span class="connection-type"></span>`;
    button.querySelector(".connection-name").textContent = connected.label;
    button.querySelector(".connection-type").textContent = edge.label;
    button.addEventListener("click", () => selectNode(connected.id));
    return button;
  }));

  const source = document.querySelector("#sourceLink");
  source.href = node.source;
  source.setAttribute("aria-label", `Open official documentation for ${node.label}`);
}

function renderSignals(edgeIds) {
  signalLayer.replaceChildren();
  edgeIds.forEach((edgeId, index) => {
    const edge = edgeById.get(edgeId);
    if (!edge) return;
    const circle = makeSvg("circle", {
      r: edge.type === "structure" ? 2.7 : 3.4,
      fill: COLORS[edge.type] || COLORS.structure,
      class: "signal-dot",
    });
    const motion = makeSvg("animateMotion", {
      dur: `${3.6 + (index % 4) * 0.55}s`,
      begin: `${-(index % 3) * 0.8}s`,
      repeatCount: "indefinite",
      rotate: "auto",
    });
    motion.append(makeSvg("mpath", { href: `#edge-${edgeId}` }));
    circle.append(motion);
    signalLayer.append(circle);
  });
}

function paintNetwork({ visibleNodes, activeEdges, focusNode = null }) {
  const visible = new Set(visibleNodes);
  const active = new Set(activeEdges);
  const neighborEdges = focusNode ? new Set(connectionsFor(focusNode).map(({ edge }) => edge.id)) : null;
  const neighborNodes = focusNode
    ? new Set([focusNode, ...connectionsFor(focusNode).map(({ node }) => node.id)])
    : visible;

  document.querySelectorAll(".neuron").forEach((element) => {
    const id = element.dataset.node;
    element.classList.toggle("is-selected", id === focusNode);
    element.classList.toggle("is-dimmed", !visible.has(id) || (focusNode && !neighborNodes.has(id)));
  });

  document.querySelectorAll(".edge-path").forEach((element) => {
    const id = element.dataset.edge;
    const edge = edgeById.get(id);
    const inVisibleSet = visible.has(edge.from) && visible.has(edge.to);
    const isActive = focusNode ? neighborEdges.has(id) : active.has(id);
    element.classList.toggle("is-active", isActive);
    element.classList.toggle("is-dimmed", !inVisibleSet || (focusNode && !neighborEdges.has(id)));
  });
  document.querySelectorAll(".edge-label").forEach((element) => {
    const id = element.dataset.edgeLabel;
    element.classList.toggle("is-active", focusNode ? neighborEdges.has(id) : active.has(id));
  });
  renderSignals(focusNode ? [...neighborEdges] : activeEdges);
}

function selectNode(nodeId) {
  selectedNode = nodeId;
  const lens = lenses[activeLens];
  const visibleNodes = lens.nodes.includes(nodeId) ? lens.nodes : nodes.map((node) => node.id);
  paintNetwork({ visibleNodes, activeEdges: lens.edges, focusNode: nodeId });
  updatePanel(byId.get(nodeId));
}

function setLens(lensId) {
  activeLens = lensId;
  selectedNode = null;
  const lens = lenses[lensId];
  document.querySelectorAll(".lens-tab").forEach((button) => {
    const active = button.dataset.lens === lensId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#lensIndex").textContent = lens.index;
  document.querySelector("#lensTitle").textContent = lens.title;
  document.querySelector("#lensDescription").textContent = lens.description;
  paintNetwork({ visibleNodes: lens.nodes, activeEdges: lens.edges });
  const defaultNode = lensId === "runtime" ? "runtime" : lensId === "agent" ? "mcpSecurity" : lensId === "lifecycle" ? "inventory" : "airs";
  updatePanel(byId.get(defaultNode));
}

drawAmbient();
drawEdges();
drawNodes();

document.querySelectorAll(".lens-tab").forEach((button) => {
  button.addEventListener("click", () => setLens(button.dataset.lens));
});

document.querySelector("#resetView").addEventListener("click", () => setLens(activeLens));

setLens("overview");
