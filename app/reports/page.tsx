"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Report = { generatedAt: string; summary: { systems: number; controls: number; evidence: number; evidenceCoverage: number; openActions: number; overdueActions: number; highRiskSystems: number; vendors: number; highRiskVendors: number }; systems: { id: string; name: string; risk: string; status: string }[]; vendors: { id: string; name: string; risk: string; status: string }[] };

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const r = await fetch("/api/reports/governance", { cache: "no-store" }); if (r.ok) setReport(await r.json()); setLoading(false); };
  useEffect(() => { void load(); }, []);
  const exportJson = () => { if (!report) return; const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `neuronbright-governance-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url); };
  return <AppShell><div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Executive reporting</p><h1 className="mt-2 text-2xl font-semibold">Governance report</h1><p className="mt-2 text-sm text-white/35">Live governance posture generated from organisation data.</p></div><div className="flex gap-2"><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white"><RefreshCw size={14}/> Refresh</button><button onClick={exportJson} disabled={!report} className="inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2 text-xs font-semibold text-black disabled:opacity-30"><Download size={14}/> Export JSON</button></div></div>
    {loading ? <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-8 text-sm text-white/35">Generating live report…</div> : report ? <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["AI systems",report.summary.systems],["Evidence coverage",`${report.summary.evidenceCoverage}%`],["Open actions",report.summary.openActions],["High-risk exposure",report.summary.highRiskSystems+report.summary.highRiskVendors]].map(([l,v])=><div key={l as string} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/25">{l}</p><p className="mt-3 text-3xl font-semibold">{v}</p></div>)}</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="font-semibold">Governance posture</h2><div className="mt-5 space-y-3 text-xs text-white/45"><p>Controls: <b className="text-white/70">{report.summary.controls}</b></p><p>Evidence items: <b className="text-white/70">{report.summary.evidence}</b></p><p>Overdue actions: <b className="text-white/70">{report.summary.overdueActions}</b></p><p>Vendors: <b className="text-white/70">{report.summary.vendors}</b> · High risk: <b className="text-white/70">{report.summary.highRiskVendors}</b></p></div></section><section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="font-semibold">Systems requiring attention</h2><div className="mt-4 space-y-2">{report.systems.filter(s=>s.risk === "High" || s.risk === "Critical").slice(0,8).map(s=><div key={s.id} className="flex justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs"><span>{s.name}</span><span className="text-[#dc6b27]">{s.risk}</span></div>)}{report.systems.filter(s=>s.risk === "High" || s.risk === "Critical").length === 0 && <p className="text-xs text-white/30">No high-risk systems.</p>}</div></section></div>
      <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="font-semibold">Vendor exposure</h2><div className="mt-4 grid gap-2 md:grid-cols-2">{report.vendors.map(v=><div key={v.id} className="flex justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs"><span>{v.name}</span><span className="text-white/40">{v.risk} · {v.status}</span></div>)}</div></div>
      <p className="mt-5 text-[10px] text-white/20">Generated {new Date(report.generatedAt).toLocaleString()}</p>
    </> : <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-8 text-sm text-white/35">Unable to generate report.</div>}
  </div></AppShell>;
}
