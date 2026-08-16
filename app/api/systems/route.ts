import { NextResponse } from "next/server";
import { createOrganisationSystem, getOrganisationSystems, writeAuditLog } from "@/lib/supabase-data";

export async function GET() {
  try {
    const systems = await getOrganisationSystems();
    return NextResponse.json({ systems });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load systems." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const system = await createOrganisationSystem(body);
    await writeAuditLog({ action: "created", entityType: "ai_system", entityId: system.id, metadata: { name: system.name } });
    return NextResponse.json({ system }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create system." }, { status: 400 });
  }
}
