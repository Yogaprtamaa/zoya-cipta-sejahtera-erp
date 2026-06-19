import { resetDb } from "@/lib/mock-db";
import { ok } from "@/lib/api-helpers";

/** POST /api/_reset — demo-only: reseed the in-memory store. */
export async function POST() {
  resetDb();
  return ok({ reset: true });
}
