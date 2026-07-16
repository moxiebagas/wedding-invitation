import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for the guest list, authenticated with the
 * service_role key (bypasses Row Level Security). Only import this from
 * route handlers under src/app/api/** — never from a "use client" component,
 * since SUPABASE_SERVICE_ROLE_KEY (unlike NEXT_PUBLIC_* vars) must never
 * reach the browser bundle.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(url && serviceRoleKey);

export const supabaseAdmin: SupabaseClient | null = isSupabaseAdminConfigured
  ? createClient(url as string, serviceRoleKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
