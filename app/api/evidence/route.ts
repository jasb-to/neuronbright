import { NextResponse } from "next/server";
import { getCurrentOrganisationId, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) return NextResponse.json({ error: "No organisation membership found." }, { status: 401 });
    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

    const { data, error } = await supabase
      .from("evidence")
      .select("id,name,status,framework,source,storage_path,expires_at,created_at,ai_system_id,control_id")
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ evidence: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load evidence." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) return NextResponse.json({ error: "No organisation membership found." }, { status: 401 });

    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

    const form = await request.formData();
    const file = form.get("file");
    const systemId = String(form.get("systemId") ?? "").trim();
    const controlId = String(form.get("controlId") ?? "").trim();
    const framework = String(form.get("framework") ?? "Internal").trim() || "Internal";
    const expiresAt = String(form.get("expiresAt") ?? "").trim();

    if (!(file instanceof File)) return NextResponse.json({ error: "A file is required." }, { status: 400 });
    if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "Files must be 15 MB or smaller." }, { status: 400 });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${organisationId}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from("evidence").upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("evidence")
      .insert({
        organisation_id: organisationId,
        ai_system_id: systemId || null,
        control_id: controlId || null,
        name: file.name,
        source: "Evidence Upload",
        storage_path: path,
        status: "Pending",
        framework,
        expires_at: expiresAt || null,
      })
      .select("id,name,status,framework,source,storage_path,expires_at,created_at,ai_system_id,control_id")
      .single();

    if (error) {
      await supabase.storage.from("evidence").remove([path]);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await writeAuditLog({ action: "uploaded", entityType: "evidence", entityId: data.id, metadata: { name: file.name, storagePath: path } });
    return NextResponse.json({ evidence: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload evidence." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const organisationId = await getCurrentOrganisationId();
    if (!organisationId) return NextResponse.json({ error: "No organisation membership found." }, { status: 401 });
    const supabase = await getSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

    const body = await request.json();
    const id = String(body.id ?? "").trim();
    const status = String(body.status ?? "").trim();
    if (!id || !["Verified", "Pending", "Missing"].includes(status)) {
      return NextResponse.json({ error: "A valid evidence id and status are required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("evidence")
      .update({ status })
      .eq("id", id)
      .eq("organisation_id", organisationId)
      .select("id,name,status,framework,source,storage_path,expires_at,created_at,ai_system_id,control_id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await writeAuditLog({ action: "status_updated", entityType: "evidence", entityId: id, metadata: { status } });
    return NextResponse.json({ evidence: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update evidence." }, { status: 500 });
  }
}
