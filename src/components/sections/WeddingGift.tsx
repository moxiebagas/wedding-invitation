"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Copy, Gift, MapPin, Nfc, Wallet } from "lucide-react";
import { config, type BankAccount, type EWalletAccount } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ParallaxBg } from "@/components/ui/ParallaxBg";
import { Reveal } from "@/components/ui/Reveal";

// Shared backdrop asset that already exists in /public/images but isn't used
// by any other section yet (Wishes still uses bg-bride.png).
const GIFT_BG = "/images/bg-wishes.png";

/* ── Clipboard helper ───────────────────────────────────────────────────── */

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

/* ── Cards ──────────────────────────────────────────────────────────────── */

function CopyButton({
  copied,
  onClick,
  label,
  className,
}: {
  copied: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 font-body text-sm font-medium text-paper transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-graphite focus-visible:-translate-y-0.5 focus-visible:bg-graphite active:translate-y-0",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Tersalin
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Salin Nomor Rekening
        </>
      )}
    </button>
  );
}

/** Stylised EMV chip drawn inline so it inherits the monochrome theme. */
function CardChip() {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 44 32"
      aria-hidden="true"
      className="h-8 w-11 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f2ea" />
          <stop offset="45%" stopColor="#cfc8b8" />
          <stop offset="100%" stopColor="#e8e2d4" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="42" height="30" rx="6" fill={`url(#${gradientId})`} />
      <rect x="1" y="1" width="42" height="30" rx="6" fill="none" stroke="rgba(20,20,20,0.35)" />
      <path
        d="M1 11h13a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H1M43 11H30a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h13M22 1v10M22 21v10"
        fill="none"
        stroke="rgba(20,20,20,0.35)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Splits "Bank Central Asia (BCA)" into short code + full name. */
function bankNameParts(bank: string): { short: string; full: string } {
  const match = bank.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) return { short: match[2], full: match[1] };
  return { short: bank, full: "" };
}

/** Groups digits in fours for a card-number look: "6871 4236 92". */
function formatCardNumber(value: string): string {
  return value.trim().replace(/(\d{4})(?=\d)/g, "$1 ");
}

function BankCard({
  account,
  copied,
  onCopy,
  delay,
}: {
  account: BankAccount;
  copied: boolean;
  onCopy: () => void;
  delay: number;
}) {
  const { short, full } = bankNameParts(account.bank);

  return (
    <Reveal direction="up" delay={delay} className="w-full">
      <div className="flex h-full flex-col">
        {/* ATM-style card face */}
        <div className="group relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#3d3d3d] via-graphite to-ink text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
          {/* Soft diagonal sheen */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_12%_-10%,rgba(255,255,255,0.16),transparent_55%)]" />
          {/* Fine texture lines */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(115deg,transparent,transparent_5px,white_5px,white_6px)]" />
          {/* Script monogram watermark (matches the Photo fallback) */}
          <span className="pointer-events-none absolute -bottom-4 -right-1 select-none font-script text-[6.5rem] leading-none text-white/[0.07]">
            I&nbsp;&amp;&nbsp;R
          </span>

          <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
            {/* Top row: chip + contactless / bank identity */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CardChip />
                <Nfc className="h-5 w-5 text-white/60" aria-hidden="true" />
              </div>
              <div className="text-right">
                <p className="font-serif text-xl font-semibold tracking-wide text-paper">
                  {short}
                </p>
                {full && (
                  <p className="mt-0.5 font-body text-[11px] uppercase tracking-[0.18em] text-white/55">
                    {full}
                  </p>
                )}
              </div>
            </div>

            {/* Account number */}
            <p className="select-all font-body text-[1.35rem] tracking-[0.22em] text-paper tabular-nums [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:text-2xl">
              {formatCardNumber(account.accountNumber)}
            </p>

            {/* Bottom row: holder / card type */}
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.22em] text-white/50">
                  Pemilik Rekening
                </p>
                <p className="mt-0.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-paper">
                  {account.accountHolder}
                </p>
              </div>
              <p className="font-serif text-xs italic tracking-[0.2em] text-white/60">
                DEBIT
              </p>
            </div>
          </div>
        </div>

        <CopyButton
          copied={copied}
          onClick={onCopy}
          label={`Salin nomor rekening ${account.bank} ${account.accountNumber}`}
          className="bg-paper text-ink hover:bg-mist hover:text-ink focus-visible:bg-mist focus-visible:text-ink"
        />
      </div>
    </Reveal>
  );
}

