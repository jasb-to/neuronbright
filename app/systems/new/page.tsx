"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Database,
  FileCheck2,
  Gauge,
  LockKeyhole,
  ShieldAlert,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

import {
  assessSystem,
  defaultSystemAssessment,
  getControlsForSystem,
  getRiskDescription,
  SystemAssessmentForm,
} from "@/lib/system-assessment";

type Step = 1 | 2 | 3 | 4;

const steps = [
  {
    number: 1,
    title: "Identity",
    description: "Tell us what the system is.",
  },
  {
    number: 2,
    title: "Purpose",
    description: "Understand how it is used.",
  },
  {
    number: 3,
    title: "Risk",
    description: "Assess governance exposure.",
  },
  {
    number: 4,
    title: "Result",
    description: "Generate the governance plan.",
  },
];

const dataOptions = [
  "Names and contact details",
  "Employee information",
  "Customer information",
  "Financial information",
  "Health information",
  "Behavioural data",
  "Performance data",
  "CVs and employment history",
  "Public information",
  "Internal business information",
];

const riskQuestions = [
  {
    key: "impactOnIndividuals" as const,
    title: "Impact on individuals",
    description:
      "How significantly could this system affect people through its outputs or recommendations?",
  },
  {
    key: "dataSensitivity" as const,
    title: "Data sensitivity",
    description:
      "How sensitive or consequential is the information processed by the system?",
  },
  {
    key: "autonomy" as const,
    title: "Autonomy",
    description:
      "How much influence does the system have without meaningful human intervention?",
  },
  {
    key: "scaleOfDeployment" as const,
    title: "Scale of deployment",
    description:
      "How widely is the system deployed across users, teams or customers?",
  },
  {
    key: "regulatoryExposure" as const,
    title: "Regulatory exposure",
    description:
      "How likely is the intended use to create additional regulatory or governance requirements?",
  },
];

function RiskLevel({
  score,
  compact = false,
}: {
  score: number;
  compact?: boolean;
}) {
  const level =
    score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]",
        level === "High"
          ? "border-[#dc6b27]/40 bg-[#dc6b27]/10 text-[#dc6b27]"
          : level === "Medium"
            ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
            : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        compact ? "px-2 py-0.5" : "",
      ].join(" ")}
    >
      {level}
    </span>
  );
}

function ScoreSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-5">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#dc6b27]"
      />

      <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.12em] text-white/20">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
}

