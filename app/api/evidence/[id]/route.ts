import { NextResponse } from "next/server";
import { getCurrentOrganisationId, getCurrentUser, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const organisationId = await getCurrentOrganisationId();
  if (!organisationId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { data: evidence, error } = await supabase
    .from("evidence")
    .select("id,name,source,storage_path,status,framework,expires_at,created_at,updated_at,ai_system_id,control_id")
    .eq("id", id)
    .eq("organisation_id", organisationId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!evidence) return NextResponse.json({ error: "Evidence not found." }, { status: 404 });

  const { data: signed } = evidence.storage_path
    ? await supabase.storage.from("evidence").createSignedUrl(evidence.storage_path, 300)
    : { data: null };

  const { data: audit } = await supabase
    .from("audit_log")
    .select("id,action,entity_type,entity_id,metadata,created_at,user_id")
    .eq("organisation_id", organisationId)
    .eq("entity_type", "evidence")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ evidence, downloadUrl: signed?.signedUrl ?? null, audit: audit ?? [] });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const organisationId = await getCurrentOrganisationId();
  const user = await getCurrentUser();
  if (!organisationId || !user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const body = (await request.json().catch(() => ({}))) as { status?: "Verified" | "Pending" | "Missing" };
  if (!body.status) return NextResponse.json({ error: "Status is required." }, { status: 400 });

  const { data: current } = await supabase
    .from("evidence")
    .select("id,status,name")
    .eq("id", id)
    .eq("organisation_id", organisationId)
    .maybeSingle();

  if (!current) return NextResponse.json({ error: "Evidence not found." }, { status: 404 });

  const { data: evidence, error } = await supabase
    .from("evidence")
    .update({ status: body.status })
    .eq("id", id)
    .eq("organisation_id", organisationId)
    .select("id,name,status,framework,expires_at,created_at,updated_at,ai_system_id,control_id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await writeAuditLog({
    action: `status_changed:${current.status}->${body.status}`,
    entityType: "evidence",
    entityId: id,
    metadata: { evidenceName: current.name, from: current.status, to: body.status, userId: user.id },
  });

  return NextResponse.json({ evidence });
}
