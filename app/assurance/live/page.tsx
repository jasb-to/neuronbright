"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Control = {
  id: string;
  external_id: string;
  name: string;
  state: string;
  target_percent: number;
  runtime_expected_events: number;
  runtime_observed_events: number;
  owner?: string | null;
  evaluation?: { state: string; effectiveness: number | null; reason: string };
};

export default function LiveAssurancePage() {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/assurance", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? body.reason ?? "Unable to load assurance state.");
        setControls(body.controls ?? []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return <AppShell><main className="mx-auto max-w-[1200px] px-6 py-10 xl:px-8">
    <div className="border-b border-white/[0.08] pb-7"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]"><Activity size={13}/> Assurance engine</div><h1 className="mt-2 text-3xl font-semibold tracking-tight">Live control effectiveness</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">This view is backed by the continuous assurance data model. It deliberately distinguishes unknown evidence from a healthy control.</p></div>
    {loading && <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-8 text-sm text-white/35">Loading live assurance state…</div>}
    {!loading && error && <div className="mt-8 rounded-xl border border-red-400/20 bg-red-400/[0.04] p-6"><div className="flex items-center gap-2 text-red-300"><AlertTriangle size={16}/><span className="text-sm font-medium">Assurance engine unavailable</span></div><p className="mt-2 text-xs leading-5 text-white/35">{error}</p><p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-white/20">If this is a new deployment, apply the continuous assurance migration in Supabase first.</p></div>}
    {!loading && !error && controls.length === 0 && <div className="mt-8 rounded-xl border border-yellow-400/20 bg-yellow-400/[0.03] p-6"><div className="flex items-center gap-2 text-yellow-300"><CircleDashed size={16}/><span className="text-sm font-medium">No assurance controls configured</span></div><p className="mt-2 text-xs leading-5 text-white/35">The engine is connected, but there are no assurance controls for this organisation yet.</p></div>}
    <section className="mt-8 space-y-4">{controls.map((control) => { const evaluation = control.evaluation; const state = evaluation?.state ?? control.state; const pct = evaluation?.effectiveness; const icon = state === "GREEN" ? <CheckCircle2 size={17}/> : state === "UNKNOWN" ? <CircleDashed size={17}/> : <AlertTriangle size={17}/>; const tone = state === "GREEN" ? "text-emerald-300 border-emerald-400/20 bg-emerald-400/[0.04]" : state === "UNKNOWN" ? "text-white/40 border-white/[0.08] bg-[#0b0b0b]" : "text-red-300 border-red-400/20 bg-red-400/[0.04]"; return <article key={control.id} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-start"><div><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{control.external_id}</p><h2 className="mt-2 text-lg font-semibold">{control.name}</h2><p className="mt-1 text-xs text-white/25">Owner: {control.owner ?? "Unassigned"}</p></div><div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[9px] uppercase tracking-[0.14em] ${tone}`}>{icon}{state.replaceAll("_", " ")}</div></div><div className="mt-6 grid gap-4 md:grid-cols-3"><div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Effectiveness</p><p className="mt-2 text-2xl font-semibold">{pct === null || pct === undefined ? "—" : `${pct.toFixed(1)}%`}</p></div><div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Runtime evidence</p><p className="mt-2 text-sm text-white/60">{control.runtime_observed_events.toLocaleString()} / {control.runtime_expected_events.toLocaleString()}</p></div><div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Decision</p><p className="mt-2 text-xs leading-5 text-white/40">{evaluation?.reason ?? "No evaluation available."}</p></div></div></article>; })}</section>
    <p className="mt-8 text-[10px] text-white/20">Engine rule: UNKNOWN is not GREEN. A governed change after verification can force REVALIDATION_REQUIRED.</p>
  </main></AppShell>;
}
