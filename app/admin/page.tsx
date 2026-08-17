import { headers } from "next/headers";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export const dynamic = "force-dynamic";

type Health = {
  overall: "online" | "degraded" | "offline";
  checks: Record<string, { status: "online" | "degraded" | "offline"; detail: string }>;
  response_ms: number;
  checked_at: string;
};

async function getHealth(): Promise<Health | null> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";
  if (!host) return null;

  const response = await fetch(`${protocol}://${host}/api/admin/health`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function AdminPage() {
  const access = await requirePlatformAdmin();
  if (!access.ok) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">NEURONBRIGHT Control Plane</p>
          <h1 className="mt-3 text-2xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-white/40">{access.reason}</p>
        </div>
      </main>
    );
  }

  const health = await getHealth();
  const overall = health?.overall ?? "offline";

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-white xl:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc6b27]">Internal platform operations</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Control Plane</h1>
            <p className="mt-2 text-sm text-white/35">Operational view of the NEURONBRIGHT production platform.</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs">
            <span className={`h-2 w-2 rounded-full ${overall === "online" ? "bg-emerald-400" : overall === "degraded" ? "bg-amber-400" : "bg-red-400"}`} />
            <span className="uppercase tracking-[0.15em] text-white/55">{overall}</span>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(health?.checks ?? {}).map(([name, check]) => (
            <div key={name} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.16em] text-white/25">{name}</span>
                <span className={`h-2 w-2 rounded-full ${check.status === "online" ? "bg-emerald-400" : check.status === "degraded" ? "bg-amber-400" : "bg-red-400"}`} />
              </div>
              <p className="mt-4 text-sm font-medium capitalize">{check.status}</p>
              <p className="mt-2 text-xs leading-5 text-white/30">{check.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">Runtime</p>
            <h2 className="mt-2 text-lg font-semibold">Production health</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Environment</p><p className="mt-2 text-sm">Production</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Response</p><p className="mt-2 text-sm">{health?.response_ms ?? "—"} ms</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Checked</p><p className="mt-2 text-sm">{health?.checked_at ? new Date(health.checked_at).toLocaleString("en-GB") : "—"}</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Platform admin</p><p className="mt-2 text-sm">{access.user.email}</p></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#dc6b27]/25 bg-[#dc6b27]/[0.05] p-6">
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#dc6b27]">Next operational layer</p>
            <h2 className="mt-2 text-lg font-semibold">Observability</h2>
            <p className="mt-3 text-sm leading-6 text-white/40">Deployment history, error rates, audit events, organisation health and feature flags will live here as the platform scales.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
