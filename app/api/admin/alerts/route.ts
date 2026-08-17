import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });

  const alerts: { id: string; severity: "critical" | "high" | "medium" | "info"; title: string; detail: string; state: "active" | "resolved" }[] = [];
  const { supabase } = access;

  const { error: dbError } = await supabase.from("organisations").select("id", { count: "exact", head: true });
  if (dbError) alerts.push({ id: "database", severity: "critical", title: "Database unavailable", detail: dbError.message, state: "active" });

  const { error: storageError } = await supabase.storage.listBuckets();
  if (storageError) alerts.push({ id: "storage", severity: "high", title: "Storage degraded", detail: storageError.message, state: "active" });

  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "PLATFORM_ADMIN_EMAILS"];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) alerts.push({ id: "configuration", severity: "high", title: "Configuration incomplete", detail: `Missing: ${missing.join(", ")}`, state: "active" });

  const { data: recentErrors } = await supabase
    .from("audit_logs")
    .select("id,action,entity_type,created_at")
    .or("action.ilike.%error%,action.ilike.%fail%,action.ilike.%denied%")
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(10);
  if ((recentErrors?.length ?? 0) >= 5) alerts.push({ id: "repeated-errors", severity: "high", title: "Repeated failures detected", detail: `${recentErrors?.length} matching failure events in the last hour`, state: "active" });
  else if ((recentErrors?.length ?? 0) > 0) alerts.push({ id: "recent-errors", severity: "medium", title: "Recent platform errors", detail: `${recentErrors?.length} matching failure event${recentErrors?.length === 1 ? "" : "s"} in the last hour`, state: "active" });

  if (!alerts.length) alerts.push({ id: "all-clear", severity: "info", title: "All systems operational", detail: "No active operational alerts detected.", state: "resolved" });

  return NextResponse.json({ alerts, active: alerts.filter((a) => a.state === "active").length, checked_at: new Date().toISOString() });
}
