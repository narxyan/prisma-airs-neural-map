const NS = "http://www.w3.org/2000/svg";
const THEME_STORAGE_KEY = "prisma-airs-theme";
const root = document.documentElement;
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const COLORS = {
  core: "#ffffff",
  gateway: "#03c0e8",
  runtime: "#377dff",
  endpoint: "#43e6c5",
  lifecycle: "#ff9e57",
  model: "#9e75ff",
};

const FLOW_COLORS = {
  data: "#03c0e8",
  policy: "#9e75ff",
  lifecycle: "#ff9e57",
  telemetry: "#73e6ff",
  capability: "#b9c7dd",
};

const A = "./assets/official/";

const nodes = [
  {
    id: "airs", label: "Prisma AIRS", meta: "platform core", cluster: "core", glyph: "AIRS",
    pos: [0, 0, 105], size: 78, asset: `${A}prisma-airs.svg`, important: true,
    eyebrow: "Unified AI security platform",
    summary: "A unified platform for discovering, assessing, and protecting AI applications, models, agents, data, and infrastructure.",
    role: "Coordinate the focused gateway, runtime, endpoint, red-team, and model-security paths shown in this map.",
    facts: ["One platform across the AI lifecycle", "Shared protection and governance context", "Focused here on six core integration surfaces"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
  },
  {
    id: "gateway", label: "AI Gateway", meta: "govern traffic", cluster: "gateway", glyph: "GW",
    pos: [-310, -155, 35], size: 58, asset: `${A}gateway-governance.svg`, important: true,
    eyebrow: "AI control plane",
    summary: "A unified control and data plane for routing, governing, and observing AI requests.",
    role: "Place consistent access, routing, cost, and security controls in the path of AI traffic.",
    facts: ["Workspace and key-scoped policy", "Guardrails for requests and responses", "LLM, MCP, and agent gateway capabilities"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-overview",
  },
  {
    id: "runtime", label: "AI Runtime Security", meta: "enforce", cluster: "runtime", glyph: "RT",
    pos: [310, -135, 55], size: 60, asset: `${A}runtime-prevention.svg`, important: true,
    eyebrow: "Real-time enforcement",
    summary: "Detects and blocks AI-specific threats as traffic moves through applications and agents.",
    role: "Apply the same security intelligence through code-level API interception, network interception, or both.",
    facts: ["Prompt, response, agent, and data protection", "API and network interception", "Actionable allow or block verdicts"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-vm-firewall/ai-runtime-security-overview",
  },
  {
    id: "endpointSecurity", label: "Endpoint Security", meta: "secure agent endpoints", cluster: "endpoint", glyph: "AES",
    pos: [325, 175, -30], size: 54, asset: `${A}runtime-platform.svg`, important: true,
    eyebrow: "Agentic endpoint protection",
    summary: "Cortex Agentic Endpoint Security protects the developer endpoint where autonomous coding agents, extensions, and local AI artifacts operate.",
    role: "Pair endpoint discovery and local enforcement with Prisma AIRS Runtime Security inspection for AI coding-agent activity.",
    facts: ["Discovers agents, extensions, and AI artifacts", "Assesses endpoint risk and applies local policy", "Integrates with AIRS Runtime Security for AI traffic protection"],
    source: "https://www.paloaltonetworks.com/blog/ai-security/securing-the-ai-coding-frontier-prisma-airs-agentic-endpoint-security/",
  },
  {
    id: "redTeam", label: "AI Red Teaming", meta: "stress test", cluster: "lifecycle", glyph: "RTM",
    pos: [-285, 185, 60], size: 56, asset: `${A}redteam-authentication.svg`, important: true,
    eyebrow: "Adversarial validation",
    summary: "Automated scans test applications, models, and agents against real-world attack techniques.",
    role: "Turn discovered AI endpoints into targets, run attacks, and feed findings back into protection decisions.",
    facts: ["Application, model, and agentic targets", "Custom and multi-turn scenarios", "Findings and remediation guidance"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming",
  },
  {
    id: "modelSecurity", label: "Model Security", meta: "scan models", cluster: "model", glyph: "MS",
    pos: [0, 235, -90], size: 54, asset: `${A}model-inspection.svg`, important: true,
    eyebrow: "Model artifact scanning",
    summary: "Scans model files for malicious code, backdoors, unsafe deserialization, and policy violations.",
    role: "Gate model artifacts before they are approved for use or deployment.",
    facts: ["Security groups, rules, and scans", "Blocking and non-blocking rules", "File-level violations and metadata"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models",
  },
];

const edges = [
  { id: "airs-gateway", from: "airs", to: "gateway", type: "capability", label: "gateway pillar" },
  { id: "airs-runtime", from: "airs", to: "runtime", type: "capability", label: "runtime pillar" },
  { id: "airs-endpoint", from: "airs", to: "endpointSecurity", type: "capability", label: "AIRS + AES" },
  { id: "airs-redteam", from: "airs", to: "redTeam", type: "capability", label: "assessment pillar" },
  { id: "airs-model", from: "airs", to: "modelSecurity", type: "capability", label: "model assurance" },
  { id: "gateway-runtime", from: "gateway", to: "runtime", type: "data", label: "policy-enforced traffic" },
  { id: "endpoint-runtime", from: "endpointSecurity", to: "runtime", type: "data", label: "agent traffic" },
  { id: "redteam-runtime", from: "redTeam", to: "runtime", type: "lifecycle", label: "findings harden policy" },
  { id: "model-runtime", from: "modelSecurity", to: "runtime", type: "policy", label: "approved model" },
];

const views = {
  platform: {
    code: "VIEW 01",
    title: "Focused Prisma AIRS platform",
    focus: "airs",
    description: "Six core surfaces, one shared security platform. Hover or select any node to trace its direct paths.",
    nodes: ["airs", "gateway", "runtime", "endpointSecurity", "redTeam", "modelSecurity"],
    edges: ["airs-gateway", "airs-runtime", "airs-endpoint", "airs-redteam", "airs-model"],
  },
  runtime: {
    code: "VIEW 02",
    title: "Live AI traffic protection",
    focus: "runtime",
    description: "Trace governed AI and coding-agent traffic into the Runtime Security enforcement layer.",
    nodes: ["airs", "gateway", "runtime", "endpointSecurity"],
    edges: ["airs-runtime", "gateway-runtime", "endpoint-runtime"],
  },
  lifecycle: {
    code: "VIEW 03",
    title: "AI lifecycle assurance",
    focus: "redTeam",
    description: "Connect adversarial testing and model assurance to the controls that protect production AI.",
    nodes: ["airs", "redTeam", "modelSecurity", "runtime"],
    edges: ["airs-redteam", "airs-model", "redteam-runtime", "model-runtime"],
  },
};

const byId = new Map(nodes.map((node) => [node.id, node]));
const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
const stage = document.querySelector("#spaceStage");
const canvas = document.querySelector("#starfield");
const context = canvas.getContext("2d");
const linkLayer = document.querySelector("#linkLayer");
const edgeLayer = document.querySelector("#edgeLayer");
const signalLayer = document.querySelector("#signalLayer");
const nodeLayer = document.querySelector("#nodeLayer");
const inspector = document.querySelector("#inspector");
const themeToggle = document.querySelector("#themeToggle");
const brandLogo = document.querySelector("#brandLogo");
const themeColor = document.querySelector('meta[name="theme-color"]');
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  view: "platform",
  selected: null,
  hovered: null,
  keyboardFocus: null,
  rotX: -0.075,
  rotY: 0.18,
  zoom: 1,
  pointerX: 0,
  pointerY: 0,
  dragging: null,
  lastInteraction: performance.now(),
};

const nodeElements = new Map();
const edgeElements = new Map();
const projected = new Map();
let edgeGeometry = new Map();
let signalObjects = [];
let signalKey = "";
let viewport = { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 };

function makeSvg(tag, attrs = {}) {
  const element = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function savedTheme() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function colorForCluster(cluster) {
  if (cluster === "core" && root.dataset.theme === "light") return "#245bff";
  return COLORS[cluster];
}

function applyTheme(theme, persist = false) {
  const nextTheme = theme === "light" ? "light" : "dark";
  const nextAction = nextTheme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;
  themeColor?.setAttribute("content", nextTheme === "light" ? "#edf3fc" : "#02040b");

  if (brandLogo) {
    brandLogo.src = nextTheme === "light" ? brandLogo.dataset.lightSrc : brandLogo.dataset.darkSrc;
  }

  if (themeToggle) {
    themeToggle.dataset.theme = nextTheme;
    themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));
    themeToggle.setAttribute("aria-label", `Switch to ${nextAction} mode`);
    themeToggle.title = `Switch to ${nextAction} mode`;
    const label = themeToggle.querySelector(".theme-toggle-label");
    if (label) label.textContent = nextAction === "light" ? "Light" : "Dark";
  }

  nodeElements.forEach((element, id) => {
    element.style.setProperty("--node-color", colorForCluster(byId.get(id).cluster));
  });
  if (state.selected) updateInspector(byId.get(state.selected));

  if (persist) {
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch {}
  }
}

function connectionsFor(nodeId) {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .map((edge) => ({ edge, node: byId.get(edge.from === nodeId ? edge.to : edge.from) }));
}

function createEdges() {
  const paths = makeSvg("g");
  const labels = makeSvg("g");
  edges.forEach((edge) => {
    const path = makeSvg("path", {
      id: `edge-${edge.id}`,
      class: `edge-path ${edge.type}`,
      "data-edge": edge.id,
      "marker-end": `url(#arrow-${edge.type})`,
    });

    const labelGroup = makeSvg("g", {
      class: "edge-label-group",
      "data-edge-label": edge.id,
    });
    const width = Math.max(58, edge.label.length * 6.1 + 16);
    const background = makeSvg("rect", {
      class: "edge-label-bg",
      x: -width / 2,
      y: -9,
      width,
      height: 18,
      rx: 4,
    });
    const text = makeSvg("text", { class: "edge-label-text", x: 0, y: 0 });
    text.textContent = edge.label.toUpperCase();
    labelGroup.append(background, text);
    paths.append(path);
    labels.append(labelGroup);
    edgeElements.set(edge.id, { path, labelGroup });
  });
  edgeLayer.append(paths, labels);
}

function createNodes() {
  nodes.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `space-node${node.id === "airs" ? " is-platform" : ""}`;
    button.dataset.node = node.id;
    button.style.setProperty("--node-color", colorForCluster(node.cluster));
    button.style.setProperty("--node-size", `${node.size}px`);
    button.style.setProperty("--node-render-size", `${node.size}px`);
    button.setAttribute("aria-label", `${node.label}. ${node.summary}`);

    const prism = document.createElement("span");
    prism.className = "node-prism";
    const face = document.createElement("span");
    face.className = "node-face";
    const image = document.createElement("img");
    image.src = node.asset;
    image.alt = "";
    image.draggable = false;
    const sideRight = document.createElement("span");
    sideRight.className = "node-side-right";
    const sideBottom = document.createElement("span");
    sideBottom.className = "node-side-bottom";
    face.append(image);
    prism.append(face, sideRight, sideBottom);

    const label = document.createElement("span");
    label.className = "node-label";
    const title = document.createElement("strong");
    title.textContent = node.label;
    const meta = document.createElement("small");
    meta.textContent = node.status ? `${node.meta} · ${node.status}` : node.meta;
    label.append(title, meta);
    button.append(prism, label);

    button.addEventListener("pointerenter", () => {
      state.hovered = node.id;
      state.lastInteraction = performance.now();
      applyVisualState();
    });
    button.addEventListener("pointerleave", () => {
      state.hovered = null;
      applyVisualState();
    });
    button.addEventListener("focus", () => {
      state.keyboardFocus = node.id;
      applyVisualState();
    });
    button.addEventListener("blur", () => {
      state.keyboardFocus = null;
      applyVisualState();
    });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id);
    });

    nodeElements.set(node.id, button);
    nodeLayer.append(button);
  });
}

