import { config } from "@/lib/config";
import { Invitation } from "@/components/Invitation";

/**
 * The guest name is driven by the `?to=` query parameter, e.g.
 *   /?to=Keluarga%20Besar%20Bapak%20Andi
 * Falls back to a default when absent.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.to) ? params.to[0] : params.to;
  const guestName = raw?.trim() ? raw.trim() : config.defaultGuest;

  return <Invitation guestName={guestName} />;
}
