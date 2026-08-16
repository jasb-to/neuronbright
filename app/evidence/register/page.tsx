"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleAlert, FileText, Search, ShieldCheck, Upload, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";

type EvidenceStatus = "Verified" | "Pending" | "Missing";
type Evidence = { id: string; name: string; status: EvidenceStatus; framework: string | null; source: string | null; expires_at: string | null; created_at: string; ai_system_id: string | null; control_id: string | null };

function daysUntil(date: string | null) { return date ? Math.ceil((new Date(date).getTime() - Date.now()) / 86400000) : null; }
function dateLabel(date: string | null) { return date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"; }

export default function EvidenceRegisterPage() {
  const [items, setItems] = useState<Evidence[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/evidence", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to load evidence.");
      setItems(payload.evidence ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load evidence."); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function toggle(id: string, status: EvidenceStatus) {
    const next = status === "Verified" ? "Pending" : "Verified";
    const response = await fetch("/api/evidence", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: next }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) { setError(payload.error ?? "Unable to update evidence."); return; }
    setItems((current) => current.map((item) => item.id === id ? payload.evidence : item));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => `${item.name} ${item.framework ?? ""} ${item.source ?? ""}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const verified = items.filter((x) => x.status === "Verified").length;
  const pending = items.filter((x) => x.status === "Pending").length;
  const missing = items.filter((x) => x.status === "Missing").length;
  const expiring = items.filter((x) => { const d = daysUntil(x.expires_at); return d !== null && d >= 0 && d <= 30; }).length;
  const coverage = items.length ? Math.round((verified / items.length) * 100) : 0;

  return <AppShell><div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Assurance</p><h1 className="mt-2 text-2xl font-semibold">Evidence Register</h1><p className="mt-2 text-sm text-white/35">Live evidence records stored in your NEURONBRIGHT database.</p></div><Link href="/evidence/upload" className="inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90"><Upload size={14}/>Upload evidence</Link></div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Total",items.length],["Verified",verified],["Pending",pending],["Missing",missing],["Coverage",`${coverage}%`]].map(([label,value],index)=><div key={String(label)} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className={`mt-3 text-3xl font-semibold ${index===1?"text-emerald-400":index===2?"text-yellow-400":index===3?"text-[#dc6b27]":"text-white"}`}>{value}</p></div>)}</div>

    {error && <div className="mt-4 rounded-lg border border-[#dc6b27]/20 bg-[#dc6b27]/[0.05] p-3 text-xs text-[#dc6b27]">{error}</div>}

    <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4"><Search size={15} className="text-white/25"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search evidence or framework..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"/></div>{loading?<div className="px-6 py-12 text-center text-sm text-white/30">Loading evidence...</div>:<div className="divide-y divide-white/[0.07]">{filtered.map((item)=><div key={item.id} className="px-5 py-5"><div className="grid gap-4 lg:grid-cols-[70px_1fr_150px_140px] lg:items-center"><span className="font-mono text-[10px] text-white/20">{item.id.slice(0,8)}</span><div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]"><FileText size={15} className="text-white/35"/></div><div><p className="text-sm font-medium text-white/70">{item.name}</p><p className="mt-1 text-[10px] text-white/25">{item.framework ?? "Internal"} · uploaded {dateLabel(item.created_at)}</p></div></div><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Freshness</p><p className={`mt-1 text-xs ${item.expires_at && (daysUntil(item.expires_at) as number) <= 30 ? "text-[#dc6b27]":"text-white/45"}`}>{item.expires_at ? `${daysUntil(item.expires_at)} days` : "No expiry"}</p></div><button onClick={()=>toggle(item.id,item.status)} className="text-left">{item.status==="Verified"?<span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400"><CheckCircle2 size={13}/>Verified</span>:item.status==="Missing"?<span className="inline-flex items-center gap-1.5 text-[10px] text-[#dc6b27]"><XCircle size={13}/>Missing</span>:<span className="inline-flex items-center gap-1.5 text-[10px] text-yellow-400"><CircleAlert size={13}/>Pending</span>}</button></div></div>)}{!filtered.length&&<div className="px-6 py-12 text-center text-sm text-white/30">No live evidence records yet. Upload the first one.</div>}</div>}</section>

    <div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6"><div className="flex items-center gap-3"><ShieldCheck size={19} className="text-[#dc6b27]"/><p className="text-sm font-medium">Evidence-backed assurance</p></div><p className="mt-4 text-4xl font-semibold">{coverage}%</p><p className="mt-1 text-xs text-white/30">verified evidence coverage</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27]" style={{width:`${coverage}%`}}/></div></div><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">Attention</p><div className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><span className="text-white/35">Pending review</span><span className="text-yellow-400">{pending}</span></div><div className="flex justify-between"><span className="text-white/35">Missing</span><span className="text-[#dc6b27]">{missing}</span></div><div className="flex justify-between"><span className="text-white/35">Expiring within 30 days</span><span className="text-[#dc6b27]"><AlertTriangle size={12} className="mr-1 inline"/>{expiring}</span></div></div></div></div>
  </div></AppShell>;
}
