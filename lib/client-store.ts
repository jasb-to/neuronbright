import { AISystem } from "@/lib/types";

const STORAGE_KEY = "neuronbright:systems";

export function getStoredSystems(): AISystem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSystem(system: AISystem): AISystem[] {
  const systems = getStoredSystems().filter((item) => item.id !== system.id);
  const next = [system, ...systems];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getStoredSystem(id: string): AISystem | null {
  return getStoredSystems().find((item) => item.id === id) ?? null;
}
