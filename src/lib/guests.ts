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

export interface Guest {
  id: string;
  name: string;
  phone: string;
  sent: boolean;
  created_at: string;
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
