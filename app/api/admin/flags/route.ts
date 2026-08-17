import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

const DEFAULT_FLAGS = [
  { key: "maintenance_mode", label: "Maintenance mode", description: "Place the application into controlled maintenance mode.", enabled: false },
  { key: "new_reporting", label: "New reporting", description: "Enable the latest governance reporting experience.", enabled: true },
  { key: "live_monitoring", label: "Live monitoring", description: "Enable live operational monitoring surfaces.", enabled: true },
  { key: "beta_features", label: "Beta features", description: "Expose features still under controlled rollout.", enabled: false },
];

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });
  const { data, error } = await access.supabase.from("platform_feature_flags").select("key,label,description,enabled,updated_at,updated_by").order("key");
  if (error) return NextResponse.json({ flags: DEFAULT_FLAGS, read_only: true, configured: false, message: "Run the feature flag migration to enable persistent controls." });
  return NextResponse.json({ flags: data ?? DEFAULT_FLAGS, read_only: false, configured: true });
}

export async function POST(request: Request) {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });
  const body = await request.json().catch(() => null) as { key?: string; enabled?: boolean } | null;
  if (!body?.key || typeof body.enabled !== "boolean") return NextResponse.json({ error: "key and boolean enabled are required" }, { status: 400 });
  if (!DEFAULT_FLAGS.some((flag) => flag.key === body.key)) return NextResponse.json({ error: "Unknown feature flag" }, { status: 400 });
  const { data: updated, error: updateError } = await access.supabase.from("platform_feature_flags").upsert({ key: body.key, enabled: body.enabled, updated_at: new Date().toISOString(), updated_by: access.user.id }, { onConflict: "key" }).select("key,label,description,enabled,updated_at,updated_by").single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 503 });
  const { error: auditError } = await access.supabase.from("platform_feature_flag_changes").insert({ flag_key: body.key, enabled: body.enabled, changed_by: access.user.id });
  if (auditError) return NextResponse.json({ error: `Flag changed but audit write failed: ${auditError.message}` }, { status: 503 });
  return NextResponse.json({ flag: updated });
}
