"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Copy, Gift, Landmark, MapPin, Wallet } from "lucide-react";
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
}: {
  copied: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 font-body text-sm font-medium text-paper transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-graphite focus-visible:-translate-y-0.5 focus-visible:bg-graphite active:translate-y-0"
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
  return (
    <Reveal direction="up" delay={delay} className="w-full">
      <div className="paper-card h-full px-6 py-7 text-center transition-shadow duration-300 hover:shadow-[0_26px_60px_-24px_rgba(20,20,20,0.45)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-mist text-ink">
          {account.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={account.logo} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <Landmark className="h-5 w-5" />
          )}
        </div>

        <h3 className="mt-3 font-serif text-lg font-semibold text-graphite">
          {account.bank}
        </h3>
        <p className="mt-1 font-body text-sm text-ash">{account.accountHolder}</p>
        <p className="mt-2 select-all font-body text-xl tracking-[0.15em] text-ink">
          {account.accountNumber}
        </p>

        <CopyButton
          copied={copied}
          onClick={onCopy}
          label={`Salin nomor rekening ${account.bank} ${account.accountNumber}`}
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
      <div className="paper-card px-6 py-7 text-center transition-shadow duration-300 hover:shadow-[0_26px_60px_-24px_rgba(20,20,20,0.45)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-mist text-ink">
          <MapPin className="h-5 w-5" />
        </div>

        <h3 className="mt-3 font-serif text-lg font-semibold text-graphite">
          {recipient}
        </h3>
        <p className="mt-2 font-body text-base leading-relaxed text-ash">{address}</p>

        <button
          type="button"
          onClick={onCopy}
          aria-label={`Salin alamat pengiriman: ${address}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 font-body text-sm text-ink transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper focus-visible:-translate-y-0.5 focus-visible:bg-ink focus-visible:text-paper active:translate-y-0 sm:w-auto sm:mx-auto"
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
