"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Download, FileText, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";

type Evidence = {
  id: string; name: string; source: string | null; status: "Verified" | "Pending" | "Missing";
  framework: string | null; expires_at: string | null; created_at: string; updated_at: string;
  ai_system_id: string | null; control_id: string | null;
};
type Audit = { id: string; action: string; created_at: string; user_id: string | null };

export default function EvidenceReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load(id: string) {
    const response = await fetch(`/api/evidence/${id}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) { setError(payload.error ?? "Unable to load evidence."); return; }
    setEvidence(payload.evidence); setDownloadUrl(payload.downloadUrl ?? null); setAudit(payload.audit ?? []);
  }

  useEffect(() => {
    let active = true;
    params.then(({ id }) => { if (active) void load(id); });
    return () => { active = false; };
  }, [params]);

  async function updateStatus(status: Evidence["status"]) {
    if (!evidence || saving) return;
    setSaving(true); setError("");
    const response = await fetch(`/api/evidence/${evidence.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const payload = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) { setError(payload.error ?? "Unable to update evidence."); return; }
    await load(evidence.id);
  }

  if (!evidence && !error) return <AppShell><div className="p-8 text-sm text-white/35">Loading evidence...</div></AppShell>;
  if (error && !evidence) return <AppShell><div className="p-8"><p className="text-sm text-[#dc6b27]">{error}</p><Link href="/evidence" className="mt-5 inline-flex text-xs text-white/40 hover:text-white">Back to Evidence Centre</Link></div></AppShell>;
  if (!evidence) return null;

  const statusIcon = evidence.status === "Verified" ? <CheckCircle2 size={16} className="text-emerald-400" /> : evidence.status === "Missing" ? <XCircle size={16} className="text-[#dc6b27]" /> : <Clock3 size={16} className="text-yellow-400" />;

  return <AppShell><div className="mx-auto max-w-[1200px] px-6 py-8 xl:px-8">
    <Link href="/evidence" className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={14}/>Back to Evidence Centre</Link>
    <div className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Evidence review</p><h1 className="mt-2 text-2xl font-semibold">{evidence.name}</h1><p className="mt-2 text-sm text-white/30">{evidence.framework ?? "Internal"} · Uploaded {new Date(evidence.created_at).toLocaleString("en-GB")}</p></div><div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-2.5 text-xs text-white/60">{statusIcon}{evidence.status}</div></div>

    <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
      <section className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><div className="flex items-center gap-3"><FileText size={19} className="text-[#dc6b27]"/><div><p className="text-sm font-medium">Evidence artefact</p><p className="mt-1 text-xs text-white/25">Private file stored in the NEURONBRIGHT evidence vault.</p></div></div><div className="mt-7 rounded-xl border border-white/[0.07] bg-black/30 p-8 text-center"><FileText size={42} className="mx-auto text-white/15"/><p className="mt-4 text-sm text-white/55">{evidence.name}</p><p className="mt-2 text-xs text-white/25">The secure preview/download link expires after 5 minutes.</p>{downloadUrl && <a href={downloadUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black"><Download size={14}/>Open secure file</a>}</div><div className="mt-6 grid gap-4 md:grid-cols-3"><div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Framework</p><p className="mt-2 text-sm text-white/60">{evidence.framework ?? "Internal"}</p></div><div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Expires</p><p className="mt-2 text-sm text-white/60">{evidence.expires_at ? new Date(evidence.expires_at).toLocaleDateString("en-GB") : "No expiry"}</p></div><div><p className="text-[9px] uppercase tracking-[0.14em] text-white/20">Source</p><p className="mt-2 text-sm text-white/60">{evidence.source ?? "Unknown"}</p></div></div></section>

      <aside className="space-y-5"><div className="rounded-xl border border-[#dc6b27]/25 bg-[#dc6b27]/[0.05] p-6"><div className="flex items-center gap-3"><ShieldCheck size={18} className="text-[#dc6b27]"/><p className="text-sm font-medium">Reviewer decision</p></div><p className="mt-3 text-xs leading-5 text-white/30">Confirm that the uploaded artefact is sufficient to support its linked governance requirement.</p><div className="mt-5 grid gap-2"><button disabled={saving} onClick={()=>updateStatus("Verified")} className="rounded-lg bg-[#dc6b27] px-4 py-2.5 text-xs font-semibold text-black disabled:opacity-40">Approve evidence</button><button disabled={saving} onClick={()=>updateStatus("Pending")} className="rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs text-white/60 disabled:opacity-40">Return to review</button><button disabled={saving} onClick={()=>updateStatus("Missing")} className="rounded-lg border border-[#dc6b27]/20 px-4 py-2.5 text-xs text-[#dc6b27] disabled:opacity-40">Reject / mark missing</button></div>{error&&<p className="mt-4 text-xs text-[#dc6b27]">{error}</p>}</div>
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6"><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">Audit trail</p><div className="mt-4 space-y-3">{audit.length ? audit.map((entry)=><div key={entry.id} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3"><p className="text-xs text-white/55">{entry.action}</p><p className="mt-1 text-[10px] text-white/20">{new Date(entry.created_at).toLocaleString("en-GB")}</p></div>) : <p className="text-xs text-white/25">No audit events recorded yet.</p>}</div></div></aside>
    </div>
  </div></AppShell>;
}
