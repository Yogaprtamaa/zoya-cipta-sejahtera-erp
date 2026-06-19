import { db } from "@/lib/mock-db";
import { ok } from "@/lib/api-helpers";

/** GET /api/audit-trail — append-only audit log (read-only). */
export async function GET() {
  return ok({ logs: db.audit });
}
