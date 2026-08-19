import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, notConfiguredResponse, unauthorizedResponse } from "@/lib/adminAuth";
import { detectContactType, isValidContact, normalizeContact, type ContactType } from "@/lib/guests";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

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
  inviterName?: unknown;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return notConfiguredResponse();

  const body = await req.json().catch(() => null);
  const rows: GuestInput[] = Array.isArray(body?.guests) ? body.guests : [];

  // "phone" can be a WhatsApp number OR an Instagram handle — contactType
  // records which one so the rest of the app knows how to render/send it.
  const valid: { name: string; phone: string; inviterName?: string; contactType: ContactType }[] = [];
  const seen = new Set<string>();
  let invalid = 0;
  for (const row of rows) {
    const name = typeof row.name === "string" ? row.name.trim().slice(0, 120) : "";
    const rawContact = typeof row.phone === "string" ? row.phone : "";
    const contactType = detectContactType(rawContact);
    const phone = normalizeContact(rawContact, contactType);
    const inviterName = typeof row.inviterName === "string" ? row.inviterName.trim().slice(0, 120) : undefined;
    if (!name || !isValidContact(rawContact, contactType) || seen.has(phone)) {
      invalid++;
      continue;
    }
    seen.add(phone);
    valid.push({ name, phone, inviterName, contactType });
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
