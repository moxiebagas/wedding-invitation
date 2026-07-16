import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, notConfiguredResponse, unauthorizedResponse } from "@/lib/adminAuth";
import { normalizePhone } from "@/lib/guests";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

const PHONE_RE = /^62\d{8,13}$/;

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return notConfiguredResponse();

  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guests: data });
}

interface GuestInput {
  name?: unknown;
  phone?: unknown;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return notConfiguredResponse();

  const body = await req.json().catch(() => null);
  const rows: GuestInput[] = Array.isArray(body?.guests) ? body.guests : [];

  const valid: { name: string; phone: string }[] = [];
  const seen = new Set<string>();
  let invalid = 0;
  for (const row of rows) {
    const name = typeof row.name === "string" ? row.name.trim().slice(0, 120) : "";
    const phone = normalizePhone(typeof row.phone === "string" ? row.phone : "");
    if (!name || !PHONE_RE.test(phone) || seen.has(phone)) {
      invalid++;
      continue;
    }
    seen.add(phone);
    valid.push({ name, phone });
  }

  if (valid.length === 0) {
    return NextResponse.json({ guests: [], inserted: 0, invalid, duplicate: 0 });
  }

  // ignoreDuplicates + RETURNING only yields rows actually inserted, so any
  // already-existing phone numbers are silently skipped (not overwritten).
  const { data, error } = await supabaseAdmin
    .from("guests")
    .upsert(valid, { onConflict: "phone", ignoreDuplicates: true })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const inserted = data ?? [];
  return NextResponse.json({
    guests: inserted,
    inserted: inserted.length,
    invalid,
    duplicate: valid.length - inserted.length,
  });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return notConfiguredResponse();

  // Require an explicit confirmation flag so "clear everything" can't happen
  // from a bare DELETE (e.g. a stray request or typo'd client code).
  if (req.nextUrl.searchParams.get("confirm") !== "all") {
    return NextResponse.json({ error: "Tambahkan ?confirm=all untuk menghapus semua tamu." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("guests").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
