/**
 * Central invitation configuration.
 * Edit the values here to personalise the invitation — every section reads
 * from this single source so there is no hard-coded copy in the components.
 */

export type GalleryItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string };

export interface EventDetail {
  title: string;
  /** ISO 8601 with timezone offset, e.g. 2026-08-30T09:00:00+07:00 */
  start: string;
  /** ISO 8601 end time — used for "Save to Calendar". */
  end: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
}

export interface BankAccount {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  /** Optional path to a bank logo image, e.g. "/images/bank-bca.png". Falls back to a generic icon. */
  logo?: string;
}

export interface EWalletAccount {
  /** e.g. "GoPay", "DANA", "OVO", "QRIS". */
  name: string;
  /** Phone number / account ID. Omit for a QR-only wallet (e.g. static QRIS). */
  accountNumber?: string;
  /** Optional QR code image, e.g. "/images/qris-gopay.png". */
  qrImage?: string;
  /** Optional wallet logo image. Falls back to a generic icon. */
  logo?: string;
}

export interface GiftAddress {
  recipient: string;
  address: string;
}

export const config = {
  // ── Couple ────────────────────────────────────────────────
  groom: {
    name: "Muhammad Rafi Herman",
    shortName: "M. Rafi Herman S.Kom",
    order: "Putra Pertama dari",
    parents: "Bpk. Herman & Ibu Rohati",
    instagram: "muhammadrafiherman",
    photo: "/images/groom.jpg",
  },
  bride: {
    name: "Indri Anjari",
    shortName: "Indri Anjari S.Pd.,Gr.",
    order: "Putri Kedua dari",
    parents: "Bpk. Hendar Suhendar & Ibu Ida Sumiati",
    instagram: "indri.anjarii",
    photo: "/images/bride.jpg",
  },

  // ── Headline date (the wedding day) ───────────────────────
  weddingDate: "2026-08-30T07:00:00+07:00",
  weddingDateShort: "30.08.2026",
  weddingDateLong: "Minggu, 30 Agustus 2026",

  // ── Cover ─────────────────────────────────────────────────
  defaultGuest: "Tamu Undangan",
  coverPhoto: "/images/cover.png",

  // Full-body portrait shown on the opening section (blends into the backdrop).
  openingPhoto: "/images/bg-opening.png",

  // ── Opening verse ─────────────────────────────────────────
  verse: {
    arabic:
      "وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةًۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ",
    translation:
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    source: "QS. Ar-Rum: 21",
  },

  // ── Events ────────────────────────────────────────────────
  events: [
    {
      title: "Akad Nikah",
      start: "2026-08-30T07:00:00+07:00",
      end: "2026-08-30T10:00:00+07:00",
      dateLabel: "Minggu, 30 Agustus 2026",
      timeLabel: "Pukul 07.00 WIB",
      venue: 'Gedung Serba Guna HTB, Ciamis',
      address: "Ciamis, Jawa Barat",
    },
    {
      title: "Resepsi",
      start: "2026-08-30T10:00:00+07:00",
      end: "2026-08-30T14:00:00+07:00",
      dateLabel: "Minggu, 30 Agustus 2026",
      timeLabel: "Pukul 10.00 WIB s/d 14.00 WIB",
      venue: 'Gedung Serba Guna HTB, Ciamis',
      address: "Ciamis, Jawa Barat",
    },
  ] satisfies EventDetail[],

  // ── Location / Maps ───────────────────────────────────────
  location: {
    name: 'Gedung Serba Guna HTB, Ciamis',
    query: 'Gedung Serba Guna HTB, Ciamis',
  },

  // ── Love story ────────────────────────────────────────────
  // `points` is a list — add/remove/edit entries to grow the timeline.
  story: {
    // Self-hosted love-story video — replace the file at public/videos/love-story.mp4.
    // video: "/videos/love-story.mp4",
    points: [
      {
        emoji: "🤝",
        title: "Awal Pertemuan",
        text: "2011 menjadi awal kami dipertemukan secara sederhana, tanpa pernah menyangka akan menjadi bagian dari perjalanan panjang hidup kami.",
      },
      {
        emoji: "🌿",
        title: "Tumbuh dan Berpisah",
        text: "Pada 2012 kami mulai saling mengenal dan tumbuh bersama, sebelum akhirnya berpisah pada 2013–2014 untuk menjalani hidup masing-masing.",
      },
      {
        emoji: "🌤️",
        title: "Kembali Bertemu",
        text: "Tahun 2015 kami dipertemukan kembali, kali ini sebagai teman. Dari sana, hubungan kami tumbuh dengan lebih tenang dan dewasa.",
      },
      {
        emoji: "💫",
        title: "Menemukan Kembali Rasa",
        text: "Pada 2019, kami menyadari bahwa rasa itu tidak pernah benar-benar hilang, Kami memutuskan untuk kembali bersama.",
      },
      {
        emoji: "💍",
        title: "Langkah Menuju Ridho Allah",
        text: "Maret 2026 menjadi awal kesungguhan kami, saat dua keluarga dipertemukan dalam satu tujuan yang sama. Hingga akhirnya pada Agustus 2026, kami memilih untuk melangkah bersama dalam ikatan pernikahan, mengucap janji suci, dan memulai perjalanan baru sebagai satu keluarga.",
      },
    ],
  },

  // ── Gallery (photos + videos) ─────────────────────────────
  gallery: [
    { type: "image", src: "/images/gallery-1.jpg", alt: "Indri & Rafi 1" },
    { type: "image", src: "/images/gallery-2.jpg", alt: "Indri & Rafi 2" },
    { type: "image", src: "/images/gallery-3.jpg", alt: "Indri & Rafi 3" },
    { type: "image", src: "/images/gallery-4.jpg", alt: "Indri & Rafi 4" },
    { type: "image", src: "/images/gallery-5.jpg", alt: "Indri & Rafi 5" },
    { type: "image", src: "/images/gallery-6.jpg", alt: "Indri & Rafi 6" },
    { type: "image", src: "/images/gallery-7.jpg", alt: "Indri & Rafi 7" },
    { type: "image", src: "/images/gallery-8.jpg", alt: "Indri & Rafi 8" },
  ] satisfies GalleryItem[],

  // ── Wedding Gift ──────────────────────────────────────────
  // Edit the values below — accounts and e-wallets are lists, so you can
  // add/remove entries freely. Leave `eWallets` as an empty array to hide
  // that card entirely.
  gift: {
    note: "Doa restu Anda adalah karunia yang paling berarti bagi kami. Namun, apabila Anda ingin memberikan ungkapan kasih sebagai hadiah pernikahan, Anda dapat menyampaikannya melalui:",
    banks: [
      {
        bank: "Bank Central Asia (BCA)",
        accountHolder: "Muhammad Rafi Herman",
        accountNumber: "6871423692 ",
      },
      {
        bank: "Bank Syariah Indonesia (BSI)",
        accountHolder: "Indri Anjari",
        accountNumber: "7187366105",
      },
    ] satisfies BankAccount[],
    eWallets: [
      { name: "GoPay", accountNumber: "089653622711" },
    ] satisfies EWalletAccount[],
    address: {
      recipient: "Indri Anjari & Muhammad Rafi Herman",
      address: "Jl. PPA Bambu Apus No.14 Rt. 005 Rw. 001, Kel. Bambu Apus, Kec. Cipayung, Kota Jakarta Timur, DKI Jakarta 13890",
    } satisfies GiftAddress,
  },

  // Background music played after the cover is opened (optional).
  music: "/audio/backsound.mp3",
} as const;

export type SiteConfig = typeof config;
