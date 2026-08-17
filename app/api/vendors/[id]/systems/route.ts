import { NextResponse } from "next/server";
import { getCurrentOrganisationId, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) return NextResponse.json({ systems: [] });
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("vendor_systems").select("ai_system_id, ai_systems(id,name)").eq("vendor_id", id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ systems: (data ?? []).map((row) => row.ai_systems).filter(Boolean) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load vendor systems." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.aiSystemId) throw new Error("AI system id is required.");
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) throw new Error("No organisation membership found.");
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data: vendor } = await supabase.from("vendors").select("id,name").eq("id", id).eq("organisation_id", organisationId).single();
    if (!vendor) throw new Error("Vendor not found.");
    const { data: system } = await supabase.from("ai_systems").select("id,name").eq("id", body.aiSystemId).eq("organisation_id", organisationId).single();
    if (!system) throw new Error("AI system not found.");
    const { error } = await supabase.from("vendor_systems").upsert({ vendor_id: id, ai_system_id: body.aiSystemId });
    if (error) throw new Error(error.message);
    await writeAuditLog({ action: "linked", entityType: "vendor_system", entityId: id, metadata: { vendor: vendor.name, system: system.name, ai_system_id: system.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to link system." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const aiSystemId = searchParams.get("aiSystemId");
    if (!aiSystemId) throw new Error("AI system id is required.");
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) throw new Error("No organisation membership found.");
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("vendor_systems").delete().eq("vendor_id", id).eq("ai_system_id", aiSystemId);
    if (error) throw new Error(error.message);
    await writeAuditLog({ action: "unlinked", entityType: "vendor_system", entityId: id, metadata: { ai_system_id: aiSystemId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to unlink system." }, { status: 400 });
  }
}
