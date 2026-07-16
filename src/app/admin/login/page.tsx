"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, User } from "lucide-react";
import { checkSession, login } from "@/lib/adminSessionApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (valid session cookie)? Skip straight to the dashboard.
  useEffect(() => {
    let active = true;
    checkSession().then((session) => {
      if (!active) return;
      if (session) router.replace("/admin/blast");
      else setCheckingSession(false);
    });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      router.replace("/admin/blast");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
      setSubmitting(false);
    }
  }

  if (checkingSession) {
    return <main className="min-h-screen bg-ink" />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-16">
      {/* Soft radial vignette, echoing the invitation's dark backdrops. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.09),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Monogram seal */}
        <div className="mx-auto mb-6 flex h-20 w-20 flex-col items-center justify-center gap-0.5 rounded-full border border-white/25">
          <span className="font-script text-lg leading-none text-white/85">I</span>
          <span className="font-script text-lg leading-none text-white/85">&amp;</span>
          <span className="font-script text-lg leading-none text-white/85">R</span>
        </div>

        <p className="font-serif text-xs uppercase tracking-[0.4em] text-white/50">Portal Admin</p>
        <h1 className="mt-2 font-script text-4xl text-white sm:text-5xl">Blast Undangan</h1>
        <span className="mx-auto mt-4 block h-px w-16 bg-white/25" />

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div>
            <label
              htmlFor="admin-username"
              className="mb-1.5 flex items-center gap-2 font-body text-sm font-medium text-white/80"
            >
              <User className="h-4 w-4" />
              Username
            </label>
            <input
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              className="w-full rounded-full bg-white/90 px-4 py-2.5 font-body text-base text-ink outline-none ring-1 ring-white/40 transition placeholder:text-ash/60 focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 flex items-center gap-2 font-body text-sm font-medium text-white/80"
            >
              <Lock className="h-4 w-4" />
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-full bg-white/90 px-4 py-2.5 font-body text-base text-ink outline-none ring-1 ring-white/40 transition placeholder:text-ash/60 focus:ring-2 focus:ring-white"
            />
          </div>

          {error && (
            <p role="alert" className="text-center font-body text-sm font-medium text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-body text-lg font-medium text-ink shadow-[0_12px_30px_-12px_rgba(0,0,0,0.9)] transition hover:bg-graphite hover:text-white disabled:opacity-60"
          >
            {submitting ? (
              "Memeriksa…"
            ) : (
              <>
                Masuk
                <LogIn className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <a
          href="/"
          className="mt-8 inline-block font-body text-sm text-white/50 underline-offset-4 transition hover:text-white/80 hover:underline"
        >
          ← Kembali ke undangan
        </a>
      </div>
    </main>
  );
}
