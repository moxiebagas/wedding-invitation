"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import {
  attendanceLabel,
  isSupabaseConfigured,
  supabase,
  type Attendance,
  type Wish,
} from "@/lib/supabase";
import { cn, timeAgo } from "@/lib/utils";
import { ParallaxBg } from "@/components/ui/ParallaxBg";
import { Reveal } from "@/components/ui/Reveal";

// Dark backdrop shared with the moody slides — swap to a dedicated /images/bg-wishes.* if added.
const WISHES_BG = "/images/bg-bride.png";

// Mockup shows two choices; the Supabase enum still accepts "ragu" if needed later.
const attendanceOptions: { value: Attendance; label: string }[] = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
];

export function Wishes({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Prefill from the ?to= guest, skipping the generic fallback.
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
    setSuccess(null);
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
    setSuccess("Terima kasih! Ucapan Anda telah terkirim.");
  }

  return (
    <section id="ucapan" className="relative w-full overflow-hidden bg-ink px-6 py-20">
      {/* Full-cover backdrop (scroll fade + parallax) + dark overlay */}
      <ParallaxBg src={WISHES_BG} overlayClassName="bg-black/65" />

      <div className="relative z-10">
        <Reveal className="text-center">
          <h2 className="font-script text-4xl text-white sm:text-5xl">Wishes</h2>
        </Reveal>

        {/* ── Form card (glassy, outlined) ─────────────────────── */}
        <Reveal delay={0.1} className="mx-auto mt-8 max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-[26px] border border-white/40 p-5 backdrop-blur-md sm:p-7"
          >
            {/* Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 font-body text-base font-medium text-white">
                <Users className="h-5 w-5" />
                Nama
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                maxLength={80}
                className="w-full rounded-full bg-white/90 px-4 py-2.5 font-body text-base text-ink outline-none ring-1 ring-white/40 transition placeholder:text-ash/60 focus:ring-2 focus:ring-white"
              />
            </div>

            {/* RSVP */}
            <div>
              <label className="mb-2 flex items-center gap-2 font-body text-base font-medium text-white">
                <CalendarCheck className="h-5 w-5" />
                RSVP
              </label>
              <div className="space-y-2 pl-1">
                {attendanceOptions.map((opt) => {
                  const active = attendance === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAttendance(opt.value)}
                      className="flex items-center gap-2.5 font-body text-base text-white"
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 border-white transition",
                          active ? "bg-white" : "bg-transparent",
                        )}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 flex items-center gap-2 font-body text-base font-medium text-white">
                <MessageCircle className="h-5 w-5" />
                Pesan Untuk Mempelai
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan doa & ucapan Anda…"
                rows={4}
                maxLength={1000}
                className="w-full resize-none rounded-3xl bg-white/90 px-4 py-3 font-body text-base text-ink outline-none ring-1 ring-white/40 transition placeholder:text-ash/60 focus:ring-2 focus:ring-white"
              />
            </div>

            {error && (
              <p className="font-body text-sm font-semibold text-white">{error}</p>
            )}
            {success && (
              <p className="font-body text-sm font-semibold text-white/90">{success}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-body text-lg font-medium text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition-[transform,background] duration-300 hover:-translate-y-0.5 hover:bg-graphite disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Kirim
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </Reveal>

        {/* ── Wish list (white cards, scrollable) ──────────────── */}
        <Reveal delay={0.15} className="mx-auto mt-8 max-w-xl">
          {loading ? (
            <p className="text-center font-body text-white/70">Memuat ucapan…</p>
          ) : !isSupabaseConfigured ? (
            <p className="text-center font-body text-white/70">
              Hubungkan Supabase untuk menampilkan ucapan.
            </p>
          ) : wishes.length === 0 ? (
            <p className="text-center font-body text-white/70">
              Jadilah yang pertama memberi ucapan 💌
            </p>
          ) : (
            <div className="no-scrollbar max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {wishes.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                  className="rounded-2xl bg-white p-4 shadow-[0_14px_36px_-20px_rgba(0,0,0,0.7)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="border-b-2 border-ink/70 pb-0.5 font-serif text-lg font-semibold text-ink">
                        {w.guest_name}
                      </span>
                      {w.attendance === "hadir" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-ash/50"
                          title={attendanceLabel[w.attendance]}
                        />
                      )}
                    </div>
                    <span className="shrink-0 font-body text-xs text-ash">
                      {timeAgo(w.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 font-body text-sm leading-relaxed text-graphite">
                    {w.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
