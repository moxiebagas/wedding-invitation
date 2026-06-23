"use client";

import { useRef, useState, useEffect } from "react";
import { Invitation } from "@/components/Invitation";
import { DesktopSlideshow } from "@/components/DesktopSlideshow";

/**
 * Renders mobile-only layout below lg, and a desktop split-panel layout at lg+.
 *
 * Desktop layout:
 *   ┌─────────────────────────┬──────────────┐
 *   │  DesktopSlideshow       │  Invitation  │
 *   │  (fills remaining width)│  (430 px)    │
 *   └─────────────────────────┴──────────────┘
 *
 * The right panel uses transform: translateZ(0) so that position:fixed children
 * (the Cover overlay and MusicToggle) are scoped to the panel, not the viewport.
 */
export function ResponsiveInvitationLayout({ guestName }: { guestName: string }) {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) {
    return <Invitation guestName={guestName} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink">
      {/* Left: fullscreen automated slideshow */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <DesktopSlideshow />
      </div>

      {/* Right: mobile-width invitation panel — scroll is isolated here */}
      <div
        ref={rightPanelRef}
        className="no-scrollbar relative h-screen w-[480px] shrink-0 overflow-x-hidden overflow-y-auto bg-paper"
        style={{ transform: "translateZ(0)" }}
      >
        <Invitation guestName={guestName} scrollContainerRef={rightPanelRef} />
      </div>
    </div>
  );
}
