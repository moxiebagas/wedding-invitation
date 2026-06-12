import { config } from "@/lib/config";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

export function Opening() {
  return (
    <section className="relative mx-auto w-full max-w-2xl px-6 py-20 text-center">
      <Reveal>
        <p className="font-serif text-sm uppercase tracking-[0.35em] text-ash">
          The Wedding Of
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          {config.bride.name}{" "}
          <span className="font-script font-normal italic text-graphite">&amp;</span>{" "}
          {config.groom.name}
        </h2>
        <p className="mt-2 font-body text-base text-ash">{config.weddingDateLong}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Photo
          src={config.coverPhoto}
          alt="Indri & Rafi"
          kenBurns
          bw
          className="mx-auto aspect-[4/5] w-full max-w-sm rounded-2xl border border-ink/10"
        />
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <p
          dir="rtl"
          lang="ar"
          className="mx-auto max-w-xl text-2xl leading-[2.6rem] text-graphite sm:text-3xl"
        >
          {config.verse.arabic}
        </p>
        <p className="mx-auto mt-7 max-w-xl font-body text-lg leading-relaxed text-ash">
          {config.verse.translation}
        </p>
        <p className="mt-4 font-serif text-sm uppercase tracking-[0.3em] text-ink/70">
          ({config.verse.source})
        </p>
      </Reveal>
    </section>
  );
}
