import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { aiSystems } from "@/lib/mock-data";

export default async function SystemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const system =
    aiSystems.find((item) => item.id === id) ??
    aiSystems[0];

  const controls = [
    {
      name: "Approved AI system",
      status: "Verified",
    },
    {
      name: "System owner assigned",
      status: "Verified",
    },
    {
      name: "Human oversight",
      status: "Verified",
    },
    {
      name: "Data classification",
      status: "Verified",
    },
    {
      name: "Risk assessment",
      status: "Pending",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1300px] px-6 py-8 xl:px-8">
        <Link
          href="/systems"
          className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-[#dc6b27]"
        >
          <ArrowLeft size={13} />
          Back to AI systems
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
              AI System
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {system.name}
            </h1>

            <p className="mt-2 text-sm text-white/35">
              {system.provider} · {system.model}
            </p>
          </div>

          <StatusBadge status={system.risk} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Owner", system.owner],
            ["Department", system.department],
            ["Provider", system.provider],
            ["Last reviewed", system.lastReviewed],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"
            >
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                {label}
              </p>

              <p className="mt-3 text-sm text-white/70">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
              <div className="border-b border-white/[0.08] p-5">
                <h2 className="text-sm font-medium">
                  System overview
                </h2>
              </div>

              <div className="p-5">
                <p className="text-sm leading-7 text-white/50">
                  {system.purpose}
                </p>

                <div className="mt-7">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Data types
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {system.dataTypes.map((dataType) => (
                      <span
                        key={dataType}
                        className="rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/45"
                      >
                        {dataType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
              <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
                <div>
                  <h2 className="text-sm font-medium">
                    Control status
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Governance controls mapped to this system
                  </p>
                </div>

                <span className="text-xs text-white/35">
                  4 / 5 verified
                </span>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {controls.map((control) => (
                  <div
                    key={control.name}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      {control.status === "Verified" ? (
                        <CheckCircle2
                          size={16}
                          className="text-[#dc6b27]"
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          className="text-amber-400"
                        />
                      )}

                      <span className="text-sm text-white/65">
                        {control.name}
                      </span>
                    </div>

                    <StatusBadge
                      status={
                        control.status as
                          | "Verified"
                          | "Pending"
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Evidence posture
                  </p>

                  <p className="mt-3 text-4xl font-semibold">
                    {system.evidence}%
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    Evidence verified
                  </p>
                </div>

                <FileCheck2
                  size={20}
                  className="text-[#dc6b27]"
                />
              </div>

              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#dc6b27]"
                  style={{
                    width: `${system.evidence}%`,
                  }}
                />
              </div>
            </section>

            <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
              <div className="border-b border-white/[0.08] p-5">
                <h2 className="text-sm font-medium">
                  Recent evidence
                </h2>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {[
                  "AI Acceptable Use Policy",
                  "Owner approval",
                  "Human oversight record",
                  "Data classification",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-5"
                  >
                    <FileCheck2
                      size={16}
                      className="text-[#dc6b27]/70"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-white/65">
                        {item}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        Verified {14 - index} Aug 2026
                      </p>
                    </div>

                    <CheckCircle2
                      size={14}
                      className="text-[#dc6b27]"
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center gap-2 rounded-xl border border-[#dc6b27]/15 bg-[#dc6b27]/[0.04] p-4">
              <Clock3
                size={16}
                className="text-[#dc6b27]"
              />

              <p className="text-xs leading-5 text-white/40">
                Next governance review scheduled for{" "}
                <span className="text-white/70">
                  14 Nov 2026
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
