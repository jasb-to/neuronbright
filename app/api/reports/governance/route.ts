import { NextResponse } from "next/server";
import { getCurrentOrganisationId } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) throw new Error("No organisation membership found.");
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase is not configured.");

    const [systems, evidence, actions, vendors, controls] = await Promise.all([
      supabase.from("ai_systems").select("id,name,risk,status").eq("organisation_id", organisationId),
      supabase.from("evidence").select("id,status").eq("organisation_id", organisationId),
      supabase.from("actions").select("id,status,priority,due_date").eq("organisation_id", organisationId),
      supabase.from("vendors").select("id,name,risk,status").eq("organisation_id", organisationId),
      supabase.from("governance_controls").select("id,status").eq("organisation_id", organisationId),
    ]);
    for (const result of [systems, evidence, actions, vendors, controls]) if (result.error) throw new Error(result.error.message);

    const s = systems.data ?? [], e = evidence.data ?? [], a = actions.data ?? [], v = vendors.data ?? [], c = controls.data ?? [];
    const verifiedEvidence = e.filter((x) => x.status === "Verified").length;
    const openActions = a.filter((x) => x.status !== "Complete" && x.status !== "Completed").length;
    const highRiskSystems = s.filter((x) => x.risk === "High" || x.risk === "Critical").length;
    const highRiskVendors = v.filter((x) => x.risk === "High").length;
    const overdueActions = a.filter((x) => x.due_date && new Date(x.due_date) < new Date() && x.status !== "Complete" && x.status !== "Completed").length;
    const evidenceCoverage = e.length ? Math.round((verifiedEvidence / e.length) * 100) : 0;

    return NextResponse.json({ generatedAt: new Date().toISOString(), summary: { systems: s.length, controls: c.length, evidence: e.length, evidenceCoverage, openActions, overdueActions, highRiskSystems, vendors: v.length, highRiskVendors }, systems: s, vendors: v });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate governance report." }, { status: 500 });
  }
}
