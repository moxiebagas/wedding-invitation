"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Slow Ken-Burns zoom for hero / feature imagery. */
  kenBurns?: boolean;
  /** Editorial grayscale treatment for a cohesive monochrome look. */
  bw?: boolean;
  priority?: boolean;
}

/**
 * Image wrapper that degrades gracefully: if the file is missing (the project
 * ships with placeholder paths), it shows an elegant light neutral gradient +
 * monogram so the layout never breaks. Drop real files into /public/images.
 */
export function Photo({
  src,
  alt,
  className,
  imgClassName,
  kenBurns,
  bw,
  priority,
}: PhotoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-mist", className)}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white via-mist to-[#e4e2dd]">
          <span className="font-script text-5xl text-ink/30">I &amp; R</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover",
            kenBurns && "animate-ken-burns",
            bw && "photo-bw",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
