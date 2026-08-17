import { NextResponse } from "next/server";
import { getCurrentOrganisationId, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) return NextResponse.json({ vendors: [] });
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from("vendors")
      .select("id,name,category,owner,risk,status,framework_coverage,evidence_score,last_reviewed,next_review_date,created_at")
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json({ vendors: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load vendors." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) throw new Error("No organisation membership found.");
    if (!body.id) throw new Error("Vendor id is required.");
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const allowed = ["Approved", "Review", "Blocked"] as const;
    if (!allowed.includes(body.status)) throw new Error("Invalid vendor status.");
    const { data, error } = await supabase
      .from("vendors")
      .update({ status: body.status })
      .eq("id", body.id)
      .eq("organisation_id", organisationId)
      .select("id,name,category,owner,risk,status,framework_coverage,evidence_score,last_reviewed,next_review_date,created_at")
      .single();
    if (error) throw new Error(error.message);
    await writeAuditLog({ action: "updated", entityType: "vendor", entityId: data.id, metadata: { status: data.status, name: data.name } });
    return NextResponse.json({ vendor: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update vendor." }, { status: 400 });
  }
}
