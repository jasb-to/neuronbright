import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { ASSURANCE_STAGES, evaluateAssurance, type AssuranceStage } from "@/lib/assurance-engine";

export const dynamic = "force-dynamic";

function toEvents(events: Array<{ id: string; stage: string; actor: string; basis: string; evidence_ref?: string | null; observed_at: string; metadata?: Record<string, unknown> }>) {
  return events.map((event) => ({
    id: event.id,
    stage: event.stage as AssuranceStage,
    actor: event.actor,
    basis: event.basis,
    evidenceRef: event.evidence_ref,
    observedAt: event.observed_at,
    metadata: event.metadata,
  }));
}

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
    const events = toEvents(control.assurance_events ?? []);
    const evaluation = evaluateAssurance({
      targetPercent: Number(control.target_percent),
      expectedEvents: Number(control.runtime_expected_events ?? 0),
      observedEvents: Number(control.runtime_observed_events ?? 0),
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
    observedAt?: string;
    metadata?: Record<string, unknown>;
  };
  if (!body.assuranceControlId || !body.stage || !body.actor || !body.basis) {
    return NextResponse.json({ error: "assuranceControlId, stage, actor and basis are required." }, { status: 400 });
  }
  if (!ASSURANCE_STAGES.includes(body.stage as AssuranceStage)) {
    return NextResponse.json({ error: `Invalid lifecycle stage. Expected one of: ${ASSURANCE_STAGES.join(", ")}.` }, { status: 400 });
  }

  const { data: control, error: controlError } = await supabase
    .from("assurance_controls")
    .select("*")
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

  const observedAt = body.observedAt ?? new Date().toISOString();
  const { data: event, error } = await supabase.from("assurance_events").insert({
    organisation_id: control.organisation_id,
    assurance_control_id: body.assuranceControlId,
    stage: body.stage,
    actor: body.actor,
    basis: body.basis,
    evidence_ref: body.evidenceRef ?? null,
    observed_at: observedAt,
    metadata: body.metadata ?? {},
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const stage = body.stage as AssuranceStage;
  const isGovernedChange = body.metadata?.eventType === "governed_change" || body.metadata?.change === true;
  const update: Record<string, unknown> = {};

  if (stage === "Verified") update.last_verified_at = observedAt;
  if (stage === "Effective") update.last_effective_at = observedAt;
  if (isGovernedChange) update.last_change_at = observedAt;

  const { data: allEvents, error: eventsError } = await supabase
    .from("assurance_events")
    .select("id, stage, actor, basis, evidence_ref, observed_at, metadata")
    .eq("assurance_control_id", body.assuranceControlId);
  if (eventsError) return NextResponse.json({ error: eventsError.message }, { status: 500 });

  const nextChangeAt = isGovernedChange ? observedAt : control.last_change_at;
  const nextVerifiedAt = stage === "Verified" ? observedAt : control.last_verified_at;
  const evaluation = evaluateAssurance({
    targetPercent: Number(control.target_percent),
    expectedEvents: Number(control.runtime_expected_events ?? 0),
    observedEvents: Number(control.runtime_observed_events ?? 0),
    lastChangeAt: nextChangeAt,
    lastVerificationAt: nextVerifiedAt,
    events: toEvents(allEvents ?? []),
  });

  update.state = evaluation.state;
  if (Object.keys(update).length > 0) {
    const { error: updateError } = await supabase
      .from("assurance_controls")
      .update(update)
      .eq("id", body.assuranceControlId)
      .eq("organisation_id", control.organisation_id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ event, evaluation, controlId: body.assuranceControlId }, { status: 201 });
}
