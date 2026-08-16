import { getSupabaseServerClient } from "@/lib/supabase-server";

export type DbSystem = {
  id: string;
  name: string;
  provider: string;
  model: string | null;
  owner: string | null;
  department: string | null;
  risk_level: "Low" | "Medium" | "High" | null;
  status: "Healthy" | "Review" | null;
  evidence_score: number;
  purpose: string | null;
  data_types: string[];
  lifecycle_stage: string;
  approval_owner: string | null;
  last_reviewed: string | null;
  next_review_date: string | null;
};

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getCurrentOrganisationId() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("memberships")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return data?.organisation_id ?? null;
}

export async function getOrganisationSystems(): Promise<DbSystem[]> {
  const organisationId = await getCurrentOrganisationId();
  if (!organisationId) return [];

  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("ai_systems")
    .select("id,name,provider,model,owner,department,risk_level,status,evidence_score,purpose,data_types,lifecycle_stage,approval_owner,last_reviewed,next_review_date")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("NEURONBRIGHT: failed to load AI systems", error);
    return [];
  }

  return (data ?? []) as DbSystem[];
}

export async function createOrganisationSystem(input: {
  name: string;
  provider: string;
  model?: string;
  owner?: string;
  department?: string;
  purpose?: string;
  dataTypes?: string[];
  riskLevel?: "Low" | "Medium" | "High";
  evidenceScore?: number;
  lifecycleStage?: string;
}) {
  const organisationId = await getCurrentOrganisationId();
  if (!organisationId) throw new Error("No organisation membership found.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("ai_systems")
    .insert({
      organisation_id: organisationId,
      name: input.name,
      provider: input.provider,
      model: input.model ?? null,
      owner: input.owner ?? null,
      department: input.department ?? null,
      purpose: input.purpose ?? null,
      data_types: input.dataTypes ?? [],
      risk_level: input.riskLevel ?? "Low",
      evidence_score: input.evidenceScore ?? 0,
      lifecycle_stage: input.lifecycleStage ?? "Assess",
      status: "Review",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DbSystem;
}

export async function createGovernanceRecord(input: {
  systemId: string;
  assessment: {
    overallScore: number;
    overallLevel: "Low" | "Medium" | "High";
    dimensions: unknown[];
    assessedAt: string;
  };
  controls: Array<{
    id: string;
    name: string;
    description: string;
    area: string;
    required: boolean;
    status: "Complete" | "In Progress" | "Missing";
    evidenceRequired: string[];
  }>;
}) {
  const organisationId = await getCurrentOrganisationId();
  if (!organisationId) throw new Error("No organisation membership found.");

  const supabase = await getSupabaseServerClient();

  const { data: risk, error: riskError } = await supabase
    .from("risk_assessments")
    .insert({
      organisation_id: organisationId,
      ai_system_id: input.systemId,
      overall_score: input.assessment.overallScore,
      overall_level: input.assessment.overallLevel,
      dimensions: input.assessment.dimensions,
      assessed_at: input.assessment.assessedAt,
    })
    .select()
    .single();

  if (riskError) throw new Error(riskError.message);

  const controls = input.controls.length
    ? input.controls.map((control) => ({
        organisation_id: organisationId,
        ai_system_id: input.systemId,
        external_id: control.id,
        name: control.name,
        description: control.description,
        area: control.area,
        required: control.required,
        status: control.status,
        evidence_required: control.evidenceRequired,
      }))
    : [];

  if (controls.length) {
    const { error: controlsError } = await supabase.from("controls").insert(controls);
    if (controlsError) throw new Error(controlsError.message);
  }

  return { risk, controlsCount: controls.length };
}

export async function writeAuditLog(input: {
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const user = await getCurrentUser();
  const organisationId = await getCurrentOrganisationId();
  if (!user || !organisationId) return;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  await supabase.from("audit_log").insert({
    organisation_id: organisationId,
    user_id: user.id,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {},
  });
}
