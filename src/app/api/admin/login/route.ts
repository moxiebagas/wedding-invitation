import { NextRequest, NextResponse } from "next/server";
import { createSessionCookieValue, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/adminSession";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/password";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Server belum dikonfigurasi. Set SUPABASE_SERVICE_ROLE_KEY & ADMIN_SESSION_SECRET di .env.local." },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username & password wajib diisi." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("username, password_hash")
    .eq("username", username)
    .maybeSingle();

  // A real query failure (e.g. the `admin_users` table doesn't exist yet)
  // must not be reported as "wrong password" — that would mask a setup
  // problem behind a misleading, unfixable-looking error.
  if (error) {
    return NextResponse.json({ error: `Gagal memeriksa akun: ${error.message}` }, { status: 500 });
  }

  let valid = false;
  if (data) {
    valid = verifyPassword(password, data.password_hash);
  } else {
    // Run a decoy hash check so a nonexistent username doesn't respond
    // measurably faster than a real one (timing side-channel).
    verifyPassword(password, DUMMY_PASSWORD_HASH);
  }

  if (!valid) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const cookieValue = createSessionCookieValue(username);
  if (!cookieValue) {
    return NextResponse.json({ error: "Server belum dikonfigurasi (ADMIN_SESSION_SECRET)." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
