"use client";

import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Clock3, FileCheck2, LockKeyhole, RotateCcw, ShieldCheck, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Stage = "Specified" | "Authorized" | "Implemented" | "Executing" | "Verified" | "Effective" | "Maintained";

type Event = {
  stage: Stage;
  date: string;
  actor: string;
  basis: string;
  status: "passed" | "warning" | "failed";
};

const stages: Stage[] = [
  "Specified",
  "Authorized",
  "Implemented",
  "Executing",
  "Verified",
  "Effective",
  "Maintained",
];

const baseEvents: Event[] = [
  { stage: "Specified", date: "04 Aug 2026", actor: "Governance policy", basis: "Human approval required before consequential output is released.", status: "passed" },
  { stage: "Authorized", date: "05 Aug 2026", actor: "AI Risk Committee", basis: "Control approved for the diagnostic workflow.", status: "passed" },
  { stage: "Implemented", date: "06 Aug 2026", actor: "Workflow engine", basis: "Release gate blocks routing without physician review.", status: "passed" },
  { stage: "Executing", date: "17 Aug 2026", actor: "Runtime telemetry", basis: "9,842 of 10,000 consequential outputs recorded a review event.", status: "warning" },
  { stage: "Verified", date: "17 Aug 2026", actor: "NEURONBRIGHT", basis: "Production evidence matched review events against released outputs.", status: "warning" },
  { stage: "Effective", date: "17 Aug 2026", actor: "NEURONBRIGHT", basis: "Control effectiveness is 98.4%, below the 100% target.", status: "failed" },
  { stage: "Maintained", date: "Pending", actor: "Awaiting revalidation", basis: "A control cannot remain effective while its target is breached.", status: "warning" },
];

function statusClasses(status: Event["status"]) {
  if (status === "passed") return "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300";
  if (status === "failed") return "border-red-400/20 bg-red-400/[0.05] text-red-300";
  return "border-yellow-400/20 bg-yellow-400/[0.05] text-yellow-300";
}

