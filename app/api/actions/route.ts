import { NextResponse } from "next/server";
import { getCurrentOrganisationId, getCurrentUser, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) return NextResponse.json({ tasks: [] });
    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    const { data, error } = await supabase.from("remediation_tasks").select("id,ai_system_id,control_id,title,description,framework,owner,due_date,priority,status,created_at,updated_at").eq("organisation_id", organisationId).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json({ tasks: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load actions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const organisationId = await getCurrentOrganisationId();
    const user = await getCurrentUser();
    if (!organisationId || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const body = await request.json();
    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    const { data, error } = await supabase.from("remediation_tasks").insert({ organisation_id: organisationId, ai_system_id: body.aiSystemId || null, control_id: body.controlId || null, title: String(body.title ?? "").trim(), description: body.description ?? null, framework: body.framework ?? null, owner: body.owner ?? null, due_date: body.dueDate || null, priority: body.priority ?? "Medium", status: body.status ?? "Open" }).select().single();
    if (error) throw new Error(error.message);
    await writeAuditLog({ action: "created", entityType: "remediation_task", entityId: data.id, metadata: { title: data.title } });
    return NextResponse.json({ task: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create action." }, { status: 400 });
  }
}