function effectiveFocus() {
  return state.hovered || state.keyboardFocus || state.selected;
}

function updateViewText(focusId = null) {
  if (focusId) {
    const node = byId.get(focusId);
    const count = connectionsFor(focusId).length;
    document.querySelector("#viewCode").textContent = node.glyph;
    document.querySelector("#viewTitle").textContent = node.label;
    document.querySelector("#viewDescription").textContent = `${count} direct integration${count === 1 ? "" : "s"} illuminated. Select the node to inspect details.`;
    return;
  }
  const view = views[state.view];
  document.querySelector("#viewCode").textContent = view.code;
  document.querySelector("#viewTitle").textContent = view.title;
  document.querySelector("#viewDescription").textContent = view.description;
}

function rebuildSignals(edgeIds, focused) {
  const key = `${focused ? "focus" : "view"}:${edgeIds.join("|")}`;
  if (key === signalKey) return;
  signalKey = key;
  signalObjects = [];
  signalLayer.replaceChildren();

  edgeIds.forEach((edgeId, index) => {
    const edge = edgeById.get(edgeId);
    if (!edge) return;
    const packet = makeSvg("rect", {
      class: "signal-packet",
      x: -2.8,
      y: -2.8,
      width: 5.6,
      height: 5.6,
      rx: 1,
      fill: FLOW_COLORS[edge.type],
      opacity: focused ? 1 : .9,
      transform: "rotate(45)",
    });
    signalLayer.append(packet);
    signalObjects.push({
      element: packet,
      edgeId,
      phase: (index * .193) % 1,
      speed: .000045 + (index % 4) * .000006,
    });
  });
}

