#!/usr/bin/env node
/**
 * Create/update the /admin/blast login (stored in Supabase's `admin_users`
 * table, service_role-only — see supabase/schema.sql). Plain node, no extra
 * dependency: password hashing reimplements src/lib/password.ts's scrypt
 * scheme so the login route can verify it, and Supabase is called directly
 * over its REST API (fetch) rather than via @supabase/supabase-js — the SDK
 * unconditionally spins up a Realtime/WebSocket client on construction,
 * which errors out on Node < 22 outside a browser/Next.js runtime. This
 * script only needs a single upsert, so plain REST avoids that entirely.
 *
 * Usage: node scripts/set-admin-user.mjs <username> <password>
 */
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const env = {};
  let text;
  try {
    text = readFileSync(envPath, "utf8");
  } catch {
    return env;
  }
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const [, , username, password] = process.argv;
if (!username || !password) {
  console.error("Usage: node scripts/set-admin-user.mjs <username> <password>");
  process.exit(1);
}
if (username.length < 3 || username.length > 40) {
  console.error("Username harus 3–40 karakter.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password minimal 8 karakter.");
  process.exit(1);
}

const fileEnv = loadEnvLocal();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fileEnv.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? fileEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local.");
  process.exit(1);
}

const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/admin_users?on_conflict=username`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify([{ username, password_hash: hashPassword(password) }]),
});

if (!res.ok) {
  const text = await res.text().catch(() => "");
  console.error(`Gagal menyimpan admin user (${res.status}): ${text}`);
  process.exit(1);
}

console.log(`Admin user "${username}" tersimpan. Login di /admin/login.`);
