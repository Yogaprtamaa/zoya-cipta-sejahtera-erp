import { db, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** PATCH /api/maklon/[id]/konsultasi — { action: "approve"|"reject" } approve/reject consultation. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { action } = await body<{ action: "approve" | "reject" }>(req);
  const lead = db.maklonLeads.find((l) => l.id === id);
  if (!lead) return fail("Lead tidak ditemukan", "NOT_FOUND", 404);
  if (lead.stage !== "consultation") return fail("Lead tidak dalam tahap konsultasi", "INVALID_STAGE");

  const before = { ...lead };
  lead.consultationStatus = action === "approve" ? "approved" : "rejected";
  logAudit("admin", `consultation_${action}`, "maklon_lead", lead.id, before, lead);
  return ok({ lead });
}