function applyVisualState() {
  const focusId = effectiveFocus();
  const view = views[state.view];
  const viewNodes = new Set(view.nodes);
  const viewEdges = new Set(view.edges);
  const focusConnections = focusId ? connectionsFor(focusId) : [];
  const focusEdges = new Set(focusConnections.map(({ edge }) => edge.id));
  const relatedNodes = new Set(focusConnections.map(({ node }) => node.id));
  const lensFocusId = !focusId ? view.focus : null;
  const lensConnections = lensFocusId
    ? connectionsFor(lensFocusId).filter(({ edge }) => viewEdges.has(edge.id))
    : [];
  const lensEdges = new Set(lensConnections.map(({ edge }) => edge.id));

  nodeElements.forEach((element, id) => {
    const isLensFocus = id === lensFocusId;
    const isLensRelated = Boolean(lensFocusId) && viewNodes.has(id) && id !== lensFocusId;
    element.classList.toggle("is-focused", id === focusId || isLensFocus);
    element.classList.toggle("is-related", (Boolean(focusId) && relatedNodes.has(id)) || isLensRelated);
    element.classList.toggle("is-muted", Boolean(focusId) && id !== focusId && !relatedNodes.has(id));
    element.classList.toggle("is-view-active", !focusId && viewNodes.has(id));
    element.classList.toggle("is-view-muted", !focusId && !viewNodes.has(id));
  });

  edgeElements.forEach(({ path, labelGroup }, id) => {
    const isFocus = focusId ? focusEdges.has(id) : lensEdges.has(id);
    const isLens = !focusId && viewEdges.has(id);
    path.classList.toggle("is-focus", isFocus);
    path.classList.toggle("is-lens", isLens);
    path.classList.toggle("is-muted", Boolean(focusId) && !isFocus);
    labelGroup.classList.toggle("is-focus", isFocus);
    labelGroup.classList.toggle("is-lens", isLens);
  });

  rebuildSignals(focusId ? [...focusEdges] : view.edges, Boolean(focusId));
  updateViewText(focusId);
}

