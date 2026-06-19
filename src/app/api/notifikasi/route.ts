import { db } from "@/lib/mock-db";
import { ok } from "@/lib/api-helpers";

/** GET /api/notifikasi?targetId= — in-app + WhatsApp delivery log (simulated). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const targetId = url.searchParams.get("targetId");
  const notifications = db.notifications
    .filter((n) => !targetId || n.targetId === targetId)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  return ok({ notifications });
}
