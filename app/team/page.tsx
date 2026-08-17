"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { getCurrentMembership } from "@/lib/organisation-context";

const roles = ["owner", "admin", "reviewer", "viewer"] as const;
type Role = (typeof roles)[number];

type Member = { id: string; user_id: string; role: Role; created_at: string };

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("reviewer");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const client = getSupabaseBrowserClient();
    const membership = await getCurrentMembership();
    if (!client || !membership) return;
    setOrgId(membership.organisation_id);
    const { data } = await client.from("memberships").select("id,user_id,role,created_at").eq("organisation_id", membership.organisation_id).order("created_at");
    setMembers((data ?? []) as Member[]);
  }

  useEffect(() => { void load(); }, []);

  async function invite() {
    setMessage("");
    const client = getSupabaseBrowserClient();
    if (!client || !orgId || !email.trim()) return;
    const { error } = await client.from("organisation_invitations").insert({ organisation_id: orgId, email: email.trim().toLowerCase(), role });
    if (error) setMessage(error.message);
    else { setMessage("Invitation created"); setEmail(""); }
  }

  return <AppShell><div className="mx-auto max-w-[1200px] px-6 py-8 xl:px-8">
    <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">Organisation</p>
    <h1 className="mt-2 text-2xl font-semibold">Team & permissions</h1>
    <p className="mt-2 text-sm text-white/35">Manage governance access and invite colleagues into NEURONBRIGHT.</p>

    <section className="mt-8 rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-6">
      <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">Invite member</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_130px]">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com" className="rounded-lg border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20" />
        <select value={role} onChange={e => setRole(e.target.value as Role)} className="rounded-lg border border-white/10 bg-black px-4 py-3 text-sm outline-none">{roles.filter(r => r !== "owner").map(r => <option key={r} value={r}>{r}</option>)}</select>
        <button onClick={() => void invite()} className="rounded-lg bg-[#dc6b27] px-4 py-3 text-xs font-semibold text-black">Create invite</button>
      </div>
      {message && <p className="mt-3 text-xs text-white/45">{message}</p>}
    </section>

    <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
      <div className="border-b border-white/[0.08] px-6 py-5"><p className="text-sm font-medium">Current members</p><p className="mt-1 text-xs text-white/25">Database-enforced organisation membership.</p></div>
      <div className="divide-y divide-white/[0.07]">{members.map(m => <div key={m.id} className="flex items-center justify-between px-6 py-4"><div><p className="font-mono text-xs text-white/50">{m.user_id}</p><p className="mt-1 text-[10px] text-white/20">Joined {new Date(m.created_at).toLocaleDateString("en-GB")}</p></div><span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white/50">{m.role}</span></div>)}{!members.length && <div className="px-6 py-10 text-center text-sm text-white/25">No members found.</div>}</div>
    </section>
  </div></AppShell>;
}
