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
  SystemAssessmentForm,
} from "@/lib/system-assessment";

type Step = 1 | 2 | 3 | 4 | 5;

const steps = [
  {
    number: 1,
    title: "Identity",
    description: "What is the system?",
  },
  {
    number: 2,
    title: "Purpose",
    description: "How is it being used?",
  },
  {
    number: 3,
    title: "People",
    description: "Who could it affect?",
  },
  {
    number: 4,
    title: "Exposure",
    description: "Data, autonomy and scale",
  },
  {
    number: 5,
    title: "Assessment",
    description: "Generate governance plan",
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

const decisionOptions = [
  {
    value: "Assistance only",
    label: "Assistance only",
    description: "Provides information or suggestions without materially influencing a decision.",
  },
  {
    value: "Recommendation",
    label: "Recommendation",
    description: "Recommends an action, option or outcome to a human.",
  },
  {
    value: "Decision support",
    label: "Decision support",
    description: "Materially supports a human decision or assessment.",
  },
  {
    value: "Automated decision",
    label: "Automated decision",
    description: "Can make or execute a decision with limited human intervention.",
  },
];

const oversightOptions = [
  {
    value: "Meaningful review",
    label: "Meaningful human review",
    description: "A person reviews outputs and can meaningfully challenge or override them.",
  },
  {
    value: "Review available",
    label: "Human review available",
    description: "A person can review outputs, although review may not happen every time.",
  },
  {
    value: "Limited review",
    label: "Limited human review",
    description: "Human involvement exists but intervention is limited.",
  },
  {
    value: "No meaningful review",
    label: "No meaningful human review",
    description: "The system operates with little or no meaningful human intervention.",
  },
];

const affectedOptions = [
  "General population",
  "Employees",
  "Customers",
  "Job applicants",
  "Children",
  "Patients",
  "Vulnerable people",
];

const deploymentOptions = [
  {
    value: "Internal",
    label: "Internal",
    description: "Used only within the organisation.",
  },
  {
    value: "Customer-facing",
    label: "Customer-facing",
    description: "Used directly by or on behalf of customers.",
  },
  {
    value: "Public-facing",
    label: "Public-facing",
    description: "Available to members of the public.",
  },
];

const scaleOptions = [
  {
    value: "Small",
    label: "Small",
    description: "Limited users or limited operational scope.",
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Multiple teams or a meaningful user population.",
  },
  {
    value: "Large",
    label: "Large",
    description: "Significant organisational or customer scale.",
  },
  {
    value: "Enterprise",
    label: "Enterprise",
    description: "Critical or organisation-wide deployment.",
  },
];

const sectorOptions = [
  "General business",
  "Employment",
  "Finance",
  "Healthcare",
  "Education",
  "Public sector",
  "Other",
] as const;

function riskLevel(score: number) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function riskClasses(level: string) {
  if (level === "High") {
    return "border-[#dc6b27]/40 bg-[#dc6b27]/10 text-[#dc6b27]";
  }

  if (level === "Medium") {
    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300";
  }

  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function RiskBadge({
  score,
  compact = false,
}: {
  score: number;
  compact?: boolean;
}) {
  const level = riskLevel(score);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-medium uppercase tracking-[0.12em]",
        compact
          ? "px-2 py-0.5 text-[9px]"
          : "px-2.5 py-1 text-[10px]",
        riskClasses(level),
      ].join(" ")}
    >
      {level}
    </span>
  );
}

function OptionCard({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group rounded-xl border p-4 text-left transition",
        selected
          ? "border-[#dc6b27]/50 bg-[#dc6b27]/[0.08]"
          : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16] hover:bg-white/[0.03]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={[
              "text-xs font-medium",
              selected ? "text-white" : "text-white/65",
            ].join(" ")}
          >
            {title}
          </p>

          {description && (
            <p className="mt-1.5 text-[11px] leading-5 text-white/25">
              {description}
            </p>
          )}
        </div>

        <div
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-[#dc6b27] bg-[#dc6b27] text-black"
              : "border-white/[0.15] text-transparent",
          ].join(" ")}
        >
          <Check size={12} />
        </div>
      </div>
    </button>
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
        {required && <span className="ml-1 text-[#dc6b27]">*</span>}
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
        {required && <span className="ml-1 text-[#dc6b27]">*</span>}
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

