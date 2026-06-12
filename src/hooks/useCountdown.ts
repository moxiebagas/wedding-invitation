"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

function diff(target: number): Countdown {
  const total = target - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    isOver: false,
  };
}

/** Live countdown to a target ISO date, ticking every second on the client. */
export function useCountdown(targetIso: string): Countdown {
  const target = new Date(targetIso).getTime();
  // Start at zeros so server and first client render match (avoids hydration mismatch).
  const [state, setState] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    setState(diff(target));
    const id = setInterval(() => setState(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return state;
}
