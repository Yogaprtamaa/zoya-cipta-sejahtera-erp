import { db, uid, resolvePrice, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** GET /api/order?agentId= — list purchase orders (optionally for one agent). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  const orders = db.purchaseOrders
    .filter((o) => !agentId || o.agentId === agentId)
    .map((o) => ({ ...o, agentName: db.agents.find((a) => a.id === o.agentId)?.name ?? o.agentId }));
  return ok({ orders });
}

/** POST /api/order — agent creates a PO. Always enters admin_review; large orders escalate on approval. */
export async function POST(req: Request) {
  const input = await body<{ agentId: string; items: { variantId: string; qty: number }[] }>(req);
  if (!input.items?.length) return fail("Item order kosong", "VALIDATION_ERROR");
  const agent = db.agents.find((a) => a.id === input.agentId);
  const level = agent?.level ?? "agen";
  const totalValue = input.items.reduce((s, it) => s + it.qty * resolvePrice(it.variantId, input.agentId, level), 0);
  const status: "admin_review" = "admin_review";
  const order = { id: uid("PO"), agentId: input.agentId, items: input.items, totalValue, status, createdAt: new Date().toISOString().slice(0, 10) };
  db.purchaseOrders.unshift(order);
  logAudit(input.agentId, "create_po", "purchase_order", order.id, null, order);
  return ok({ order });
}
