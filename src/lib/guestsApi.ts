import type { Guest } from "@/lib/guests";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "same-origin", // send the httpOnly admin_session cookie
    headers: { ...(init?.headers ?? {}), "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? `Permintaan gagal (${res.status}).`);
  return body as T;
}

export function fetchGuests(): Promise<Guest[]> {
  return request<{ guests: Guest[] }>("/api/admin/guests").then((r) => r.guests);
}

export function addGuests(
  rows: { name: string; phone: string }[],
): Promise<{ guests: Guest[]; inserted: number; invalid: number; duplicate: number }> {
  return request("/api/admin/guests", {
    method: "POST",
    body: JSON.stringify({ guests: rows }),
  });
}

export function setGuestSent(id: string, sent: boolean): Promise<Guest> {
  return request<{ guest: Guest }>(`/api/admin/guests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ sent }),
  }).then((r) => r.guest);
}

export function deleteGuest(id: string): Promise<void> {
  return request(`/api/admin/guests/${id}`, { method: "DELETE" });
}

export function clearAllGuests(): Promise<void> {
  return request("/api/admin/guests?confirm=all", { method: "DELETE" });
}
