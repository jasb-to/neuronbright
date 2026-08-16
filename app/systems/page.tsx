"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystems } from "@/lib/client-store";
import { AISystem } from "@/lib/types";

export default function SystemsPage() {
  const [stored, setStored] = useState<AISystem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => setStored(getStoredSystems()), []);

  const systems = useMemo(() => {
    const merged = [...stored, ...aiSystems.filter(item => !stored.some(saved => saved.id === item.id))];
    const q = query.trim().toLowerCase();
    return q ? merged.filter(s => `${s.name} ${s.provider} ${s.owner} ${s.department}`.toLowerCase().includes(q)) : merged;
  }, [stored, query]);

  return <AppShell><div className="mx-auto max-w-[1500px] px-6 py-8 xl:px-8">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Inventory</p><h1 className="mt-2 text-2xl font-semibold">AI Systems</h1><p className="mt-2 text-sm text-white/35">Every AI system discovered across your organisation.</p></div><Link href="/systems/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"><Plus size={15}/>Add AI system</Link></div>
    <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3"><Search size={16} className="text-white/25"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search AI systems..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"/><span className="hidden text-[10px] text-white/20 sm:block">{systems.length} systems</span></div>
    <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-white/[0.08] bg-white/[0.015] text-[9px] uppercase tracking-[0.15em] text-white/25"><tr>{["AI system","Provider","Owner","Risk","Evidence","Status"].map(x=><th key={x} className="px-5 py-4">{x}</th>)}</tr></thead><tbody className="divide-y divide-white/[0.07]">{systems.map(system=><tr key={system.id} className="hover:bg-white/[0.025]"><td className="px-5 py-5"><Link href={`/systems/${system.id}`} className="font-medium hover:text-[#dc6b27]">{system.name}</Link><p className="mt-1 text-xs text-white/25">{system.model}</p></td><td className="px-5 py-5 text-white/50">{system.provider}</td><td className="px-5 py-5"><p className="text-white/60">{system.owner}</p><p className="mt-1 text-[10px] text-white/25">{system.department}</p></td><td className="px-5 py-5"><StatusBadge status={system.risk}/></td><td className="px-5 py-5"><div className="flex items-center gap-3"><div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-[#dc6b27]" style={{width:`${system.evidence}%`}}/></div><span className="text-xs text-white/50">{system.evidence}%</span></div></td><td className="px-5 py-5"><StatusBadge status={system.status}/></td></tr>)}</tbody></table></div>
  </div></AppShell>;
}
