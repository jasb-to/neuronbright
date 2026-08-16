export type VendorRisk = "Low" | "Medium" | "High";
export type VendorStatus = "Approved" | "Review" | "Blocked";

export type AIVendor = {
  id: string;
  name: string;
  category: string;
  owner: string;
  systems: number;
  risk: VendorRisk;
  status: VendorStatus;
  frameworkCoverage: number;
  lastReviewed: string;
  nextReview: string;
  evidence: number;
};

const KEY = "neuronbright:vendors";

export const seedVendors: AIVendor[] = [
  {
    id: "V-001",
    name: "OpenAI",
    category: "Foundation models",
    owner: "AI Governance Team",
    systems: 12,
    risk: "High",
    status: "Review",
    frameworkCoverage: 78,
    lastReviewed: "12 Aug 2026",
    nextReview: "30 Sep 2026",
    evidence: 71,
  },
  {
    id: "V-002",
    name: "Microsoft Azure AI",
    category: "Cloud AI platform",
    owner: "Technology",
    systems: 18,
    risk: "Medium",
    status: "Approved",
    frameworkCoverage: 92,
    lastReviewed: "08 Aug 2026",
    nextReview: "08 Nov 2026",
    evidence: 94,
  },
  {
    id: "V-003",
    name: "Anthropic",
    category: "Foundation models",
    owner: "Engineering",
    systems: 7,
    risk: "Medium",
    status: "Approved",
    frameworkCoverage: 88,
    lastReviewed: "05 Aug 2026",
    nextReview: "05 Nov 2026",
    evidence: 86,
  },
  {
    id: "V-004",
    name: "Salesforce Einstein",
    category: "Enterprise AI",
    owner: "Sales Operations",
    systems: 5,
    risk: "High",
    status: "Review",
    frameworkCoverage: 64,
    lastReviewed: "18 Jul 2026",
    nextReview: "18 Aug 2026",
    evidence: 59,
  },
];

export function loadVendors(): AIVendor[] {
  if (typeof window === "undefined") return seedVendors;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seedVendors;
  } catch {
    return seedVendors;
  }
}

export function saveVendors(items: AIVendor[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  return items;
}
