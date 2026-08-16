"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, FileCheck2, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystem } from "@/lib/client-store";
import { getGovernanceRecord, updateControlStatus, GovernanceRecord } from "@/lib/governance-store";
import { Control } from "@/lib/types";

function ControlStatus({ status }: { status: Control["status"] }) {
  if (status === "Complete") return <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400"><CheckCircle2 size={13} />Complete</span>;
  if (status === "Missing") return <span className="inline-flex items-center gap-1.5 text-[10px] text-[#dc6b27]"><CircleAlert size={13} />Gap</span>;
  return <span className="inline-flex items-center gap-1.5 text-[10px] text-yellow-400"><CircleAlert size={13} />In progress</span>;
}

export default function SystemControlsPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [record, setRecord] = useState<GovernanceRecord | null>(null);
  const [systemName, setSystemName] = useState("AI system");

  useEffect(() => {
    let active = true;
    params.then(({ id: routeId }) => {
      if (!active) return;
      setId(routeId);
      const saved = getStoredSystem(routeId);
      const governance = getGovernanceRecord(routeId);
      setSystemName(saved?.name ?? aiSystems.find((item) => item.id === routeId)?.name ?? "AI system");
      setRecord(governance);
    });
    return () => { active = false; };
  }, [params]);

  const controls = record?.controls ?? [];
  const implemented = controls.filter((control) => control.status === "Complete").length;
  const gaps = controls.filter((control) => control.status === "Missing").length;
  const evidenceRequired = controls.reduce((total, control) => total + control.evidenceRequired.length, 0);
  const completion = controls.length ? Math.round((implemented / controls.length) * 100) : 0;

  function setStatus(controlId: string, status: Control["status"]) {
    const updated = updateControlStatus(id, controlId, status);
    if (updated) setRecord(updated);
  }

  const fallbackMessage = useMemo(() => !record && id ? "This system predates the governance workflow. Create a new assessment to generate its control set." : "", [record, id]);

  return <AppShell>
    <div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
      <Link href={`/systems/${id}`} className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={14}/>Back to {systemName}</Link>
      <div className="mt-7"><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Governance controls</p><h1 className="mt-2 text-2xl font-semibold">Control set</h1><p className="mt-2 text-sm text-white/35">Controls required to govern {systemName}.</p></div>

      {record ? <>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[['Total controls', controls.length, 'text-white'], ['Complete', implemented, 'text-emerald-400'], ['Governance gaps', gaps, 'text-[#dc6b27]'], ['Completion', `${completion}%`, 'text-[#dc6b27]']].map(([label,value,cls])=><div key={String(label)} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className={`mt-3 text-2xl font-semibold ${cls}`}>{value}</p></div>)}
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5"><div className="flex items-center gap-3"><Shield size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Required controls</p><p className="mt-1 text-xs text-white/25">Generated from the system's risk assessment. Each control needs an accountable owner and supporting evidence.</p></div></div></div>
          <div className="divide-y divide-white/[0.07]">
            {controls.map((control) => <div key={control.id} className="px-6 py-5 hover:bg-white/[0.02]"><div className="grid gap-4 lg:grid-cols-[90px_1fr_130px_220px] lg:items-center"><span className="text-[10px] font-mono text-white/20">{control.id}</span><div><p className="text-sm font-medium text-white/75">{control.name}</p><p className="mt-1 max-w-2xl text-[10px] leading-5 text-white/25">{control.description}</p></div><ControlStatus status={control.status}/><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Evidence</p><p className={`mt-1 text-xs ${control.status === "Missing" ? "text-[#dc6b27]" : "text-white/45"}`}>{control.evidenceRequired.join(", ")}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => setStatus(control.id, control.status === "Complete" ? "Missing" : "Complete")} className="rounded-md border border-white/[0.09] px-2.5 py-1.5 text-[9px] text-white/50 hover:border-[#dc6b27]/40 hover:text-white">{control.status === "Complete" ? "Reopen" : "Mark complete"}</button>{control.status === "Missing" && <button type="button" onClick={() => setStatus(control.id, "In Progress")} className="rounded-md border border-white/[0.09] px-2.5 py-1.5 text-[9px] text-white/50 hover:border-[#dc6b27]/40 hover:text-white">Start</button>}</div></div></div></div>)}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><FileCheck2 size={19} className="mt-0.5 text-[#dc6b27]"/><div><p className="text-sm font-medium">{evidenceRequired} evidence items are required</p><p className="mt-1 text-xs leading-5 text-white/30">The next step is to attach evidence to the controls and close the remaining governance gaps.</p></div></div><Link href="/evidence" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90">Open Evidence Centre<ArrowRight size={14}/></Link></div></div>
      </> : <div className="mt-8 rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6"><p className="text-sm font-medium">Governance record not found</p><p className="mt-2 text-xs leading-5 text-white/35">{fallbackMessage}</p><Link href="/systems/new" className="mt-5 inline-flex rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black">Create & assess a system</Link></div>}
    </div>
  </AppShell>;
}
