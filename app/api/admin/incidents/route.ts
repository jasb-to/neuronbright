import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });
  const { supabase } = access;
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,action,entity_type,created_at")
    .or("action.ilike.%error%,action.ilike.%fail%,action.ilike.%incident%,action.ilike.%denied%")
    .order("created_at", { ascending: false })
    .limit(25);
  return NextResponse.json({ incidents: data ?? [], error: error?.message ?? null, checked_at: new Date().toISOString() }, { status: error ? 503 : 200 });
}
