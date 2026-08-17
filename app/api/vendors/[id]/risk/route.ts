import { NextResponse } from "next/server";
import { getCurrentOrganisationId, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) throw new Error("No organisation membership found.");
    const risk = body.risk;
    if (!["Low", "Medium", "High"].includes(risk)) throw new Error("Invalid vendor risk.");
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("vendors").update({ risk, last_reviewed: new Date().toISOString().slice(0, 10) }).eq("id", id).eq("organisation_id", organisationId).select("id,name,risk,status,last_reviewed,next_review_date,framework_coverage,evidence_score").single();
    if (error) throw new Error(error.message);
    await writeAuditLog({ action: "risk_assessed", entityType: "vendor", entityId: data.id, metadata: { name: data.name, risk: data.risk } });
    return NextResponse.json({ vendor: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to assess vendor risk." }, { status: 400 });
  }
}
