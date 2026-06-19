import { db, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** POST /api/finance/setoran/[id]/verifikasi — { decision: "verify"|"reject" } admin confirms payment. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { decision } = await body<{ decision: "verify" | "reject" }>(req);
  const billing = db.billings.find((b) => b.id === id);
  if (!billing) return fail("Tagihan tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...billing };
  if (decision === "verify") {
    billing.status = "paid";
    // Mark the agent's consigned stock for this period as settled (paid).
    db.inventory.filter((i) => i.locationType === "agent" && i.locationId === billing.agentId && i.status === "sold_unbilled").forEach((i) => (i.status = "paid"));
  } else {
    billing.status = "unbilled";
    billing.proofUrl = null;
  }
  logAudit("admin", `verify_${decision}`, "monthly_billing", billing.id, before, billing);
  return ok({ billing });
}