function updateInspector(node) {
  inspector.style.setProperty("--detail-color", colorForCluster(node.cluster));
  const icon = document.querySelector("#detailIcon");
  icon.src = node.asset;
  icon.alt = `${node.label} official feature icon`;
  document.querySelector("#detailCluster").textContent = `${node.cluster.toUpperCase()} · ${node.meta.toUpperCase()}`;
  document.querySelector("#detailEyebrow").textContent = node.eyebrow;
  document.querySelector("#detailTitle").textContent = node.label;
  document.querySelector("#detailSummary").textContent = node.summary;
  document.querySelector("#detailRole").textContent = node.role;

  const facts = node.facts.map((fact) => {
    const item = document.createElement("li");
    item.textContent = fact;
    return item;
  });
  document.querySelector("#detailFacts").replaceChildren(...facts);

  const connections = connectionsFor(node.id);
  document.querySelector("#connectionCount").textContent = String(connections.length).padStart(2, "0");
  const buttons = connections.map(({ edge, node: connected }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "connection-button";
    button.style.setProperty("--connection-color", colorForCluster(connected.cluster));
    const light = document.createElement("i");
    light.setAttribute("aria-hidden", "true");
    const name = document.createElement("strong");
    name.textContent = connected.label;
    const type = document.createElement("span");
    type.textContent = edge.label;
    button.append(light, name, type);
    button.addEventListener("click", () => selectNode(connected.id));
    return button;
  });
  document.querySelector("#connectionList").replaceChildren(...buttons);

  const source = document.querySelector("#sourceLink");
  source.href = node.source;
  source.setAttribute("aria-label", `Open official documentation for ${node.label}`);
}

function selectNode(nodeId) {
  state.selected = nodeId;
  state.lastInteraction = performance.now();
  updateInspector(byId.get(nodeId));
  inspector.classList.add("is-open");
  inspector.setAttribute("aria-hidden", "false");
  applyVisualState();
}

