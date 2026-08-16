"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Building2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getOrganisation, saveOrganisation, type OrganisationProfile } from "@/lib/organisation-store";

export default function SettingsPage() {
  const [profile, setProfile] = useState<OrganisationProfile>(getOrganisation());
  const [saved, setSaved] = useState(false);

  useEffect(() => setProfile(getOrganisation()), []);

  function update<K extends keyof OrganisationProfile>(key: K, value: OrganisationProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    saveOrganisation(profile);
    setSaved(true);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1100px] px-6 py-8 xl:px-8">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Organisation</p>
        <h1 className="mt-2 text-2xl font-semibold">Organisation profile</h1>
        <p className="mt-2 text-sm text-white/35">Define the organisation that NEURONBRIGHT is governing.</p>

        <form onSubmit={submit} className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="flex items-center gap-4 border-b border-white/[0.08] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dc6b27]/10"><Building2 size={18} className="text-[#dc6b27]" /></div>
            <div><p className="text-sm font-medium">Organisation identity</p><p className="mt-1 text-xs text-white/25">This information appears across the governance workspace.</p></div>
          </div>
          <div className="grid gap-5 p-6 md:grid-cols-2">
            {([
              ["name", "Organisation name"],
              ["industry", "Industry"],
              ["size", "Organisation size"],
              ["governanceLead", "Governance owner"],
              ["contactEmail", "Governance contact"],
            ] as const).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/25">{label}</span>
                <input value={profile[key]} onChange={(e) => update(key, e.target.value)} className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-sm text-white outline-none focus:border-[#dc6b27]/50" />
              </label>
            ))}
          </div>
          <div className="flex items-center justify-end gap-4 border-t border-white/[0.08] p-6">
            {saved && <span className="flex items-center gap-2 text-xs text-white/40"><CheckCircle2 size={14} className="text-[#dc6b27]" />Saved</span>}
            <button type="submit" className="rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90">Save organisation</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
