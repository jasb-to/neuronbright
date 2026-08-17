import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

const FLAGS = [
  { key: "maintenance_mode", label: "Maintenance mode", description: "Place the application into controlled maintenance mode.", enabled: false },
  { key: "new_reporting", label: "New reporting", description: "Enable the latest governance reporting experience.", enabled: true },
  { key: "live_monitoring", label: "Live monitoring", description: "Enable live operational monitoring surfaces.", enabled: true },
  { key: "beta_features", label: "Beta features", description: "Expose features still under controlled rollout.", enabled: false },
];

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });
  return NextResponse.json({ flags: FLAGS, read_only: true, generated_at: new Date().toISOString() });
}
