"use client";

import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    const client = getSupabaseBrowserClient();
    if (!client) { setError("Authentication is not configured yet. Add the Supabase environment variables in Vercel."); return; }
    setLoading(true);
    const { error: authError } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    setMessage("Check your email for the NEURONBRIGHT sign-in link.");
  }

  return (
    <div className="min-h-screen bg-[#070707] px-6 py-16 text-white"><div className="mx-auto max-w-md"><div className="rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-8 shadow-2xl shadow-black/20">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dc6b27]/10"><LockKeyhole size={19} className="text-[#dc6b27]" /></div>
      <p className="mt-7 text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">NEURONBRIGHT</p><h1 className="mt-2 text-2xl font-semibold">Sign in</h1><p className="mt-2 text-sm leading-6 text-white/35">Access your organisation&apos;s AI governance workspace.</p>
      <form onSubmit={submit} className="mt-8 space-y-4"><label className="block"><span className="text-xs font-medium text-white/55">Work email</span><div className="mt-2 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-black px-3"><Mail size={15} className="text-white/20" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/15" /></div></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#dc6b27] px-5 py-3 text-xs font-semibold text-black transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50">{loading ? "Sending link..." : "Send sign-in link"}{!loading && <ArrowRight size={14} />}</button></form>
      {message && <p className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] p-3 text-xs text-emerald-300">{message}</p>}{error && <p className="mt-5 rounded-lg border border-[#dc6b27]/20 bg-[#dc6b27]/[0.05] p-3 text-xs leading-5 text-[#dc6b27]">{error}</p>}
      <p className="mt-8 text-[10px] leading-5 text-white/20">Authentication is powered by Supabase. No passwords are stored by NEURONBRIGHT.</p>
    </div></div></div>
  );
}
