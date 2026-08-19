/**
 * Guest-list types + shared helpers for the /admin/blast feature.
 *
 * Guest records (name, phone, sent) live in the Supabase `guests` table,
 * accessed only through /api/admin/guests — never directly from the browser
 * with the public anon key. See src/lib/supabaseAdmin.ts and
 * supabase/schema.sql for why: guest phone numbers are private, unlike the
 * public RSVP book, so RLS denies the anon key entirely.
 *
 * The pure helpers below (phone normalisation, link building) have no
 * browser-only APIs, so they're safe to import from both the client page and
 * the server route handlers.
 */

export type ContactType = "whatsapp" | "instagram";

export interface Guest {
  id: string;
  name: string;
  phone: string;
  /** How `phone` should be interpreted — a WhatsApp number or an Instagram handle. Defaults to "whatsapp" for older rows. */
  contactType?: ContactType;
  sent: boolean;
  created_at: string;
  inviterName?: string;
}

const TEMPLATE_KEY = "wedding-blast-template";
const BASE_URL_KEY = "wedding-blast-base-url";

export const DEFAULT_TEMPLATE =
  "Assalamu'alaikum {nama},\n\nKami mengundang Anda untuk hadir di acara pernikahan kami. Berikut undangan digital kami, mohon kesediaannya untuk membuka:\n{link}\n\nMerupakan suatu kehormatan & kebahagiaan bagi kami apabila Anda berkenan hadir. Terima kasih 🙏";

function isBrowser() {
  return typeof window !== "undefined";
}

// Template + base URL are just UI preferences (not sensitive), so they stay
// in localStorage rather than round-tripping to the server.
export function loadTemplate(): string {
  if (!isBrowser()) return DEFAULT_TEMPLATE;
  return window.localStorage.getItem(TEMPLATE_KEY) ?? DEFAULT_TEMPLATE;
}

export function saveTemplate(template: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TEMPLATE_KEY, template);
}

export function loadBaseUrl(): string {
  if (!isBrowser()) return "";
  return window.localStorage.getItem(BASE_URL_KEY) ?? window.location.origin;
}

export function saveBaseUrl(url: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(BASE_URL_KEY, url);
}

/**
 * Normalise a loosely-formatted Indonesian phone number to the digits-only
 * "62xxxxxxxxxx" form that wa.me links (and the `guests.phone` column) use.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

/** True if `phone` normalises to a plausible Indonesian mobile number. */
export function isValidPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  return /^62\d{8,13}$/.test(normalized);
}

export function buildInvitationLink(baseUrl: string, name: string): string {
  const trimmedBase = baseUrl.trim().replace(/\/+$/, "");
  return `${trimmedBase}/?to=${encodeURIComponent(name)}`;
}

/** Fill `{nama}` / `{link}` placeholders in the message template. */
export function renderMessage(template: string, name: string, link: string): string {
  return template.replaceAll("{nama}", name).replaceAll("{link}", link);
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

// ── Instagram (alternative contact channel) ─────────────────────────────
//
// A guest's contact field can hold either a WhatsApp number or an Instagram
// handle. We guess which one from the raw text: anything that's "mostly
// digits" is treated as a phone number, anything else (letters, an "@"
// prefix, or an instagram.com URL) is treated as a handle.

const PHONE_LIKE_RE = /^[\d+\-\s()]+$/;

/** Guess whether a raw contact value looks like a WhatsApp number or an Instagram handle. */
export function detectContactType(raw: string): ContactType {
  const trimmed = raw.trim();
  if (!trimmed) return "whatsapp";
  if (trimmed.startsWith("@") || /instagram\.com/i.test(trimmed)) return "instagram";
  return PHONE_LIKE_RE.test(trimmed) ? "whatsapp" : "instagram";
}

/** Normalise an Instagram handle: strips "@", full URL, trailing slash/query, lowercases. */
export function normalizeInstagramUsername(raw: string): string {
  const withoutUrl = raw.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  const withoutAt = withoutUrl.replace(/^@/, "");
  const withoutTrailing = withoutAt.split(/[/?]/)[0];
  return withoutTrailing.toLowerCase();
}

/** True if `raw` normalises to a syntactically valid Instagram username. */
export function isValidInstagramUsername(raw: string): boolean {
  const normalized = normalizeInstagramUsername(raw);
  return (
    /^[a-z0-9._]{1,30}$/.test(normalized) &&
    !normalized.includes("..") &&
    !normalized.startsWith(".") &&
    !normalized.endsWith(".")
  );
}

/** Normalise a raw contact value according to its (detected) type. */
export function normalizeContact(raw: string, type: ContactType = detectContactType(raw)): string {
  return type === "instagram" ? normalizeInstagramUsername(raw) : normalizePhone(raw);
}

/** True if `raw` is a valid contact for its (detected) type. */
export function isValidContact(raw: string, type: ContactType = detectContactType(raw)): boolean {
  return type === "instagram" ? isValidInstagramUsername(raw) : isValidPhone(raw);
}

/** Human-friendly display for a stored contact value, e.g. "+62812…" or "@rafi.herman". */
export function formatContactDisplay(phone: string, contactType: ContactType = "whatsapp"): string {
  return contactType === "instagram" ? `@${phone}` : `+${phone}`;
}

export function buildInstagramLink(username: string): string {
  return `https://instagram.com/${normalizeInstagramUsername(username)}`;
}