export function SystemAssessment() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<SystemAssessmentForm>(
    defaultSystemAssessment
  );

  const assessment = useMemo(() => assessSystem(form), [form]);

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

  function canContinue() {
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

    if (step === 3) {
      return Boolean(form.affectedCategory !== "Unknown");
    }

    if (step === 4) {
      return (
        form.dataTypes.length > 0 &&
        form.decisionType !== "Unknown" &&
        form.humanOversight !== "Unknown" &&
        form.deploymentType !== "Unknown" &&
        form.scale !== "Unknown"
      );
    }

    return true;
  }

  function next() {
    if (!canContinue()) return;

    setStep((current) => Math.min(5, current + 1) as Step);
  }

  function back() {
    setStep((current) => Math.max(1, current - 1) as Step);
  }

  function reset() {
    setStep(1);
    setForm(defaultSystemAssessment);
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
          Tell NEURONBRIGHT what the system does, who it affects and how it
          operates. We&apos;ll translate that information into an initial
          governance risk profile and control plan.
        </p>
      </div>

      <div className="mt-8 grid gap-2 md:grid-cols-5">
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
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
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
                      active ? "text-white" : "text-white/55",
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

            <div>
              <p className="text-xs font-medium text-white/60">
                Business sector
              </p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {sectorOptions.map((sector) => (
                  <OptionCard
                    key={sector}
                    selected={form.sector === sector}
                    title={sector}
                    onClick={() => updateField("sector", sector)}
                  />
                ))}
              </div>
            </div>
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
                <Sparkles size={17} className="text-[#dc6b27]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Step 02
                </p>

                <h2 className="mt-1 text-base font-semibold">
                  Understand the purpose
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <TextArea
              label="What is the system used for?"
              required
              value={form.purpose}
              placeholder="Describe the business purpose and what the AI system actually does..."
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
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                <UserRound size={17} className="text-[#dc6b27]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Step 03
                </p>

                <h2 className="mt-1 text-base font-semibold">
                  Who could the system affect?
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm font-medium text-white/70">
              Select the people or groups most directly affected by the
              system.
            </p>

            <p className="mt-1 text-xs text-white/25">
              This helps NEURONBRIGHT understand potential impact and
              governance exposure.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {affectedOptions.map((option) => (
                <OptionCard
                  key={option}
                  selected={form.affectedCategory === option}
                  title={option}
                  onClick={() =>
                    updateField(
                      "affectedCategory",
                      option as SystemAssessmentForm["affectedCategory"]
                    )
                  }
                />
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-white/[0.08] bg-black p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert
                  size={16}
                  className="mt-0.5 text-[#dc6b27]"
                />

                <div>
                  <p className="text-xs font-medium text-white/70">
                    Why we ask this
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Systems affecting employment, health, children,
                    vulnerable people or other consequential outcomes may
                    require more extensive governance review.
                  </p>
                </div>
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

      {step === 4 && (
        <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                <Database size={17} className="text-[#dc6b27]" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Step 04
                </p>

                <h2 className="mt-1 text-base font-semibold">
                  Data, autonomy & deployment
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6">
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

            <div>
              <p className="text-xs font-medium text-white/70">
                How much influence does the AI have?
              </p>

              <p className="mt-1 text-[11px] text-white/25">
                Choose the closest description.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {decisionOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={form.decisionType === option.value}
                    title={option.label}
                    description={option.description}
                    onClick={() =>
                      updateField(
                        "decisionType",
                        option.value as SystemAssessmentForm["decisionType"]
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-white/70">
                What human oversight exists?
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {oversightOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={form.humanOversight === option.value}
                    title={option.label}
                    description={option.description}
                    onClick={() =>
                      updateField(
                        "humanOversight",
                        option.value as SystemAssessmentForm["humanOversight"]
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-white/70">
                Where will it be deployed?
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {deploymentOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={form.deploymentType === option.value}
                    title={option.label}
                    description={option.description}
                    onClick={() =>
                      updateField(
                        "deploymentType",
                        option.value as SystemAssessmentForm["deploymentType"]
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-white/70">
                Expected deployment scale
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {scaleOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={form.scale === option.value}
                    title={option.label}
                    description={option.description}
                    onClick={() =>
                      updateField(
                        "scale",
                        option.value as SystemAssessmentForm["scale"]
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <Navigation
            onBack={back}
            onNext={next}
            nextDisabled={!canContinue()}
            nextLabel="Analyse system"
          />
        </section>
      )}

      {step === 5 && (
        <div className="mt-6 space-y-5">
          <section className="rounded-xl border border-[#dc6b27]/30 bg-[#dc6b27]/[0.05] p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#dc6b27]">
                  NEURONBRIGHT assessment
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {form.name || "AI system"}
                </h2>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
                  Based on the information provided, NEURONBRIGHT has
                  generated an initial governance risk profile and control
                  plan.
                </p>
              </div>

              <div className="text-center md:min-w-[170px]">
                <div className="text-5xl font-semibold">
                  {assessment.overallScore}
                </div>

                <div className="mt-2">
                  <RiskBadge score={assessment.overallScore} />
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

                <p className="mt-1 text-xs text-white/25">
                  The score is generated from the information you provided,
                  rather than a manually selected overall rating.
                </p>
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

                        <RiskBadge
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
              <div className="rounded-xl border border-[#dc6b27]/30 bg-[#dc6b27]/[0.06] p-6">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#dc6b27]">
                  Governance exposure
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-semibold">
                      {assessment.overallScore}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      out of 100
                    </p>
                  </div>

                  <ShieldAlert
                    size={34}
                    strokeWidth={1.5}
                    className="text-[#dc6b27]"
                  />
                </div>

                <div className="mt-5">
                  <RiskBadge score={assessment.overallScore} />
                </div>
              </div>

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
                      Controls identified
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
            </aside>
          </div>

          <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27]/10">
                  <CheckCircle2
                    size={17}
                    className="text-[#dc6b27]"
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                    What happens next
                  </p>

                  <h3 className="mt-1 text-base font-semibold">
                    Your initial governance plan
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3">
              <ResultCard
                number={controls.length}
                label="Controls identified"
                description="Governance controls that should be considered for this system."
              />

              <ResultCard
                number={
                  controls.filter(
                    (control) => control.status === "Missing"
                  ).length
                }
                label="Evidence gaps"
                description="Controls currently requiring supporting evidence."
              />

              <ResultCard
                number={
                  controls.filter(
                    (control) => control.status === "Complete"
                  ).length
                }
                label="Already satisfied"
                description="Controls currently represented as complete by the assessment engine."
              />
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium">
                  Assessment generated
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/30">
                  This is currently an assessment preview. The next product
                  layer will persist this system, its controls and its
                  evidence requirements in the organisation&apos;s governance
                  record.
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
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

function ResultCard({
  number,
  label,
  description,
}: {
  number: number;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black p-5">
      <p className="text-3xl font-semibold">{number}</p>

      <p className="mt-2 text-xs font-medium text-white/60">
        {label}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-white/25">
        {description}
      </p>
    </div>
  );
}