function clearSelection() {
  state.selected = null;
  inspector.classList.remove("is-open");
  inspector.setAttribute("aria-hidden", "true");
  applyVisualState();
}

function setView(viewId) {
  state.view = viewId;
  state.hovered = null;
  state.keyboardFocus = null;
  clearSelection();
  document.querySelectorAll(".view-tab").forEach((button) => {
    const active = button.dataset.view === viewId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function resize() {
  viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.min(2, window.devicePixelRatio || 1),
  };
  canvas.width = Math.round(viewport.width * viewport.dpr);
  canvas.height = Math.round(viewport.height * viewport.dpr);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
  linkLayer.setAttribute("viewBox", `0 0 ${viewport.width} ${viewport.height}`);
  linkLayer.setAttribute("width", viewport.width);
  linkLayer.setAttribute("height", viewport.height);

  const iconScale = viewport.width <= 360
    ? .62
    : viewport.width <= 520
      ? .68
      : viewport.width <= 820 || viewport.height <= 640
        ? .76
        : viewport.width <= 1180 || viewport.height <= 760
          ? .84
          : viewport.width <= 1440 || viewport.height <= 850
            ? .9
            : 1;

  nodes.forEach((node) => {
    const element = nodeElements.get(node.id);
    element?.style.setProperty("--node-render-size", `${Math.round(node.size * iconScale)}px`);
  });
}

let seed = 734921;
function seededRandom() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

const stars = Array.from({ length: 360 }, (_, index) => ({
  x: seededRandom(),
  y: seededRandom(),
  depth: .2 + seededRandom() * .8,
  size: .35 + seededRandom() * 1.45,
  alpha: .18 + seededRandom() * .72,
  phase: seededRandom() * Math.PI * 2,
  tint: index % 29 === 0 ? "cyan" : index % 43 === 0 ? "violet" : "white",
}));

function drawStars(time) {
  const { width, height, dpr } = viewport;
  const isLight = root.dataset.theme === "light";
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = isLight ? "#edf3fc" : "#02040b";
  context.fillRect(0, 0, width, height);
  if (isLight) return;

  stars.forEach((star) => {
    const drift = prefersReducedMotion ? 0 : time * .000003 * star.depth;
    let x = ((star.x + drift) % 1) * width + state.pointerX * star.depth * 15;
    let y = star.y * height + state.pointerY * star.depth * 10;
    if (x < 0) x += width;
    if (x > width) x -= width;
    if (y < 0) y += height;
    if (y > height) y -= height;
    const twinkle = prefersReducedMotion ? 1 : .72 + Math.sin(time * .0011 + star.phase) * .28;
    const alpha = star.alpha * twinkle;
    context.beginPath();
    context.arc(x, y, star.size * star.depth, 0, Math.PI * 2);
    context.fillStyle = star.tint === "cyan"
      ? `rgba(93,224,255,${alpha})`
      : star.tint === "violet"
        ? `rgba(178,145,255,${alpha})`
        : `rgba(231,239,255,${alpha})`;
    context.fill();
  });
}

function rotatePoint(position, time) {
  const idle = time - state.lastInteraction > 3600 && !prefersReducedMotion;
  const auto = idle ? Math.sin(time * .00014) * .045 : 0;
  const rotY = state.rotY + auto;
  const rotX = state.rotX;
  const [x, y, z] = position;
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  return { x: x1, y: y1, z: z2 };
}

function projectNode(node, time) {
  const rotated = rotatePoint(node.pos, time);
  const fit = clamp(Math.min(viewport.width / 1220, viewport.height / 790) * 1.04, .34, 1.16) * state.zoom;
  const centerShift = state.selected && viewport.width > 920 ? -115 : 0;
  const centerX = viewport.width * .5 + centerShift;
  const centerY = viewport.height * .505 + (viewport.width < 760 ? 22 : 0);
  const depthScale = clamp(920 / (920 - rotated.z * fit), .72, 1.32);
  return {
    x: centerX + rotated.x * fit,
    y: centerY + rotated.y * fit,
    z: rotated.z,
    scale: depthScale,
  };
}

function quadraticPoint(geometry, t) {
  const one = 1 - t;
  return {
    x: one * one * geometry.a.x + 2 * one * t * geometry.c.x + t * t * geometry.b.x,
    y: one * one * geometry.a.y + 2 * one * t * geometry.c.y + t * t * geometry.b.y,
  };
}

function updateScene(time) {
  projected.clear();
  nodes.forEach((node) => {
    const point = projectNode(node, time);
    projected.set(node.id, point);
    const element = nodeElements.get(node.id);
    element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${point.scale})`;
    element.style.zIndex = String(Math.round(1000 + point.z));
  });

  edgeGeometry = new Map();
  edges.forEach((edge, index) => {
    const a = projected.get(edge.from);
    const b = projected.get(edge.to);
    const bend = ((a.z - b.z) * .055) + ((index % 3) - 1) * 8;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / length;
    const ny = dx / length;
    const c = {
      x: (a.x + b.x) / 2 + nx * bend,
      y: (a.y + b.y) / 2 + ny * bend,
    };
    const geometry = { a, b, c };
    edgeGeometry.set(edge.id, geometry);
    const elements = edgeElements.get(edge.id);
    elements.path.setAttribute("d", `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
    const midpoint = quadraticPoint(geometry, .5);
    elements.labelGroup.setAttribute("transform", `translate(${midpoint.x.toFixed(1)} ${midpoint.y.toFixed(1)})`);
  });

  signalObjects.forEach((signal) => {
    const geometry = edgeGeometry.get(signal.edgeId);
    if (!geometry) return;
    const t = (time * signal.speed + signal.phase) % 1;
    const point = quadraticPoint(geometry, t);
    signal.element.setAttribute("x", (point.x - 2.8).toFixed(1));
    signal.element.setAttribute("y", (point.y - 2.8).toFixed(1));
    signal.element.setAttribute("transform", `rotate(45 ${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
  });
}

function updateCameraReadout() {
  const degrees = Math.round(state.rotY * 180 / Math.PI);
  document.querySelector("#cameraReadout").textContent = `ORBIT ${degrees}° · ZOOM ${state.zoom.toFixed(1)}`;
}

function frame(time) {
  drawStars(time);
  updateScene(time);
  requestAnimationFrame(frame);
}

function resetCamera() {
  state.rotX = -0.075;
  state.rotY = 0.18;
  state.zoom = 1;
  state.lastInteraction = performance.now();
  updateCameraReadout();
}

stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, .inspector")) return;
  state.dragging = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    rotX: state.rotX,
    rotY: state.rotY,
    moved: false,
  };
  stage.setPointerCapture(event.pointerId);
  stage.classList.add("is-dragging");
  state.lastInteraction = performance.now();
});

stage.addEventListener("pointermove", (event) => {
  state.pointerX = (event.clientX / viewport.width - .5) * 2;
  state.pointerY = (event.clientY / viewport.height - .5) * 2;
  if (!state.dragging || state.dragging.pointerId !== event.pointerId) return;
  const dx = event.clientX - state.dragging.startX;
  const dy = event.clientY - state.dragging.startY;
  if (Math.hypot(dx, dy) > 4) state.dragging.moved = true;
  state.rotY = state.dragging.rotY + dx * .0045;
  state.rotX = clamp(state.dragging.rotX - dy * .0038, -.7, .7);
  state.lastInteraction = performance.now();
  updateCameraReadout();
});

function finishDrag(event) {
  if (!state.dragging || state.dragging.pointerId !== event.pointerId) return;
  const moved = state.dragging.moved;
  state.dragging = null;
  stage.classList.remove("is-dragging");
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  if (!moved) clearSelection();
}

stage.addEventListener("pointerup", finishDrag);
stage.addEventListener("pointercancel", finishDrag);

stage.addEventListener("wheel", (event) => {
  if (event.target.closest(".inspector")) return;
  event.preventDefault();
  state.zoom = clamp(state.zoom * Math.exp(-event.deltaY * .001), .66, 1.62);
  state.lastInteraction = performance.now();
  updateCameraReadout();
}, { passive: false });

document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

themeToggle?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "light" ? "dark" : "light", true);
});

systemTheme.addEventListener("change", (event) => {
  if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
});

document.querySelector("#resetCamera").addEventListener("click", resetCamera);
document.querySelector("#closeInspector").addEventListener("click", clearSelection);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") clearSelection();
});

window.addEventListener("resize", resize);

applyTheme(root.dataset.theme || (systemTheme.matches ? "dark" : "light"));
createEdges();
createNodes();
resize();
updateCameraReadout();
applyVisualState();
requestAnimationFrame(frame);
