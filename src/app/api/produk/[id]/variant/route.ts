import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";
import type { AgentLevel } from "@/types";

/** POST /api/produk/[id]/variant — add variant + optional price tiers. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await body<{ name: string; unit?: string; price?: number }>(req);
  if (!db.products.find((p) => p.id === id)) return fail("Produk tidak ditemukan", "NOT_FOUND", 404);
  const variant = { id: uid("var"), productId: id, name: input.name, unit: input.unit ?? "pcs" };
  db.variants.push(variant);
  if (input.price) {
    const levels: (AgentLevel | "default")[] = ["agen", "sub-agen", "reseller", "default"];
    const multipliers: Record<string, number> = { agen: 1, "sub-agen": 1.06, reseller: 1.12, default: 1.3 };
    levels.forEach((l) => db.priceTiers.push({ variantId: variant.id, level: l, price: Math.round(input.price! * multipliers[l]) }));
  }
  logAudit("admin", "create_variant", "variant", variant.id, null, variant);
  return ok({ variant });
}

/** DELETE /api/produk/[id]/variant?variantId= */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const variantId = new URL(req.url).searchParams.get("variantId");
  const idx = db.variants.findIndex((v) => v.id === variantId && v.productId === id);
  if (idx === -1) return fail("Varian tidak ditemukan", "NOT_FOUND", 404);
  const [removed] = db.variants.splice(idx, 1);
  db.priceTiers = db.priceTiers.filter((t) => t.variantId !== variantId);
  db.priceOverrides = db.priceOverrides.filter((o) => o.variantId !== variantId);
  logAudit("admin", "delete_variant", "variant", removed.id, removed, null);
  return ok({ ok: true });
}
