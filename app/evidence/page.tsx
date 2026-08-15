import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { evidenceItems } from "@/lib/mock-data";

export default function EvidencePage() {
  const verified = evidenceItems.filter(
    (item) => item.status === "Verified",
  ).length;

  const pending = evidenceItems.filter(
    (item) => item.status === "Pending",
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-6 py-8 xl:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
              Assurance
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Evidence Centre
            </h1>

            <p className="mt-2 text-sm text-white/35">
              The evidence behind your AI governance decisions.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90">
            <Upload size={14} />
            Upload evidence
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Total evidence
            </p>
            <p className="mt-3 text-3xl font-semibold">
              128
            </p>
            <p className="mt-2 text-[10px] text-white/25">
              across 47 AI systems
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
              Verified
            </p>
            <p className="mt-3 text-3xl font-semibold text-emerald-400">
              {verified + 121}
            </p>
            <p className="mt-2 text-[10px] text-emerald-400">
              evidence accepted
            </p>
          </div>

          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/[0.03] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-yellow-400/70">
              Pending review
            </p>
            <p className="mt-3 text-3xl font-semibold text-yellow-400">
              {pending + 2}
            </p>
            <p className="mt-2 text-[10px] text-white/25">
              awaiting validation
            </p>
          </div>

          <div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#dc6b27]/70">
              Evidence gaps
            </p>
            <p className="mt-3 text-3xl font-semibold text-[#dc6b27]">
              14
            </p>
            <p className="mt-2 text-[10px] text-white/25">
              controls need evidence
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3">
            <Search size={15} className="text-white/25" />
            <input
              placeholder="Search evidence..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3 text-xs text-white/40 hover:text-white">
            <Filter size={14} />
            Filter
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center gap-3">
              <FileCheck2
                size={17}
                className="text-[#dc6b27]"
              />

              <div>
                <p className="text-sm font-medium">
                  Evidence register
                </p>
                <p className="mt-1 text-xs text-white/25">
                  Every governance claim should be traceable to supporting
                  evidence.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {evidenceItems.map((item) => (
              <div
                key={item.id}
                className="px-6 py-5 transition hover:bg-white/[0.02]"
              >
                <div className="grid gap-5 lg:grid-cols-[90px_1fr_220px_150px_130px] lg:items-center">
                  <span className="font-mono text-[10px] text-white/20">
                    {item.id}
                  </span>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                      <FileText
                        size={15}
                        className="text-white/35"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white/70">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[10px] text-white/20">
                        Source: {item.source}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                      AI system
                    </p>

                    <Link
                      href={`/systems/${evidenceItems.find(
                        (candidate) => candidate.name === item.name,
                      )?.id ?? ""}`}
                      className="mt-1 block text-xs text-white/50 hover:text-[#dc6b27]"
                    >
                      {item.system}
                    </Link>
                  </div>

                  <div>
                    {item.status === "Verified" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <CheckCircle2 size={13} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-yellow-400">
                        <CircleAlert size={13} />
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/40">
                      {item.date}
                    </p>
                    <button className="mt-1 text-[10px] text-white/20 hover:text-[#dc6b27]">
                      View evidence
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck
                size={20}
                className="text-[#dc6b27]"
              />

              <div>
                <p className="text-sm font-medium">
                  Evidence health
                </p>

                <p className="mt-2 text-xs leading-5 text-white/30">
                  Your current evidence coverage is strong, but 14 controls
                  still require supporting artefacts before they can be
                  considered fully evidenced.
                </p>

                <div className="mt-5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/25">
                      Overall coverage
                    </span>
                    <span className="text-white/50">
                      89%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#dc6b27]"
                      style={{ width: "89%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/controls"
            className="group rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6 transition hover:border-[#dc6b27]/30"
          >
            <div className="flex items-start justify-between">
              <Plus
                size={19}
                className="text-[#dc6b27]"
              />

              <ArrowUpRight
                size={15}
                className="text-white/20 transition group-hover:text-[#dc6b27]"
              />
            </div>

            <p className="mt-5 text-sm font-medium">
              Close a governance gap
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Review controls with missing evidence and assign remediation
              actions to accountable owners.
            </p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
