import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  Shield,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { aiSystems } from "@/lib/mock-data";

const controls = [
  {
    id: "CTRL-001",
    name: "Named business owner",
    framework: "AI Governance",
    status: "Implemented",
    evidence: "Owner record",
  },
  {
    id: "CTRL-002",
    name: "Documented intended purpose",
    framework: "AI Governance",
    status: "Implemented",
    evidence: "System record",
  },
  {
    id: "CTRL-003",
    name: "Human oversight procedure",
    framework: "AI Risk",
    status: "Gap",
    evidence: "Missing",
  },
  {
    id: "CTRL-004",
    name: "Data protection assessment",
    framework: "Privacy",
    status: "Review",
    evidence: "Pending",
  },
  {
    id: "CTRL-005",
    name: "AI system risk assessment",
    framework: "AI Risk",
    status: "Implemented",
    evidence: "Risk assessment",
  },
  {
    id: "CTRL-006",
    name: "Incident management process",
    framework: "AI Governance",
    status: "Gap",
    evidence: "Missing",
  },
];

function ControlStatus({ status }: { status: string }) {
  if (status === "Implemented") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400">
        <CheckCircle2 size={13} />
        Implemented
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
      Review
    </span>
  );
}

export default async function SystemControlsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const system = aiSystems.find((item) => item.id === id) ?? aiSystems[1];

  const implemented = controls.filter(
    (control) => control.status === "Implemented",
  ).length;

  const gaps = controls.filter(
    (control) => control.status === "Gap",
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
        <Link
          href={`/systems/${system.id}`}
          className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to {system.name}
        </Link>

        <div className="mt-7">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
            Governance controls
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Control set
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Controls required to govern {system.name}.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Total controls
            </p>
            <p className="mt-3 text-2xl font-semibold">
              {controls.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Implemented
            </p>
            <p className="mt-3 text-2xl font-semibold text-emerald-400">
              {implemented}
            </p>
          </div>

          <div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#dc6b27]/70">
              Governance gaps
            </p>
            <p className="mt-3 text-2xl font-semibold text-[#dc6b27]">
              {gaps}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center gap-3">
              <Shield size={17} className="text-[#dc6b27]" />
              <div>
                <p className="text-sm font-medium">
                  Required controls
                </p>
                <p className="mt-1 text-xs text-white/25">
                  Each control should have an accountable owner and supporting
                  evidence.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {controls.map((control) => (
              <div
                key={control.id}
                className="px-6 py-5 transition hover:bg-white/[0.02]"
              >
                <div className="grid gap-4 lg:grid-cols-[100px_1fr_150px_180px] lg:items-center">
                  <span className="text-[10px] font-mono text-white/20">
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
                    <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                      Evidence
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        control.evidence === "Missing"
                          ? "text-[#dc6b27]"
                          : "text-white/45"
                      }`}
                    >
                      {control.evidence}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <FileCheck2
                size={19}
                className="mt-0.5 text-[#dc6b27]"
              />

              <div>
                <p className="text-sm font-medium">
                  2 controls require evidence
                </p>
                <p className="mt-1 text-xs leading-5 text-white/30">
                  Upload or connect evidence to close the outstanding
                  governance gaps.
                </p>
              </div>
            </div>

            <Link
              href="/evidence"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90"
            >
              Open Evidence Centre
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
