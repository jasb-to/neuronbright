import Link from "next/link";

export function Brand() {
  return (
    <Link
      href="/dashboard"
      className="group flex items-center gap-3"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dc6b27] text-sm font-black text-black transition-transform group-hover:scale-105">
        N
      </div>

      <div>
        <div className="text-sm font-bold tracking-[0.18em] text-white">
          NEURONBRIGHT
        </div>

        <div className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/30">
          AI Governance Infrastructure
        </div>
      </div>
    </Link>
  );
}
