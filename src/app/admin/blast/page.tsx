"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Download,
  Link as LinkIcon,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { downloadTextFile, parseGuestCsv, toGuestCsv } from "@/lib/csv";
import {
  buildInvitationLink,
  buildWhatsAppLink,
  DEFAULT_TEMPLATE,
  loadBaseUrl,
  loadTemplate,
  normalizePhone,
  renderMessage,
  saveBaseUrl,
  saveTemplate,
  type Guest,
} from "@/lib/guests";
import { addGuests, clearAllGuests, deleteGuest, fetchGuests, setGuestSent } from "@/lib/guestsApi";
import { checkSession, logout } from "@/lib/adminSessionApi";

type Filter = "all" | "sent" | "unsent";

export default function BlastAdminPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [prefsHydrated, setPrefsHydrated] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Require a valid session; bounce to the login page otherwise.
  useEffect(() => {
    let active = true;
    checkSession().then((session) => {
      if (!active) return;
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setUsername(session.username);
      setAuthChecking(false);
      fetchGuests()
        .then((data) => active && setGuests(data))
        .catch((err) => active && setListError(err instanceof Error ? err.message : "Gagal memuat data."));
    });
    return () => {
      active = false;
    };
  }, [router]);

  // UI prefs (base URL + message template) are non-sensitive, so they stay local.
  useEffect(() => {
    setBaseUrl(loadBaseUrl());
    setTemplate(loadTemplate());
    setPrefsHydrated(true);
  }, []);
  useEffect(() => {
    if (prefsHydrated) saveBaseUrl(baseUrl);
  }, [baseUrl, prefsHydrated]);
  useEffect(() => {
    if (prefsHydrated) saveTemplate(template);
  }, [template, prefsHydrated]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (filter === "sent" && !g.sent) return false;
      if (filter === "unsent" && g.sent) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!g.name.toLowerCase().includes(q) && !g.phone.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [guests, filter, search]);

  const sentCount = guests.filter((g) => g.sent).length;

  async function handleAddManual(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const result = await addGuests([{ name, phone }]);
      if (result.inserted === 0) {
        setFormError(
          result.duplicate > 0
            ? "Nomor ini sudah ada di daftar."
            : "Nama & nomor WhatsApp wajib diisi dengan format yang benar.",
        );
        return;
      }
      setGuests((prev) => [...prev, ...result.guests]);
      setName("");
      setPhone("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menambah tamu.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileUpload(file: File) {
    setImportNotice(null);
    try {
      const text = await file.text();
      const rows = parseGuestCsv(text);
      const result = await addGuests(rows);
      setGuests((prev) => [...prev, ...result.guests]);
      setImportNotice(
        `${result.inserted} tamu ditambahkan dari file${
          result.invalid + result.duplicate > 0
            ? `, ${result.invalid + result.duplicate} baris dilewati (nomor tidak valid/duplikat)`
            : ""
        }.`,
      );
    } catch (err) {
      setImportNotice(err instanceof Error ? err.message : "Gagal mengimpor file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    const prev = guests;
    setGuests((cur) => cur.filter((g) => g.id !== id));
    try {
      await deleteGuest(id);
    } catch (err) {
      setGuests(prev);
      setListError(err instanceof Error ? err.message : "Gagal menghapus tamu.");
    }
  }

  async function handleClearAll() {
    if (guests.length === 0) return;
    if (!window.confirm(`Hapus semua ${guests.length} tamu dari daftar? Tindakan ini tidak bisa dibatalkan.`)) return;
    const prev = guests;
    setGuests([]);
    try {
      await clearAllGuests();
    } catch (err) {
      setGuests(prev);
      setListError(err instanceof Error ? err.message : "Gagal menghapus semua tamu.");
    }
  }

  async function handleToggleSent(guest: Guest) {
    const nextSent = !guest.sent;
    setGuests((cur) => cur.map((g) => (g.id === guest.id ? { ...g, sent: nextSent } : g)));
    try {
      await setGuestSent(guest.id, nextSent);
    } catch (err) {
      setGuests((cur) => cur.map((g) => (g.id === guest.id ? { ...g, sent: guest.sent } : g)));
      setListError(err instanceof Error ? err.message : "Gagal memperbarui status.");
    }
  }

  function handleExport() {
    const csv = toGuestCsv(guests);
    downloadTextFile("daftar-tamu-undangan.csv", csv);
  }

  async function handleCopyLink(guest: Guest) {
    const link = buildInvitationLink(baseUrl, guest.name);
    await navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId((cur) => (cur === guest.id ? null : cur)), 1500);
  }

  function handleSendWhatsApp(guest: Guest) {
    const link = buildInvitationLink(baseUrl, guest.name);
    const message = renderMessage(template, guest.name, link);
    window.open(buildWhatsAppLink(guest.phone, message), "_blank", "noopener,noreferrer");
    if (!guest.sent) handleToggleSent(guest);
  }

  if (authChecking) {
    return <main className="min-h-screen bg-mist" />;
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-xs uppercase tracking-[0.4em] text-ash">Portal Admin</p>
            <h1 className="mt-1 font-script text-4xl leading-tight text-graphite sm:text-5xl">Blast Undangan</h1>
            <span className="mt-3 block h-px w-16 bg-ink/20" />
            <p className="mt-4 max-w-2xl font-body text-lg text-ash">
              Kelola daftar tamu, lalu buka setiap tautan WhatsApp untuk mengirim undangan satu per satu.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
            {username && <p className="font-body text-sm text-ash">Masuk sebagai {username}</p>}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-white px-4 py-2 font-body text-sm font-medium text-ink transition hover:bg-ink/5"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </header>

        {listError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-body text-sm text-red-700">
            {listError}
          </p>
        )}

        {/* ── Settings: base URL + message template ─────────────── */}
        <section className="paper-card mb-6 p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-ink">
            <LinkIcon className="h-5 w-5" />
            Pengaturan Tautan &amp; Pesan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="base-url" className="mb-1.5 block font-body text-sm font-medium text-graphite">
                URL Undangan
              </label>
              <input
                id="base-url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://undangan-domain-anda.com"
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 font-body text-base text-ink outline-none transition focus:border-ink/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-graphite">
                Contoh tautan yang dihasilkan
              </label>
              <p className="truncate rounded-xl border border-dashed border-ink/15 bg-white px-3.5 py-2.5 font-body text-sm text-ash">
                {baseUrl ? buildInvitationLink(baseUrl, "Nama Tamu") : "Isi URL undangan terlebih dahulu"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="template" className="mb-1.5 block font-body text-sm font-medium text-graphite">
              Template pesan WhatsApp — gunakan <code className="rounded bg-ink/5 px-1">{"{nama}"}</code> dan{" "}
              <code className="rounded bg-ink/5 px-1">{"{link}"}</code>
            </label>
            <textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 font-body text-base text-ink outline-none transition focus:border-ink/40"
            />
          </div>
        </section>

        {/* ── Add guests: manual + CSV import ─────────────────────── */}
        <section className="paper-card mb-6 p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-ink">
            <Users className="h-5 w-5" />
            Tambah Tamu
          </h2>

          <form onSubmit={handleAddManual} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="guest-name" className="mb-1.5 block font-body text-sm font-medium text-graphite">
                Nama
              </label>
              <input
                id="guest-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Tamu"
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 font-body text-base text-ink outline-none transition focus:border-ink/40"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="guest-phone" className="mb-1.5 block font-body text-sm font-medium text-graphite">
                No. WhatsApp
              </label>
              <input
                id="guest-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 font-body text-base text-ink outline-none transition focus:border-ink/40"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 font-body text-base font-medium text-white transition hover:bg-graphite disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </button>
          </form>
          {formError && <p className="mt-2 font-body text-sm text-red-600">{formError}</p>}

          <div className="my-5 flex items-center gap-3 text-ash">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="font-body text-sm">atau</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 font-body text-base font-medium text-ink transition hover:bg-ink/5"
            >
              <Upload className="h-4 w-4" />
              Upload CSV (dari Excel)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <p className="font-body text-sm text-ash">
              Di Excel: <span className="font-medium">File → Save As → CSV</span>. Kolom: <strong>Nama</strong>,{" "}
              <strong>No. HP</strong> (urutan bebas, atau tanpa header: kolom A = nama, B = nomor).
            </p>
          </div>
          {importNotice && <p className="mt-2 font-body text-sm text-graphite">{importNotice}</p>}
        </section>

        {/* ── Guest list ───────────────────────────────────────────── */}
        <section className="paper-card p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
              Daftar Tamu
              <span className="rounded-full bg-ink/5 px-2.5 py-0.5 font-body text-sm font-normal text-ash">
                {sentCount}/{guests.length} terkirim
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama/nomor…"
                  className="rounded-xl border border-ink/15 bg-white py-2 pl-9 pr-3 font-body text-sm text-ink outline-none transition focus:border-ink/40"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="rounded-xl border border-ink/15 bg-white px-3 py-2 font-body text-sm text-ink outline-none transition focus:border-ink/40"
              >
                <option value="all">Semua</option>
                <option value="sent">Sudah terkirim</option>
                <option value="unsent">Belum terkirim</option>
              </select>
              <button
                type="button"
                onClick={handleExport}
                disabled={guests.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink/20 bg-white px-3 py-2 font-body text-sm font-medium text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={guests.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 font-body text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Semua
              </button>
            </div>
          </div>

          {guests.length === 0 ? (
            <p className="py-10 text-center font-body text-ash">
              Belum ada tamu. Tambahkan secara manual atau upload CSV di atas.
            </p>
          ) : filteredGuests.length === 0 ? (
            <p className="py-10 text-center font-body text-ash">Tidak ada tamu yang cocok dengan pencarian.</p>
          ) : (
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-ink/10 text-left font-body text-sm text-ash">
                    <th className="px-2 py-2 font-medium">Nama</th>
                    <th className="px-2 py-2 font-medium">No. WhatsApp</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-2 py-2 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-ink/5 font-body text-base text-ink">
                      <td className="px-2 py-3">{guest.name}</td>
                      <td className="px-2 py-3 text-ash">+{normalizePhone(guest.phone)}</td>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleSent(guest)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-sm transition",
                            guest.sent ? "bg-ink/90 text-white" : "bg-ink/5 text-ash hover:bg-ink/10",
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                          {guest.sent ? "Terkirim" : "Belum"}
                        </button>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            title="Salin tautan undangan"
                            onClick={() => handleCopyLink(guest)}
                            className="rounded-lg p-2 text-ash transition hover:bg-ink/5 hover:text-ink"
                          >
                            {copiedId === guest.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            title="Kirim via WhatsApp"
                            onClick={() => handleSendWhatsApp(guest)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-body text-sm font-medium text-white transition hover:bg-emerald-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Kirim
                          </button>
                          <button
                            type="button"
                            title="Hapus tamu"
                            onClick={() => handleDelete(guest.id)}
                            className="rounded-lg p-2 text-ash transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-6 flex items-center gap-1.5 font-body text-sm text-ash">
          <Send className="h-3.5 w-3.5" />
          Tiap klik &quot;Kirim&quot; membuka WhatsApp dengan pesan siap kirim — Anda tetap menekan tombol kirim di
          WhatsApp. Ini menghindari akun terkena batasan WhatsApp karena pengiriman otomatis.
        </p>
      </div>
    </main>
  );
}
