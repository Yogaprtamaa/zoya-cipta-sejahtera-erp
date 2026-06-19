import { db, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** POST /api/finance/setoran/[id]/bukti — agent uploads transfer proof (object URL). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await body<{ proofUrl: string }>(req);
  const billing = db.billings.find((b) => b.id === id);
  if (!billing) return fail("Tagihan tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...billing };
  billing.proofUrl = input.proofUrl ?? "mock://bukti";
  billing.status = "uploaded";
  logAudit(billing.agentId, "upload_proof", "monthly_billing", billing.id, before, billing);
  return ok({ billing });
}
