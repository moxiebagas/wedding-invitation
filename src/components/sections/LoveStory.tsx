import { config } from "@/lib/config";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

export function LoveStory() {
  return (
    <section className="relative mx-auto w-full max-w-2xl px-6 py-20">
      <SectionTitle script="Love Story" />

      <Reveal delay={0.1} className="mt-10">
        <div className="paper-card overflow-hidden p-1.5">
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              title="Love story video"
              src={config.story.videoUrl}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-8">
        <p className="text-center font-body text-lg leading-relaxed text-ash">
          {config.story.text}
        </p>
      </Reveal>
    </section>
  );
}
