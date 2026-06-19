import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";
import type { MaklonStage, Product } from "@/types";

const ORDER: MaklonStage[] = ["lead", "quote", "formulation", "production", "qc", "done"];

/** PATCH /api/maklon/[id]/stage — { stage } move pipeline; "done" mints a private SKU. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { stage } = await body<{ stage: MaklonStage }>(req);
  const lead = db.maklonLeads.find((l) => l.id === id);
  if (!lead) return fail("Lead tidak ditemukan", "NOT_FOUND", 404);
  if (!ORDER.includes(stage)) return fail("Stage tidak valid", "VALIDATION_ERROR");
  const before = { ...lead };
  lead.stage = stage;

  let product: Product | undefined;
  if (stage === "done" && !db.products.some((p) => p.clientId === lead.id)) {
    product = { id: uid("prod"), name: `${lead.productType} — ${lead.clientName}`, isPrivate: true, clientId: lead.id, category: "Maklon" };
    db.products.push(product);
  }
  logAudit("admin", "maklon_stage", "maklon_lead", lead.id, before, lead);
  return ok({ lead, privateProduct: product ?? null });
}
