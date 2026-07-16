/**
 * Minimal CSV parse/export — no dependency (avoids pulling in a heavier,
 * historically vulnerable "excel" parsing library for what's really just
 * name+phone rows). Handles quoted fields and both comma/semicolon delimiters
 * since that's what Excel's regional "Save As CSV" tends to produce.
 */

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
const PHONE_HEADERS = ["no hp", "nomor", "nomor hp", "no. hp", "phone", "no telp", "telepon", "whatsapp", "wa", "nomor whatsapp", "no. whatsapp"];

/** Parse a CSV file's text into {name, phone} rows, matching common header names. */
export function parseGuestCsv(text: string): { name: string; phone: string }[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes(";") && !lines[0].includes(",") ? ";" : ",";
  const header = splitLine(lines[0], delimiter).map((h) => h.toLowerCase());

  const nameIdx = header.findIndex((h) => NAME_HEADERS.includes(h));
  const phoneIdx = header.findIndex((h) => PHONE_HEADERS.includes(h));

  // No recognisable header — assume column A = nama, column B = no. HP.
  const hasHeader = nameIdx !== -1 || phoneIdx !== -1;
  const startRow = hasHeader ? 1 : 0;
  const nameCol = nameIdx !== -1 ? nameIdx : 0;
  const phoneCol = phoneIdx !== -1 ? phoneIdx : 1;

  const rows: { name: string; phone: string }[] = [];
  for (let i = startRow; i < lines.length; i++) {
    const cells = splitLine(lines[i], delimiter);
    const name = cells[nameCol]?.trim() ?? "";
    const phone = cells[phoneCol]?.trim() ?? "";
    if (name || phone) rows.push({ name, phone });
  }
  return rows;
}

function toCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function toGuestCsv(rows: { name: string; phone: string; sent: boolean }[]): string {
  const header = "Nama,No. HP,Terkirim";
  const body = rows
    .map((r) => [toCsvCell(r.name), toCsvCell(r.phone), r.sent ? "Ya" : "Belum"].join(","))
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
