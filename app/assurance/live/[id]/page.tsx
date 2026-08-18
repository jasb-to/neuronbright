"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, ArrowLeft, CheckCircle2, CircleDashed, Clock3, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const stages = ["Specified", "Authorized", "Implemented", "Executing", "Verified", "Effective", "Maintained"] as const;

type Event = { id: string; stage: string; actor: string; basis: string; evidenceRef?: string | null; observedAt: string; metadata?: Record<string, unknown> };
type Control = { id: string; external_id: string; name: string; owner?: string | null; target_percent: number; runtime_expected_events: number; runtime_observed_events: number; last_change_at?: string | null; last_verified_at?: string | null; last_effective_at?: string | null; evaluation?: { state: string; effectiveness: number | null; reason: string }; events: Event[] };

function formatDate(value?: string | null) { return value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Not recorded"; }

export default function AssuranceControlDetail({ params }: { params: Promise<{ id: string }> }) {
  const [control, setControl] = useState<Control | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { params.then(({ id }) => fetch(`/api/assurance/${id}`, { cache: "no-store" }).then(async r => { const body = await r.json(); if (!r.ok) throw new Error(body.error ?? "Unable to load control."); setControl(body.control); }).catch((e: Error) => setError(e.message))); }, [params]);

  if (error) return <AppShell><main className="mx-auto max-w-[1000px] px-6 py-10"><p className="text-sm text-red-300">{error}</p></main></AppShell>;
  if (!control) return <AppShell><main className="mx-auto max-w-[1000px] px-6 py-10 text-sm text-white/35">Loading control assurance…</main></AppShell>;

  const evaluation = control.evaluation;
  const state = evaluation?.state ?? "UNKNOWN";
  const completed = new Set(control.events.map(e => e.stage));
  const stateTone = state === "GREEN" ? "text-emerald-300 border-emerald-400/20 bg-emerald-400/[0.04]" : state === "RED" || state === "REVALIDATION_REQUIRED" ? "text-red-300 border-red-400/20 bg-red-400/[0.04]" : state === "AMBER" ? "text-yellow-300 border-yellow-400/20 bg-yellow-400/[0.04]" : "text-white/45 border-white/[0.08] bg-white/[0.02]";

  return <AppShell><main className="mx-auto max-w-[1100px] px-6 py-10 xl:px-8">
    <Link href="/assurance/live" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/30 hover:text-white/60"><ArrowLeft size={13}/> Back to live assurance</Link>
    <div className="mt-6 border-b border-white/[0.08] pb-7"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[9px] uppercase tracking-[0.15em] text-[#dc6b27]">{control.external_id}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{control.name}</h1><p className="mt-2 text-sm text-white/35">Control owner: {control.owner ?? "Unassigned"}</p></div><div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.14em] ${stateTone}`}><Activity size={14}/>{state.replaceAll("_", " ")}</div></div></div>

    <section className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Effectiveness</p><p className="mt-2 text-3xl font-semibold">{evaluation?.effectiveness == null ? "—" : `${evaluation.effectiveness.toFixed(1)}%`}</p><p className="mt-2 text-xs text-white/30">Target {Number(control.target_percent).toFixed(1)}%</p></div><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Runtime population</p><p className="mt-2 text-3xl font-semibold">{control.runtime_observed_events.toLocaleString()} <span className="text-base text-white/25">/ {control.runtime_expected_events.toLocaleString()}</span></p></div><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Decision</p><p className="mt-2 text-xs leading-5 text-white/45">{evaluation?.reason}</p></div></section>

    <section className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex items-center gap-2"><ShieldAlert size={15} className="text-[#dc6b27]"/><h2 className="text-sm font-semibold">Control lifecycle</h2></div><div className="mt-7 grid gap-3 md:grid-cols-7">{stages.map((stage, index) => { const done = completed.has(stage); return <div key={stage} className="relative"><div className={`flex min-h-[86px] flex-col justify-between rounded-lg border p-3 ${done ? "border-emerald-400/20 bg-emerald-400/[0.035]" : "border-white/[0.07] bg-white/[0.015]"}`}><div className="flex items-center justify-between"><span className="text-[9px] text-white/25">0{index + 1}</span>{done ? <CheckCircle2 size={14} className="text-emerald-300"/> : <CircleDashed size={14} className="text-white/20"/>}</div><span className={`text-[10px] font-medium ${done ? "text-white/70" : "text-white/25"}`}>{stage}</span></div>{index < stages.length - 1 && <span className="hidden md:block absolute -right-2 top-10 h-px w-1/4 bg-white/10"/>}</div>; })}</div></section>

    <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.35fr]"><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><h2 className="text-sm font-semibold">Assurance timestamps</h2><div className="mt-5 space-y-4 text-xs"><div><p className="text-white/25">Last governed change</p><p className="mt-1 text-white/55">{formatDate(control.last_change_at)}</p></div><div><p className="text-white/25">Last verification</p><p className="mt-1 text-white/55">{formatDate(control.last_verified_at)}</p></div><div><p className="text-white/25">Last effectiveness assessment</p><p className="mt-1 text-white/55">{formatDate(control.last_effective_at)}</p></div></div></div><div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex items-center gap-2"><Clock3 size={15} className="text-[#dc6b27]"/><h2 className="text-sm font-semibold">Evidence trail</h2></div><div className="mt-5 space-y-3">{control.events.length === 0 ? <p className="text-xs text-white/25">No lifecycle evidence recorded.</p> : control.events.map(event => <div key={event.id} className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-4"><div className="flex justify-between gap-4"><span className="text-[10px] font-medium text-white/65">{event.stage}</span><span className="text-[9px] text-white/20">{formatDate(event.observedAt)}</span></div><p className="mt-2 text-xs text-white/40">{event.basis}</p><p className="mt-2 text-[10px] text-white/20">Actor: {event.actor}{event.evidenceRef ? ` · Evidence: ${event.evidenceRef}` : ""}</p></div>)}</div></div></section>
  </main></AppShell>;
}
