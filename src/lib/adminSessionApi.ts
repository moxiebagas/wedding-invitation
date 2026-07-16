async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: { ...(init?.headers ?? {}), "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? `Permintaan gagal (${res.status}).`);
  return body as T;
}

export function login(username: string, password: string): Promise<{ ok: true; username: string }> {
  return request("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) });
}

export async function logout(): Promise<void> {
  await request("/api/admin/logout", { method: "POST" });
}

export async function checkSession(): Promise<{ username: string } | null> {
  const res = await fetch("/api/admin/session", { credentials: "same-origin" });
  if (!res.ok) return null;
  const body = await res.json().catch(() => null);
  return body?.authenticated ? { username: body.username as string } : null;
}
