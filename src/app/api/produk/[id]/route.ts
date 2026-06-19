import { db, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** PATCH /api/produk/[id] — edit product name or category. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await body<{ name?: string; category?: string }>(req);
  const product = db.products.find((p) => p.id === id);
  if (!product) return fail("Produk tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...product };
  if (input.name !== undefined) product.name = input.name;
  if (input.category !== undefined) product.category = input.category;
  logAudit("admin", "update_product", "product", product.id, before, product);
  return ok({ product });
}

/** DELETE /api/produk/[id] — remove product and all its variants/prices. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return fail("Produk tidak ditemukan", "NOT_FOUND", 404);
  const [removed] = db.products.splice(idx, 1);
  const variantIds = db.variants.filter((v) => v.productId === id).map((v) => v.id);
  db.variants = db.variants.filter((v) => v.productId !== id);
  db.priceTiers = db.priceTiers.filter((t) => !variantIds.includes(t.variantId));
  db.priceOverrides = db.priceOverrides.filter((o) => !variantIds.includes(o.variantId));
  db.inventory = db.inventory.filter((i) => !variantIds.includes(i.variantId));
  logAudit("admin", "delete_product", "product", removed.id, removed, null);
  return ok({ ok: true });
}
