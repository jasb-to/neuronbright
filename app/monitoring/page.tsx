"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Boxes, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";
import { getStoredSystems } from "@/lib/client-store";
import type { AISystem } from "@/lib/types";

export default function MonitoringPage() {
  const [stored, setStored] = useState<AISystem[]>([]);
  useEffect(() => setStored(getStoredSystems()), []);

  const systems = useMemo(() => [...stored, ...aiSystems.filter((item) => !stored.some((saved) => saved.id === item.id))], [stored]);
  const highRisk = systems.filter((s) => s.risk === "High").length;
  const review = systems.filter((s) => s.status === "Review").length;
  const avgEvidence = systems.length ? Math.round(systems.reduce((sum, s) => sum + s.evidence, 0) / systems.length) : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] px-6 py-8 xl:px-8">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Governance intelligence</p>
        <h1 className="mt-2 text-2xl font-semibold">Organisation monitoring</h1>
        <p className="mt-2 text-sm text-white/35">A live view of AI risk, evidence and governance exposure across the inventory.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["AI systems", systems.length, Boxes],
            ["High risk", highRisk, AlertTriangle],
            ["Require review", review, Activity],
            ["Evidence coverage", `${avgEvidence}%`, ShieldCheck],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
              <div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[0.15em] text-white/25">{label as string}</span><Icon size={16} className="text-[#dc6b27]" /></div>
              <p className="mt-4 text-3xl font-semibold">{value as string | number}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] p-5"><h2 className="text-sm font-medium">AI governance inventory</h2><p className="mt-1 text-xs text-white/25">Prioritise systems requiring governance attention.</p></div>
          <div className="divide-y divide-white/[0.07]">
            {systems.map((system) => (
              <div key={system.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_140px_140px_120px] md:items-center">
                <div><Link href={`/systems/${system.id}`} className="text-sm font-medium hover:text-[#dc6b27]">{system.name}</Link><p className="mt-1 text-xs text-white/25">{system.owner} · {system.department}</p></div>
                <StatusBadge status={system.risk} />
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Evidence</p><p className="mt-1 text-sm text-white/60">{system.evidence}%</p></div>
                <StatusBadge status={system.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
