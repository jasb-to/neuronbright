"use client";

import Link from "next/link";
import { CheckCircle2, CircleAlert, FileCheck2, FileText, Plus, Search, ShieldCheck, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { evidenceItems as seedEvidence } from "@/lib/mock-data";

type Evidence = (typeof seedEvidence)[number];
const STORAGE_KEY = "neuronbright:evidence";

function loadEvidence(): Evidence[] {
  if (typeof window === "undefined") return seedEvidence;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedEvidence;
  } catch { return seedEvidence; }
}

export default function EvidencePage() {
  const [items, setItems] = useState<Evidence[]>(loadEvidence);
  const [query, setQuery] = useState("");

  function persist(next: Evidence[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addEvidence() {
    const name = window.prompt("Evidence name");
    if (!name?.trim()) return;
    const system = window.prompt("AI system this evidence supports", "Unassigned") || "Unassigned";
    const next: Evidence = {
      id: `EV-${String(items.length + 1).padStart(3, "0")}`,
      name: name.trim(), source: "NEURONBRIGHT", system,
      status: "Pending", date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    persist([next, ...items]);
  }

  function toggleStatus(id: string) {
    persist(items.map((item) => item.id === id ? { ...item, status: item.status === "Verified" ? "Pending" : "Verified" } : item));
  }

  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.system} ${item.source}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const verified = items.filter((x) => x.status === "Verified").length;
  const pending = items.length - verified;
  const coverage = items.length ? Math.round((verified / items.length) * 100) : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Assurance</p><h1 className="mt-2 text-2xl font-semibold">Evidence Centre</h1><p className="mt-2 text-sm text-white/35">The evidence behind your AI governance decisions.</p></div>
          <button onClick={addEvidence} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90"><Upload size={14}/>Add evidence</button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Total evidence", items.length, "registered artefacts"],["Verified", verified, "evidence accepted"],["Pending review", pending, "awaiting validation"],["Coverage", `${coverage}%`, "verified evidence"]].map(([label,value,sub], i) => <div key={label} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className={`mt-3 text-3xl font-semibold ${i === 1 ? "text-emerald-400" : i === 2 ? "text-yellow-400" : "text-white"}`}>{value}</p><p className="mt-2 text-[10px] text-white/25">{sub}</p></div>)}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3"><Search size={15} className="text-white/25"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search evidence..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"/></div>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5 flex items-center gap-3"><FileCheck2 size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Evidence register</p><p className="mt-1 text-xs text-white/25">Every governance claim should be traceable to supporting evidence.</p></div></div>
          <div className="divide-y divide-white/[0.07]">
            {filtered.map((item) => <div key={item.id} className="px-6 py-5"><div className="grid gap-5 lg:grid-cols-[80px_1fr_220px_130px_130px] lg:items-center"><span className="font-mono text-[10px] text-white/20">{item.id}</span><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]"><FileText size={15} className="text-white/35"/></div><div><p className="text-sm font-medium text-white/70">{item.name}</p><p className="mt-1 text-[10px] text-white/20">Source: {item.source}</p></div></div><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">AI system</p><p className="mt-1 text-xs text-white/50">{item.system}</p></div><button onClick={() => toggleStatus(item.id)} className="text-left">{item.status === "Verified" ? <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400"><CheckCircle2 size={13}/>Verified</span> : <span className="inline-flex items-center gap-1.5 text-[10px] text-yellow-400"><CircleAlert size={13}/>Pending</span>}</button><div className="text-right"><p className="text-xs text-white/40">{item.date}</p><p className="mt-1 text-[10px] text-white/20">Click status to update</p></div></div></div>)}
            {!filtered.length && <div className="px-6 py-12 text-center text-sm text-white/30">No evidence matches your search.</div>}
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2"><div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6"><div className="flex items-start gap-4"><ShieldCheck size={20} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Evidence health</p><p className="mt-2 text-xs leading-5 text-white/30">Verified evidence currently covers {coverage}% of the registered evidence set.</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27]" style={{width:`${coverage}%`}}/></div></div></div></div><Link href="/controls" className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6 transition hover:border-[#dc6b27]/30"><Plus size={19} className="text-[#dc6b27]"/><p className="mt-5 text-sm font-medium">Close a governance gap</p><p className="mt-2 text-xs leading-5 text-white/30">Review controls with missing evidence and assign remediation actions.</p></Link></div>
      </div>
    </AppShell>
  );
}
