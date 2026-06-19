import { db, logAudit } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";
import type { Settings } from "@/types";

/** GET /api/settings — all configurable values (not hardcoded). */
export async function GET() {
  return ok({ settings: db.settings });
}

/** PATCH /api/settings — update config keys. */
export async function PATCH(req: Request) {
  const input = await body<Partial<Settings>>(req);
  const before = { ...db.settings };
  db.settings = { ...db.settings, ...input };
  logAudit("admin", "update_settings", "settings", "global", before, db.settings);
  return ok({ settings: db.settings });
}
