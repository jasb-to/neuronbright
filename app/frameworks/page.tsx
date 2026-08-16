"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { frameworks, type FrameworkId, type FrameworkStatus } from "@/lib/frameworks";
import { aiSystems } from "@/lib/mock-data";

function statusFor(index:number, systemRisk:string):FrameworkStatus { if(systemRisk === "High" && index === 1) return "Gap"; if(index === 2) return "Partial"; return "Covered"; }
export default function FrameworksPage(){
 const [selected,setSelected]=useState<FrameworkId>("EU_AI_ACT");
 const framework=frameworks.find(f=>f.id===selected)??frameworks[0];
 const system=aiSystems[0];
 const results=useMemo(()=>framework.requirements.map((r,i)=>({...r,status:statusFor(i,system.risk)})),[framework,system.risk]);
 const covered=results.filter(r=>r.status==="Covered").length; const score=Math.round((results.reduce((n,r)=>n+(r.status==="Covered"?100:r.status==="Partial"?50:0),0)/results.length));
 return <AppShell><div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
  <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Governance intelligence</p><h1 className="mt-2 text-2xl font-semibold">Framework mapping</h1><p className="mt-2 text-sm text-white/35">Map AI governance requirements to controls and evidence.</p>
  <div className="mt-8 grid gap-5 lg:grid-cols-[300px_1fr]">
   <aside className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-3">{frameworks.map(f=><button key={f.id} onClick={()=>setSelected(f.id)} className={`mb-2 w-full rounded-lg p-4 text-left ${selected===f.id?"bg-[#dc6b27]/10 border border-[#dc6b27]/30":"border border-transparent hover:bg-white/[0.025]"}`}><p className="text-sm font-medium">{f.name}</p><p className="mt-1 text-xs leading-5 text-white/25">{f.description}</p></button>)}</aside>
   <main><div className="rounded-xl border border-[#dc6b27]/25 bg-[#dc6b27]/[0.05] p-6"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-[9px] uppercase tracking-[0.15em] text-[#dc6b27]">Coverage</p><h2 className="mt-1 text-lg font-semibold">{framework.name}</h2><p className="mt-1 text-xs text-white/30">Assessment against {system.name}</p></div><div className="text-right"><p className="text-4xl font-semibold">{score}%</p><p className="text-[9px] uppercase tracking-[0.12em] text-white/25">{covered}/{results.length} covered</p></div></div></div>
   <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><div className="border-b border-white/[0.08] p-5"><h2 className="text-sm font-medium">Requirements & mapped controls</h2></div><div className="divide-y divide-white/[0.07]">{results.map(r=><div key={r.id} className="p-5"><div className="flex flex-col justify-between gap-4 md:flex-row"><div className="flex gap-4"><div className="mt-0.5">{r.status==="Covered"?<CheckCircle2 size={17} className="text-[#dc6b27]"/>:<CircleAlert size={17} className="text-[#dc6b27]"/>}</div><div><div className="flex items-center gap-3"><span className="text-[9px] uppercase tracking-[0.14em] text-white/25">{r.code}</span><span className="text-sm font-medium">{r.title}</span></div><p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">{r.description}</p></div></div><span className="h-fit rounded-md border border-white/[0.08] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/35">{r.status}</span></div><div className="mt-4 ml-9 grid gap-3 md:grid-cols-2"><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Mapped control</p><p className="mt-1 text-xs text-white/55">{r.mappedControl}</p></div><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Evidence</p><p className="mt-1 text-xs text-white/45">{r.evidence.join(" · ")}</p></div></div></div>)}</div></div>
   <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><ShieldCheck size={18} className="mt-0.5 text-[#dc6b27]"/><p className="text-xs leading-5 text-white/35"><span className="text-white/60">Important:</span> framework mapping is a governance aid, not legal advice. Applicability depends on the organisation, system and deployment context.</p></div>
   </main>
  </div></div></AppShell>;
}
