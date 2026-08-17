import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) {
    return NextResponse.json({ error: access.reason }, { status: access.reason === "Authentication required" ? 401 : 403 });
  }

  const checks: Record<string, { status: "online" | "degraded" | "offline"; detail: string }> = {};
  const started = Date.now();

  checks.application = { status: "online", detail: "Next.js server responding" };

  const { supabase } = access;
  const dbStart = Date.now();
  const { error: dbError } = await supabase.from("organisations").select("id", { count: "exact", head: true });
  checks.database = dbError
    ? { status: "offline", detail: dbError.message }
    : { status: "online", detail: `Database responded in ${Date.now() - dbStart}ms` };

  const storageStart = Date.now();
  const { error: storageError } = await supabase.storage.listBuckets();
  checks.storage = storageError
    ? { status: "degraded", detail: storageError.message }
    : { status: "online", detail: `Storage responded in ${Date.now() - storageStart}ms` };

  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "PLATFORM_ADMIN_EMAILS"];
  const missing = required.filter((name) => !process.env[name]);
  checks.configuration = missing.length
    ? { status: "degraded", detail: `Missing: ${missing.join(", ")}` }
    : { status: "online", detail: "Required platform configuration present" };

  const statuses = Object.values(checks).map((check) => check.status);
  const overall = statuses.includes("offline") ? "offline" : statuses.includes("degraded") ? "degraded" : "online";

  return NextResponse.json({ overall, checks, response_ms: Date.now() - started, checked_at: new Date().toISOString() });
}