export default function AssurancePage() {
  const [failed, setFailed] = useState(true);
  const [revalidated, setRevalidated] = useState(false);

  const events = useMemo(() => {
    if (revalidated) {
      return baseEvents.map((event) => event.stage === "Effective" ? { ...event, basis: "Revalidation passed after remediation. 10,000 of 10,000 outputs recorded a review event.", status: "passed" as const } : event.stage === "Maintained" ? { ...event, date: "18 Aug 2026", actor: "NEURONBRIGHT", basis: "Revalidation completed after the runtime exception was closed.", status: "passed" as const } : event);
    }
    return baseEvents;
  }, [revalidated]);

  const effectiveness = revalidated ? 100 : failed ? 98.4 : 100;
  const missing = revalidated ? 0 : failed ? 158 : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]"><ShieldCheck size={13} /> Continuous assurance</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Prove the control is actually working.</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/35">A working prototype of the NEURONBRIGHT assurance layer: move beyond policy and attestations to execution, verification, effectiveness and maintenance.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.14em] ${failed && !revalidated ? "border-red-400/20 bg-red-400/[0.05] text-red-300" : "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${failed && !revalidated ? "bg-red-400" : "bg-emerald-400"}`} />
              {failed && !revalidated ? "Control degraded" : "Control effective"}
            </span>
          </div>
        </div>

        <section className="mt-7 grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className={`rounded-xl border p-5 ${failed && !revalidated ? "border-red-400/20 bg-red-400/[0.04]" : "border-emerald-400/20 bg-emerald-400/[0.04]"}`}>
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Control effectiveness</p>
            <div className="mt-3 flex items-end gap-3"><p className={`text-4xl font-semibold ${failed && !revalidated ? "text-red-300" : "text-emerald-300"}`}>{effectiveness}%</p><p className="pb-1 text-xs text-white/30">target 100%</p></div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full ${failed && !revalidated ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${effectiveness}%` }} /></div>
            <p className="mt-3 text-xs text-white/35">{missing === 0 ? "All consequential outputs have a recorded physician review." : `${missing} consequential outputs have no matching physician review event.`}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-white/25">System</p><p className="mt-3 text-sm font-medium">Diagnostic Assistant</p><p className="mt-2 text-xs text-white/25">High-risk · Production</p></div>
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Evidence window</p><p className="mt-3 text-sm font-medium">17 Aug 2026</p><p className="mt-2 text-xs text-white/25">10,000 production decisions</p></div>
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Verification latency</p><p className="mt-3 text-sm font-medium">38 seconds</p><p className="mt-2 text-xs text-white/25">telemetry → exception</p></div>
        </section>

        <section className="mt-5 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><p className="text-[9px] uppercase tracking-[0.16em] text-[#dc6b27]">Control lifecycle</p><h2 className="mt-2 text-lg font-semibold">Human review before consequential output</h2><p className="mt-1 text-xs text-white/25">CTRL-HO-001 · Evidence-backed lifecycle state</p></div><button onClick={() => { setFailed(!failed); setRevalidated(false); }} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/45 hover:text-white"><Zap size={13} /> Simulate {failed ? "healthy state" : "control failure"}</button></div>

          <div className="mt-7 overflow-x-auto pb-2"><div className="flex min-w-[900px] items-start">
            {stages.map((stage, index) => {
              const event = events[index];
              const isCurrentFailure = event.status === "failed" || (stage === "Executing" && failed && !revalidated);
              return <div key={stage} className="flex flex-1 items-start">
                <div className="min-w-0 flex-1"><div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${isCurrentFailure ? "border-red-400/40 bg-red-400/10 text-red-300" : event.status === "warning" ? "border-yellow-400/30 bg-yellow-400/[0.06] text-yellow-300" : "border-emerald-400/25 bg-emerald-400/[0.05] text-emerald-300"}`}>{event.status === "passed" ? <CheckCircle2 size={17} /> : event.status === "failed" ? <AlertTriangle size={17} /> : <Clock3 size={16} />}</div><p className="mt-3 text-center text-[10px] font-medium text-white/60">{stage}</p><p className="mt-1 text-center text-[9px] leading-4 text-white/20">{event.date}</p></div>
                {index < stages.length - 1 && <div className="mt-5 h-px flex-1 bg-white/[0.08]" />}
              </div>;
            })}
          </div></div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
            <div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[0.16em] text-white/20">Evidence ledger</p><h2 className="mt-2 text-lg font-semibold">Every transition leaves a record</h2></div><span className="text-[10px] text-white/20">{events.length} lifecycle events</span></div>
            <div className="mt-5 divide-y divide-white/[0.06]">{events.map((event) => <div key={event.stage} className="grid gap-3 py-4 md:grid-cols-[105px_1fr_100px] md:items-start"><div className="flex items-center gap-2"><FileCheck2 size={14} className="text-white/20" /><span className="text-[10px] uppercase tracking-[0.12em] text-white/45">{event.stage}</span></div><div><p className="text-xs text-white/65">{event.basis}</p><p className="mt-1 text-[10px] text-white/20">{event.actor} · {event.date}</p></div><span className={`justify-self-start rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] ${statusClasses(event.status)}`}>{event.status}</span></div>)}</div>
          </div>

          <div className="space-y-5">
            <div className={`rounded-xl border p-6 ${failed && !revalidated ? "border-red-400/20 bg-red-400/[0.04]" : "border-emerald-400/20 bg-emerald-400/[0.04]"}`}>
              <div className="flex items-center gap-2"><AlertTriangle size={16} className={failed && !revalidated ? "text-red-300" : "text-emerald-300"} /><p className="text-[9px] uppercase tracking-[0.16em] text-white/35">Governance decision</p></div>
              <h3 className="mt-3 text-base font-semibold">{failed && !revalidated ? "Revalidation required" : "Control restored"}</h3>
              <p className="mt-2 text-xs leading-5 text-white/35">{failed && !revalidated ? "The control is implemented, but production evidence shows it is not fully effective. The system should not silently retain an Effective state." : "Remediation evidence has been rechecked and the control has returned to Effective."}</p>
              {failed && !revalidated ? <button onClick={() => setRevalidated(true)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-medium text-white hover:brightness-110"><RotateCcw size={14} /> Run revalidation</button> : <div className="mt-5 flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 size={15} /> Revalidation passed</div>}
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><p className="text-[9px] uppercase tracking-[0.16em] text-white/20">What this proves</p><div className="mt-4 space-y-3"><div className="flex gap-3"><LockKeyhole size={15} className="mt-0.5 shrink-0 text-white/25" /><p className="text-xs leading-5 text-white/40">Policy status is separated from runtime effectiveness.</p></div><div className="flex gap-3"><Activity size={15} className="mt-0.5 shrink-0 text-white/25" /><p className="text-xs leading-5 text-white/40">Telemetry can create an exception instead of waiting for an audit.</p></div><div className="flex gap-3"><ArrowRight size={15} className="mt-0.5 shrink-0 text-white/25" /><p className="text-xs leading-5 text-white/40">A change can force revalidation rather than leaving a stale green status.</p></div></div></div>
          </div>
        </section>

        <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#dc6b27]/15 bg-[#dc6b27]/[0.03] px-4 py-3 text-[10px] text-white/30"><Zap size={13} className="text-[#dc6b27]" /> Prototype mode: the telemetry is simulated. The next product step is connecting these lifecycle states to real production evidence.</div>
      </div>
    </AppShell>
  );
}
