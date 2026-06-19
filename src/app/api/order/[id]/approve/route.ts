import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/**
 * POST /api/order/[id]/approve — { action: "approve"|"reject"|"ship", by?: "admin"|"director" }
 * Enforces director threshold and moves stock to agent (consigned) on ship.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { action, by = "admin" } = await body<{ action: "approve" | "reject" | "ship"; by?: "admin" | "director" }>(req);
  const order = db.purchaseOrders.find((o) => o.id === id);
  if (!order) return fail("Order tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...order };

  if (action === "reject") {
    order.status = "rejected";
  } else if (action === "approve") {
    const large = order.totalValue >= db.settings.director_threshold;
    if (order.status === "admin_review") order.status = large ? "director_review" : "approved";
    else if (order.status === "director_review" && by === "director") order.status = "approved";
    else return fail("Transisi approval tidak valid", "INVALID_TRANSITION");
  } else if (action === "ship") {
    if (order.status !== "approved") return fail("Order belum disetujui", "INVALID_TRANSITION");
    order.status = "shipped";
    // Move stock: warehouse available -> agent consigned (transaction-like).
    for (const it of order.items) {
      const wh = db.inventory.find((i) => i.variantId === it.variantId && i.locationType === "warehouse" && i.status === "available");
      if (wh) wh.qty = Math.max(0, wh.qty - it.qty);
      const consigned = db.inventory.find((i) => i.variantId === it.variantId && i.locationType === "agent" && i.locationId === order.agentId && i.status === "consigned");
      if (consigned) consigned.qty += it.qty;
      else db.inventory.push({ id: uid("inv"), variantId: it.variantId, locationType: "agent", locationId: order.agentId, status: "consigned", qty: it.qty });
    }
  }
  logAudit(by, `po_${action}`, "purchase_order", order.id, before, order);
  return ok({ order });
}
