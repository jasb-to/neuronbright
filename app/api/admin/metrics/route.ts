import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });
  const { supabase } = access;
  const [orgs, systems, vendors, actions, audit] = await Promise.all([
    supabase.from("organisations").select("id", { count: "exact", head: true }),
    supabase.from("ai_systems").select("id", { count: "exact", head: true }),
    supabase.from("vendors").select("id", { count: "exact", head: true }),
    supabase.from("actions").select("id", { count: "exact", head: true }).neq("status", "Completed"),
    supabase.from("audit_logs").select("id,action,entity_type,created_at").order("created_at", { ascending: false }).limit(10),
  ]);
  const errors = [orgs, systems, vendors, actions, audit].filter((r) => r.error).map((r) => r.error?.message);
  return NextResponse.json({ generated_at: new Date().toISOString(), counts: { organisations: orgs.count ?? 0, systems: systems.count ?? 0, vendors: vendors.count ?? 0, open_actions: actions.count ?? 0 }, recent_audit: audit.data ?? [], errors });
}
