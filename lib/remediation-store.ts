export type RemediationStatus = "Open" | "In progress" | "Complete";
export type RemediationPriority = "Critical" | "High" | "Medium" | "Low";

export type RemediationTask = {
  id: string;
  title: string;
  description: string;
  system: string;
  control: string;
  framework: string;
  owner: string;
  dueDate: string;
  priority: RemediationPriority;
  status: RemediationStatus;
};

const KEY = "neuronbright:remediation";

export const seedRemediation: RemediationTask[] = [
  { id: "REM-001", title: "Document human oversight procedure", description: "Create and approve a documented process for human review and intervention.", system: "Recruitment Screening AI", control: "Human oversight", framework: "EU AI Act", owner: "James Patel", dueDate: "2026-08-22", priority: "Critical", status: "Open" },
  { id: "REM-002", title: "Complete data processing assessment", description: "Document data categories, purpose, sources and safeguards for the fraud detection model.", system: "Fraud Detection Model", control: "Data governance", framework: "EU AI Act", owner: "Robert Lewis", dueDate: "2026-08-28", priority: "High", status: "In progress" },
  { id: "REM-003", title: "Upload model evaluation report", description: "Provide the latest testing and validation results for the developer assistant.", system: "Developer Assistant", control: "Testing and validation evidence", framework: "NIST AI RMF", owner: "Daniel Evans", dueDate: "2026-09-05", priority: "Medium", status: "Open" },
];

export function loadRemediation(): RemediationTask[] {
  if (typeof window === "undefined") return seedRemediation;
  try { const raw = window.localStorage.getItem(KEY); return raw ? JSON.parse(raw) : seedRemediation; }
  catch { return seedRemediation; }
}

export function saveRemediation(items: RemediationTask[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  return items;
}