function EWalletCard({
  wallet,
  copied,
  onCopy,
  delay,
}: {
  wallet: EWalletAccount;
  copied: boolean;
  onCopy: () => void;
  delay: number;
}) {
  return (
    <Reveal direction="up" delay={delay} className="w-full">
      <div className="paper-card h-full px-6 py-7 text-center transition-shadow duration-300 hover:shadow-[0_26px_60px_-24px_rgba(20,20,20,0.45)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-mist text-ink">
          {wallet.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wallet.logo} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <Wallet className="h-5 w-5" />
          )}
        </div>

        <h3 className="mt-3 font-serif text-lg font-semibold text-graphite">
          {wallet.name}
        </h3>

        {wallet.qrImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wallet.qrImage}
            alt={`Kode QR ${wallet.name}`}
            className="mx-auto mt-3 h-36 w-36 rounded-xl border border-ink/10 object-contain"
          />
        )}

        {wallet.accountNumber && (
          <>
            <p className="mt-2 select-all font-body text-xl tracking-[0.15em] text-ink">
              {wallet.accountNumber}
            </p>
            <CopyButton
              copied={copied}
              onClick={onCopy}
              label={`Salin nomor ${wallet.name} ${wallet.accountNumber}`}
            />
          </>
        )}
      </div>
    </Reveal>
  );
}

function AddressCard({
  copied,
  onCopy,
  delay,
}: {
  copied: boolean;
  onCopy: () => void;
  delay: number;
}) {
  const { recipient, address } = config.gift.address;
  return (
    <Reveal direction="up" delay={delay} className="mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-7 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white">
          <MapPin className="h-5 w-5" />
        </div>

        <h3 className="mt-3 font-serif text-lg font-semibold text-paper">
          {recipient}
        </h3>
        <p className="mt-2 font-body text-base leading-relaxed text-white/75">{address}</p>

        <button
          type="button"
          onClick={onCopy}
          aria-label={`Salin alamat pengiriman: ${address}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/70 px-4 py-2.5 font-body text-sm text-white transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-white focus-visible:text-ink active:translate-y-0 sm:w-auto sm:mx-auto"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Salin Alamat
            </>
          )}
        </button>
      </div>
    </Reveal>
  );
}

/* ── Toast ──────────────────────────────────────────────────────────────── */

function Toast({ message }: { message: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-6">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-body text-sm text-paper shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)]"
          >
            <Check className="h-4 w-4" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

export function WeddingGift() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    };
  }, []);

  async function handleCopy(key: string, value: string, successMessage: string) {
    const ok = await copyText(value);

    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(ok ? successMessage : "Gagal menyalin. Coba salin manual.");
    toastTimeout.current = setTimeout(() => setToast(null), 2200);

    if (ok) {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
      setCopiedKey(key);
      copiedTimeout.current = setTimeout(() => setCopiedKey(null), 1800);
    }
  }

  const banks = config.gift.banks;
  // const eWallets = config.gift.eWallets;

  return (
    <section id="hadiah" className="relative w-full overflow-hidden bg-ink px-6 py-20">
      {/* Full-cover backdrop (scroll fade + parallax) + dark overlay */}
      <ParallaxBg src={GIFT_BG} overlayClassName="bg-black/70" />

      <div className="relative z-10">
        <Reveal className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white">
            <Gift className="h-5 w-5" />
          </div>
          <h2 className="mt-3 font-script text-4xl leading-tight text-white sm:text-5xl">
            Wedding Gift
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-4 max-w-md text-center">
          <p className="font-body text-base leading-relaxed text-white/85">
            {config.gift.note}
          </p>
        </Reveal>

        {/* Toggle: only the title + note show by default; tap to reveal the cards */}
        <Reveal delay={0.14} className="mt-7 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="hadiah-detail"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/60 px-5 py-2 font-body text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink"
          >
            {expanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </Reveal>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id="hadiah-detail"
              key="hadiah-detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {/* Bank accounts + optional e-wallets */}
              <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
                {banks.map((account, i) => (
                  <BankCard
                    key={`bank-${account.bank}`}
                    account={account}
                    copied={copiedKey === `bank-${i}`}
                    onCopy={() =>
                      handleCopy(
                        `bank-${i}`,
                        account.accountNumber,
                        `Nomor rekening ${account.bank} disalin`,
                      )
                    }
                    delay={0.06 * i}
                  />
                ))}

                {/* {eWallets.map((wallet, i) => (
                  <EWalletCard
                    key={`ewallet-${wallet.name}`}
                    wallet={wallet}
                    copied={copiedKey === `ewallet-${i}`}
                    onCopy={() =>
                      wallet.accountNumber &&
                      handleCopy(
                        `ewallet-${i}`,
                        wallet.accountNumber,
                        `Nomor ${wallet.name} disalin`,
                      )
                    }
                    delay={0.06 * (banks.length + i)}
                  />
                ))} */}
              </div>

              {/* Gift delivery address */}
              <div className="mt-6 pb-1">
                <AddressCard
                  copied={copiedKey === "address"}
                  onCopy={() =>
                    handleCopy(
                      "address",
                      config.gift.address.address,
                      "Alamat pengiriman disalin",
                    )
                  }
                  delay={0.06 * banks.length}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast message={toast} />
    </section>
  );
}
