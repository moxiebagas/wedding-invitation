"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Send, UserRound } from "lucide-react";
import {
  attendanceLabel,
  isSupabaseConfigured,
  supabase,
  type Attendance,
  type Wish,
} from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

const attendanceOptions: { value: Attendance; label: string }[] = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
  { value: "ragu", label: "Masih Ragu" },
];

// Monochrome attendance chips — distinguished by fill weight, not colour.
const badgeStyles: Record<Attendance, string> = {
  hadir: "bg-ink text-white border-ink",
  tidak_hadir: "bg-white text-ink border-ink/30",
  ragu: "bg-ink/10 text-ink border-ink/20",
};

export function Wishes({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill the name from the ?to= guest, but only the generic fallback is skipped.
  useEffect(() => {
    if (defaultName && defaultName !== "Tamu Undangan") setName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!active) return;
      if (error) setError("Gagal memuat ucapan.");
      else setWishes((data as Wish[]) ?? []);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }
    if (!supabase) {
      setError("Database belum dikonfigurasi. Lengkapi NEXT_PUBLIC_SUPABASE_* di .env.local.");
      return;
    }

    setSubmitting(true);
    const payload = {
      guest_name: name.trim().slice(0, 80),
      attendance,
      message: message.trim().slice(0, 1000),
    };
    const { data, error } = await supabase
      .from("wishes")
      .insert(payload)
      .select()
      .single();
    setSubmitting(false);

    if (error) {
      setError("Gagal mengirim ucapan. Coba lagi.");
      return;
    }
    setWishes((prev) => [data as Wish, ...prev]);
    setMessage("");
  }

  return (
    <section id="ucapan" className="relative w-full bg-mist px-6 py-20">
      <SectionTitle overline="DOA &amp; UCAPAN" script="Wishes" />

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl">
        <form onSubmit={handleSubmit} className="paper-card space-y-4 p-6">
          <div>
            <label className="mb-1 block font-body text-sm text-ash">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              maxLength={80}
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 font-body text-base text-ink outline-none transition-colors placeholder:text-ash/60 focus:border-ink"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-body text-sm text-ash">Kehadiran</label>
            <div className="grid grid-cols-3 gap-2">
              {attendanceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAttendance(opt.value)}
                  className={`rounded-xl border px-2 py-2 font-body text-sm transition-colors ${
                    attendance === opt.value
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-ash hover:border-ink/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-ash">
              Pesan untuk Mempelai
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan doa & ucapan Anda…"
              rows={4}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-ink/15 bg-white px-4 py-2.5 font-body text-base text-ink outline-none transition-colors placeholder:text-ash/60 focus:border-ink"
            />
          </div>

          {error && (
            <p className="font-body text-sm font-semibold italic text-ink">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-body text-lg font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Kirim
          </button>
        </form>
      </Reveal>

      {/* Wish list */}
      <Reveal delay={0.15} className="mx-auto mt-8 max-w-xl space-y-3">
        {loading ? (
          <p className="text-center font-body text-ash">Memuat ucapan…</p>
        ) : !isSupabaseConfigured ? (
          <p className="text-center font-body text-ash">
            Hubungkan Supabase untuk menampilkan ucapan.
          </p>
        ) : wishes.length === 0 ? (
          <p className="text-center font-body text-ash">
            Jadilah yang pertama memberi ucapan 💌
          </p>
        ) : (
          wishes.map((w) => (
            <div key={w.id} className="paper-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-ink">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <span className="font-serif text-lg text-ink">{w.guest_name}</span>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-body text-xs ${badgeStyles[w.attendance]}`}
                >
                  {attendanceLabel[w.attendance]}
                </span>
              </div>
              <p className="mt-2 font-body text-base leading-relaxed text-graphite">
                {w.message}
              </p>
              <p className="mt-2 font-body text-xs text-ash">{timeAgo(w.created_at)}</p>
            </div>
          ))
        )}
      </Reveal>
    </section>
  );
}
