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

export const config = {
  // ── Couple ────────────────────────────────────────────────
  groom: {
    name: "Muhammad Rafi Herman",
    shortName: "M. Rafi Herman S, Kom.",
    order: "Putra Pertama dari",
    parents: "Bpk. Herholo & Ibu Nofiati",
    instagram: "rafiherman",
    photo: "/images/groom.jpg",
  },
  bride: {
    name: "Indri Anjari",
    shortName: "Indri Anjari S, Pd., Gr.",
    order: "Putri Kedua dari",
    parents: "Bpk. Hendar Suwantar & Ibu Ida Suriyani",
    instagram: "indrianjari",
    photo: "/images/bride.jpg",
  },

  // ── Headline date (the wedding day) ───────────────────────
  weddingDate: "2026-08-30T09:00:00+07:00",
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
      "وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗاِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ",
    translation:
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    source: "QS. Ar-Rum: 21",
  },

  // ── Events ────────────────────────────────────────────────
  events: [
    {
      title: "Akad Nikah",
      start: "2026-08-30T09:00:00+07:00",
      end: "2026-08-30T10:30:00+07:00",
      dateLabel: "Minggu, 30 Agustus 2026",
      timeLabel: "Pukul 09.00 WIB",
      venue: 'Kelenteng "HOK TEK BIO"',
      address: "Ciamis, Jawa Barat",
    },
    {
      title: "Resepsi",
      start: "2026-08-30T11:00:00+07:00",
      end: "2026-08-30T14:00:00+07:00",
      dateLabel: "Minggu, 30 Agustus 2026",
      timeLabel: "Pukul 11.00 WIB",
      venue: 'Kelenteng "HOK TEK BIO"',
      address: "Ciamis, Jawa Barat",
    },
  ] satisfies EventDetail[],

  // ── Location / Maps ───────────────────────────────────────
  location: {
    name: 'Kelenteng "HOK TEK BIO" Ciamis',
    query: 'Kelenteng HOK TEK BIO Ciamis',
  },

  // ── Love story ────────────────────────────────────────────
  story: {
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    text: "Pada tahun 2020, takdir mempertemukan kami dalam sebuah kesederhanaan yang tak pernah kami duga. Dari obrolan ringan, tumbuh rasa yang perlahan menguat, melewati suka dan duka bersama. Kini, dengan mengucap syukur, kami memutuskan untuk melangkah ke jenjang yang lebih serius dan menyatukan dua hati dalam ikatan yang suci.",
  },

  // ── Gallery (photos + videos) ─────────────────────────────
  gallery: [
    { type: "image", src: "/images/gallery-1.jpg", alt: "Indri & Rafi 1" },
    { type: "image", src: "/images/gallery-2.jpg", alt: "Indri & Rafi 2" },
    { type: "image", src: "/images/gallery-3.jpg", alt: "Indri & Rafi 3" },
    { type: "video", src: "/images/clip-1.mp4", poster: "/images/gallery-4.jpg", alt: "Prewedding clip" },
    { type: "image", src: "/images/gallery-5.jpg", alt: "Indri & Rafi 5" },
    { type: "image", src: "/images/gallery-6.jpg", alt: "Indri & Rafi 6" },
  ] satisfies GalleryItem[],

  // Background music played after the cover is opened (optional).
  music: "/audio/backsound.mp3",
} as const;

export type SiteConfig = typeof config;
