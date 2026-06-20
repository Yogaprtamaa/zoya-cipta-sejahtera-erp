import type { Role, AccountStatus } from "@/types";

/**
 * Mock auth via cookies (no real session). middleware.ts reads these to gate
 * routes; the demo role-switcher writes them. NOT a security boundary — the real
 * backend must enforce RBAC server-side.
 */
export const ROLE_COOKIE   = "zoya_role";
export const STATUS_COOKIE = "zoya_status";
export const LEVEL_COOKIE  = "zoya_level";

export const DEFAULT_ROLE: Role = "guest";

/** Home route for each role — used by the switcher and post-login redirects. */
export const roleHome: Record<Role, string> = {
  guest: "/",
  prospect: "/konversi",
  agent: "/dashboard",
  klien_maklon: "/maklon-portal",
  admin: "/admin"
};

/** Client-side: set the mock session cookies (used by the demo role switcher). */
export function setSession(role: Role, status: AccountStatus = "active", level = "agen") {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=86400`;
  document.cookie = `${STATUS_COOKIE}=${status}; path=/; max-age=86400`;
  document.cookie = `${LEVEL_COOKIE}=${level}; path=/; max-age=86400`;
}

/** Client-side: read current role from cookie. */
export function getClientRole(): Role {
  if (typeof document === "undefined") return DEFAULT_ROLE;
  const m = document.cookie.match(new RegExp(`${ROLE_COOKIE}=([^;]+)`));
  return (m?.[1] as Role) ?? DEFAULT_ROLE;
}

/** Client-side: read current agent level from cookie (agen | sub-agen | reseller). */
export function getClientLevel(): string {
  if (typeof document === "undefined") return "agen";
  const m = document.cookie.match(new RegExp(`${LEVEL_COOKIE}=([^;]+)`));
  return m?.[1] ?? "agen";
}
