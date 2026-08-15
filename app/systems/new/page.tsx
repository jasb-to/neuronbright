"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  Database,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";

const steps = [
  {
    number: "01",
    title: "Identity",
    description: "What is the system?",
    icon: Bot,
  },
  {
    number: "02",
    title: "Purpose",
    description: "What does it do?",
    icon: FileText,
  },
  {
    number: "03",
    title: "Data",
    description: "What does it access?",
    icon: Database,
  },
  {
    number: "04",
    title: "Ownership",
    description: "Who is accountable?",
    icon: Users,
  },
];

export default function NewAISystemPage() {
  const [step, setStep] = useState(1);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] px-6 py-8 xl:px-8">
        <Link
          href="/systems"
          className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to AI systems
        </Link>

        <div className="mt-7">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
            AI system intake
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Add an AI system
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
            Create a governed record for an AI system before it enters or
            continues operating within your organisation.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-4">
            <p className="px-3 pb-4 text-[9px] uppercase tracking-[0.18em] text-white/20">
              Assessment
            </p>

            <div className="space-y-1">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const active = index + 1 === step;
                const completed = index + 1 < step;

                return (
                  <button
                    key={item.number}
                    onClick={() => setStep(index + 1)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                      active
                        ? "bg-[#dc6b27]/10 text-[#dc6b27]"
                        : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        active
                          ? "border-[#dc6b27]/40 bg-[#dc6b27]/10"
                          : completed
                            ? "border-[#dc6b27]/20 bg-[#dc6b27]/5"
                            : "border-white/[0.08]"
                      }`}
                    >
                      {completed ? (
                        <ShieldCheck size={15} />
                      ) : (
                        <Icon size={15} />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-medium">
                        {item.number} · {item.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-white/20">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                Governance outcome
              </p>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Your answers will be used to determine the system&apos;s
                initial risk profile and required governance controls.
              </p>
            </div>
          </aside>

          <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                    Step {step} of 4
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    {steps[step - 1].title}
                  </h2>
                </div>

                <div className="text-xs text-white/25">
                  {Math.round((step / 4) * 100)}%
                </div>
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#dc6b27] transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-white/55">
                      AI system name
                    </label>
                    <input
                      placeholder="e.g. Customer Support Copilot"
                      className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm text-white outline-none transition focus:border-[#dc6b27]/50"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/55">
                        Provider
                      </label>
                      <input
                        placeholder="e.g. Microsoft, OpenAI, Internal"
                        className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm text-white outline-none focus:border-[#dc6b27]/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/55">
                        Model / technology
                      </label>
                      <input
                        placeholder="e.g. GPT-5, Claude, Custom ML"
                        className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm text-white outline-none focus:border-[#dc6b27]/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/55">
                      Deployment type
                    </label>

                    <div className="mt-2 grid gap-3 sm:grid-cols-3">
                      {[
                        "Internal",
                        "Third-party SaaS",
                        "Customer-facing",
                      ].map((option) => (
                        <button
                          key={option}
                          className="rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-left text-xs text-white/45 transition hover:border-[#dc6b27]/40 hover:text-white"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-white/55">
                      Primary purpose
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe what the AI system is used for..."
                      className="mt-2 w-full resize-none rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm leading-6 text-white outline-none focus:border-[#dc6b27]/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/55">
                      Does the system influence decisions about people?
                    </label>

                    <div className="mt-2 grid gap-3 sm:grid-cols-3">
                      {["No", "Assists a human", "Makes recommendations"].map(
                        (option) => (
                          <button
                            key={option}
                            className="rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-left text-xs text-white/45 transition hover:border-[#dc6b27]/40 hover:text-white"
                          >
                            {option}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-white/55">
                      Data processed by the system
                    </label>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[
                        "Customer data",
                        "Employee data",
                        "Financial information",
                        "Health information",
                        "Source code",
                        "Public information",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-xs text-white/45 hover:border-[#dc6b27]/30"
                        >
                          <input
                            type="checkbox"
                            className="accent-[#dc6b27]"
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/55">
                      Does the system process sensitive or restricted data?
                    </label>

                    <div className="mt-2 flex gap-3">
                      {["Yes", "No", "Unknown"].map((option) => (
                        <button
                          key={option}
                          className="rounded-lg border border-white/[0.08] bg-[#080808] px-5 py-3 text-xs text-white/45 hover:border-[#dc6b27]/40 hover:text-white"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-white/55">
                      Business owner
                    </label>
                    <input
                      placeholder="Name of accountable owner"
                      className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm text-white outline-none focus:border-[#dc6b27]/50"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/55">
                        Department
                      </label>
                      <input
                        placeholder="e.g. Customer Operations"
                        className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm text-white outline-none focus:border-[#dc6b27]/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/55">
                        Technical owner
                      </label>
                      <input
                        placeholder="Name of technical owner"
                        className="mt-2 w-full rounded-lg border border-white/[0.08] bg-[#080808] px-4 py-3 text-sm text-white outline-none focus:border-[#dc6b27]/50"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#dc6b27]/20 bg-[#dc6b27]/5 p-4">
                    <div className="flex items-start gap-3">
                      <Building2
                        size={17}
                        className="mt-0.5 text-[#dc6b27]"
                      />
                      <div>
                        <p className="text-xs font-medium text-white">
                          Accountability matters
                        </p>
                        <p className="mt-1 text-xs leading-5 text-white/35">
                          Every registered AI system should have a named
                          business owner who can approve its continued use.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-xs text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                >
                  Back
                </button>

                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link
                    href="/systems"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black hover:opacity-90"
                  >
                    Create AI system
                    <ShieldCheck size={14} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
