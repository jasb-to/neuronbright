export type RiskLevel = "Low" | "Medium" | "High";

export type SystemStatus = "Healthy" | "Review";

export type EvidenceStatus = "Verified" | "Pending" | "Missing";

export type ControlStatus = "Complete" | "In Progress" | "Missing";

export type GovernanceArea =
  | "Inventory"
  | "Risk"
  | "Controls"
  | "Evidence"
  | "Ownership"
  | "Monitoring";

export type RiskDimensionName =
  | "Impact on individuals"
  | "Data sensitivity"
  | "Autonomy"
  | "Scale of deployment"
  | "Regulatory exposure";

export type RiskDimension = {
  name: RiskDimensionName;
  score: number;
  level: RiskLevel;
  explanation: string;
};

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

export type RiskAssessmentInput = {
  impactOnIndividuals: number;
  dataSensitivity: number;
  autonomy: number;
  scaleOfDeployment: number;
  regulatoryExposure: number;
};

export type RiskAssessment = {
  overallScore: number;
  overallLevel: RiskLevel;
  dimensions: RiskDimension[];
  assessedAt: string;
};

export type Control = {
  id: string;
  name: string;
  description: string;
  area: GovernanceArea;
  required: boolean;
  status: ControlStatus;
  evidenceRequired: string[];
};

export type EvidenceItem = {
  id: string;
  name: string;
  source: string;
  system: string;
  status: EvidenceStatus;
  date: string;
  controlId?: string;
};

export type GovernanceScore = {
  overall: number;
  inventory: number;
  risk: number;
  controls: number;
  evidence: number;
  ownership: number;
  monitoring: number;
};

export type GovernanceGap = {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  area: GovernanceArea;
  systemId?: string;
  action: string;
};

export type GovernanceSummary = {
  score: GovernanceScore;
  gaps: GovernanceGap[];
  highRiskSystems: number;
  systemsRequiringReview: number;
  missingEvidence: number;
  outstandingControls: number;
};
