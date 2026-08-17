"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type VendorStatus = "Approved" | "Review" | "Blocked";
type VendorRisk = "Low" | "Medium" | "High";
type Vendor = {
  id: string;
  name: string;
  category: string;
  owner: string | null;
  risk: VendorRisk;
  status: VendorStatus;
  framework_coverage: number;
  evidence_score: number;
  last_reviewed: string | null;
  next_review_date: string | null;
};

function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const config = {
    Approved: ["border-emerald-400/25 bg-emerald-400/10 text-emerald-400", CheckCircle2],
    Review: ["border-yellow-400/25 bg-yellow-400/10 text-yellow-300", AlertTriangle],
    Blocked: ["border-[#dc6b27]/30 bg-[#dc6b27]/10 text-[#dc6b27]", AlertTriangle],
  } as const;
  const [classes, Icon] = config[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] ${classes}`}><Icon size={12}/>{status}</span>;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/vendors")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Unable to load vendors.");
        setVendors(body.vendors ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load vendors."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => vendors.filter((vendor) => `${vendor.name} ${vendor.category} ${vendor.owner ?? ""}`.toLowerCase().includes(query.toLowerCase())), [vendors, query]);
  const highRisk = vendors.filter((v) => v.risk === "High").length;
  const underReview = vendors.filter((v) => v.status === "Review").length;
  const avgCoverage = vendors.length ? Math.round(vendors.reduce((s, v) => s + v.framework_coverage, 0) / vendors.length) : 0;
  const avgEvidence = vendors.length ? Math.round(vendors.reduce((s, v) => s + v.evidence_score, 0) / vendors.length) : 0;

  async function cycleStatus(vendor: Vendor) {
    const next: VendorStatus = vendor.status === "Approved" ? "Review" : vendor.status === "Review" ? "Blocked" : "Approved";
    const response = await fetch("/api/vendors", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: vendor.id, status: next }) });
    const body = await response.json();
    if (!response.ok) {
      setError(body.error ?? "Unable to update vendor.");
      return;
    }
    setVendors((items) => items.map((item) => item.id === vendor.id ? body.vendor : item));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1450px] px-6 py-8 xl:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Third-party AI</p>
          <h1 className="mt-2 text-2xl font-semibold">Vendor Registry</h1>
          <p className="mt-2 text-sm text-white/35">Govern the AI suppliers and models your organisation depends on.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["AI vendors", vendors.length, "registered suppliers"], ["High risk", highRisk, "require enhanced due diligence"], ["Under review", underReview, "awaiting governance decision"], ["Framework coverage", `${avgCoverage}%`, `${avgEvidence}% evidence coverage`]].map(([label, value, detail]) => (
            <div key={String(label)} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p><p className="mt-2 text-[10px] text-white/25">{detail}</p></div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3"><Search size={15} className="text-white/25"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vendors, categories or owners..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"/></div>
        {error && <div className="mt-4 rounded-lg border border-[#dc6b27]/30 bg-[#dc6b27]/[0.06] px-4 py-3 text-xs text-[#dc6b27]">{error}</div>}

        <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-5"><Building2 size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">AI supplier register</p><p className="mt-1 text-xs text-white/25">Live organisation data from Supabase.</p></div></div>
          <div className="divide-y divide-white/[0.07]">
            {loading && <div className="px-6 py-12 text-center text-sm text-white/30">Loading live vendor register…</div>}
            {!loading && filtered.map((vendor) => (
              <div key={vendor.id} className="px-6 py-5"><div className="grid gap-5 lg:grid-cols-[1fr_150px_120px_180px_130px] lg:items-center">
                <div><p className="text-sm font-medium text-white/75">{vendor.name}</p><p className="mt-1 text-[10px] text-white/20">{vendor.category} · {vendor.owner ?? "Unassigned"}</p></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Risk</p><p className={`mt-1 text-xs ${vendor.risk === "High" ? "text-[#dc6b27]" : "text-white/55"}`}>{vendor.risk}</p></div>
                <button type="button" onClick={() => cycleStatus(vendor)} className="text-left"><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Status</p><div className="mt-2"><VendorStatusBadge status={vendor.status}/></div></button>
                <div><div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[0.12em] text-white/20">Framework</span><span className="text-xs text-white/50">{vendor.framework_coverage}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27]" style={{ width: `${vendor.framework_coverage}%` }}/></div></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Next review</p><p className="mt-1 text-xs text-white/55">{formatDate(vendor.next_review_date)}</p></div>
              </div></div>
            ))}
            {!loading && !filtered.length && <div className="px-6 py-12 text-center text-sm text-white/30">No vendors found for this organisation.</div>}
          </div>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-[#dc6b27]/20 bg-[#dc6b27]/[0.04] p-6"><div className="flex items-start gap-4"><ShieldCheck size={19} className="mt-0.5 text-[#dc6b27]"/><div><p className="text-sm font-medium">Vendor governance signal</p><p className="mt-2 text-xs leading-5 text-white/30">{underReview} supplier{underReview === 1 ? " is" : "s are"} currently under review. High-risk vendors should have current contracts, security evidence and AI-specific due diligence before approval.</p></div></div></div>
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">What NEURONBRIGHT tracks</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><span className="text-xs text-white/45">Supplier ownership</span><span className="text-xs text-white/45">AI systems using supplier</span><span className="text-xs text-white/45">Framework coverage</span><span className="text-xs text-white/45">Evidence posture</span><span className="text-xs text-white/45">Approval status</span><span className="text-xs text-white/45">Review cadence</span></div></div>
        </div>
      </div>
    </AppShell>
  );
}
