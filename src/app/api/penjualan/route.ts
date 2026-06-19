import { db, uid, resolvePrice, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** GET /api/penjualan?agentId= — sales list joined with names. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");
  const sales = db.sales
    .filter((s) => !agentId || s.agentId === agentId)
    .map((s) => {
      const variant = db.variants.find((v) => v.id === s.variantId);
      const product = db.products.find((p) => p.id === variant?.productId);
      const agent = db.agents.find((a) => a.id === s.agentId);
      return { ...s, productName: `${product?.name ?? ""} ${variant?.name ?? ""}`.trim(), agentName: agent?.name, value: s.qty * resolvePrice(s.variantId, s.agentId, agent?.level) };
    })
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));
  return ok({ sales });
}

/** POST /api/penjualan — agent reports a sale; decrements consigned stock + accrues billing. */
export async function POST(req: Request) {
  const input = await body<{ agentId: string; variantId: string; qty: number; date?: string; proofUrl?: string }>(req);
  if (!input.qty || input.qty <= 0) return fail("Jumlah harus lebih dari 0", "VALIDATION_ERROR");

  const consigned = db.inventory.find((i) => i.variantId === input.variantId && i.locationType === "agent" && i.locationId === input.agentId && i.status === "consigned");
  if (!consigned || consigned.qty < input.qty) return fail(`Stok konsinyasi tidak cukup (tersisa ${consigned?.qty ?? 0})`, "INSUFFICIENT_STOCK");

  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const sale = { id: uid("SAL"), agentId: input.agentId, variantId: input.variantId, qty: input.qty, date, reportedAt: new Date().toISOString(), proofUrl: input.proofUrl ?? null };
  db.sales.unshift(sale);
  consigned.qty -= input.qty;

  // Accrue into the period's billing (generated from sales, not PO).
  const period = date.slice(0, 7);
  const agent = db.agents.find((a) => a.id === input.agentId);
  const value = input.qty * resolvePrice(input.variantId, input.agentId, agent?.level);
  let billing = db.billings.find((b) => b.agentId === input.agentId && b.period === period);
  if (billing) { billing.totalQty += input.qty; billing.totalValue += value; }
  else { billing = { id: uid("BIL"), agentId: input.agentId, period, totalQty: input.qty, totalValue: value, status: "unbilled", proofUrl: null }; db.billings.unshift(billing); }

  logAudit(input.agentId, "report_sale", "sale", sale.id, null, sale);
  return ok({ sale, billing });
}
