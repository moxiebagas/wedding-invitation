/**
 * Minimal CSV parse/export — no dependency (avoids pulling in a heavier,
 * historically vulnerable "excel" parsing library for what's really just
 * name+phone rows). Handles quoted fields and both comma/semicolon delimiters
 * since that's what Excel's regional "Save As CSV" tends to produce.
 */

import { formatContactDisplay, type ContactType } from "@/lib/guests";

function splitLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

const NAME_HEADERS = ["nama", "name", "nama tamu", "guest", "guest name"];
// "Kontak" is now WhatsApp-or-Instagram, so this recognises both kinds of header.
const CONTACT_HEADERS = [
  "no hp", "nomor", "nomor hp", "no. hp", "phone", "no telp", "telepon",
  "whatsapp", "wa", "nomor whatsapp", "no. whatsapp",
  "instagram", "ig", "username ig", "username instagram", "kontak",
];
const INVITER_HEADERS = ["nama pengundang", "pengundang", "inviter", "inviter name", "diundang oleh"];

/** Parse a CSV file's text into {name, phone, inviterName} rows, matching common header names.
 *  `phone` may hold either a WhatsApp number or an Instagram handle — the caller
 *  (the /api/admin/guests endpoint) detects which one it is. */
export function parseGuestCsv(text: string): { name: string; phone: string; inviterName?: string }[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes(";") && !lines[0].includes(",") ? ";" : ",";
  const header = splitLine(lines[0], delimiter).map((h) => h.toLowerCase());

  const nameIdx = header.findIndex((h) => NAME_HEADERS.includes(h));
  const contactIdx = header.findIndex((h) => CONTACT_HEADERS.includes(h));
  const inviterIdx = header.findIndex((h) => INVITER_HEADERS.includes(h));

  // No recognisable header — assume column A = nama, B = kontak, C = pengundang.
  const hasHeader = nameIdx !== -1 || contactIdx !== -1 || inviterIdx !== -1;
  const startRow = hasHeader ? 1 : 0;
  const nameCol = nameIdx !== -1 ? nameIdx : 0;
  const contactCol = contactIdx !== -1 ? contactIdx : 1;
  const inviterCol = inviterIdx !== -1 ? inviterIdx : 2;

  const rows: { name: string; phone: string; inviterName?: string }[] = [];
  for (let i = startRow; i < lines.length; i++) {
    const cells = splitLine(lines[i], delimiter);
    const name = cells[nameCol]?.trim() ?? "";
    const phone = cells[contactCol]?.trim() ?? "";
    const inviterName = cells[inviterCol]?.trim() || undefined;
    if (name || phone) rows.push({ name, phone, inviterName });
  }
  return rows;
}

function toCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function toGuestCsv(
  rows: { name: string; phone: string; contactType?: ContactType; inviterName?: string; sent: boolean }[],
): string {
  const header = "Nama,Kontak (WA/IG),Nama Pengundang,Terkirim";
  const body = rows
    .map((r) =>
      [
        toCsvCell(r.name),
        toCsvCell(formatContactDisplay(r.phone, r.contactType ?? "whatsapp")),
        toCsvCell(r.inviterName ?? ""),
        r.sent ? "Ya" : "Belum",
      ].join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
