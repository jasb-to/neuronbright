import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  Shield,
  SlidersHorizontal,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";

const controls = [
  {
    id: "CTRL-001",
    name: "AI system inventory",
    framework: "AI Governance",
    coverage: 100,
    status: "Healthy",
    systems: 47,
  },
  {
    id: "CTRL-002",
    name: "Named business ownership",
    framework: "Accountability",
    coverage: 91,
    status: "Healthy",
    systems: 47,
  },
  {
    id: "CTRL-003",
    name: "Human oversight",
    framework: "AI Risk",
    coverage: 68,
    status: "Attention",
    systems: 47,
  },
  {
    id: "CTRL-004",
    name: "Data protection assessment",
    framework: "Privacy",
    coverage: 74,
    status: "Attention",
    systems: 39,
  },
  {
    id: "CTRL-005",
    name: "AI risk assessment",
    framework: "AI Risk",
    coverage: 82,
    status: "Healthy",
    systems: 47,
  },
  {
    id: "CTRL-006",
    name: "Incident management",
    framework: "Operational",
    coverage: 54,
    status: "Gap",
    systems: 47,
  },
  {
    id: "CTRL-007",
    name: "Third-party AI assessment",
    framework: "Vendor Risk",
    coverage: 63,
    status: "Attention",
    systems: 28,
  },
];

function ControlStatus({ status }: { status: string }) {
  if (status === "Healthy") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400">
        <CheckCircle2 size={13} />
        Healthy
      </span>
    );
  }

  if (status === "Gap") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] text-[#dc6b27]">
        <CircleAlert size={13} />
        Gap
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] text-yellow-400">
      <CircleAlert size={13} />
      Attention
    </span>
  );
}

export default function ControlsPage() {
  const averageCoverage = Math.round(
    controls.reduce((sum, control) => sum + control.coverage, 0) /
      controls.length,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
              Governance
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Control Centre
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Organisation-wide visibility of AI governance controls.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-2.5 text-xs text-white/50 hover:text-white">
            <SlidersHorizontal size={14} />
            Configure controls
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Control coverage
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {averageCoverage}%
            </p>
            <p className="mt-2 text-[10px] text-emerald-400">
              +6% this month
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Healthy
            </p>
            <p className="mt-3 text-3xl font-semibold">
              3
            </p>
            <p className="mt-2 text-[10px] text-white/25">
              controls at target
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Attention
            </p>
            <p className="mt-3 text-3xl font-semibold text-yellow-400">
              3
            </p>
            <p className="mt-2 text-[10px] text-white/25">
              controls below target
            </p>
          </div>

          <div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#dc6b27]/70">
              Critical gaps
            </p>
            <p className="mt-3 text-3xl font-semibold text-[#dc6b27]">
              1
            </p>
            <p className="mt-2 text-[10px] text-white/25">
              immediate action required
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center gap-3">
              <Shield size={17} className="text-[#dc6b27]" />
              <div>
                <p className="text-sm font-medium">
                  Governance control library
                </p>
                <p className="mt-1 text-xs text-white/25">
                  A single control can govern multiple AI systems.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {controls.map((control) => (
              <div
                key={control.id}
                className="px-6 py-5 hover:bg-white/[0.02]"
              >
                <div className="grid gap-5 lg:grid-cols-[100px_1fr_150px_260px_90px] lg:items-center">
                  <span className="font-mono text-[10px] text-white/20">
                    {control.id}
                  </span>

                  <div>
                    <p className="text-sm font-medium text-white/75">
                      {control.name}
                    </p>
                    <p className="mt-1 text-[10px] text-white/20">
                      {control.framework}
                    </p>
                  </div>

                  <ControlStatus status={control.status} />

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/25">
                        Coverage
                      </span>
                      <span className="text-xs text-white/50">
                        {control.coverage}%
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#dc6b27]"
                        style={{
                          width: `${control.coverage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/50">
                      {control.systems}
                    </p>
                    <p className="text-[9px] text-white/20">
                      systems
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Link
            href="/evidence"
            className="group rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6 transition hover:border-[#dc6b27]/30"
          >
            <div className="flex items-start justify-between">
              <FileCheck2
                size={20}
                className="text-[#dc6b27]"
              />
              <ArrowUpRight
                size={15}
                className="text-white/20 transition group-hover:text-[#dc6b27]"
              />
            </div>

            <p className="mt-5 text-sm font-medium">
              Evidence coverage
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              See which controls have sufficient evidence and which require
              remediation.
            </p>
          </Link>

          <div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#dc6b27]">
              Governance signal
            </p>

            <p className="mt-3 text-sm font-medium">
              Human oversight is your largest control gap.
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              32% of registered systems do not currently have sufficient
              evidence demonstrating documented human oversight.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
