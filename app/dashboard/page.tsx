import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] space-y-8 px-6 py-8 xl:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
            NEURONBRIGHT
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Control Centre
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Your organisation's current AI governance posture.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="AI systems"
            value="47"
            detail="12 providers discovered"
            icon={<Boxes size={17} />}
          />

          <MetricCard
            label="High risk"
            value="8"
            detail="3 require immediate review"
            icon={<AlertTriangle size={17} />}
          />

          <MetricCard
            label="Evidence"
            value="1,842"
            detail="94% currently verified"
            icon={<FileCheck2 size={17} />}
          />

          <MetricCard
            label="Governance posture"
            value="87%"
            detail="Up 4.2% this month"
            icon={<CheckCircle2 size={17} />}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div>
                <h2 className="text-sm font-medium">
                  AI systems
                </h2>

                <p className="mt-1 text-xs text-white/25">
                  Recently monitored systems
                </p>
              </div>

              <Link
                href="/systems"
                className="flex items-center gap-1 text-xs text-[#dc6b27]"
              >
                View inventory
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {aiSystems.slice(0, 4).map((system) => (
                <Link
                  key={system.id}
                  href={`/systems/${system.id}`}
                  className="grid grid-cols-1 gap-4 px-5 py-5 hover:bg-white/[0.025] md:grid-cols-[1fr_130px_100px_90px]"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {system.name}
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      {system.department} · {system.owner}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/20">
                      Risk
                    </p>

                    <div className="mt-1">
                      <StatusBadge status={system.risk} />
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/20">
                      Evidence
                    </p>

                    <p className="mt-2 text-xs text-white/60">
                      {system.evidence}%
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/20">
                      Status
                    </p>

                    <div className="mt-1">
                      <StatusBadge status={system.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.08] px-5 py-4">
              <h2 className="text-sm font-medium">
                Attention required
              </h2>

              <p className="mt-1 text-xs text-white/25">
                Governance items requiring action
              </p>
            </div>

            <div className="space-y-1 p-3">
              {[
                "3 systems are missing owners",
                "2 controls have no evidence",
                "1 high-risk review is overdue",
                "14 evidence items are pending",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/[0.03]"
                >
                  <AlertTriangle
                    size={15}
                    className="shrink-0 text-[#dc6b27]"
                  />

                  <span className="text-xs text-white/55">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                Evidence posture
              </p>

              <h2 className="mt-3 text-lg font-medium">
                94% of required evidence verified
              </h2>

              <p className="mt-1 text-xs text-white/30">
                1,725 verified · 117 pending
              </p>
            </div>

            <span className="rounded-full border border-[#dc6b27]/20 bg-[#dc6b27]/10 px-3 py-1 text-[10px] font-medium text-[#dc6b27]">
              Healthy
            </span>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[94%] rounded-full bg-[#dc6b27]" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
