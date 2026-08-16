"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, FileCheck2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystem } from "@/lib/client-store";
import { Control, AISystem } from "@/lib/types";

function ControlStatus({ status }: { status: Control["status"] }) {
  if (status === "Complete") return <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400"><CheckCircle2 size={13}/>Complete</span>;
  if (status === "Missing") return <span className="inline-flex items-center gap-1.5 text-[10px] text-[#dc6b27]"><CircleAlert size={13}/>Gap</span>;
  return <span className="inline-flex items-center gap-1.5 text-[10px] text-yellow-400"><CircleAlert size={13}/>In progress</span>;
}

export default function SystemControlsPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [system, setSystem] = useState<AISystem | null>(null);
  const [controls, setControls] = useState<Control[]>([]);

  useEffect(() => {
    let active = true;
    params.then(async ({ id: routeId }) => {
      if (!active) return;
      setId(routeId);
      setSystem(getStoredSystem(routeId) ?? aiSystems.find((item) => item.id === routeId) ?? aiSystems[0]);
      const response = await fetch(`/api/systems/${routeId}/governance`, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setControls((data.controls ?? []).map((control: { id: string; external_id: string; name: string; description: string | null; area: string | null; required: boolean; status: Control["status"]; evidence_required: string[] | null }) => ({ id: control.external_id || control.id, name: control.name, description: control.description ?? "", area: (control.area ?? "Inventory") as Control["area"], required: control.required, status: control.status, evidenceRequired: control.evidence_required ?? [] })));
    });
    return () => { active = false; };
  }, [params]);

  const implemented = controls.filter((control) => control.status === "Complete").length;
  const gaps = controls.filter((control) => control.status === "Missing").length;
  const evidenceRequired = controls.reduce((total, control) => total + control.evidenceRequired.length, 0);
  const completion = controls.length ? Math.round((implemented / controls.length) * 100) : 0;

  async function setStatus(externalId: string, status: Control["status"]) {
    const target = controls.find((control) => control.id === externalId);
    if (!target) return;
    const response = await fetch(`/api/systems/${id}/governance`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ controlId: target.id, status }) });
    if (!response.ok) return;
    setControls((current) => current.map((control) => control.id === externalId ? { ...control, status } : control));
  }

  return <AppShell>
    <div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
      <Link href={`/systems/${id}`} className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={14}/>Back to {system?.name ?? "AI system"}</Link>
      <div className="mt-7"><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Governance controls</p><h1 className="mt-2 text-2xl font-semibold">Control set</h1><p className="mt-2 text-sm text-white/35">Controls required to govern {system?.name ?? "this AI system"}.</p></div>

      {controls.length ? <>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[["Total controls", controls.length, "text-white"],["Complete", implemented, "text-emerald-400"],["Governance gaps", gaps, "text-[#dc6b27]"],["Completion", `${completion}%`, "text-[#dc6b27]"]].map(([label, value, cls]) => <div key={String(label)} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className={`mt-3 text-2xl font-semibold ${cls}`}>{value}</p></div>)}
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5"><div className="flex items-center gap-3"><Shield size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Required controls</p><p className="mt-1 text-xs text-white/25">Stored in the organisation governance database.</p></div></div></div>
          <div className="divide-y divide-white/[0.07]">
            {controls.map((control) => <div key={control.id} className="px-6 py-5 hover:bg-white/[0.02]"><div className="grid gap-4 lg:grid-cols-[90px_1fr_130px_220px] lg:items-center"><span className="text-[10px] font-mono text-white/20">{control.id}</span><div><p className="text-sm font-medium text-white/75">{control.name}</p><p className="mt-1 max-w-2xl text-[10px] leading-5 text-white/25">{control.description}</p></div><ControlStatus status={control.status}/><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Evidence</p><p className={`mt-1 text-xs ${control.status === "Missing" ? "text-[#dc6b27]" : "text-white/45"}`}>{control.evidenceRequired.join(", ") || "Evidence to be mapped"}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => setStatus(control.id, control.status === "Complete" ? "Missing" : "Complete")} className="rounded-md border border-white/[0.09] px-2.5 py-1.5 text-[9px] text-white/50 hover:border-[#dc6b27]/40 hover:text-white">{control.status === "Complete" ? "Reopen" : "Mark complete"}</button>{control.status === "Missing" && <button type="button" onClick={() => setStatus(control.id, "In Progress")} className="rounded-md border border-white/[0.09] px-2.5 py-1.5 text-[9px] text-white/50 hover:border-[#dc6b27]/40 hover:text-white">Start</button>}</div></div></div></div>)}
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><FileCheck2 size={19} className="mt-0.5 text-[#dc6b27]"/><div><p className="text-sm font-medium">{evidenceRequired} evidence items are required</p><p className="mt-1 text-xs leading-5 text-white/30">Attach evidence to these controls and close the remaining governance gaps.</p></div></div><Link href="/evidence" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90">Open Evidence Centre<ArrowRight size={14}/></Link></div></div>
      </> : <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-8"><p className="text-sm font-medium">No controls found</p><p className="mt-2 text-xs text-white/30">Create and assess this system to generate and save its governance control set.</p><Link href="/systems/new" className="mt-5 inline-flex rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black">Create & assess a system</Link></div>}
    </div>
  </AppShell>;
}
