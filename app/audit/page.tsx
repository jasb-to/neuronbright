"use client";

import { useEffect, useState } from "react";
import { Activity, Clock3, FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type AuditEvent={id:string;action:string;entity_type:string;entity_id:string|null;metadata:Record<string,unknown>;created_at:string;user_id:string|null};

export default function AuditPage(){
 const [events,setEvents]=useState<AuditEvent[]>([]); const [error,setError]=useState("");
 useEffect(()=>{fetch("/api/audit",{cache:"no-store"}).then(r=>r.json()).then(p=>{setEvents(p.events??[]);setError(p.error??"")}).catch(()=>setError("Unable to load audit log."))},[]);
 return <AppShell><div className="mx-auto max-w-[1200px] px-6 py-8 xl:px-8"><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Assurance</p><h1 className="mt-2 text-2xl font-semibold">Audit trail</h1><p className="mt-2 text-sm text-white/35">A chronological record of governance activity across the organisation.</p>{error&&<div className="mt-5 rounded-lg border border-[#dc6b27]/20 bg-[#dc6b27]/[0.05] p-3 text-xs text-[#dc6b27]">{error}</div>}<section className="mt-8 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]"><div className="border-b border-white/[0.08] p-5 flex items-center gap-3"><Activity size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Activity history</p><p className="mt-1 text-xs text-white/25">Up to the latest 100 organisation events.</p></div></div><div className="divide-y divide-white/[0.07]">{events.map(event=><div key={event.id} className="grid gap-4 px-5 py-4 md:grid-cols-[160px_140px_1fr_180px] md:items-center"><div className="flex items-center gap-2 text-[10px] text-white/30"><Clock3 size={13} className="text-white/20"/>{new Date(event.created_at).toLocaleString("en-GB")}</div><span className="rounded-md border border-white/[0.07] px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-white/35 w-fit">{event.entity_type}</span><div><p className="text-sm text-white/65">{event.action}</p><p className="mt-1 text-[10px] text-white/25">{event.entity_id??"Organisation activity"}</p></div><div className="text-xs text-white/30">{event.metadata?.name ? String(event.metadata.name) : event.metadata?.title ? String(event.metadata.title) : <span className="flex items-center gap-2"><FileText size={13}/>Governance event</span>}</div></div>)}{!events.length&&<div className="p-12 text-center text-sm text-white/30">No audit activity recorded yet.</div>}</div></section></div></AppShell>;
}
