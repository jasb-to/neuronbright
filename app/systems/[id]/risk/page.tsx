"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleAlert, FileCheck2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystem } from "@/lib/client-store";
import { getGovernanceRecord, GovernanceRecord } from "@/lib/governance-store";
import { AISystem, RiskAssessment } from "@/lib/types";

const fallbackAssessment: RiskAssessment = {
  overallScore: 78,
  overallLevel: "High",
  assessedAt: "",
  dimensions: [
    { name: "Impact on individuals", score: 82, level: "High", explanation: "The system may materially influence outcomes affecting individuals." },
    { name: "Data sensitivity", score: 74, level: "High", explanation: "The system processes information associated with people." },
    { name: "Autonomy", score: 58, level: "Medium", explanation: "Human review is present but recommendations influence outcomes." },
    { name: "Scale of deployment", score: 66, level: "Medium", explanation: "The system is available across multiple organisational teams." },
    { name: "Regulatory exposure", score: 79, level: "High", explanation: "The intended use creates elevated governance requirements." },
  ],
};

export default function SystemRiskPage({ params }: { params: Promise<{ id: string }> }) {
  const [system, setSystem] = useState<AISystem | null>(null);
  const [record, setRecord] = useState<GovernanceRecord | null>(null);

  useEffect(() => {
    let active = true;
    params.then(({ id }) => {
      if (!active) return;
      setSystem(getStoredSystem(id) ?? aiSystems.find((item) => item.id === id) ?? aiSystems[1]);
      setRecord(getGovernanceRecord(id));
    });
    return () => { active = false; };
  }, [params]);

  if (!system) return <AppShell><div className="p-8 text-sm text-white/40">Loading assessment...</div></AppShell>;

  const assessment = record?.assessment ?? fallbackAssessment;
  const controls = record?.controls ?? [];
  const missingControls = controls.filter((control) => control.status !== "Complete").length;

  return <AppShell><div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
    <Link href={`/systems/${system.id}`} className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={14}/>Back to {system.name}</Link>
    <div className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Risk assessment</p><h1 className="mt-2 text-2xl font-semibold">{system.name}</h1><p className="mt-2 text-sm text-white/35">Structured assessment of the system&apos;s governance exposure.</p></div><StatusBadge status={assessment.overallLevel}/></div>
    <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><div className="border-b border-white/[0.08] px-6 py-5"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.16em] text-white/20">Risk dimensions</p><h2 className="mt-1 text-base font-semibold">Inherent risk profile</h2></div><ShieldAlert size={17} className="text-[#dc6b27]"/></div></div><div className="divide-y divide-white/[0.07]">{assessment.dimensions.map((dimension)=><div key={dimension.name} className="px-6 py-5"><div className="flex items-start justify-between gap-5"><div><p className="text-sm font-medium text-white/75">{dimension.name}</p><p className="mt-1 max-w-xl text-xs leading-5 text-white/30">{dimension.explanation}</p></div><div className="text-right"><p className="text-lg font-semibold">{dimension.score}</p><p className="text-[9px] uppercase tracking-[0.12em] text-white/25">/ 100</p></div></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27]" style={{width:`${dimension.score}%`}}/></div><div className="mt-2 flex justify-end"><StatusBadge status={dimension.level}/></div></div>)}</div></section>
      <aside className="space-y-5"><div className="rounded-xl border border-[#dc6b27]/30 bg-[#dc6b27]/[0.06] p-6"><p className="text-[9px] uppercase tracking-[0.18em] text-[#dc6b27]">Overall assessment</p><div className="mt-5 flex items-end justify-between"><div><p className="text-4xl font-semibold">{assessment.overallScore}</p><p className="mt-1 text-xs text-white/30">Risk score</p></div><ShieldAlert size={34} strokeWidth={1.5} className="text-[#dc6b27]"/></div><div className="mt-5"><StatusBadge status={assessment.overallLevel}/></div><p className="mt-4 text-xs leading-5 text-white/35">{assessment.overallLevel === "High" ? "This system should receive additional governance review before deployment or continued operation." : assessment.overallLevel === "Medium" ? "This system requires appropriate controls and evidence before approval." : "This system currently presents lower governance exposure, subject to the accuracy of the assessment inputs."}</p></div><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><p className="text-[9px] uppercase tracking-[0.18em] text-white/20">Assessment result</p><div className="mt-4 space-y-3">{(controls.length ? controls.filter(c=>c.status!=="Complete").slice(0,4).map(c=>c.name) : ["Human oversight review","Data assessment review","Control review","Evidence package"]).map(item=><div key={item} className="flex items-center gap-3"><CircleAlert size={14} className="text-[#dc6b27]"/><span className="text-xs text-white/50">{item}</span></div>)}</div>{controls.length>0&&<p className="mt-4 text-[10px] text-white/20">{missingControls} of {controls.length} controls still require action.</p>}</div></aside>
    </div>
    <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dc6b27]/10"><FileCheck2 size={18} className="text-[#dc6b27]"/></div><div><p className="text-sm font-medium">Next: map required controls</p><p className="mt-1 text-xs text-white/30">NEURONBRIGHT has translated this risk profile into a governance control set.</p></div></div><Link href={`/systems/${system.id}/controls`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90">Review controls<ArrowRight size={14}/></Link></div></div>
  </div></AppShell>;
}
