import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentOrganisationId, getCurrentUser, writeAuditLog } from "@/lib/supabase-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const organisationId = await getCurrentOrganisationId();
  if (!organisationId) return NextResponse.json({ error: "No organisation membership found." }, { status: 401 });

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const [{ data: risk }, { data: controls }] = await Promise.all([
    supabase.from("risk_assessments").select("id,overall_score,overall_level,dimensions,assessed_at").eq("organisation_id", organisationId).eq("ai_system_id", id).order("assessed_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("controls").select("id,external_id,name,description,area,required,status,evidence_required").eq("organisation_id", organisationId).eq("ai_system_id", id).order("created_at", { ascending: true }),
  ]);

  return NextResponse.json({ risk, controls: controls ?? [] });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const organisationId = await getCurrentOrganisationId();
  const user = await getCurrentUser();
  if (!organisationId || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json();
  const controlId = String(body.controlId ?? "");
  const status = body.status;
  if (!controlId || !["Complete", "In Progress", "Missing"].includes(status)) {
    return NextResponse.json({ error: "Invalid control update." }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("controls").update({ status }).eq("id", controlId).eq("organisation_id", organisationId).eq("ai_system_id", id).select("id,external_id,name,description,area,required,status,evidence_required").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await writeAuditLog({ action: "updated", entityType: "control", entityId: controlId, metadata: { systemId: id, status } });
  return NextResponse.json({ control: data });
}
