import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";

/** GET /api/maklon/lead — pipeline leads. */
export async function GET() {
  return ok({ leads: db.maklonLeads });
}

/** POST /api/maklon/lead — consultation submission from logged-in maklon client. */
export async function POST(req: Request) {
  const input = await body<{ clientName: string; productType: string; targetVolume?: number; contact?: string; notes?: string; clientId?: string }>(req);
  const lead = {
    id: uid("MKL"),
    clientName: input.clientName,
    productType: input.productType,
    targetVolume: input.targetVolume ?? 0,
    stage: "consultation" as const,
    consultationStatus: "pending" as const,
    contact: input.contact ?? "",
    notes: input.notes,
    clientId: input.clientId,
  };
  db.maklonLeads.unshift(lead);
  logAudit(input.clientId ?? "system", "submit_consultation", "maklon_lead", lead.id, null, lead);
  return ok({ lead });
}
