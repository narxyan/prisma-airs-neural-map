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
  agent: "#f2cc60",
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
    pos: [0, 0, 105], compactPos: [0, 0, 105], mobilePos: [0, -330, 105], size: 78, asset: `${A}prisma-airs.svg`, important: true,
    eyebrow: "Unified AI security platform",
    summary: "A unified platform for discovering, assessing, and protecting AI applications, models, agents, data, and infrastructure.",
    role: "Coordinate the five official AIRS capability pillars: Gateway, Runtime Security, Agent Identity, Supply Chain Security, and Red Teaming.",
    facts: ["Five official AIRS capability pillars", "Shared protection and governance context", "Supporting integrations appear in their relevant workflow views"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture",
  },
  {
    id: "gateway", label: "AI Gateway", meta: "govern traffic", cluster: "gateway", glyph: "GW",
    pos: [-310, -155, 35], compactPos: [-300, -170, 35], mobilePos: [-380, -620, 35], size: 58, asset: `${A}gateway-governance.svg`, important: true,
    eyebrow: "AI control plane",
    summary: "A unified control and data plane for routing, governing, and observing AI requests.",
    role: "Place consistent access, routing, cost, and security controls in the path of AI traffic.",
    facts: ["Workspace and key-scoped policy", "Guardrails for requests and responses", "LLM, MCP, and agent gateway capabilities"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-overview",
  },
  {
    id: "runtime", label: "AI Runtime Security", meta: "enforce", cluster: "runtime", glyph: "RT",
    pos: [310, -135, 55], compactPos: [310, -150, 55], mobilePos: [380, -620, 55], size: 60, asset: `${A}runtime-prevention.svg`, important: true,
    eyebrow: "Real-time enforcement",
    summary: "Detects and blocks AI-specific threats as traffic moves through applications and agents.",
    role: "Apply the same security intelligence through code-level API interception, network interception, or both.",
    facts: ["Prompt, response, agent, and data protection", "API and network interception", "Actionable allow or block verdicts"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-vm-firewall/ai-runtime-security-overview",
  },
  {
    id: "endpointSecurity", label: "Endpoint Security", meta: "secure agent endpoints", cluster: "endpoint", glyph: "AES",
    pos: [385, 20, -30], compactPos: [410, 20, -30], mobilePos: [380, -330, -30], size: 54, asset: `${A}runtime-platform.svg`, important: true,
    hideOutsideViews: true,
    eyebrow: "Agentic endpoint protection",
    summary: "Cortex Agentic Endpoint Security protects the developer endpoint where autonomous coding agents, extensions, and local AI artifacts operate.",
    role: "Pair endpoint discovery and local enforcement with Prisma AIRS Runtime Security inspection for AI coding-agent activity.",
    facts: ["Discovers agents, extensions, and AI artifacts", "Assesses endpoint risk and applies local policy", "Integrates with AIRS Runtime Security for AI traffic protection"],
    source: "https://www.paloaltonetworks.com/blog/ai-security/securing-the-ai-coding-frontier-prisma-airs-agentic-endpoint-security/",
  },
  {
    id: "redTeam", label: "AI Red Teaming", meta: "stress test", cluster: "lifecycle", glyph: "RTM",
    pos: [-390, 185, 60], compactPos: [-430, 145, 60], mobilePos: [-380, -40, 60], size: 56, asset: `${A}redteam-authentication.svg`, important: true,
    eyebrow: "Adversarial validation",
    summary: "Automated scans test applications, models, and agents against real-world attack techniques.",
    role: "Turn discovered AI endpoints into targets, run attacks, and feed findings back into protection decisions.",
    facts: ["Application, model, and agentic targets", "Custom and multi-turn scenarios", "Findings and remediation guidance"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming",
  },
  {
    id: "supplyChain", label: "AI Supply Chain Security", meta: "validate artifacts", cluster: "model", glyph: "SC",
    clusterLabel: "SUPPLY CHAIN · VALIDATE ARTIFACTS",
    pos: [-60, 175, -90], compactPos: [-100, 155, -90], mobilePos: [0, -40, -90], size: 56, asset: `${A}model-manufacturing.svg`, important: true,
    eyebrow: "Pre-production artifact assurance",
    summary: "A unified supply-chain capability that evaluates AI models and agent skills before they reach production.",
    role: "Scan and gate model files and skill packages, then use their verdicts as evidence in the release process.",
    facts: ["Model Security for model artifacts", "AI Skill Security for skill packages (Preview)", "Centralized verdicts and audit evidence"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security",
  },
  {
    id: "modelSecurity", label: "Model Security", meta: "scan model artifacts", cluster: "model", glyph: "MS",
    childOf: "supplyChain", hideOutsideViews: true,
    pos: [-190, 230, -125], compactPos: [-420, 310, -120], mobilePos: [-380, 280, -120], size: 50, asset: `${A}model-inspection.svg`,
    eyebrow: "Supply-chain child capability",
    summary: "Scans AI model artifacts from supported sources so malicious content, unsafe files, vulnerabilities, and policy violations can be found before deployment.",
    role: "Inspect a model artifact against the Security Group attached to its Model Source, then return findings and a release decision before promotion.",
    facts: ["Model Sources define artifact origin and metadata", "Security Groups establish model scan controls", "Scan findings support pre-deployment release gates"],
    prerequisites: ["Prisma AIRS Model Security license", "Strata Cloud Manager access and a supported Model Source or local scan workflow", "A Security Group associated with the selected Model Source"],
    docs: [
      { label: "AI Model Security", type: "Capability overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models" },
      { label: "Default Security Groups and Rules", type: "Control configuration", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models/get-started-with-ai-model-security/default-security-groups-and-rules" },
    ],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models",
  },
  {
    id: "skillSecurity", label: "AI Skill Security", meta: "scan skills · preview", cluster: "model", glyph: "SS",
    childOf: "supplyChain", hideOutsideViews: true,
    pos: [100, 235, -70], compactPos: [-80, 310, -70], mobilePos: [0, 280, -70], size: 50, asset: `${A}model-visibility.svg`,
    eyebrow: "Supply-chain child capability · Preview",
    summary: "Statically analyzes packaged AI skills and produces an Allowed or Blocked verdict before those skills are trusted in an enterprise agent workflow.",
    role: "Upload a ZIP package, inspect SKILL.md and referenced files, evaluate security and governance rules, and use the verdict as an approval gate.",
    facts: ["Analyzes SKILL.md plus referenced files", "Checks prompt integrity, code execution, secrets, and exfiltration risk", "Returns rule outcomes, findings, file locations, and a verdict"],
    prerequisites: ["Prisma AIRS AI Skill Security deployment profile", "A ZIP package containing a valid SKILL.md", "Configured AI Skill Security rules; no license is required during Preview"],
    docs: [
      { label: "AI Skill Security (Preview)", type: "Capability overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security" },
      { label: "Prepare a Skill Package", type: "Packaging requirements", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security/prepare-a-skill-package" },
      { label: "AI Skill Security Rules", type: "Control reference", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security/ai-skill-security-rules" },
    ],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security",
  },
  {
    id: "agentIdentity", label: "AI Agent Identity", meta: "govern agents + MCP", cluster: "agent", glyph: "ID",
    clusterLabel: "AGENT IDENTITY · GOVERN",
    pos: [350, 175, 45], compactPos: [360, 145, 45], mobilePos: [380, -40, 45], size: 52, asset: `${A}gateway-identity.svg`, important: true,
    eyebrow: "Zero-trust agent governance",
    summary: "Secures AI agents and MCP-based workflows through centralized identity, posture, access, and runtime governance.",
    role: "Unify SaaS agent visibility and posture with centralized MCP security so agent access, tools, and behavior can be governed consistently.",
    facts: ["SaaS Agent Security for discovery and posture", "Centralized Prisma AIRS MCP Server security", "Identity-aware governance for agents and tools"],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity",
  },
  {
    id: "saasAgentSecurity", label: "SaaS Agent Security", meta: "discover + govern", cluster: "agent", glyph: "SAS",
    childOf: "agentIdentity", hideOutsideViews: true,
    pos: [250, 225, 5], compactPos: [250, 310, 5], mobilePos: [380, 280, 5], size: 49, asset: `${A}runtime-visibility.svg`,
    eyebrow: "Agent Identity child capability",
    summary: "Discovers AI agents on supported SaaS platforms, assesses their configuration and access posture, and drives governance and remediation workflows.",
    role: "Onboard an agent platform, inventory its agents and connected resources, assess posture and runtime risk, and act on prioritized recommendations.",
    facts: ["Agent, permission, tool, and data-access visibility", "Continuous posture and risk assessment", "Recommendations and supported automated enforcement workflows"],
    prerequisites: ["A SaaS Agent Security entitlement through Prisma AIRS, CASB-X, CASB-PA, or SaaS Security Posture Management", "Strata Cloud Manager access", "Administrator access to a supported AI agent platform"],
    docs: [
      { label: "SaaS Agent Security Overview", type: "Capability overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview" },
      { label: "Onboard SaaS Agents", type: "Implementation guide", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview/onboard-saas-agents" },
    ],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview",
  },
  {
    id: "mcpSecurity", label: "MCP Security", meta: "secure MCP tools", cluster: "agent", glyph: "MCP",
    childOf: "agentIdentity", hideOutsideViews: true,
    pos: [500, 205, 20], compactPos: [430, 385, 20], mobilePos: [380, 550, 20], size: 49, asset: `${A}gateway-controls.svg`,
    eyebrow: "Agent Identity child capability",
    summary: "Uses the centralized Prisma AIRS MCP Server to expose security tools to MCP clients with authenticated, profile-aware policy and logging.",
    role: "Authenticate an MCP client to the regional Prisma AIRS endpoint, attach an AI Security Profile, invoke the required protection tools, and review MCP scan logs.",
    facts: ["API key or OAuth 2.0 authentication", "Streamable HTTP and SSE MCP transports", "Security-profile linking and MCP-specific scan logs"],
    prerequisites: ["Prisma AIRS AI Runtime API Intercept deployment profile and application", "API key or OAuth 2.0 token", "An AI Security Profile and an MCP client that supports Streamable HTTP or SSE"],
    docs: [
      { label: "Prisma AIRS MCP Server", type: "Capability overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/prisma-airs-mcp-server-for-centralized-ai-agent-security" },
      { label: "Configure MCP Server Security", type: "Implementation guide", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/understanding-the-prisma-airs-mcp-server/configure-mcp-server-security-using-prisma-airs" },
    ],
    source: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/prisma-airs-mcp-server-for-centralized-ai-agent-security",
  },
];

const edges = [
  { id: "airs-gateway", from: "airs", to: "gateway", type: "capability", label: "gateway pillar", width: 8, bend: -7 },
  { id: "airs-runtime", from: "airs", to: "runtime", type: "capability", label: "runtime pillar", width: 9, bend: 8 },
  { id: "airs-endpoint", from: "airs", to: "endpointSecurity", type: "capability", label: "AIRS + AES", width: 8, bend: -5 },
  { id: "airs-redteam", from: "airs", to: "redTeam", type: "capability", label: "assessment pillar", width: 8, bend: 7 },
  { id: "airs-supply", from: "airs", to: "supplyChain", type: "capability", label: "supply chain pillar", width: 9, bend: -7 },
  { id: "airs-agent-identity", from: "airs", to: "agentIdentity", type: "capability", label: "identity pillar", width: 9, bend: 7 },
  { id: "supply-model", from: "supplyChain", to: "modelSecurity", type: "capability", label: "model security branch", width: 5, bend: -12, labelT: .54, labelOnFocusOnly: true },
  { id: "supply-skill", from: "supplyChain", to: "skillSecurity", type: "capability", label: "skill security branch", width: 5, bend: 12, labelT: .54, labelOnFocusOnly: true },
  { id: "identity-saas", from: "agentIdentity", to: "saasAgentSecurity", type: "capability", label: "SaaS agent branch", width: 5, bend: -12, labelT: .54, labelOnFocusOnly: true },
  { id: "identity-mcp", from: "agentIdentity", to: "mcpSecurity", type: "capability", label: "MCP security branch", width: 5, bend: 12, labelT: .54, labelOnFocusOnly: true },
  { id: "gateway-runtime", from: "gateway", via: "airs", to: "runtime", type: "data", label: "policy-enforced traffic", width: 14, lane: -1.2, labelT: .24 },
  { id: "endpoint-runtime", from: "endpointSecurity", via: "airs", to: "runtime", type: "data", label: "agent traffic", width: 12, lane: 1.2, labelT: .22 },
  { id: "redteam-runtime", from: "redTeam", via: "airs", to: "runtime", type: "lifecycle", label: "findings harden policy", width: 11, lane: -1.1, labelT: .24 },
  { id: "supply-runtime", from: "supplyChain", via: "airs", to: "runtime", type: "policy", label: "approved artifacts", width: 10, lane: 1.1, labelT: .23 },
  { id: "agentidentity-runtime", from: "agentIdentity", via: "airs", to: "runtime", type: "telemetry", label: "identity + runtime", width: 11, lane: 2, labelT: .24 },
];

const integrationGuides = {
  "airs-gateway": {
    evidence: "PUBLIC · NATIVE",
    mode: "Native Prisma AIRS capability",
    summary: "AI Gateway is a native Prisma AIRS capability, so there is no separate AIRS-to-Gateway connector to install. Activation, workspaces, provider integrations, and scoped keys are configured in Strata Cloud Manager.",
    prerequisites: [
      "A Prisma AIRS tenant with AI Gateway activated",
      "Strata Cloud Manager access",
      "At least one LLM provider integration and workspace",
    ],
    steps: [
      "Activate AI Gateway and create a workspace for the target team or application.",
      "Add an LLM integration and provision the models that workspace may use.",
      "Create a Gateway API key and use the workspace virtual key to scope requests and policy.",
    ],
    note: "Native platform relationship — no connector code is required between Prisma AIRS and AI Gateway.",
    sources: [
      { label: "AI Gateway overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-overview" },
      { label: "AI Gateway workspaces", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-overview/ai-gateway-workspaces" },
      { label: "Manage Gateway API keys", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-configs/manage-gateway-api-keys" },
    ],
  },
  "airs-runtime": {
    evidence: "PUBLIC · API / SDK",
    mode: "Code-level API intercept",
    summary: "Prisma AIRS Runtime API can be embedded directly in an application or agent pipeline. It scans prompts, responses, and agent content against a named security profile and returns a verdict for the application to enforce.",
    prerequisites: [
      "AI Runtime API deployment profile",
      "Runtime API application and API key",
      "Configured API security profile name or ID",
    ],
    steps: [
      "Create the deployment profile, Runtime API application, and API key in Strata Cloud Manager.",
      "Create an API security profile with the required allow or block actions.",
      "Install the official Python SDK and scan content before the protected model or tool call.",
    ],
    code: {
      language: "Python",
      label: "Official AIRS Runtime SDK pattern",
      value: `import os
import aisecurity
from aisecurity.scan.inline.scanner import Scanner
from aisecurity.generated_openapi_client.models.ai_profile import AiProfile

aisecurity.init(api_key=os.environ["PANW_AI_SEC_API_KEY"])

verdict = Scanner().sync_scan(
    ai_profile=AiProfile(profile_name="Secure-AI"),
    content={"prompt": user_prompt},
    metadata={"app_user": user_id},
)
print(verdict)`,
    },
    note: "This shows API Intercept. Network Intercept is a separate traffic-routing deployment and does not require application code changes.",
    sources: [
      { label: "AIRS API overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api" },
      { label: "Python SDK setup", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/airs-apis-python-sdk" },
      { label: "Developer API reference", url: "https://pan.dev/airs/" },
    ],
  },
  "airs-endpoint": {
    evidence: "PUBLIC · CONFIG",
    mode: "Managed Cortex AES integration",
    summary: "Cortex Agentic Endpoint Security (AES) connects to Prisma AIRS with a service account, retrieves the available Runtime API keys and security profiles, and centrally deploys AIRS hooks to developer endpoints.",
    prerequisites: [
      "Prisma AIRS Runtime API application",
      "Cortex AES subscription",
      "Service account with read access to API keys and profiles",
    ],
    steps: [
      "Create a service account in Strata Cloud Manager and securely capture its client ID and client secret.",
      "Create a Runtime API application, one API key per policy, and the matching security profiles.",
      "Connect Prisma AIRS in the AES console, create the runtime policy, and deploy the managed hooks to endpoint groups.",
    ],
    note: "Configuration workflow — AES manages the endpoint hooks and API keys centrally, so Palo Alto Networks does not require per-device application code.",
    sources: [
      { label: "Prisma AIRS + Cortex AES setup", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/prisma-airs-integration-with-cortex-aes" },
    ],
  },
  "airs-redteam": {
    evidence: "PUBLIC · TARGET API",
    mode: "Red Team target connection",
    summary: "AI Red Teaming connects to a model, application, or agent as a target. Public guides support preconfigured providers plus REST, streaming, WebSocket, private Network Channels, and custom adapters.",
    prerequisites: [
      "AI Red Teaming license and deployment profile",
      "Target endpoint URL and its authentication details",
      "A supported connection method for the target",
    ],
    steps: [
      "Create and associate an AI Red Teaming deployment profile with the tenant.",
      "Add the AI system as a model, application, or agent target and choose its connection method.",
      "For a custom API, import a representative cURL request and replace the prompt value with {INPUT}.",
    ],
    code: {
      language: "Shell",
      label: "REST target request template",
      value: `curl -X POST "$TARGET_URL" \\
  -H "Authorization: Bearer $TARGET_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"{INPUT}"}'`,
    },
    note: "{INPUT} is the documented placeholder that AI Red Teaming replaces with attack prompts at scan time; adapt the JSON field to your target API.",
    sources: [
      { label: "Red Teaming target connection methods", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming/get-started-with-prisma-airs-ai-red-teaming/targets/connection-methods" },
      { label: "REST, streaming, and WebSocket targets", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming/get-started-with-prisma-airs-ai-red-teaming/targets/connection-methods/add-a-target-rest-api-or-streaming-cm" },
    ],
  },
  "airs-supply": {
    evidence: "PUBLIC · CLI / UPLOAD",
    mode: "Native supply-chain capability",
    summary: "AI Supply Chain Security brings Model Security and AI Skill Security together under Prisma AIRS. Model artifacts can be scanned through supported sources and clients; skill packages can be uploaded for static analysis and an Allowed or Blocked verdict.",
    prerequisites: [
      "Prisma AIRS AI Supply Chain Security access",
      "A service account and Security Group for Model Security scans",
      "A packaged skill containing SKILL.md for AI Skill Security (Preview)",
    ],
    steps: [
      "Choose the Model Security or Skill Security branch for the artifact being evaluated.",
      "Configure the applicable security policy, rules, or Security Group.",
      "Scan the artifact and use its verdict as a release or deployment gate.",
    ],
    note: "The two child capabilities use different ingestion workflows, but both produce pre-production artifact evidence within AI Supply Chain Security.",
    sources: [
      { label: "AI Supply Chain Security overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security" },
      { label: "AI Model Security", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models" },
      { label: "AI Skill Security (Preview)", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security" },
    ],
  },
  "airs-agent-identity": {
    evidence: "PUBLIC · NATIVE",
    mode: "Native AIRS identity pillar",
    summary: "AI Agent Identity is an official Prisma AIRS pillar. It brings SaaS Agent Security and the Prisma AIRS MCP Server into a shared governance surface for agent discovery, posture, access, tools, and runtime protection.",
    prerequisites: [
      "A Prisma AIRS tenant and Strata Cloud Manager access",
      "The applicable SaaS Agent Security or AI Runtime API entitlement",
      "Administrator access to the agent platform or MCP client environment",
    ],
    steps: [
      "Choose the SaaS Agent Security or MCP Security branch for the target workflow.",
      "Onboard the supported agent platform or configure the Prisma AIRS MCP Server and client authentication.",
      "Apply identity, posture, security-profile, and runtime controls; then monitor agent and MCP activity.",
    ],
    note: "Native pillar — SaaS Agent Security uses platform onboarding, while MCP Security uses the documented Prisma AIRS MCP endpoint and client configuration.",
    sources: [
      { label: "AI Agent Identity", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity" },
      { label: "SaaS Agent Security overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview" },
      { label: "Prisma AIRS MCP Server", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/prisma-airs-mcp-server-for-centralized-ai-agent-security" },
    ],
  },
  "supply-model": {
    evidence: "PUBLIC · NATIVE SCAN",
    mode: "Model artifact scanning",
    summary: "Model Security is a dedicated child capability of AI Supply Chain Security. It evaluates model artifacts against the Security Group permanently associated with their Model Source and surfaces findings before release.",
    prerequisites: [
      "Prisma AIRS Model Security license",
      "A supported Model Source or local model-scanning workflow",
      "A Security Group configured for that Model Source",
    ],
    steps: [
      "Select or configure the Model Source that owns the artifact and its metadata.",
      "Use the source's default Security Group or create a custom group with the required rules.",
      "Submit or discover the model artifact, review the scan findings, and use the result as a promotion gate.",
    ],
    note: "Hierarchy edge — Model Security is operated as its own control surface, while AI Supply Chain Security is the parent capability that organizes pre-production artifact assurance.",
    sources: [
      { label: "AI Model Security", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models" },
      { label: "Default Security Groups and Rules", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/model-security-to-secure-your-ai-models/get-started-with-ai-model-security/default-security-groups-and-rules" },
    ],
  },
  "supply-skill": {
    evidence: "PUBLIC · ZIP UPLOAD",
    mode: "Static skill-package scan",
    summary: "AI Skill Security is a dedicated Preview child capability. It analyzes SKILL.md and the files referenced by a packaged skill, evaluates built-in security and governance rules, and returns an Allowed or Blocked verdict.",
    prerequisites: [
      "Prisma AIRS AI Skill Security deployment profile",
      "A ZIP archive containing a valid SKILL.md and any supporting files",
      "The built-in rules configured for the organization's approval policy",
    ],
    steps: [
      "Package one skill with SKILL.md at the archive root, or package up to 100 sibling skill directories in a batch archive.",
      "Upload the ZIP package and allow Prisma AIRS to analyze its contents and referenced files.",
      "Review rule outcomes, file-level findings, and the final Allowed or Blocked verdict before trusting the skill.",
    ],
    code: {
      language: "Shell",
      label: "Documented skill ZIP pattern",
      value: `zip -r my-skill.zip . \\
  -x ".git/*" "__pycache__/*" "*.pyc" \\
     ".venv/*" "venv/*" "node_modules/*"`,
    },
    note: "Preview capability — Palo Alto Networks currently documents no license requirement for Preview, but a Prisma AIRS AI Skill Security deployment profile is required.",
    sources: [
      { label: "AI Skill Security (Preview)", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security" },
      { label: "Prepare a Skill Package", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security/prepare-a-skill-package" },
      { label: "AI Skill Security Rules", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security/ai-skill-security/ai-skill-security-rules" },
    ],
  },
  "identity-saas": {
    evidence: "PUBLIC · ONBOARDING",
    mode: "SaaS agent discovery and posture",
    summary: "SaaS Agent Security is a dedicated AI Agent Identity child capability. It onboards supported agent platforms, discovers agents and their access, evaluates posture, and provides recommendations and enforcement workflows.",
    prerequisites: [
      "A SaaS Agent Security entitlement through Prisma AIRS or an included SaaS security license",
      "Strata Cloud Manager access",
      "Administrator credentials for a supported AI agent platform",
    ],
    steps: [
      "Activate the entitlement or Prisma AIRS deployment profile for SaaS Agent Security.",
      "Onboard the supported AI agent platform through the Cloud Account workflow.",
      "Review agent inventory, permissions, tools, posture findings, and recommendations; apply supported remediation actions.",
    ],
    note: "Platform onboarding path — credentials and supported data vary by agent platform, so the official platform-specific guide remains the source of truth for each connector.",
    sources: [
      { label: "SaaS Agent Security Overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview" },
      { label: "Onboard SaaS Agents", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview/onboard-saas-agents" },
    ],
  },
  "identity-mcp": {
    evidence: "PUBLIC · MCP CONFIG",
    mode: "Centralized Prisma AIRS MCP Server",
    summary: "MCP Security is a dedicated AI Agent Identity child capability. A compatible client connects to the regional Prisma AIRS MCP endpoint, authenticates with an API key or OAuth token, and invokes profile-aware security tools.",
    prerequisites: [
      "Prisma AIRS AI Runtime API Intercept deployment profile and application",
      "API key or OAuth 2.0 token",
      "AI Security Profile and an MCP client supporting Streamable HTTP or SSE",
    ],
    steps: [
      "Generate an AIRS API key or OAuth 2.0 token and create the AI Security Profile used by the tools.",
      "Configure the MCP client with the regional endpoint, transport, authentication header, and optional x-pan-profile header.",
      "Ensure the agent invokes the required security tools and monitor PANW MCP Server entries in the AIRS scan logs.",
    ],
    code: {
      language: "JSON",
      label: "Official MCP client configuration pattern",
      value: `{
  "servers": {
    "prisma-airs": {
      "type": "http",
      "url": "https://service.api.aisecurity.paloaltonetworks.com/mcp",
      "headers": {
        "x-pan-token": "your-api-key",
        "x-pan-profile": "your-profile-optional"
      }
    }
  }
}`,
    },
    note: "The MCP server exposes security tools, but the agent or application remains responsible for invoking them at the correct points in its workflow.",
    sources: [
      { label: "Prisma AIRS MCP Server", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/prisma-airs-mcp-server-for-centralized-ai-agent-security" },
      { label: "Configure MCP Server Security", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/understanding-the-prisma-airs-mcp-server/configure-mcp-server-security-using-prisma-airs" },
    ],
  },
  "gateway-runtime": {
    evidence: "PUBLIC · NATIVE CONFIG",
    mode: "Partner guardrail",
    summary: "AI Gateway has a documented PANW Prisma AIRS partner guardrail. Gateway forwards governed request payloads to AI Runtime Security API Intercept for deep inspection before traffic reaches the LLM provider.",
    prerequisites: [
      "AI Gateway activated in the Americas region",
      "AI Runtime Security API Intercept deployment profile and API key",
      "An AI Gateway routing configuration",
    ],
    steps: [
      "Create a Runtime API deployment profile and record its endpoint and generated API key.",
      "Configure the PANW Prisma AIRS plugin under AI Gateway Admin Settings.",
      "Create a Partner guardrail, select PANW Prisma AIRS Guardrail, and note its pg- ID.",
      "Reference that pg- ID in the routing configuration and commit the change.",
    ],
    code: {
      language: "JSON",
      label: "AI Gateway routing configuration",
      value: `{
  "before_request_hooks": [
    { "id": "<pg_prisma_airs_guardrail_id>" }
  ]
}`,
    },
    note: "This is a native Prisma AIRS path: AI Gateway invokes the Prisma AIRS Runtime guardrail through the shared platform. The API endpoint and key are stored in the Gateway plugin configuration, not in the routing JSON.",
    sources: [
      { label: "Configure the Prisma AIRS guardrail", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-guardrails/configure-ai-runtime-api-guardrail" },
      { label: "Create a Gateway routing configuration", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-gateway/ai-gateway-configs/create-a-gateway-config" },
    ],
  },
  "endpoint-runtime": {
    evidence: "PUBLIC · MANAGED HOOKS",
    mode: "Endpoint traffic and verdict path",
    summary: "AES deploys and manages AIRS hooks on selected developer endpoints. Prompts, MCP tool calls, and supported network calls are sent to Runtime Security for inspection; AES enforces the returned verdict and records it with endpoint context.",
    prerequisites: [
      "Cortex AES subscription and endpoint scope",
      "Prisma AIRS Runtime API application and security profiles",
      "SCM service-account credentials for the AES connection",
    ],
    steps: [
      "Create the SCM service account with read access to Prisma AIRS API keys and profiles.",
      "Connect that service account in AES and choose the Runtime security profile for the policy.",
      "Deploy the AES runtime policy; AES handles hooks, enforcement, developer notification, and event attribution.",
    ],
    note: "Managed integration — Palo Alto Networks documents central policy configuration rather than a customer-written endpoint snippet.",
    sources: [
      { label: "Prisma AIRS + Cortex AES setup", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/prisma-airs-integration-with-cortex-aes" },
    ],
  },
  "redteam-runtime": {
    evidence: "PUBLIC · WORKFLOW",
    mode: "Assessment-to-policy hardening loop",
    summary: "AI Red Teaming tests the protected application, model, or agent as a target; Runtime Security enforces the production security profile. Public docs support this hardening loop, but do not describe an automatic findings-to-runtime-policy connector.",
    prerequisites: [
      "AI Red Teaming and AI Runtime Security enabled",
      "The same application, model, or agent available as a Red Team target",
      "Access to edit the Runtime API security profile",
    ],
    steps: [
      "Run the Red Team scan against the protected target and review successful attacks and remediation guidance.",
      "Translate relevant findings into detector actions, custom topics, or other Runtime security-profile controls.",
      "Retest the target and confirm the Runtime policy blocks or logs the intended behavior.",
    ],
    note: "Evidence boundary — no public one-click sync or direct API handoff was found. This edge represents a documented operational feedback loop, not an automatic data integration.",
    sources: [
      { label: "Get started with AI Red Teaming", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-red-teaming/identify-ai-system-risks-with-ai-red-teaming/get-started-with-prisma-airs-ai-red-teaming" },
      { label: "Configure a Runtime API security profile", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-runtime-security/airs-api/api-intercept-create-configure-security-profile" },
    ],
  },
  "supply-runtime": {
    evidence: "PUBLIC · MANUAL GATE",
    mode: "Artifact approval before runtime",
    summary: "AI Supply Chain Security evaluates model and skill artifacts before promotion, while Runtime Security protects live AI traffic. Public documentation does not describe an automatic artifact-verdict-to-Runtime-policy synchronization.",
    prerequisites: [
      "A configured Model Security or AI Skill Security policy",
      "The exact artifact version intended for promotion",
      "A release process that can stop on a blocked or failed verdict",
    ],
    steps: [
      "Scan the model or skill package that the release process intends to promote.",
      "Stop promotion when the supply-chain verdict does not meet the release policy.",
      "Deploy only an approved artifact, then apply Runtime Security to its live prompt, response, or agent traffic.",
    ],
    note: "Evidence boundary — this edge represents a deployment-gate workflow. The release pipeline owns promotion; Runtime Security remains a separately configured enforcement layer.",
    sources: [
      { label: "AI Supply Chain Security overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-supply-chain-security/ai-supply-chain-security" },
      { label: "Prisma AIRS platform architecture", url: "https://docs.paloaltonetworks.com/prisma-airs/getting-started/prisma-airs-platform-architecture" },
    ],
  },
  "agentidentity-runtime": {
    evidence: "PUBLIC · PLATFORM WORKFLOW",
    mode: "Identity-aware runtime protection",
    summary: "AI Agent Identity contributes agent, platform, and MCP context while Runtime Security inspects live AI traffic. SaaS Agent Security and the Prisma AIRS MCP Server provide documented paths into that protection model.",
    prerequisites: [
      "AI Agent Identity and AI Runtime Security capabilities activated as required",
      "A supported SaaS agent platform or MCP client configured",
      "An applicable AI security profile and authentication method",
    ],
    steps: [
      "Discover the agent, its permissions, connected tools, and data access.",
      "Attach the applicable security profile through the supported SaaS or MCP workflow.",
      "Review runtime events, posture findings, and agent context together when remediating risk.",
    ],
    note: "Platform workflow — the exact enforcement path depends on whether the agent is onboarded through a supported SaaS platform or protected through the Prisma AIRS MCP Server.",
    sources: [
      { label: "AI Agent Identity", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity" },
      { label: "SaaS Agent Security overview", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/saas-agent-security-overview" },
      { label: "Configure MCP Server Security", url: "https://docs.paloaltonetworks.com/prisma-airs/ai-agent-identity/understanding-the-prisma-airs-mcp-server/configure-mcp-server-security-using-prisma-airs" },
    ],
  },
};

const views = {
  platform: {
    code: "VIEW 01",
    title: "Focused Prisma AIRS platform",
    focus: "airs",
    description: "The complete starting lens: five AIRS pillars, Endpoint Security, and four independently inspectable child capabilities.",
    nodes: ["airs", "gateway", "runtime", "endpointSecurity", "redTeam", "supplyChain", "modelSecurity", "skillSecurity", "agentIdentity", "saasAgentSecurity", "mcpSecurity"],
    edges: ["airs-gateway", "airs-runtime", "airs-endpoint", "airs-redteam", "airs-supply", "airs-agent-identity", "supply-model", "supply-skill", "identity-saas", "identity-mcp"],
  },
  runtime: {
    code: "VIEW 02",
    title: "Live AI traffic protection",
    focus: "runtime",
    description: "Trace governed AI, endpoint, identity, and MCP paths into the Runtime Security enforcement layer.",
    nodes: ["airs", "gateway", "runtime", "endpointSecurity", "agentIdentity", "saasAgentSecurity", "mcpSecurity"],
    edges: ["gateway-runtime", "endpoint-runtime", "agentidentity-runtime", "identity-saas", "identity-mcp"],
  },
  lifecycle: {
    code: "VIEW 03",
    title: "AI lifecycle assurance",
    focus: "redTeam",
    description: "Connect adversarial testing and supply-chain artifact assurance to production protection.",
    nodes: ["airs", "redTeam", "supplyChain", "modelSecurity", "skillSecurity", "runtime"],
    edges: ["redteam-runtime", "supply-runtime", "supply-model", "supply-skill"],
  },
};

const byId = new Map(nodes.map((node) => [node.id, node]));
const documentationState = {
  status: "loading",
  lastCheckedAt: null,
  pendingChanges: 0,
  failedSources: 0,
  sourceCount: 0,
};
const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
const stage = document.querySelector("#spaceStage");
const canvas = document.querySelector("#starfield");
const context = canvas.getContext("2d");
const linkLayer = document.querySelector("#linkLayer");
const edgeDefs = linkLayer.querySelector("defs");
const edgeLayer = document.querySelector("#edgeLayer");
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
let viewport = { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 };

function makeSvg(tag, attrs = {}) {
  const element = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resetStageScroll() {
  if (stage.scrollLeft !== 0) stage.scrollLeft = 0;
  if (stage.scrollTop !== 0) stage.scrollTop = 0;
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
  updateEdgePalettes();
  if (state.selected) {
    const openEdgeId = inspector.querySelector(".integration-accordion[open]")?.dataset.edgeId ?? null;
    updateInspector(byId.get(state.selected), openEdgeId);
  }

  if (persist) {
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch {}
  }
}

function connectionsFor(nodeId) {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .map((edge) => ({ edge, node: byId.get(edge.from === nodeId ? edge.to : edge.from) }));
}

function updateEdgePalettes() {
  edgeElements.forEach(({ stops }, edgeId) => {
    const edge = edgeById.get(edgeId);
    const palette = root.dataset.theme === "dark"
      ? (edge.via
          ? ["#2b2d32", "#676a70", "#676a70", "#34363a"]
          : ["#303238", "#55585e", "#55585e", "#303238"])
      : [
          colorForCluster(byId.get(edge.from).cluster),
          edge.via ? colorForCluster(byId.get(edge.via).cluster) : FLOW_COLORS[edge.type],
          edge.via ? colorForCluster(byId.get(edge.via).cluster) : FLOW_COLORS[edge.type],
          colorForCluster(byId.get(edge.to).cluster),
        ];
    palette.forEach((color, index) => {
      stops[index].setAttribute("stop-color", color);
    });
  });
}

function createEdges() {
  const paths = makeSvg("g");
  const labels = makeSvg("g");
  edges.forEach((edge, index) => {
    const gradient = makeSvg("linearGradient", {
      id: `flow-gradient-${edge.id}`,
      gradientUnits: "userSpaceOnUse",
    });
    const stops = [
      makeSvg("stop", { offset: "0%" }),
      makeSvg("stop", { offset: edge.via ? "43%" : "47%" }),
      makeSvg("stop", { offset: edge.via ? "57%" : "53%" }),
      makeSvg("stop", { offset: "100%" }),
    ];
    gradient.append(...stops);
    edgeDefs.append(gradient);

    const group = makeSvg("g", {
      class: `flow-edge ${edge.type}`,
      "data-edge": edge.id,
    });
    group.style.setProperty("--flow-width", `${edge.width ?? 9}px`);
    group.style.setProperty("--flow-delay", `${-(index * .37).toFixed(2)}s`);

    const bed = makeSvg("path", { class: "flow-ribbon-bed" });
    const shadow = makeSvg("path", {
      class: "flow-ribbon-shadow",
      stroke: `url(#flow-gradient-${edge.id})`,
    });
    const body = makeSvg("path", {
      id: `edge-${edge.id}`,
      class: "flow-ribbon-body",
      stroke: `url(#flow-gradient-${edge.id})`,
    });
    const current = makeSvg("path", {
      class: "flow-ribbon-current",
      stroke: `url(#flow-gradient-${edge.id})`,
    });
    const crest = makeSvg("path", { class: "flow-ribbon-crest" });
    group.append(bed, shadow, body, current, crest);

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
    paths.append(group);
    labels.append(labelGroup);
    edgeElements.set(edge.id, {
      group,
      paths: [bed, shadow, body, current, crest],
      body,
      gradient,
      stops,
      labelGroup,
    });
  });
  edgeLayer.append(paths, labels);
  updateEdgePalettes();
}

function createNodes() {
  nodes.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `space-node${node.id === "airs" ? " is-platform" : ""}${node.childOf ? " is-child" : ""}`;
    button.dataset.node = node.id;
    button.setAttribute("aria-controls", "inspector");
    button.setAttribute("aria-expanded", "false");
    button.style.setProperty("--node-color", colorForCluster(node.cluster));
    button.style.setProperty("--node-size", `${node.size}px`);
    button.style.setProperty("--node-render-size", `${node.size}px`);
    const parentContext = node.childOf ? ` Child capability of ${byId.get(node.childOf).label}.` : "";
    button.setAttribute("aria-label", `${node.label}.${parentContext} ${node.summary}`);

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
      toggleNode(node.id);
    });

    nodeElements.set(node.id, button);
    nodeLayer.append(button);
  });
}

function effectiveFocus() {
  return state.selected || state.hovered || state.keyboardFocus;
}

function updateViewText(focusId = null) {
  if (focusId) {
    const node = byId.get(focusId);
    const count = connectionsFor(focusId).length;
    document.querySelector("#viewCode").textContent = node.glyph;
    document.querySelector("#viewTitle").textContent = node.label;
    document.querySelector("#viewDescription").textContent = state.selected === focusId
      ? `${count} documented path${count === 1 ? "" : "s"} illuminated. Click the node again to close details.`
      : `${count} documented path${count === 1 ? "" : "s"} illuminated. Select the node to inspect details.`;
    return;
  }
  const view = views[state.view];
  document.querySelector("#viewCode").textContent = view.code;
  document.querySelector("#viewTitle").textContent = view.title;
  document.querySelector("#viewDescription").textContent = view.description;
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
    const node = byId.get(id);
    const isLensFocus = id === lensFocusId;
    const isLensRelated = Boolean(lensFocusId) && viewNodes.has(id) && id !== lensFocusId;
    const isRelevantToFocus = Boolean(focusId) && (id === focusId || relatedNodes.has(id));
    const isViewHidden = Boolean(node.hideOutsideViews && !viewNodes.has(id) && !isRelevantToFocus);
    element.classList.toggle("is-focused", id === focusId || isLensFocus);
    element.classList.toggle("is-related", (Boolean(focusId) && relatedNodes.has(id)) || isLensRelated);
    element.classList.toggle("is-muted", Boolean(focusId) && id !== focusId && !relatedNodes.has(id));
    element.classList.toggle("is-view-active", !focusId && viewNodes.has(id));
    element.classList.toggle("is-view-muted", !focusId && !viewNodes.has(id));
    element.classList.toggle("is-view-hidden", isViewHidden);
    element.setAttribute("aria-expanded", String(state.selected === id));
  });

  edgeElements.forEach(({ group, labelGroup }, id) => {
    const edge = edgeById.get(id);
    const hasHiddenEndpoint = [edge.from, edge.to]
      .some((nodeId) => byId.get(nodeId)?.hideOutsideViews && !viewNodes.has(nodeId));
    const isFocus = focusId ? focusEdges.has(id) : lensEdges.has(id);
    const isLens = !focusId && viewEdges.has(id);
    const isViewHidden = hasHiddenEndpoint && !isFocus;
    group.classList.toggle("is-focus", isFocus);
    group.classList.toggle("is-lens", isLens);
    group.classList.toggle("is-muted", Boolean(focusId) && !isFocus);
    group.classList.toggle("is-view-hidden", isViewHidden);
    labelGroup.classList.toggle("is-focus", isFocus);
    labelGroup.classList.toggle("is-lens", isLens && !edge.labelOnFocusOnly);
    labelGroup.classList.toggle("is-view-hidden", isViewHidden);
  });

  updateViewText(focusId);
}

function createGuideSection(title, items, ordered = false) {
  const section = document.createElement("section");
  section.className = "integration-section";
  const heading = document.createElement("h4");
  heading.textContent = title;
  const list = document.createElement(ordered ? "ol" : "ul");
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });
  section.append(heading, list);
  return section;
}

function createIntegrationAccordion(selectedNode, edge, connected, initiallyOpen = false) {
  const guide = integrationGuides[edge.id];
  const details = document.createElement("details");
  details.className = "integration-accordion";
  details.dataset.edgeId = edge.id;
  details.style.setProperty("--connection-color", colorForCluster(connected.cluster));

  const summary = document.createElement("summary");
  const light = document.createElement("i");
  light.className = "connection-light";
  light.setAttribute("aria-hidden", "true");
  const title = document.createElement("span");
  title.className = "connection-title";
  const name = document.createElement("strong");
  name.textContent = connected.label;
  const type = document.createElement("span");
  type.textContent = edge.label;
  title.append(name, type);
  const badge = document.createElement("span");
  badge.className = "integration-badge";
  badge.textContent = guide?.evidence ?? "PUBLIC DOCS";
  const chevron = document.createElement("span");
  chevron.className = "accordion-chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "+";
  summary.append(light, title, badge, chevron);

  const panel = document.createElement("div");
  panel.className = "integration-panel";
  const mode = document.createElement("p");
  mode.className = "integration-mode";
  mode.textContent = guide?.mode ?? "Documented Prisma AIRS relationship";
  const intro = document.createElement("p");
  intro.className = "integration-summary";
  intro.textContent = guide?.summary ?? `Review the official documentation for the ${selectedNode.label} and ${connected.label} relationship.`;
  panel.append(mode, intro);

  if (guide?.prerequisites?.length) panel.append(createGuideSection("Prerequisites", guide.prerequisites));
  if (guide?.steps?.length) panel.append(createGuideSection("Implementation path", guide.steps, true));

  if (guide?.code) {
    const codeBlock = document.createElement("section");
    codeBlock.className = "integration-code-section";
    const codeHeader = document.createElement("div");
    codeHeader.className = "integration-code-header";
    const codeLabel = document.createElement("span");
    codeLabel.textContent = guide.code.label;
    const language = document.createElement("small");
    language.textContent = guide.code.language;
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-code-button";
    copy.textContent = "Copy";
    copy.setAttribute("aria-label", `Copy ${guide.code.label}`);
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(guide.code.value);
        copy.textContent = "Copied";
      } catch {
        copy.textContent = "Copy unavailable";
      }
      window.setTimeout(() => { copy.textContent = "Copy"; }, 1800);
    });
    codeHeader.append(codeLabel, language, copy);
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = guide.code.value;
    pre.append(code);
    codeBlock.append(codeHeader, pre);
    panel.append(codeBlock);
  }

  if (guide?.note) {
    const note = document.createElement("p");
    note.className = "integration-note";
    note.textContent = guide.note;
    panel.append(note);
  }

  if (guide?.sources?.length) {
    const sources = document.createElement("div");
    sources.className = "integration-sources";
    const sourceLabel = document.createElement("span");
    sourceLabel.textContent = "Official sources";
    const links = document.createElement("div");
    guide.sources.forEach((source) => {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = `${source.label} ↗`;
      links.append(link);
    });
    sources.append(sourceLabel, links);
    panel.append(sources);
  }

  const focusButton = document.createElement("button");
  focusButton.type = "button";
  focusButton.className = "focus-node-button";
  focusButton.textContent = `Open ${connected.label} node`;
  focusButton.addEventListener("click", () => {
    selectNode(connected.id);
    inspector.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
  panel.append(focusButton);

  details.append(summary, panel);
  details.open = initiallyOpen;
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    details.parentElement?.querySelectorAll(".integration-accordion[open]").forEach((sibling) => {
      if (sibling !== details) sibling.open = false;
    });
  });
  return details;
}

function setInspectorTab(tabId) {
  document.querySelectorAll(".inspector-tab").forEach((button) => {
    const active = button.dataset.inspectorTab === tabId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".inspector-panel").forEach((panel) => {
    const active = panel.id === `${tabId}Panel`;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

function documentationFor(node) {
  const candidates = [
    ...(node.docs ?? [{ label: `${node.label} documentation`, type: "Primary capability page", url: node.source }]),
  ];

  connectionsFor(node.id).forEach(({ edge }) => {
    integrationGuides[edge.id]?.sources?.forEach((source) => {
      candidates.push({ ...source, type: `Integration path · ${edge.label}` });
    });
  });

  const seen = new Set();
  return candidates.filter((document) => {
    if (seen.has(document.url)) return false;
    seen.add(document.url);
    return true;
  });
}

function formatMonitorTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function updateDocumentationFreshness(node) {
  const element = document.querySelector("#documentationFreshness");
  if (!element) return;

  if (documentationState.status === "loading") {
    element.textContent = "Weekly documentation monitor is initializing.";
    return;
  }

  if (documentationState.status === "unavailable") {
    element.textContent = "Live freshness status is temporarily unavailable; the verified built-in documentation remains available.";
    return;
  }

  const checkedAt = formatMonitorTime(documentationState.lastCheckedAt);
  const nodeUpdatedAt = formatMonitorTime(node.managedUpdatedAt);
  const parts = [
    checkedAt ? `Automatically checked ${checkedAt}` : "Awaiting the first scheduled documentation check",
    `${documentationState.sourceCount} official sources monitored`,
  ];
  if (nodeUpdatedAt) parts.push(`this node updated ${nodeUpdatedAt}`);
  if (documentationState.pendingChanges > 0) parts.push(`${documentationState.pendingChanges} change${documentationState.pendingChanges === 1 ? "" : "s"} awaiting review`);
  if (documentationState.failedSources > 0) parts.push(`${documentationState.failedSources} source${documentationState.failedSources === 1 ? "" : "s"} will be retried`);
  element.textContent = parts.join(" · ");
}

async function loadManagedDocumentation() {
  try {
    const response = await fetch("/api/documentation", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Documentation service returned ${response.status}`);
    const payload = await response.json();

    Object.entries(payload.nodes ?? {}).forEach(([nodeId, managed]) => {
      const node = byId.get(nodeId);
      if (!node || !managed || typeof managed !== "object") return;
      for (const field of ["summary", "role", "facts", "prerequisites", "docs"]) {
        if (managed[field] !== undefined) node[field] = managed[field];
      }
      node.managedUpdatedAt = managed.updatedAt ?? null;
      node.managedChangeSummary = managed.changeSummary ?? null;
    });

    Object.assign(documentationState, {
      status: "ready",
      lastCheckedAt: payload.monitoring?.lastCheckedAt ?? null,
      pendingChanges: Number(payload.monitoring?.pendingChanges ?? 0),
      failedSources: Number(payload.monitoring?.failedSources ?? 0),
      sourceCount: Number(payload.monitoring?.sourceCount ?? 0),
    });
  } catch (error) {
    console.warn("Documentation freshness service is unavailable.", error);
    documentationState.status = "unavailable";
  }

  if (state.selected && inspector.classList.contains("is-open")) {
    updateInspector(byId.get(state.selected));
  }
}

function createDocumentationCard(sourceDoc) {
  const link = document.createElement("a");
  link.className = "documentation-card";
  link.href = sourceDoc.url;
  link.target = "_blank";
  link.rel = "noreferrer";

  const copy = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = sourceDoc.label;
  const type = document.createElement("small");
  type.textContent = sourceDoc.type ?? "Official technical documentation";
  copy.append(title, type);

  const arrow = document.createElement("i");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  link.append(copy, arrow);
  return link;
}

function updateInspector(node, openEdgeId = null) {
  inspector.style.setProperty("--detail-color", colorForCluster(node.cluster));
  const icon = document.querySelector("#detailIcon");
  icon.src = node.asset;
  icon.alt = `${node.label} official feature icon`;
  document.querySelector("#detailCluster").textContent = node.clusterLabel ?? `${node.cluster.toUpperCase()} · ${node.meta.toUpperCase()}`;
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

  const prerequisites = (node.prerequisites ?? []).map((prerequisite) => {
    const item = document.createElement("li");
    item.textContent = prerequisite;
    return item;
  });
  const prerequisitesBlock = document.querySelector("#prerequisitesBlock");
  prerequisitesBlock.hidden = prerequisites.length === 0;
  document.querySelector("#detailPrerequisites").replaceChildren(...prerequisites);

  const connections = connectionsFor(node.id);
  document.querySelector("#connectionCount").textContent = String(connections.length).padStart(2, "0");
  const accordions = connections.map(({ edge, node: connected }) => {
    return createIntegrationAccordion(node, edge, connected, edge.id === openEdgeId);
  });
  document.querySelector("#connectionList").replaceChildren(...accordions);

  const documentation = documentationFor(node).map(createDocumentationCard);
  document.querySelector("#documentationList").replaceChildren(...documentation);
  updateDocumentationFreshness(node);
}

function selectNode(nodeId) {
  resetStageScroll();
  state.selected = nodeId;
  state.lastInteraction = performance.now();
  updateInspector(byId.get(nodeId));
  setInspectorTab("overview");
  inspector.classList.add("is-open");
  inspector.setAttribute("aria-hidden", "false");
  applyVisualState();
}

function toggleNode(nodeId) {
  if (state.selected === nodeId && inspector.classList.contains("is-open")) {
    clearSelection();
    return;
  }
  selectNode(nodeId);
}

function clearSelection() {
  state.selected = null;
  state.hovered = null;
  state.keyboardFocus = null;
  inspector.classList.remove("is-open");
  inspector.setAttribute("aria-hidden", "true");
  resetStageScroll();
  applyVisualState();
}

function setView(viewId) {
  state.view = viewId;
  state.hovered = null;
  state.keyboardFocus = null;
  clearSelection();
  resetStageScroll();
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

  const responsiveIconScale = viewport.width <= 360
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
  const iconScale = responsiveIconScale * .82;

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

function positionForNode(node) {
  return viewport.width <= 460
    ? (node.mobilePos ?? node.compactPos ?? node.pos)
    : viewport.width <= 760
      ? (node.compactPos ?? node.pos)
      : node.pos;
}

function projectNode(node, time) {
  const position = positionForNode(node);
  const rotated = rotatePoint(position, time);
  const baseFit = clamp(Math.min(viewport.width / 1220, viewport.height / 790) * 1.04, .34, 1.16);
  const hasDockedInspector = Boolean(state.selected) && viewport.width > 920;
  const hasSheetInspector = Boolean(state.selected) && viewport.width <= 760;
  const inspectorWidth = hasDockedInspector ? Math.min(430, viewport.width - 32) : 0;
  const graphLeft = hasDockedInspector ? 16 : 0;
  const graphRight = hasDockedInspector ? viewport.width - inspectorWidth - 32 : viewport.width;
  const graphWidth = graphRight - graphLeft;
  const dockedFitCap = clamp((graphWidth - 130) / 800, .34, baseFit);
  const fitX = (hasDockedInspector ? Math.min(baseFit, dockedFitCap) : baseFit) * state.zoom;
  const fitY = baseFit * state.zoom;
  const selectedRotated = hasSheetInspector ? rotatePoint(positionForNode(byId.get(state.selected)), time) : null;
  const centerX = hasDockedInspector
    ? graphLeft + graphWidth * .5
    : viewport.width * .5 - (selectedRotated?.x ?? 0) * fitX;
  const centerY = hasSheetInspector
    ? viewport.height * .21 - selectedRotated.y * fitY
    : viewport.height * .505 + (viewport.width < 760 ? 22 : 0);
  const depthScale = clamp(920 / (920 - rotated.z * Math.min(fitX, fitY)), .72, 1.32);
  const sheetScale = hasSheetInspector ? .9 : 1;
  return {
    x: centerX + rotated.x * fitX,
    y: centerY + rotated.y * fitY,
    z: rotated.z,
    scale: depthScale * sheetScale,
  };
}

function normalFor(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  return { x: -dy / length, y: dx / length };
}

function directRibbonPath(edge, a, b, index, time) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const normal = normalFor(a, b);
  const drift = prefersReducedMotion ? 0 : Math.sin(time * .00055 + index * .9) * 2.2;
  const bend = (edge.bend ?? ((a.z - b.z) * .055 + ((index % 3) - 1) * 8)) + drift;
  const c1 = {
    x: a.x + dx * .34 + normal.x * bend,
    y: a.y + dy * .34 + normal.y * bend,
  };
  const c2 = {
    x: a.x + dx * .66 + normal.x * bend,
    y: a.y + dy * .66 + normal.y * bend,
  };
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function routedRibbonPath(edge, a, via, b, index, time) {
  const normal = normalFor(a, b);
  const fluid = prefersReducedMotion ? 0 : Math.sin(time * .00048 + index * .82) * 1.8;
  const lane = (edge.lane ?? 0) * 7 + fluid;
  const junction = {
    x: via.x + normal.x * lane,
    y: via.y + normal.y * lane,
  };
  const tangent = {
    x: (b.x - a.x) * .14,
    y: (b.y - a.y) * .14,
  };
  const firstControl = {
    x: a.x + (junction.x - a.x) * .42 + normal.x * lane * .24,
    y: a.y + (junction.y - a.y) * .42 + normal.y * lane * .24,
  };
  const intoJunction = {
    x: junction.x - tangent.x,
    y: junction.y - tangent.y,
  };
  const outOfJunction = {
    x: junction.x + tangent.x,
    y: junction.y + tangent.y,
  };
  const lastControl = {
    x: b.x - (b.x - junction.x) * .42 + normal.x * lane * .24,
    y: b.y - (b.y - junction.y) * .42 + normal.y * lane * .24,
  };
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${firstControl.x.toFixed(1)} ${firstControl.y.toFixed(1)} ${intoJunction.x.toFixed(1)} ${intoJunction.y.toFixed(1)} ${junction.x.toFixed(1)} ${junction.y.toFixed(1)} C ${outOfJunction.x.toFixed(1)} ${outOfJunction.y.toFixed(1)} ${lastControl.x.toFixed(1)} ${lastControl.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
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

  edges.forEach((edge, index) => {
    const a = projected.get(edge.from);
    const b = projected.get(edge.to);
    const via = edge.via ? projected.get(edge.via) : null;
    const d = via
      ? routedRibbonPath(edge, a, via, b, index, time)
      : directRibbonPath(edge, a, b, index, time);
    const elements = edgeElements.get(edge.id);
    elements.paths.forEach((path) => path.setAttribute("d", d));
    elements.gradient.setAttribute("x1", a.x.toFixed(1));
    elements.gradient.setAttribute("y1", a.y.toFixed(1));
    elements.gradient.setAttribute("x2", b.x.toFixed(1));
    elements.gradient.setAttribute("y2", b.y.toFixed(1));

    const totalLength = elements.body.getTotalLength();
    const labelPoint = elements.body.getPointAtLength(totalLength * (edge.labelT ?? .5));
    elements.labelGroup.setAttribute("transform", `translate(${labelPoint.x.toFixed(1)} ${labelPoint.y.toFixed(1)})`);
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

stage.addEventListener("scroll", resetStageScroll, { passive: true });

document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll(".inspector-tab").forEach((button) => {
  button.addEventListener("click", () => setInspectorTab(button.dataset.inspectorTab));
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
resetStageScroll();
updateCameraReadout();
applyVisualState();
void loadManagedDocumentation();
requestAnimationFrame(frame);
