import type { ApiResponse } from "@/types";

/**
 * Thin fetch wrapper around the mock API. The only thing that changes when the
 * real backend ships is NEXT_PUBLIC_API_BASE — every page goes through here.
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store"
    });
    const json = (await res.json()) as ApiResponse<T>;
    return json;
  } catch (e) {
    return { data: null, error: { code: "NETWORK_ERROR", message: e instanceof Error ? e.message : "Gagal terhubung ke server" } };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
