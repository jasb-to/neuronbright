import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { evaluateAssurance } from "@/lib/assurance-engine";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { data: membership } = await supabase.from("memberships").select("organisation_id").eq("user_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (!membership) return NextResponse.json({ error: "No organisation membership." }, { status: 403 });

  const { data: control, error } = await supabase.from("assurance_controls").select("*, assurance_events(*)").eq("id", id).eq("organisation_id", membership.organisation_id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!control) return NextResponse.json({ error: "Assurance control not found." }, { status: 404 });

  const events = (control.assurance_events ?? []).map((event: { id: string; stage: string; actor: string; basis: string; evidence_ref?: string | null; observed_at: string; metadata?: Record<string, unknown> }) => ({
    id: event.id, stage: event.stage, actor: event.actor, basis: event.basis, evidenceRef: event.evidence_ref, observedAt: event.observed_at, metadata: event.metadata,
  })).sort((a: { observedAt: string }, b: { observedAt: string }) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime());

  const evaluation = evaluateAssurance({
    targetPercent: Number(control.target_percent),
    expectedEvents: Number(control.runtime_expected_events ?? 0),
    observedEvents: Number(control.runtime_observed_events ?? 0),
    lastChangeAt: control.last_change_at,
    lastVerificationAt: control.last_verified_at,
    events,
  });

  return NextResponse.json({ control: { ...control, assurance_events: undefined, events, evaluation } });
}
