import { db, logAudit } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";

/** POST /api/produk/[id]/harga — set tier price or per-agent override. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await body<{ variantId: string; level?: string; agentId?: string; price: number }>(req);

  if (input.agentId) {
    const existing = db.priceOverrides.find((o) => o.variantId === input.variantId && o.agentId === input.agentId);
    if (existing) existing.price = input.price;
    else db.priceOverrides.push({ variantId: input.variantId, agentId: input.agentId, price: input.price });
  } else {
    const tier = db.priceTiers.find((t) => t.variantId === input.variantId && t.level === (input.level ?? "default"));
    if (tier) tier.price = input.price;
    else db.priceTiers.push({ variantId: input.variantId, level: (input.level ?? "default") as "default", price: input.price });
  }
  logAudit("admin", "set_price", "product", id, null, input);
  return ok({ ok: true });
}
