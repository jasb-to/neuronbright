export const ASSURANCE_STAGES = ["Specified", "Authorized", "Implemented", "Executing", "Verified", "Effective", "Maintained"] as const;
export type AssuranceStage = (typeof ASSURANCE_STAGES)[number];
export type AssuranceState = "GREEN" | "AMBER" | "RED" | "UNKNOWN" | "REVALIDATION_REQUIRED";

export type AssuranceEvent = {
  id?: string;
  stage: AssuranceStage;
  actor: string;
  basis: string;
  evidenceRef?: string | null;
  observedAt: string;
  metadata?: Record<string, unknown>;
};

export type AssuranceInput = {
  targetPercent: number;
  expectedEvents: number;
  observedEvents: number;
  lastChangeAt?: string | null;
  lastVerificationAt?: string | null;
  events: AssuranceEvent[];
};

export function effectivenessPercent(expectedEvents: number, observedEvents: number) {
  if (expectedEvents <= 0) return null;
  return Math.max(0, Math.min(100, (observedEvents / expectedEvents) * 100));
}

export function evaluateAssurance(input: AssuranceInput): { state: AssuranceState; effectiveness: number | null; reason: string } {
  const effectiveness = effectivenessPercent(input.expectedEvents, input.observedEvents);
  if (effectiveness === null) return { state: "UNKNOWN", effectiveness, reason: "No expected runtime population has been established." };

  const requiredStages = new Set(input.events.map((event) => event.stage));
  if (!requiredStages.has("Specified") || !requiredStages.has("Authorized") || !requiredStages.has("Implemented")) {
    return { state: "UNKNOWN", effectiveness, reason: "The control lifecycle is incomplete before runtime assurance can be established." };
  }

  if (input.lastChangeAt && input.lastVerificationAt && new Date(input.lastChangeAt) > new Date(input.lastVerificationAt)) {
    return { state: "REVALIDATION_REQUIRED", effectiveness, reason: "The governed system changed after the last verification." };
  }

  if (!requiredStages.has("Executing") || !requiredStages.has("Verified")) {
    return { state: "AMBER", effectiveness, reason: "Runtime execution or verification evidence is missing." };
  }

  if (effectiveness < input.targetPercent) {
    return { state: "RED", effectiveness, reason: `Observed effectiveness ${effectiveness.toFixed(1)}% is below the ${input.targetPercent.toFixed(1)}% target.` };
  }

  if (!requiredStages.has("Effective") || !requiredStages.has("Maintained")) {
    return { state: "AMBER", effectiveness, reason: "The control is executing successfully but has not completed the full assurance lifecycle." };
  }

  return { state: "GREEN", effectiveness, reason: "Runtime evidence meets the target and the assurance lifecycle is current." };
}
