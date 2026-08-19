import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2, CircleAlert, CircleHelp, FileCheck2, RefreshCw, ShieldCheck } from "lucide-react";

const steps = [
  ["Connect", "Bring your organisation into NEURONBRIGHT and establish the systems, owners and governance context that matter.", ShieldCheck],
  ["Discover", "Build a living inventory of AI systems rather than relying on a static spreadsheet or annual exercise.", Activity],
  ["Assess", "Classify risk and map the controls and evidence required for each system.", FileCheck2],
  ["Verify", "Test whether controls are actually operating — not simply whether somebody says they exist.", CheckCircle2],
  ["Act", "Turn failures, missing evidence and changes into clear, owned actions.", CircleAlert],
  ["Prove", "Keep the evidence trail that explains what was checked, when, against what, and what happened next.", ShieldCheck],
] as const;

export default function HowItWorksPage() {
  return <main className="min-h-screen bg-[#070707] text-white">
    <header className="border-b border-white/[0.08]"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><Link href="/" className="font-semibold tracking-tight">NEURON<span className="text-[#dc6b27]">BRIGHT</span></Link><Link href="/dashboard" className="rounded-lg bg-[#dc6b27] px-4 py-2 text-sm font-semibold text-black">Open platform</Link></div></header>
    <section className="mx-auto max-w-6xl px-6 py-20"><p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">How it works</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">From AI inventory to continuous assurance.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/45">NEURONBRIGHT turns AI governance from a collection of documents into an operating process: know what exists, know what should happen, verify what actually happened, and act when it doesn't.</p>
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 lg:grid-cols-3">{steps.map(([title,text,Icon],i)=><div key={title} className="bg-[#0b0b0b] p-7"><div className="flex items-center justify-between"><Icon size={20} className="text-[#dc6b27]"/><span className="text-xs text-white/20">0{i+1}</span></div><h2 className="mt-8 text-lg font-medium">{title}</h2><p className="mt-3 text-sm leading-6 text-white/40">{text}</p></div>)}</div>
    </section>
    <section className="border-y border-white/[0.08] bg-[#0b0b0b]"><div className="mx-auto max-w-6xl px-6 py-16"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">The principle</p><h2 className="mt-3 text-3xl font-semibold">A control is not the same thing as evidence that a control operated.</h2><p className="mt-5 max-w-3xl text-white/40 leading-7">NEURONBRIGHT is built around that distinction. A policy can say that human review is required. Assurance asks whether the review happened, whether it can be evidenced, who owns it, and what happens when the assumption changes.</p><Link href="/guide" className="mt-8 inline-flex items-center gap-2 text-sm text-[#dc6b27]">Understand the badges and statuses <ArrowRight size={15}/></Link></div></section>
  </main>;
}
