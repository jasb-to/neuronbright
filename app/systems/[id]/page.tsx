"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileCheck2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystem } from "@/lib/client-store";
import { AISystem } from "@/lib/types";

export default function SystemPage({ params }: { params: { id: string } }) {
  const [system, setSystem] = useState<AISystem | null>(null);

  useEffect(() => {
    const saved = getStoredSystem(params.id);
    setSystem(saved ?? aiSystems.find(item => item.id === params.id) ?? aiSystems[0]);
  }, [params.id]);

  if (!system) return <AppShell><div className="p-8 text-sm text-white/40">Loading system...</div></AppShell>;

  const controls = [
    "System owner assigned",
    "Data classification",
    "Risk assessment",
    "Human oversight",
    "Evidence package",
  ];

  return <AppShell><div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
    <Link href="/systems" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-[#dc6b27]"><ArrowLeft size={13}/>Back to AI systems</Link>
    <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-start"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">AI System</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{system.name}</h1><p className="mt-2 text-sm text-white/35">{system.provider} · {system.model}</p></div><StatusBadge status={system.risk}/></div>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["Owner",system.owner],["Department",system.department],["Provider",system.provider],["Last reviewed",system.lastReviewed]].map(([label,value])=><div key={label} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className="mt-3 text-sm text-white/70">{value}</p></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]"><div className="space-y-6">
      <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><div className="border-b border-white/[0.08] p-5"><h2 className="text-sm font-medium">System overview</h2></div><div className="p-5"><p className="text-sm leading-7 text-white/50">{system.purpose}</p><div className="mt-7"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">Data types</p><div className="mt-3 flex flex-wrap gap-2">{system.dataTypes.map(x=><span key={x} className="rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/45">{x}</span>)}</div></div></div></section>
      <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><div className="flex items-center justify-between border-b border-white/[0.08] p-5"><div><h2 className="text-sm font-medium">Governance workflow</h2><p className="mt-1 text-xs text-white/25">Controls generated from the initial assessment</p></div><ShieldAlert size={18} className="text-[#dc6b27]"/></div><div className="divide-y divide-white/[0.07]">{controls.map((x,i)=><div key={x} className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><CheckCircle2 size={16} className={i<2?"text-[#dc6b27]":"text-white/20"}/><span className="text-sm text-white/65">{x}</span></div><span className="text-[9px] uppercase tracking-[0.12em] text-white/25">{i<2?"Ready":"Required"}</span></div>)}</div></section>
    </div><div className="space-y-6"><section className="rounded-xl border border-[#dc6b27]/25 bg-[#dc6b27]/[0.05] p-6"><p className="text-[9px] uppercase tracking-[0.15em] text-[#dc6b27]">Evidence posture</p><p className="mt-3 text-4xl font-semibold">{system.evidence}%</p><p className="mt-2 text-xs text-white/30">Evidence verified</p><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27]" style={{width:`${system.evidence}%`}}/></div></section><section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex items-center gap-3"><FileCheck2 size={18} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Next step</p><p className="mt-1 text-xs text-white/30">Review the risk assessment and map the required controls.</p></div></div><Link href={`/systems/${system.id}/risk`} className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90">Open risk assessment</Link></section></div></div>
  </div></AppShell>;
}
