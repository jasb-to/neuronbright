import type { AISystem, LifecycleStage } from "@/lib/types";

export const lifecycleStages: LifecycleStage[] = ["Discover", "Assess", "Approve", "Monitor", "Review", "Retire"];

export function lifecycleIndex(stage: LifecycleStage = "Discover") {
  return lifecycleStages.indexOf(stage);
}

export function isReviewOverdue(system: AISystem) {
  if (!system.nextReviewDate || system.lifecycleStage === "Retire") return false;
  return new Date(system.nextReviewDate).getTime() < Date.now();
}

export function lifecycleLabel(stage: LifecycleStage = "Discover") {
  return stage === "Approve" ? "Approval" : stage;
}
