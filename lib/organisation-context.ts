import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export async function ensureOrganisation() {
  const client = getSupabaseBrowserClient();
  if (!client) return { organisationId: null, error: "Supabase is not configured." };

  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) return { organisationId: null, error: "Not authenticated." };

  const { data, error } = await client.rpc("bootstrap_organisation", {
    organisation_name: "NEURONBRIGHT",
    organisation_industry: "AI & Technology",
    organisation_size: "1–5,000 employees",
  });

  if (error) return { organisationId: null, error: error.message };
  return { organisationId: data as string, error: null };
}

export async function getCurrentMembership() {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;

  const { data } = await client
    .from("memberships")
    .select("organisation_id, role, organisations(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}
