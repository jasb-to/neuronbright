export type OrganisationProfile = {
  name: string;
  industry: string;
  size: string;
  governanceLead: string;
  contactEmail: string;
};

const KEY = "neuronbright:organisation";

export const defaultOrganisation: OrganisationProfile = {
  name: "Acme Corporation",
  industry: "Professional services",
  size: "1,000–5,000 employees",
  governanceLead: "AI Governance Team",
  contactEmail: "governance@acme.example",
};

export function getOrganisation(): OrganisationProfile {
  if (typeof window === "undefined") return defaultOrganisation;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaultOrganisation, ...JSON.parse(raw) } : defaultOrganisation;
  } catch {
    return defaultOrganisation;
  }
}

export function saveOrganisation(profile: OrganisationProfile) {
  window.localStorage.setItem(KEY, JSON.stringify(profile));
  return profile;
}
