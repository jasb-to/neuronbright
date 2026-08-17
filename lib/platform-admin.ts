import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function requirePlatformAdmin() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false as const, reason: "Supabase is not configured" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false as const, reason: "Authentication required" };

  const allowed = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(user.email.toLowerCase())) {
    return { ok: false as const, reason: "Platform admin access required" };
  }

  return { ok: true as const, supabase, user };
}
