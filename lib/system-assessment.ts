import {
  AISystem,
  RiskAssessment,
  RiskAssessmentInput,
} from "@/lib/types";
import { calculateRiskAssessment, generateControls } from "@/lib/governance";

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
  impactOnIndividuals: 50,
  dataSensitivity: 50,
  autonomy: 50,
  scaleOfDeployment: 50,
  regulatoryExposure: 50,
};

export function getRiskInputs(
  form: SystemAssessmentForm
): RiskAssessmentInput {
  return {
    impactOnIndividuals: form.impactOnIndividuals,
    dataSensitivity: form.dataSensitivity,
    autonomy: form.autonomy,
    scaleOfDeployment: form.scaleOfDeployment,
    regulatoryExposure: form.regulatoryExposure,
  };
}

export function assessSystem(
  form: SystemAssessmentForm
): RiskAssessment {
  return calculateRiskAssessment(getRiskInputs(form));
}

export function getControlsForSystem(form: SystemAssessmentForm) {
  const assessment = assessSystem(form);

  return generateControls(assessment);
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
  if (score >= 70) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

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
