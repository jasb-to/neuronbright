import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "@/components/brand";

const capabilities = [
  {
    icon: Database,
    title: "Discover",
    text: "Build a living inventory of the AI systems operating across your organisation.",
  },
  {
    icon: ShieldCheck,
    title: "Assess",
    text: "Understand risk, ownership, controls and governance obligations.",
  },
  {
    icon: Activity,
    title: "Monitor",
    text: "Continuously track changes across your AI estate and governance posture.",
  },
  {
    icon: FileCheck2,
    title: "Prove",
    text: "Turn governance activity into structured, audit-ready evidence.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <nav className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Brand />

          <Link
            href="/dashboard"
            className="rounded-lg bg-[#dc6b27] px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
          >
            View platform
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#dc6b27]/[0.06] blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-28">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dc6b27]/20 bg-[#dc6b27]/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#dc6b27]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dc6b27]" />

              AI Governance Infrastructure
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
              Know what AI is happening.
              <br />

              <span className="text-white/35">
                Prove how it is governed.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/45">
              NEURONBRIGHT gives organisations a continuously updated view
              of their AI estate, governance controls and evidence — without
              the manual audit scramble.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Explore NEURONBRIGHT
                <ArrowRight size={16} />
              </Link>

              <span className="text-xs text-white/25">
                AI governance infrastructure
              </span>
            </div>
          </div>

          <div className="mt-28 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-[#0b0b0b] p-7 hover:bg-[#0f0f0f]"
                >
                  <Icon
                    size={20}
                    className="text-[#dc6b27]"
                  />

                  <h2 className="mt-8 font-medium">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/20">
            NEURONBRIGHT
          </p>

          <p className="text-xs text-white/20">
            AI Governance Infrastructure
          </p>
        </div>
      </footer>
    </main>
  );
}
