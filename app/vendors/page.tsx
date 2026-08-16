"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Building2, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { loadVendors, saveVendors, type AIVendor, type VendorStatus } from "@/lib/vendor-store";

function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const config = {
    Approved: ["border-emerald-400/25 bg-emerald-400/10 text-emerald-400", CheckCircle2],
    Review: ["border-yellow-400/25 bg-yellow-400/10 text-yellow-300", AlertTriangle],
    Blocked: ["border-[#dc6b27]/30 bg-[#dc6b27]/10 text-[#dc6b27]", AlertTriangle],
  } as const;
  const [classes, Icon] = config[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] ${classes}`}><Icon size={12}/>{status}</span>;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<AIVendor[]>(loadVendors);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => vendors.filter((vendor) => `${vendor.name} ${vendor.category} ${vendor.owner}`.toLowerCase().includes(query.toLowerCase())), [vendors, query]);
  const highRisk = vendors.filter((v) => v.risk === "High").length;
  const underReview = vendors.filter((v) => v.status === "Review").length;
  const avgCoverage = vendors.length ? Math.round(vendors.reduce((s, v) => s + v.frameworkCoverage, 0) / vendors.length) : 0;
  const avgEvidence = vendors.length ? Math.round(vendors.reduce((s, v) => s + v.evidence, 0) / vendors.length) : 0;

  function cycleStatus(id: string) {
    setVendors(saveVendors(vendors.map((vendor) => {
      if (vendor.id !== id) return vendor;
      const next: VendorStatus = vendor.status === "Approved" ? "Review" : vendor.status === "Review" ? "Blocked" : "Approved";
      return { ...vendor, status: next };
    })));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1450px] px-6 py-8 xl:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Third-party AI</p>
            <h1 className="mt-2 text-2xl font-semibold">Vendor Registry</h1>
            <p className="mt-2 text-sm text-white/35">Govern the AI suppliers and models your organisation depends on.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["AI vendors", vendors.length, "registered suppliers"],
            ["High risk", highRisk, "require enhanced due diligence"],
            ["Under review", underReview, "awaiting governance decision"],
            ["Framework coverage", `${avgCoverage}%`, `${avgEvidence}% evidence coverage`],
          ].map(([label, value, detail]) => (
            <div key={label} className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
              <p className="mt-2 text-[10px] text-white/25">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3"><Search size={15} className="text-white/25"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vendors, categories or owners..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"/></div>

        <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-5"><Building2 size={17} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">AI supplier register</p><p className="mt-1 text-xs text-white/25">Vendor risk, governance coverage and assurance posture.</p></div></div>
          <div className="divide-y divide-white/[0.07]">
            {filtered.map((vendor) => (
              <div key={vendor.id} className="px-6 py-5">
                <div className="grid gap-5 lg:grid-cols-[70px_1fr_150px_120px_180px_130px] lg:items-center">
                  <span className="font-mono text-[10px] text-white/20">{vendor.id}</span>
                  <div><p className="text-sm font-medium text-white/75">{vendor.name}</p><p className="mt-1 text-[10px] text-white/20">{vendor.category} · {vendor.owner}</p></div>
                  <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Risk</p><p className={`mt-1 text-xs ${vendor.risk === "High" ? "text-[#dc6b27]" : "text-white/55"}`}>{vendor.risk}</p></div>
                  <button type="button" onClick={() => cycleStatus(vendor.id)} className="text-left"><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Status</p><div className="mt-2"><VendorStatusBadge status={vendor.status}/></div></button>
                  <div><div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[0.12em] text-white/20">Framework</span><span className="text-xs text-white/50">{vendor.frameworkCoverage}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#dc6b27]" style={{ width: `${vendor.frameworkCoverage}%` }}/></div></div>
                  <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/20">Next review</p><p className="mt-1 text-xs text-white/55">{vendor.nextReview}</p></div>
                </div>
              </div>
            ))}
            {!filtered.length && <div className="px-6 py-12 text-center text-sm text-white/30">No vendors match your search.</div>}
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
