import { config } from "@/lib/config";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden">
      <Photo
        src={config.coverPhoto}
        alt="Indri & Rafi"
        bw
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-black/65" />

      <Reveal className="relative z-10 mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-body text-lg leading-relaxed text-white/85">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <p className="mt-8 font-serif text-sm uppercase tracking-[0.4em] text-white/75">
          Terima Kasih
        </p>
        <h2 className="mt-3 font-script text-5xl text-white sm:text-6xl">
          {config.bride.name.split(" ")[0]} &amp; {config.groom.name.split(" ")[1]}
        </h2>
        <p className="mt-8 font-body text-xs text-white/50">{config.weddingDateLong}</p>
      </Reveal>
    </footer>
  );
}
