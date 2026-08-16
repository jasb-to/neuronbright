"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Clock3, ListChecks } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { loadRemediation, saveRemediation, type RemediationStatus } from "@/lib/remediation-store";

function isOverdue(date: string, status: RemediationStatus) {
  return status !== "Complete" && new Date(`${date}T23:59:59`).getTime() < Date.now();
}

export default function ActionsPage() {
  const [items, setItems] = useState(loadRemediation);

  function updateStatus(id: string, status: RemediationStatus) {
    setItems(saveRemediation(items.map((item) => item.id === id ? { ...item, status } : item)));
  }

  const summary = useMemo(() => ({
    open: items.filter((x) => x.status === "Open").length,
    progress: items.filter((x) => x.status === "In progress").length,
    complete: items.filter((x) => x.status === "Complete").length,
    overdue: items.filter((x) => isOverdue(x.dueDate, x.status)).length,
  }), [items]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Remediation</p>
        <h1 className="mt-2 text-2xl font-semibold">Action Centre</h1>
        <p className="mt-2 text-sm text-white/35">Turn governance gaps into accountable actions.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Open",summary.open,"text-[#dc6b27]"],["In progress",summary.progress,"text-yellow-400"],["Complete",summary.complete,"text-emerald-400"],["Overdue",summary.overdue,"text-[#dc6b27]"]].map(([label,value,color]) => (
            <div key={label} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p>
              <p className={`mt-3 text-3xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5 flex items-center gap-3"><ListChecks size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Governance actions</p><p className="mt-1 text-xs text-white/25">Every open gap has an owner, deadline and next action.</p></div></div>
          <div className="divide-y divide-white/[0.07]">
            {items.map((item) => {
              const overdue = isOverdue(item.dueDate, item.status);
              return (
                <div key={item.id} className="px-6 py-5">
                  <div className="grid gap-5 lg:grid-cols-[90px_1fr_150px_130px_150px] lg:items-center">
                    <span className="font-mono text-[10px] text-white/20">{item.id}</span>
                    <div><p className="text-sm font-medium text-white/75">{item.title}</p><p className="mt-1 text-xs leading-5 text-white/30">{item.description}</p><div className="mt-2 flex flex-wrap gap-2"><span className="rounded border border-white/[0.07] px-2 py-1 text-[9px] text-white/25">{item.system}</span><span className="rounded border border-white/[0.07] px-2 py-1 text-[9px] text-white/25">{item.control}</span><span className="rounded border border-white/[0.07] px-2 py-1 text-[9px] text-white/25">{item.framework}</span></div></div>
                    <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Owner</p><p className="mt-1 text-xs text-white/55">{item.owner}</p></div>
                    <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Due</p><p className={`mt-1 text-xs ${overdue ? "text-[#dc6b27]" : "text-white/55"}`}>{item.dueDate}</p>{overdue && <p className="mt-1 text-[9px] text-[#dc6b27]">Overdue</p>}</div>
                    <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Status</p><select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value as RemediationStatus)} className="mt-2 w-full rounded-lg border border-white/[0.08] bg-black px-2.5 py-2 text-xs text-white/60 outline-none focus:border-[#dc6b27]/50"><option>Open</option><option>In progress</option><option>Complete</option></select></div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-white/25">{item.status === "Complete" ? <CheckCircle2 size={13} className="text-emerald-400"/> : overdue ? <CircleAlert size={13} className="text-[#dc6b27]"/> : <Clock3 size={13} className="text-yellow-400"/>}{item.status === "Complete" ? "Remediation complete" : overdue ? "Immediate attention required" : "Action remains open"}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
