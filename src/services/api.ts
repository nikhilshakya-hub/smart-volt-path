/**
 * Base API client.
 * Currently resolves mock data; swap `USE_MOCK` to false and point
 * `BASE_URL` at the Flask backend when it is ready.
 */
export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
export const USE_MOCK = true;

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

/** Returns mock data with a tiny simulated latency. */
export function mock<T>(data: T, delayMs = 0): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
