"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, Boxes, CheckCircle2, FileCheck2, ListChecks } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystems } from "@/lib/client-store";
import { loadRemediation } from "@/lib/remediation-store";
import type { AISystem } from "@/lib/types";

const evidenceSeed = [
  { status: "Verified" },
  { status: "Pending" },
  { status: "Verified" },
  { status: "Verified" },
  { status: "Verified" },
  { status: "Pending" },
];

export default function DashboardPage() {
  const [storedSystems, setStoredSystems] = useState<AISystem[]>([]);
  const [remediation, setRemediation] = useState(loadRemediation);

  useEffect(() => {
    setStoredSystems(getStoredSystems());
    setRemediation(loadRemediation());
  }, []);

  const systems = useMemo(
    () => [
      ...storedSystems,
      ...aiSystems.filter((item) => !storedSystems.some((saved) => saved.id === item.id)),
    ],
    [storedSystems],
  );

  const metrics = useMemo(() => {
    const highRisk = systems.filter((system) => system.risk === "High").length;
    const review = systems.filter((system) => system.status === "Review").length;
    const evidenceVerified = evidenceSeed.filter((item) => item.status === "Verified").length;
    const evidenceCoverage = evidenceSeed.length ? Math.round((evidenceVerified / evidenceSeed.length) * 100) : 0;
    const openActions = remediation.filter((item) => item.status !== "Complete").length;
    const governance = Math.max(0, Math.min(100, Math.round(
      systems.length
        ? (systems.reduce((sum, system) => sum + system.evidence, 0) / systems.length) * 0.45 +
          (1 - highRisk / systems.length) * 35 +
          evidenceCoverage * 0.2
        : evidenceCoverage,
    )));

    return { highRisk, review, evidenceCoverage, openActions, governance };
  }, [systems, remediation]);

  const attention = [
    ...(metrics.highRisk > 0 ? [`${metrics.highRisk} high-risk systems require active governance`] : []),
    ...(metrics.review > 0 ? [`${metrics.review} systems are currently under review`] : []),
    ...(metrics.openActions > 0 ? [`${metrics.openActions} remediation actions remain open`] : []),
    ...(metrics.evidenceCoverage < 100 ? [`${100 - metrics.evidenceCoverage}% of evidence set is not yet verified`] : []),
  ].slice(0, 4);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] space-y-8 px-6 py-8 xl:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">NEURONBRIGHT</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Control Centre</h1>
          <p className="mt-2 text-sm text-white/35">Your organisation&apos;s current AI governance posture.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="AI systems" value={String(systems.length)} detail={`${metrics.highRisk} high risk`} icon={<Boxes size={17} />} />
          <MetricCard label="Governance posture" value={`${metrics.governance}%`} detail={`${metrics.review} systems under review`} icon={<CheckCircle2 size={17} />} />
          <MetricCard label="Evidence coverage" value={`${metrics.evidenceCoverage}%`} detail={`${evidenceSeed.length - evidenceSeed.filter((item) => item.status === "Verified").length} pending in evidence set`} icon={<FileCheck2 size={17} />} />
          <MetricCard label="Open actions" value={String(metrics.openActions)} detail="remediation items" icon={<ListChecks size={17} />} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div><h2 className="text-sm font-medium">AI systems</h2><p className="mt-1 text-xs text-white/25">Live inventory with governance posture.</p></div>
              <Link href="/systems" className="flex items-center gap-1 text-xs text-[#dc6b27]">View inventory <ArrowUpRight size={13} /></Link>
            </div>
            <div className="divide-y divide-white/[0.07]">
              {systems.slice(0, 6).map((system) => (
                <Link key={system.id} href={`/systems/${system.id}`} className="grid grid-cols-1 gap-4 px-5 py-5 hover:bg-white/[0.025] md:grid-cols-[1fr_130px_100px_90px]">
                  <div><p className="text-sm font-medium">{system.name}</p><p className="mt-1 text-xs text-white/25">{system.department} · {system.owner}</p></div>
                  <div><p className="text-[9px] uppercase tracking-wider text-white/20">Risk</p><div className="mt-1"><StatusBadge status={system.risk} /></div></div>
                  <div><p className="text-[9px] uppercase tracking-wider text-white/20">Evidence</p><p className="mt-2 text-xs text-white/60">{system.evidence}%</p></div>
                  <div><p className="text-[9px] uppercase tracking-wider text-white/20">Status</p><div className="mt-1"><StatusBadge status={system.status} /></div></div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.08] px-5 py-4"><h2 className="text-sm font-medium">Attention required</h2><p className="mt-1 text-xs text-white/25">Live governance signals</p></div>
            <div className="space-y-1 p-3">
              {attention.length ? attention.map((item) => <div key={item} className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/[0.03]"><AlertTriangle size={15} className="shrink-0 text-[#dc6b27]"/><span className="text-xs text-white/55">{item}</span></div>) : <div className="px-3 py-8 text-xs text-emerald-400">No immediate governance signals.</div>}
            </div>
            <div className="border-t border-white/[0.08] p-4"><Link href="/actions" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90">Open Action Centre <ArrowUpRight size={13} /></Link></div>
          </section>
        </div>

        <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
          <div className="flex items-start justify-between gap-5">
            <div><p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Governance posture</p><h2 className="mt-3 text-lg font-medium">{metrics.governance}% organisation readiness</h2><p className="mt-1 text-xs text-white/30">A composite operational signal based on inventory risk, evidence coverage and outstanding remediation.</p></div>
            <span className="rounded-full border border-[#dc6b27]/20 bg-[#dc6b27]/10 px-3 py-1 text-[10px] font-medium text-[#dc6b27]">Live</span>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27] transition-all" style={{ width: `${metrics.governance}%` }} /></div>
          <div className="mt-4 flex flex-wrap gap-5 text-[10px] text-white/25"><span>Inventory: {systems.length}</span><span>High risk: {metrics.highRisk}</span><span>Evidence: {metrics.evidenceCoverage}%</span><span>Open actions: {metrics.openActions}</span></div>
        </section>
      </div>
    </AppShell>
  );
}
