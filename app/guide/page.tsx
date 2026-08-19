import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleHelp, RefreshCw, ShieldAlert } from "lucide-react";

const statuses = [
  ["Green", "Control operating", "Evidence is current and the control is behaving as expected.", CheckCircle2, "text-emerald-400"],
  ["Amber", "Attention required", "Something needs review, but there is not yet a confirmed material control failure.", AlertTriangle, "text-amber-400"],
  ["Red", "Control failure", "A required control is failing, missing, or has insufficient assurance.", ShieldAlert, "text-red-400"],
  ["Unknown", "Insufficient evidence", "NEURONBRIGHT cannot currently establish whether the control is operating.", CircleHelp, "text-white/50"],
  ["Revalidation", "Previous assurance may no longer apply", "A material change has invalidated the assumptions behind the previous assessment.", RefreshCw, "text-[#dc6b27]"],
] as const;

export default function GuidePage() {
  return <main className="min-h-screen bg-[#070707] text-white"><header className="border-b border-white/[0.08]"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><Link href="/" className="font-semibold tracking-tight">NEURON<span className="text-[#dc6b27]">BRIGHT</span></Link><Link href="/dashboard" className="rounded-lg bg-[#dc6b27] px-4 py-2 text-sm font-semibold text-black">Open platform</Link></div></header>
    <section className="mx-auto max-w-6xl px-6 py-20"><p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">Guide</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em]">Badges, statuses and what to do next.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/45">You should not need a training course to understand NEURONBRIGHT. The interface uses a small set of signals to tell you what is healthy, what needs attention and where evidence is missing.</p>
      <div className="mt-14 space-y-3">{statuses.map(([name,title,text,Icon,colour])=><div key={name} className="flex gap-5 rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6"><Icon size={21} className={colour}/><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-medium">{name}</h2><span className="text-xs text-white/25">{title}</span></div><p className="mt-2 text-sm leading-6 text-white/40">{text}</p></div></div>)}</div>
      <div className="mt-16 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="font-medium">Risk</h2><p className="mt-2 text-sm leading-6 text-white/40">How much governance attention a system requires based on its use, impact and applicable obligations.</p></div><div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="font-medium">Evidence</h2><p className="mt-2 text-sm leading-6 text-white/40">The record supporting an assertion: what was checked, when, against which control or policy, and by whom or what system.</p></div><div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="font-medium">Owner</h2><p className="mt-2 text-sm leading-6 text-white/40">The person or team responsible for responding when a control, evidence requirement or revalidation event needs attention.</p></div></div>
    </section></main>;
}
