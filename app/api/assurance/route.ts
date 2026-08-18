import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { evaluateAssurance } from "@/lib/assurance-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ configured: false, reason: "Supabase is not configured." }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ configured: true, authenticated: false }, { status: 401 });

  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .select("organisation_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });
  if (!membership) return NextResponse.json({ controls: [] });

  const { data: controls, error } = await supabase
    .from("assurance_controls")
    .select("*, assurance_events(*)")
    .eq("organisation_id", membership.organisation_id)
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const evaluated = (controls ?? []).map((control) => {
    const events = (control.assurance_events ?? []).map((event: { id: string; stage: string; actor: string; basis: string; evidence_ref?: string | null; observed_at: string; metadata?: Record<string, unknown> }) => ({
      id: event.id,
      stage: event.stage,
      actor: event.actor,
      basis: event.basis,
      evidenceRef: event.evidence_ref,
      observedAt: event.observed_at,
      metadata: event.metadata,
    }));
    const expectedEvents = Number(control.target_percent) >= 100 ? Number(control.runtime_expected_events ?? 0) : Number(control.runtime_expected_events ?? 0);
    const observedEvents = Number(control.runtime_observed_events ?? 0);
    const evaluation = evaluateAssurance({
      targetPercent: Number(control.target_percent),
      expectedEvents,
      observedEvents,
      lastChangeAt: control.last_change_at,
      lastVerificationAt: control.last_verified_at,
      events,
    });
    return { ...control, assurance_events: undefined, events, evaluation };
  });

  return NextResponse.json({ controls: evaluated });
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await request.json() as {
    assuranceControlId?: string;
    stage?: string;
    actor?: string;
    basis?: string;
    evidenceRef?: string;
    metadata?: Record<string, unknown>;
  };
  if (!body.assuranceControlId || !body.stage || !body.actor || !body.basis) {
    return NextResponse.json({ error: "assuranceControlId, stage, actor and basis are required." }, { status: 400 });
  }

  const { data: control, error: controlError } = await supabase
    .from("assurance_controls")
    .select("organisation_id")
    .eq("id", body.assuranceControlId)
    .single();
  if (controlError || !control) return NextResponse.json({ error: controlError?.message ?? "Control not found." }, { status: 404 });

  const { data: membership } = await supabase
    .from("memberships")
    .select("organisation_id")
    .eq("organisation_id", control.organisation_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { data: event, error } = await supabase.from("assurance_events").insert({
    organisation_id: control.organisation_id,
    assurance_control_id: body.assuranceControlId,
    stage: body.stage,
    actor: body.actor,
    basis: body.basis,
    evidence_ref: body.evidenceRef ?? null,
    metadata: body.metadata ?? {},
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ event }, { status: 201 });
}
