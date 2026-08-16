import { Control, RiskAssessment } from "@/lib/types";

export type GovernanceRecord = {
  systemId: string;
  assessment: RiskAssessment;
  controls: Control[];
  createdAt: string;
};

const STORAGE_KEY = "neuronbright:governance";

function read(): GovernanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(records: GovernanceRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveGovernanceRecord(record: GovernanceRecord) {
  const next = [record, ...read().filter((item) => item.systemId !== record.systemId)];
  write(next);
  return record;
}

export function getGovernanceRecord(systemId: string): GovernanceRecord | null {
  return read().find((item) => item.systemId === systemId) ?? null;
}

export function updateControlStatus(
  systemId: string,
  controlId: string,
  status: Control["status"],
): GovernanceRecord | null {
  const record = getGovernanceRecord(systemId);
  if (!record) return null;

  const updated: GovernanceRecord = {
    ...record,
    controls: record.controls.map((control) =>
      control.id === controlId ? { ...control, status } : control,
    ),
  };

  saveGovernanceRecord(updated);
  return updated;
}
