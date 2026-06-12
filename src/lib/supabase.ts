import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client used by the "Doa & Ucapan" (RSVP) section.
 * Only the public anon key is used; row-level security policies (see
 * supabase/schema.sql) restrict access to public SELECT + INSERT on `wishes`.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export type Attendance = "hadir" | "tidak_hadir" | "ragu";

export interface Wish {
  id: string;
  guest_name: string;
  attendance: Attendance;
  message: string;
  created_at: string;
}

export const attendanceLabel: Record<Attendance, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
  ragu: "Masih Ragu",
};
