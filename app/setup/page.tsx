"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Cloud, Github, KeyRound, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  { title: "Organisation", text: "Tell us who you are and what you need to govern." },
  { title: "Connect", text: "Connect the systems where your AI evidence already lives." },
  { title: "Discover", text: "NEURONBRIGHT finds systems, vendors and governance gaps." },
];

const connectors = [
  { name: "Microsoft", detail: "Entra ID, Microsoft 365, Azure and Purview", icon: Cloud, status: "Available" },
  { name: "GitHub", detail: "Repositories, owners, workflows and change evidence", icon: Github, status: "Available" },
  { name: "Jira", detail: "Workflows, approvals and remediation evidence", icon: CheckCircle2, status: "Coming next" },
];

export default function SetupPage() {
  const [connected, setConnected] = useState<string[]>([]);
  const toggle = (name: string) => setConnected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">NEURONBRIGHT setup</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Connect your organisation</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">Start with the systems you already use. We will turn the evidence they contain into a live view of your AI governance.</p></div>
          <Sparkles className="hidden text-[#dc6b27] sm:block" size={28} />
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => <div key={step.title} className={`rounded-xl border p-4 ${index === 1 ? "border-[#dc6b27]/30 bg-[#dc6b27]/[0.06]" : "border-white/[0.08] bg-white/[0.02]"}`}><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-xs text-white/60">{index + 1}</span><span className="text-sm font-medium">{step.title}</span></div><p className="mt-3 text-xs leading-5 text-white/35">{step.text}</p></div>)}
        </div>
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6 sm:p-8">
          <div className="flex items-start gap-4"><div className="rounded-xl bg-[#dc6b27]/10 p-3"><ShieldCheck className="text-[#dc6b27]" size={22} /></div><div><h2 className="text-lg font-semibold">Choose your first connections</h2><p className="mt-1 text-sm text-white/35">You can add more later. Start with the systems that contain the strongest evidence.</p></div></div>
          <div className="mt-6 space-y-3">{connectors.map((connector) => { const Icon = connector.icon; const isConnected = connected.includes(connector.name); const available = connector.status === "Available"; return <button key={connector.name} type="button" disabled={!available} onClick={() => toggle(connector.name)} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${isConnected ? "border-emerald-400/30 bg-emerald-400/[0.05]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"} ${!available ? "cursor-not-allowed opacity-50" : ""}`}><div className="flex items-center gap-4"><div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2.5"><Icon size={18} /></div><div><p className="text-sm font-medium">{connector.name}</p><p className="mt-1 text-xs text-white/35">{connector.detail}</p></div></div><span className={`text-[10px] uppercase tracking-[0.14em] ${isConnected ? "text-emerald-400" : available ? "text-[#dc6b27]" : "text-white/25"}`}>{isConnected ? "Selected" : connector.status}</span></button>; })}</div>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"><KeyRound size={16} className="text-white/35" /><p className="text-xs leading-5 text-white/35">Connections will use scoped permissions. NEURONBRIGHT should read the evidence it needs, not take control of your environment.</p></div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center"><p className="text-xs text-white/30">{connected.length ? `${connected.length} connection${connected.length === 1 ? "" : "s"} selected` : "No connections selected yet"}</p><Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-3 text-sm font-medium text-black hover:brightness-110">Continue to discovery <ArrowRight size={16} /></Link></div>
        </section>
        <p className="mt-5 text-center text-[11px] text-white/20">Need help? Your administrator can configure connections later in Settings.</p>
      </div>
    </main>
  );
}
