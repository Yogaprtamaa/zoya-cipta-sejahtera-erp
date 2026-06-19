import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";

/** POST /api/inventory/masuk — incoming stock to warehouse. */
export async function POST(req: Request) {
  const input = await body<{ variantId: string; qty: number; locationId?: string }>(req);
  const loc = input.locationId ?? "wh-pusat";
  const existing = db.inventory.find((i) => i.variantId === input.variantId && i.locationType === "warehouse" && i.locationId === loc && i.status === "available");
  if (existing) existing.qty += input.qty;
  else db.inventory.push({ id: uid("inv"), variantId: input.variantId, locationType: "warehouse", locationId: loc, status: "available", qty: input.qty });
  logAudit("admin", "stock_in", "inventory", input.variantId, null, input);
  return ok({ ok: true });
}
