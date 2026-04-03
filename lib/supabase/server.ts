import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (service role for API routes).
 * Returns null if env is not configured — persistence is optional for local dev.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const rawUrl = process.env.SUPABASE_URL;
  const url = rawUrl?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key?.trim()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — skipping persist",
      );
    }
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
