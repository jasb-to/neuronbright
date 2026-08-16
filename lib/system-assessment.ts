import {
  AISystem,
  RiskAssessment,
  RiskAssessmentInput,
} from "@/lib/types";
import {
  calculateRiskAssessment,
  generateControls,
} from "@/lib/governance";

export type SystemAssessmentForm = {
  name: string;
  provider: string;
  model: string;
  owner: string;
  department: string;

  purpose: string;
  users: string;
  affectedPeople: string;
  decisions: string;

  dataTypes: string[];

  deploymentType:
    | "Internal"
    | "Customer-facing"
    | "Public-facing"
    | "Unknown";

  decisionType:
    | "Assistance only"
    | "Recommendation"
    | "Decision support"
    | "Automated decision"
    | "Unknown";

  humanOversight:
    | "Meaningful review"
    | "Review available"
    | "Limited review"
    | "No meaningful review"
    | "Unknown";

  affectedCategory:
    | "General population"
    | "Employees"
    | "Customers"
    | "Job applicants"
    | "Children"
    | "Patients"
    | "Vulnerable people"
    | "Unknown";

  sector:
    | "General business"
    | "Employment"
    | "Finance"
    | "Healthcare"
    | "Education"
    | "Public sector"
    | "Other";

  scale:
    | "Small"
    | "Medium"
    | "Large"
    | "Enterprise"
    | "Unknown";

  impactOnIndividuals: number;
  dataSensitivity: number;
  autonomy: number;
  scaleOfDeployment: number;
  regulatoryExposure: number;
};

export const defaultSystemAssessment: SystemAssessmentForm = {
  name: "",
  provider: "",
  model: "",
  owner: "",
  department: "",

  purpose: "",
  users: "",
  affectedPeople: "",
  decisions: "",

  dataTypes: [],

  deploymentType: "Unknown",
  decisionType: "Unknown",
  humanOversight: "Unknown",
  affectedCategory: "Unknown",
  sector: "General business",
  scale: "Unknown",

  impactOnIndividuals: 50,
  dataSensitivity: 50,
  autonomy: 50,
  scaleOfDeployment: 50,
  regulatoryExposure: 50,
};

const sensitiveDataTypes = new Set([
  "Health information",
  "Financial information",
  "Behavioural data",
  "Performance data",
  "Employee information",
]);

const personalDataTypes = new Set([
  "Names and contact details",
  "Employee information",
  "Customer information",
  "Financial information",
  "Health information",
  "Behavioural data",
  "Performance data",
  "CVs and employment history",
]);

export function getRiskInputs(
  form: SystemAssessmentForm
): RiskAssessmentInput {
  const dataSensitivityBoost =
    form.dataTypes.filter((item) =>
      sensitiveDataTypes.has(item)
    ).length * 7;

  const personalDataBoost =
    form.dataTypes.filter((item) =>
      personalDataTypes.has(item)
    ).length * 3;

  const sectorBoost =
    form.sector === "Employment" ||
    form.sector === "Healthcare" ||
    form.sector === "Finance" ||
    form.sector === "Public sector"
      ? 12
      : 0;

  const affectedPeopleBoost =
    form.affectedCategory === "Children" ||
    form.affectedCategory === "Patients" ||
    form.affectedCategory === "Vulnerable people"
      ? 15
      : form.affectedCategory === "Job applicants"
        ? 12
        : 0;

  const decisionBoost =
    form.decisionType === "Automated decision"
      ? 25
      : form.decisionType === "Decision support"
        ? 15
        : form.decisionType === "Recommendation"
          ? 10
          : 0;

  const autonomyBoost =
    form.humanOversight === "No meaningful review"
      ? 25
      : form.humanOversight === "Limited review"
        ? 15
        : form.humanOversight === "Review available"
          ? 5
          : 0;

  const deploymentBoost =
    form.deploymentType === "Public-facing"
      ? 12
      : form.deploymentType === "Customer-facing"
        ? 8
        : 0;

  const scaleBoost =
    form.scale === "Enterprise"
      ? 15
      : form.scale === "Large"
        ? 10
        : form.scale === "Medium"
          ? 5
          : 0;

  return {
    impactOnIndividuals: clamp(
      form.impactOnIndividuals +
        affectedPeopleBoost +
        decisionBoost * 0.25
    ),

    dataSensitivity: clamp(
      form.dataSensitivity +
        dataSensitivityBoost +
        personalDataBoost
    ),

    autonomy: clamp(
      form.autonomy +
        decisionBoost * 0.7 +
        autonomyBoost
    ),

    scaleOfDeployment: clamp(
      form.scaleOfDeployment +
        scaleBoost +
        deploymentBoost * 0.5
    ),

    regulatoryExposure: clamp(
      form.regulatoryExposure +
        sectorBoost +
        decisionBoost * 0.5 +
        affectedPeopleBoost * 0.5 +
        deploymentBoost * 0.5
    ),
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function assessSystem(
  form: SystemAssessmentForm
): RiskAssessment {
  return calculateRiskAssessment(getRiskInputs(form));
}

export function getControlsForSystem(
  form: SystemAssessmentForm
) {
  return generateControls(assessSystem(form));
}

export function createPreviewSystem(
  form: SystemAssessmentForm,
  assessment: RiskAssessment
): AISystem {
  return {
    id: `preview-${Date.now()}`,
    name: form.name || "Unnamed AI system",
    provider: form.provider || "Not specified",
    model: form.model || "Not specified",
    owner: form.owner || "Unassigned",
    department: form.department || "Unassigned",
    risk: assessment.overallLevel,
    status: "Review",
    evidence: 0,
    purpose: form.purpose || "Purpose not yet provided",
    dataTypes: form.dataTypes,
    lastReviewed: new Date().toISOString().slice(0, 10),
  };
}

export function getRiskLabel(score: number): string {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function getRiskDescription(score: number): string {
  if (score >= 70) {
    return "This system presents elevated governance exposure and should receive additional review before deployment or continued operation.";
  }

  if (score >= 40) {
    return "This system presents moderate governance exposure and should have appropriate controls and evidence in place.";
  }

  return "This system currently presents lower governance exposure, subject to the accuracy of the information provided.";
}