export function SystemAssessment() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<SystemAssessmentForm>(
    defaultSystemAssessment
  );

  const assessment = useMemo(
    () => assessSystem(form),
    [form]
  );

  const controls = useMemo(
    () => getControlsForSystem(form),
    [form]
  );

  function updateField<K extends keyof SystemAssessmentForm>(
    field: K,
    value: SystemAssessmentForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleDataType(value: string) {
    setForm((current) => {
      const exists = current.dataTypes.includes(value);

      return {
        ...current,
        dataTypes: exists
          ? current.dataTypes.filter((item) => item !== value)
          : [...current.dataTypes, value],
      };
    });
  }

  function canContinue(): boolean {
    if (step === 1) {
      return Boolean(
        form.name.trim() &&
          form.provider.trim() &&
          form.owner.trim() &&
          form.department.trim()
      );
    }

    if (step === 2) {
      return Boolean(
        form.purpose.trim() &&
          form.users.trim() &&
          form.affectedPeople.trim()
      );
    }

    return true;
  }

  function next() {
    if (!canContinue()) {
      return;
    }

    setStep((current) =>
      Math.min(4, current + 1) as Step
    );
  }

  function back() {
    setStep((current) =>
      Math.max(1, current - 1) as Step
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 xl:px-8">
      <Link
        href="/systems"
        className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to AI systems
      </Link>

      <div className="mt-7">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">
          New AI system
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Assess an AI system
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          Give NEURONBRIGHT enough context to understand the system,
          assess its governance exposure and generate the controls and
          evidence it may require.
        </p>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        {steps.map((item) => {
          const active = item.number === step;
          const complete = item.number < step;

          return (
            <div
              key={item.number}
              className={[
                "rounded-xl border p-4 transition",
                active
                  ? "border-[#dc6b27]/40 bg-[#dc6b27]/[0.06]"
                  : complete
                    ? "border-emerald-400/20 bg-emerald-400/[0.03]"
                    : "border-white/[0.08] bg-[#0b0b0b]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold",
                    active
                      ? "bg-[#dc6b27] text-black"
                      : complete
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "bg-white/[0.06] text-white/30",
                  ].join(" ")}
                >
                  {complete ? <Check size={13} /> : item.number}
                </div>

                <div>
                  <p
                    className={[
                      "text-xs font-medium",
                      active
                        ? "text-white"
                        : "text-white/55",
                    ].join(" ")}
                  >
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/20">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                <Gauge size={17} className="text-[#dc6b27]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Step 01
                </p>
                <h2 className="mt-1 text-base font-semibold">
                  Identify the system
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <Field
              label="System name"
              required
              value={form.name}
              placeholder="e.g. AI Recruitment Assistant"
              onChange={(value) => updateField("name", value)}
            />

            <Field
              label="Provider"
              required
              value={form.provider}
              placeholder="e.g. OpenAI"
              onChange={(value) => updateField("provider", value)}
            />

            <Field
              label="Model / product"
              value={form.model}
              placeholder="e.g. GPT-5"
              onChange={(value) => updateField("model", value)}
            />

            <Field
              label="Business owner"
              required
              value={form.owner}
              placeholder="e.g. Sarah Jones"
              onChange={(value) => updateField("owner", value)}
            />

            <Field
              label="Department"
              required
              value={form.department}
              placeholder="e.g. People & Culture"
              onChange={(value) => updateField("department", value)}
            />
          </div>

          <Navigation
            onBack={back}
            onNext={next}
            nextDisabled={!canContinue()}
            showBack={false}
          />
        </section>
      )}

      {step === 2 && (
        <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                <Database size={17} className="text-[#dc6b27]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Step 02
                </p>
                <h2 className="mt-1 text-base font-semibold">
                  Understand how it is used
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <TextArea
              label="What is the system used for?"
              required
              value={form.purpose}
              placeholder="Describe the business purpose and what the AI system does..."
              onChange={(value) => updateField("purpose", value)}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <TextArea
                label="Who uses the system?"
                required
                value={form.users}
                placeholder="e.g. HR recruiters and hiring managers"
                onChange={(value) => updateField("users", value)}
              />

              <TextArea
                label="Who could be affected by its outputs?"
                required
                value={form.affectedPeople}
                placeholder="e.g. job applicants and candidates"
                onChange={(value) =>
                  updateField("affectedPeople", value)
                }
              />
            </div>

            <TextArea
              label="What decisions or outcomes can it influence?"
              value={form.decisions}
              placeholder="e.g. recommends candidates for interview, but HR makes the final decision"
              onChange={(value) => updateField("decisions", value)}
            />

            <div>
              <div className="flex items-center gap-2">
                <LockKeyhole size={14} className="text-[#dc6b27]" />
                <p className="text-xs font-medium text-white/70">
                  What types of data does it process?
                </p>
              </div>

              <p className="mt-1 text-[11px] text-white/25">
                Select everything that applies.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {dataOptions.map((option) => {
                  const selected = form.dataTypes.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDataType(option)}
                      className={[
                        "rounded-lg border px-3 py-3 text-left text-xs transition",
                        selected
                          ? "border-[#dc6b27]/40 bg-[#dc6b27]/10 text-white"
                          : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/65",
                      ].join(" ")}
                    >
                      <span className="flex items-center justify-between gap-3">
                        {option}
                        {selected && (
                          <Check
                            size={13}
                            className="shrink-0 text-[#dc6b27]"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Navigation
            onBack={back}
            onNext={next}
            nextDisabled={!canContinue()}
          />
        </section>
      )}

      {step === 3 && (
        <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                  <ShieldAlert
                    size={17}
                    className="text-[#dc6b27]"
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                    Step 03
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    Assess governance exposure
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                  Live score
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl font-semibold">
                    {assessment.overallScore}
                  </span>
                  <RiskLevel score={assessment.overallScore} />
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {riskQuestions.map((question) => {
              const value = form[question.key];

              return (
                <div key={question.key} className="p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-medium text-white/75">
                        {question.title}
                      </p>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-white/30">
                        {question.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-semibold">
                        {value}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                        / 100
                      </p>
                    </div>
                  </div>

                  <ScoreSlider
                    value={value}
                    onChange={(nextValue) =>
                      updateField(question.key, nextValue)
                    }
                  />

                  <div className="mt-3 flex justify-end">
                    <RiskLevel score={value} compact />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/[0.08] bg-[#dc6b27]/[0.04] px-6 py-5">
            <div className="flex items-start gap-3">
              <Sparkles
                size={16}
                className="mt-0.5 shrink-0 text-[#dc6b27]"
              />

              <div>
                <p className="text-xs font-medium">
                  NEURONBRIGHT assessment
                </p>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-white/35">
                  {getRiskDescription(assessment.overallScore)}
                </p>
              </div>
            </div>
          </div>

          <Navigation
            onBack={back}
            onNext={next}
            nextLabel="Generate governance plan"
          />
        </section>
      )}

      {step === 4 && (
        <div className="mt-6 space-y-5">
          <section className="rounded-xl border border-[#dc6b27]/30 bg-[#dc6b27]/[0.05] p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#dc6b27]">
                  Assessment complete
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {form.name || "AI system"}
                </h2>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
                  NEURONBRIGHT has translated the information provided
                  into an initial governance profile.
                </p>
              </div>

              <div className="text-center md:min-w-[150px]">
                <div className="text-5xl font-semibold">
                  {assessment.overallScore}
                </div>

                <div className="mt-2">
                  <RiskLevel score={assessment.overallScore} />
                </div>

                <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/20">
                  Governance risk
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
            <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
              <div className="border-b border-white/[0.08] px-6 py-5">
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Risk profile
                </p>

                <h3 className="mt-1 text-base font-semibold">
                  Five governance dimensions
                </h3>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {assessment.dimensions.map((dimension) => (
                  <div
                    key={dimension.name}
                    className="px-6 py-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-white/65">
                        {dimension.name}
                      </p>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          {dimension.score}
                        </span>

                        <RiskLevel
                          score={dimension.score}
                          compact
                        />
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#dc6b27]"
                        style={{
                          width: `${dimension.score}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-white/25">
                      {dimension.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                    <FileCheck2
                      size={17}
                      className="text-[#dc6b27]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                      Governance plan
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Controls required
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-4xl font-semibold">
                    {controls.length}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    governance controls identified
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {controls.slice(0, 5).map((control) => (
                    <div
                      key={control.id}
                      className="flex items-start gap-3"
                    >
                      <CircleAlert
                        size={14}
                        className="mt-0.5 shrink-0 text-[#dc6b27]"
                      />

                      <span className="text-xs leading-5 text-white/45">
                        {control.name}
                      </span>
                    </div>
                  ))}

                  {controls.length > 5 && (
                    <p className="pt-1 text-[10px] text-white/20">
                      + {controls.length - 5} additional controls
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  System owner
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                    <UserRound
                      size={16}
                      className="text-white/40"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/70">
                      {form.owner}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/20">
                      {form.department}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium">
                  Initial assessment generated
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/30">
                  This assessment is currently a preview. The next
                  NEURONBRIGHT layer will persist the system, controls
                  and evidence requirements in the organisation&apos;s
                  governance record.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setForm(defaultSystemAssessment);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-5 py-2.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <ArrowLeft size={14} />
                Assess another system
              </button>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/systems"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-5 py-2.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Return to systems
            </Link>

            <Link
              href="/evidence"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black transition hover:opacity-90"
            >
              View evidence
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-white/60">
        {label}
        {required && (
          <span className="ml-1 text-[#dc6b27]">*</span>
        )}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-black px-3 text-xs text-white outline-none placeholder:text-white/15 transition focus:border-[#dc6b27]/50"
      />
    </label>
  );
}

function TextArea({
  label,
  required,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-white/60">
        {label}
        {required && (
          <span className="ml-1 text-[#dc6b27]">*</span>
        )}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border border-white/[0.08] bg-black px-3 py-3 text-xs leading-5 text-white outline-none placeholder:text-white/15 transition focus:border-[#dc6b27]/50"
      />
    </label>
  );
}

function Navigation({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Continue",
  showBack = true,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-5">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={[
          "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition",
          nextDisabled
            ? "cursor-not-allowed bg-white/[0.06] text-white/20"
            : "bg-[#dc6b27] text-black hover:opacity-90",
        ].join(" ")}
      >
        {nextLabel}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
