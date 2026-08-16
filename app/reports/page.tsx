"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, FileCheck2, Printer, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystems } from "@/lib/client-store";
import { loadRemediation } from "@/lib/remediation-store";
import { getOrganisation } from "@/lib/organisation-store";
import type { AISystem } from "@/lib/types";

export default function ReportsPage() {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [organisation, setOrganisation] = useState(getOrganisation());

  useEffect(() => {
    const stored = getStoredSystems();
    setSystems([...stored, ...aiSystems.filter((item) => !stored.some((saved) => saved.id === item.id))]);
    setOrganisation(getOrganisation());
  }, []);

  const remediation = useMemo(() => loadRemediation(), []);
  const highRisk = systems.filter((s) => s.risk === "High").length;
  const underReview = systems.filter((s) => s.status === "Review").length;
  const evidence = systems.length ? Math.round(systems.reduce((sum, s) => sum + s.evidence, 0) / systems.length) : 0;
  const openActions = remediation.filter((item) => item.status !== "Complete").length;
  const posture = Math.max(0, Math.min(100, Math.round(evidence * 0.55 + (systems.length ? (1 - highRisk / systems.length) * 30 : 30) + (openActions === 0 ? 15 : Math.max(0, 15 - openActions * 3)))));

  return (
    <AppShell>
      <div className="mx-auto max-w-[1150px] px-6 py-8 xl:px-8 print:max-w-none print:px-8">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={14} />Control Centre</Link>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#0b0b0b] px-4 py-2.5 text-xs text-white/60 hover:text-white"><Printer size={14} />Print / Save PDF</button>
        </div>

        <header className="mt-8 border-b border-white/[0.1] pb-7">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">NEURONBRIGHT governance report</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><h1 className="text-3xl font-semibold tracking-tight">AI Governance Executive Report</h1><p className="mt-2 text-sm text-white/35">{organisation.name} · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p></div>
            <div className="text-left md:text-right"><p className="text-[9px] uppercase tracking-[0.16em] text-white/20">Governance posture</p><p className="mt-1 text-4xl font-semibold text-[#dc6b27]">{posture}%</p></div>
          </div>
        </header>

        <section className="mt-7 grid gap-4 md:grid-cols-4">
          {[['AI systems', systems.length], ['High risk', highRisk], ['Under review', underReview], ['Evidence coverage', `${evidence}%`]].map(([label, value]) => <div key={label as string} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></div>)}
        </section>

        <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
          <div className="flex items-center gap-3"><ShieldAlert size={18} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Executive assessment</p><p className="mt-1 text-xs text-white/25">Operational summary of the current governance position.</p></div></div>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55">NEURONBRIGHT currently records {systems.length} AI systems. {highRisk} are classified as high risk and {underReview} require active review. Evidence coverage is {evidence}%, with {openActions} remediation actions still open. This report is an operational governance summary and does not constitute legal or regulatory certification.</p>
        </section>

        <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] p-6"><h2 className="text-sm font-medium">AI inventory</h2><p className="mt-1 text-xs text-white/25">Current systems requiring governance oversight.</p></div>
          <div className="divide-y divide-white/[0.07]">
            {systems.map((system) => <div key={system.id} className="grid gap-4 px-6 py-4 md:grid-cols-[1fr_120px_120px_110px] md:items-center"><div><p className="text-sm font-medium text-white/70">{system.name}</p><p className="mt-1 text-[10px] text-white/25">{system.owner} · {system.department}</p></div><span className="text-xs text-white/45">{system.risk} risk</span><span className="text-xs text-white/45">{system.evidence}% evidence</span><span className="text-xs text-white/45">{system.status}</span></div>)}
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex items-center gap-3"><FileCheck2 size={17} className="text-[#dc6b27]"/><h2 className="text-sm font-medium">Evidence posture</h2></div><p className="mt-4 text-3xl font-semibold">{evidence}%</p><p className="mt-1 text-xs text-white/30">Average verified evidence coverage across the AI inventory.</p></div>
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex items-center gap-3"><CheckCircle2 size={17} className="text-[#dc6b27]"/><h2 className="text-sm font-medium">Governance actions</h2></div><p className="mt-4 text-3xl font-semibold">{openActions}</p><p className="mt-1 text-xs text-white/30">Open remediation actions requiring ownership and follow-through.</p></div>
        </section>

        <div className="mt-7 flex flex-wrap gap-3 print:hidden">
          <Link href="/actions" className="inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black">Open Action Centre <ArrowUpRight size={13}/></Link>
          <Link href="/frameworks" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs text-white/55 hover:text-white">Framework coverage <ArrowUpRight size={13}/></Link>
          <Link href="/evidence" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs text-white/55 hover:text-white">Evidence Centre <ArrowUpRight size={13}/></Link>
        </div>
      </div>
    </AppShell>
  );
}
