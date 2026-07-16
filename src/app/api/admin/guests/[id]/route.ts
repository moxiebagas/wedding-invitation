import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, notConfiguredResponse, unauthorizedResponse } from "@/lib/adminAuth";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return notConfiguredResponse();

  const body = await req.json().catch(() => null);
  if (typeof body?.sent !== "boolean") {
    return NextResponse.json({ error: "Field 'sent' (boolean) wajib diisi." }, { status: 400 });
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("guests")
    .update({ sent: body.sent })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guest: data });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return notConfiguredResponse();

  const { id } = await params;
  const { error } = await supabaseAdmin.from("guests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
