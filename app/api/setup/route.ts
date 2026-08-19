import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const industry = typeof body.industry === "string" ? body.industry.trim() : "";
    const size = typeof body.size === "string" ? body.size.trim() : "";
    if (!name) return NextResponse.json({ error: "Organisation name is required." }, { status: 400 });
    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    const { data, error } = await supabase.rpc("bootstrap_organisation", { organisation_name: name, organisation_industry: industry || "General business", organisation_size: size || "Unknown" });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ organisationId: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to complete organisation setup." }, { status: 400 });
  }
}
