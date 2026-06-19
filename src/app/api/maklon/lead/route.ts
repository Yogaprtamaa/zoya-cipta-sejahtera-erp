import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";

/** GET /api/maklon/lead — pipeline leads. */
export async function GET() {
  return ok({ leads: db.maklonLeads });
}

/** POST /api/maklon/lead — public lead form submission. */
export async function POST(req: Request) {
  const input = await body<{ clientName: string; productType: string; targetVolume?: number; contact?: string }>(req);
  const lead = { id: uid("MKL"), clientName: input.clientName, productType: input.productType, targetVolume: input.targetVolume ?? 0, stage: "lead" as const, contact: input.contact ?? "" };
  db.maklonLeads.unshift(lead);
  logAudit("system", "create_lead", "maklon_lead", lead.id, null, lead);
  return ok({ lead });
}
