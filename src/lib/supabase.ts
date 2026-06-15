import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client used by the RSVP / "Doa & Ucapan" section.
 * Only the public anon key is used; row-level security (see supabase/schema.sql)
 * restricts the `rsvps` table to public SELECT + INSERT (never update/delete).
 * Credentials come from env vars — never hardcode them.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export type AttendanceStatus = "attending" | "not_attending" | "maybe";

export interface RSVP {
  id: string;
  guest_name: string;
  attendance_status: AttendanceStatus;
  message: string | null;
  created_at: string;
}

/** Indonesian display labels for each attendance status. */
export const attendanceLabel: Record<AttendanceStatus, string> = {
  attending: "Hadir",
  not_attending: "Tidak Hadir",
  maybe: "Masih Ragu",
};
