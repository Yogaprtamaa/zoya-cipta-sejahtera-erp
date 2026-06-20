import { db, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** PATCH /api/finance/setoran/[id]/koreksi — manual billing correction (audit-logged). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await body<{ newValue: number; reason: string; by?: string }>(req);

  const billing = db.billings.find((b) => b.id === id);
  if (!billing) return fail("Tagihan tidak ditemukan", "NOT_FOUND", 404);
  if (!input.reason?.trim()) return fail("Alasan koreksi wajib diisi", "VALIDATION_ERROR");
  if (typeof input.newValue !== "number" || input.newValue < 0) return fail("Nilai koreksi tidak valid", "VALIDATION_ERROR");

  const before = { ...billing };
  billing.totalValue = input.newValue;

  logAudit(
    input.by ?? "admin",
    "koreksi_tagihan",
    "billing",
    billing.id,
    { totalValue: before.totalValue },
    { totalValue: billing.totalValue, reason: input.reason }
  );

  return ok({ billing, before: { totalValue: before.totalValue } });
}
