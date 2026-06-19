import { db } from "@/lib/mock-db";
import { ok } from "@/lib/api-helpers";

/** GET /api/finance/setoran?agentId= — monthly billings (generated from sales). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  const billings = db.billings
    .filter((b) => !agentId || b.agentId === agentId)
    .map((b) => ({ ...b, agentName: db.agents.find((a) => a.id === b.agentId)?.name ?? b.agentId }))
    .sort((a, b) => b.period.localeCompare(a.period));
  return ok({ billings });
}
