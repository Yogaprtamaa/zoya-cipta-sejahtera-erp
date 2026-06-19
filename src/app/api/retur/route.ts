import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** GET /api/retur?agentId= */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  const returns = db.returns
    .filter((r) => !agentId || r.agentId === agentId)
    .map((r) => {
      const variant = db.variants.find((v) => v.id === r.variantId);
      const product = db.products.find((p) => p.id === variant?.productId);
      return { ...r, productName: `${product?.name ?? ""} ${variant?.name ?? ""}`.trim(), agentName: db.agents.find((a) => a.id === r.agentId)?.name };
    });
  return ok({ returns });
}

/** POST /api/retur — agent files a return with evidence. */
export async function POST(req: Request) {
  const input = await body<{ agentId: string; variantId: string; qty: number; reason?: string; evidenceUrl?: string }>(req);
  if (!input.qty || input.qty <= 0) return fail("Jumlah retur tidak valid", "VALIDATION_ERROR");
  const ret = { id: uid("RTN"), agentId: input.agentId, variantId: input.variantId, qty: input.qty, evidenceUrl: input.evidenceUrl ?? "mock://retur", status: "pending" as const, reason: input.reason };
  db.returns.unshift(ret);
  logAudit(input.agentId, "create_return", "return", ret.id, null, ret);
  return ok({ return: ret });
}

/** PATCH /api/retur — admin approves/rejects; approval restocks warehouse. */
export async function PATCH(req: Request) {
  const input = await body<{ id: string; status: "approved" | "rejected" }>(req);
  const ret = db.returns.find((r) => r.id === input.id);
  if (!ret) return fail("Retur tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...ret };
  ret.status = input.status;
  if (input.status === "approved") {
    const consigned = db.inventory.find((i) => i.variantId === ret.variantId && i.locationType === "agent" && i.locationId === ret.agentId && i.status === "consigned");
    if (consigned) consigned.qty = Math.max(0, consigned.qty - ret.qty);
  }
  logAudit("admin", `return_${input.status}`, "return", ret.id, before, ret);
  return ok({ return: ret });
}
