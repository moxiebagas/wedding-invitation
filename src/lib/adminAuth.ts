import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/adminSession";

export function isAdminAuthorized(req: NextRequest): boolean {
  return getSession(req) !== null;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Sesi berakhir, silakan login kembali." }, { status: 401 });
}

export function notConfiguredResponse() {
  return NextResponse.json(
    {
      error:
        "Server belum dikonfigurasi. Set SUPABASE_SERVICE_ROLE_KEY & ADMIN_SESSION_SECRET di .env.local, lalu restart dev server.",
    },
    { status: 500 },
  );
}
