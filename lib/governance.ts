import {
  Control,
  RiskAssessment,
  RiskAssessmentInput,
  RiskDimension,
  RiskLevel,
} from "@/lib/types";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
}

function createDimension(
  name: RiskDimension["name"],
  score: number,
  explanation: string
): RiskDimension {
  const safeScore = clampScore(score);

  return {
    name,
    score: safeScore,
    level: getRiskLevel(safeScore),
    explanation,
  };
}

export function calculateRiskAssessment(
  input: RiskAssessmentInput
): RiskAssessment {
  const dimensions: RiskDimension[] = [
    createDimension(
      "Impact on individuals",
      input.impactOnIndividuals,
      getImpactExplanation(input.impactOnIndividuals)
    ),
    createDimension(
      "Data sensitivity",
      input.dataSensitivity,
      getDataSensitivityExplanation(input.dataSensitivity)
    ),
    createDimension(
      "Autonomy",
      input.autonomy,
      getAutonomyExplanation(input.autonomy)
    ),
    createDimension(
      "Scale of deployment",
      input.scaleOfDeployment,
      getScaleExplanation(input.scaleOfDeployment)
    ),
    createDimension(
      "Regulatory exposure",
      input.regulatoryExposure,
      getRegulatoryExplanation(input.regulatoryExposure)
    ),
  ];

  const overallScore = clampScore(
    dimensions.reduce((total, dimension) => total + dimension.score, 0) /
      dimensions.length
  );

  return {
    overallScore,
    overallLevel: getRiskLevel(overallScore),
    dimensions,
    assessedAt: new Date().toISOString(),
  };
}

function getImpactExplanation(score: number): string {
  if (score >= 70) {
    return "The system may materially influence outcomes affecting individuals.";
  }

  if (score >= 40) {
    return "The system may influence decisions or experiences involving individuals.";
  }

  return "The system has limited direct impact on individuals.";
}

function getDataSensitivityExplanation(score: number): string {
  if (score >= 70) {
    return "The system may process sensitive, personal or otherwise consequential information.";
  }

  if (score >= 40) {
    return "The system processes information associated with people or organisational activity.";
  }

  return "The system primarily processes low-sensitivity information.";
}

function getAutonomyExplanation(score: number): string {
  if (score >= 70) {
    return "The system can materially influence or make decisions with limited human intervention.";
  }

  if (score >= 40) {
    return "Human review is present, but system recommendations may influence outcomes.";
  }

  return "The system primarily provides assistance and remains subject to meaningful human review.";
}

function getScaleExplanation(score: number): string {
  if (score >= 70) {
    return "The system operates at significant organisational or user scale.";
  }

  if (score >= 40) {
    return "The system is deployed across multiple teams, workflows or user groups.";
  }

  return "The system has limited deployment scope.";
}

function getRegulatoryExplanation(score: number): string {
  if (score >= 70) {
    return "The intended use creates elevated governance, regulatory or assurance requirements.";
  }

  if (score >= 40) {
    return "The intended use may create additional governance or assurance requirements.";
  }

  return "The intended use currently presents limited regulatory exposure.";
}

export function generateControls(
  assessment: RiskAssessment
): Control[] {
  const controls: Control[] = [
    {
      id: "CTRL-001",
      name: "Accountable owner assigned",
      description:
        "A named person must be accountable for the AI system and its governance lifecycle.",
      area: "Ownership",
      required: true,
      status: "Missing",
      evidenceRequired: ["Named system owner record"],
    },
    {
      id: "CTRL-002",
      name: "Human oversight documented",
      description:
        "The organisation must document how humans review, challenge or override AI outputs where appropriate.",
      area: "Controls",
      required: true,
      status: "Missing",
      evidenceRequired: ["Human oversight procedure"],
    },
    {
      id: "CTRL-003",
      name: "Risk assessment completed",
      description:
        "The system must have a documented and reviewable risk assessment.",
      area: "Risk",
      required: true,
      status: "Complete",
      evidenceRequired: ["Risk assessment"],
    },
  ];

  if (assessment.overallLevel === "Medium" || assessment.overallLevel === "High") {
    controls.push(
      {
        id: "CTRL-004",
        name: "Data assessment completed",
        description:
          "The organisation must document the categories and sensitivity of data processed by the system.",
        area: "Risk",
        required: true,
        status: "Missing",
        evidenceRequired: ["Data processing assessment"],
      },
      {
        id: "CTRL-005",
        name: "Testing and validation evidence",
        description:
          "Testing should demonstrate that the system performs acceptably for its intended use.",
        area: "Evidence",
        required: true,
        status: "Missing",
        evidenceRequired: ["Testing or validation report"],
      },
      {
        id: "CTRL-006",
        name: "Monitoring process established",
        description:
          "The organisation must define how system performance, incidents and material changes are monitored.",
        area: "Monitoring",
        required: true,
        status: "Missing",
        evidenceRequired: ["AI monitoring procedure"],
      }
    );
  }

  if (assessment.overallLevel === "High") {
    controls.push(
      {
        id: "CTRL-007",
        name: "AI impact assessment completed",
        description:
          "The organisation should document potential impacts, affected groups and mitigation measures.",
        area: "Risk",
        required: true,
        status: "Missing",
        evidenceRequired: ["AI impact assessment"],
      },
      {
        id: "CTRL-008",
        name: "Incident escalation procedure",
        description:
          "A documented process must exist for escalating significant AI incidents or failures.",
        area: "Controls",
        required: true,
        status: "Missing",
        evidenceRequired: ["AI incident response procedure"],
      },
      {
        id: "CTRL-009",
        name: "Supplier and model assessment",
        description:
          "Third-party providers, models and material dependencies should be assessed and documented.",
        area: "Controls",
        required: true,
        status: "Missing",
        evidenceRequired: ["Supplier AI assessment"],
      }
    );
  }

  return controls;
}

export function calculateEvidenceScore(
  controls: Control[]
): number {
  if (controls.length === 0) {
    return 100;
  }

  const completed = controls.filter(
    (control) => control.status === "Complete"
  ).length;

  return clampScore((completed / controls.length) * 100);
}

export function calculateGovernanceScore(input: {
  inventory: number;
  risk: number;
  controls: number;
  evidence: number;
  ownership: number;
  monitoring: number;
}) {
  const overall = clampScore(
    input.inventory * 0.15 +
      input.risk * 0.2 +
      input.controls * 0.2 +
      input.evidence * 0.2 +
      input.ownership * 0.1 +
      input.monitoring * 0.15
  );

  return {
    ...input,
    overall,
  };
}

export function getGovernancePriority(
  level: RiskLevel
): "Immediate" | "Priority" | "Routine" {
  if (level === "High") {
    return "Immediate";
  }

  if (level === "Medium") {
    return "Priority";
  }

  return "Routine";
}
