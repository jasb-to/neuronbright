export type RiskLevel =
  | "Low"
  | "Medium"
  | "High";

export type SystemStatus =
  | "Healthy"
  | "Review";

export type AISystem = {
  id: string;
  name: string;
  provider: string;
  model: string;
  owner: string;
  department: string;
  risk: RiskLevel;
  status: SystemStatus;
  evidence: number;
  purpose: string;
  dataTypes: string[];
  lastReviewed: string;
};

export type EvidenceItem = {
  id: string;
  name: string;
  source: string;
  system: string;
  status: "Verified" | "Pending";
  date: string;
};

export const aiSystems: AISystem[] = [
  {
    id: "customer-support-copilot",
    name: "Customer Support Copilot",
    provider: "Microsoft",
    model: "Azure OpenAI",
    owner: "Sarah Mitchell",
    department: "Customer Operations",
    risk: "Medium",
    status: "Healthy",
    evidence: 94,
    purpose:
      "Assists customer service teams with response drafting, knowledge retrieval and case summarisation.",
    dataTypes: [
      "Customer communications",
      "Support tickets",
      "Knowledge base",
    ],
    lastReviewed: "14 Aug 2026",
  },
  {
    id: "recruitment-screening-ai",
    name: "Recruitment Screening AI",
    provider: "Internal",
    model: "GPT-5",
    owner: "James Patel",
    department: "People",
    risk: "High",
    status: "Review",
    evidence: 71,
    purpose:
      "Assists recruitment teams with candidate screening and application summarisation.",
    dataTypes: [
      "CVs",
      "Candidate applications",
      "Interview notes",
    ],
    lastReviewed: "13 Aug 2026",
  },
  {
    id: "marketing-content-assistant",
    name: "Marketing Content Assistant",
    provider: "OpenAI",
    model: "GPT-5",
    owner: "Maya Jones",
    department: "Marketing",
    risk: "Low",
    status: "Healthy",
    evidence: 100,
    purpose:
      "Supports marketing teams with content ideation, drafting and campaign variations.",
    dataTypes: [
      "Marketing copy",
      "Campaign information",
    ],
    lastReviewed: "11 Aug 2026",
  },
  {
    id: "developer-assistant",
    name: "Developer Assistant",
    provider: "Anthropic",
    model: "Claude",
    owner: "Daniel Evans",
    department: "Engineering",
    risk: "Medium",
    status: "Healthy",
    evidence: 88,
    purpose:
      "Assists developers with code generation, debugging and technical documentation.",
    dataTypes: [
      "Source code",
      "Technical documentation",
    ],
    lastReviewed: "12 Aug 2026",
  },
  {
    id: "fraud-detection",
    name: "Fraud Detection Model",
    provider: "Internal",
    model: "Custom ML",
    owner: "Robert Lewis",
    department: "Risk",
    risk: "High",
    status: "Review",
    evidence: 63,
    purpose:
      "Identifies potentially fraudulent transactions for review by the risk team.",
    dataTypes: [
      "Transaction data",
      "Customer data",
      "Risk indicators",
    ],
    lastReviewed: "09 Aug 2026",
  },
];

export const evidenceItems: EvidenceItem[] = [
  {
    id: "EV-001",
    name: "AI Acceptable Use Policy",
    source: "Microsoft SharePoint",
    system: "Customer Support Copilot",
    status: "Verified",
    date: "14 Aug 2026",
  },
  {
    id: "EV-002",
    name: "Human Oversight Procedure",
    source: "Policy Repository",
    system: "Recruitment Screening AI",
    status: "Pending",
    date: "13 Aug 2026",
  },
  {
    id: "EV-003",
    name: "Data Classification Record",
    source: "Microsoft Purview",
    system: "Customer Support Copilot",
    status: "Verified",
    date: "12 Aug 2026",
  },
  {
    id: "EV-004",
    name: "AI System Approval",
    source: "ServiceNow",
    system: "Marketing Content Assistant",
    status: "Verified",
    date: "11 Aug 2026",
  },
  {
    id: "EV-005",
    name: "Risk Assessment",
    source: "NEURONBRIGHT",
    system: "Developer Assistant",
    status: "Verified",
    date: "12 Aug 2026",
  },
  {
    id: "EV-006",
    name: "Data Processing Assessment",
    source: "Microsoft Purview",
    system: "Fraud Detection Model",
    status: "Pending",
    date: "09 Aug 2026",
  },
];
