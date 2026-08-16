"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function EvidenceUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [systemId, setSystemId] = useState("");
  const [framework, setFramework] = useState("Internal");
  const [expiresAt, setExpiresAt] = useState("");
  const [systems, setSystems] = useState<Array<{ id: string; name: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/systems", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setSystems((payload.systems ?? []).map((x: { id: string; name: string }) => ({ id: x.id, name: x.name }))))
      .catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("Supabase is not configured.");
      return;
    }

    setSaving(true);
    const form = new FormData();
    form.append("file", file);
    form.append("systemId", systemId);
    form.append("framework", framework);
    form.append("expiresAt", expiresAt);

    const response = await fetch("/api/evidence", { method: "POST", body: form });
    const payload = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setError(payload.error ?? "Upload failed.");
      return;
    }

    setFile(null);
    setSuccess(`${payload.evidence?.name ?? file.name} uploaded and marked Pending for review.`);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[900px] px-6 py-8 xl:px-8">
        <Link href="/evidence" className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white">
          <ArrowLeft size={14} /> Back to Evidence Intelligence
        </Link>

        <div className="mt-7">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Evidence</p>
          <h1 className="mt-2 text-2xl font-semibold">Upload evidence</h1>
          <p className="mt-2 text-sm text-white/35">Store the actual artefact in the NEURONBRIGHT evidence vault and create a traceable evidence record.</p>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
          <label className="block">
            <span className="text-xs font-medium text-white/60">Evidence file</span>
            <div className="mt-2 rounded-xl border border-dashed border-white/[0.12] bg-black/30 p-8 text-center hover:border-[#dc6b27]/40">
              <FileUp size={28} className="mx-auto text-[#dc6b27]" />
              <p className="mt-3 text-sm text-white/60">{file ? file.name : "Choose a PDF, DOCX, XLSX, PPTX or other evidence file"}</p>
              <p className="mt-1 text-[10px] text-white/25">Maximum 15 MB</p>
              <input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-5 block w-full text-xs text-white/40" />
            </div>
          </label>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-white/60">AI system</span>
              <select value={systemId} onChange={(event) => setSystemId(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-black px-3 text-xs text-white/70 outline-none focus:border-[#dc6b27]/50">
                <option value="">Unassigned</option>
                {systems.map((system) => <option key={system.id} value={system.id}>{system.name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-white/60">Framework</span>
              <select value={framework} onChange={(event) => setFramework(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-black px-3 text-xs text-white/70 outline-none focus:border-[#dc6b27]/50">
                <option>Internal</option>
                <option>EU AI Act</option>
                <option>ISO/IEC 42001</option>
                <option>NIST AI RMF</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-white/60">Expiry date</span>
              <input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-black px-3 text-xs text-white/70 outline-none focus:border-[#dc6b27]/50" />
            </label>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
            <div className="text-[10px] text-white/25">Files are stored privately and the evidence record starts in Pending status.</div>
            <button type="submit" disabled={saving || !file} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-2.5 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
              {saving ? "Uploading..." : "Upload evidence"}
            </button>
          </div>

          {success && <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] p-3 text-xs text-emerald-300"><CheckCircle2 size={15} />{success}</div>}
          {error && <div className="mt-5 rounded-lg border border-[#dc6b27]/20 bg-[#dc6b27]/[0.05] p-3 text-xs leading-5 text-[#dc6b27]">{error}</div>}
        </form>
      </div>
    </AppShell>
  );
}
