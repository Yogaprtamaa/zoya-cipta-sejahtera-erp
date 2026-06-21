import { db, uid, resolvePrice } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";

/** GET /api/produk?role=guest|agent&agentId=&level=&withTiers= — guests get no prices, private products filtered. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = url.searchParams.get("role") ?? "guest";
  const agentId = url.searchParams.get("agentId") ?? undefined;
  const level = url.searchParams.get("level") ?? "agen";
  const clientId = url.searchParams.get("clientId");
  const withTiers = url.searchParams.get("withTiers") === "true";

  const products = db.products
    .filter((p) => !p.isPrivate || p.clientId === clientId || role === "admin")
    .map((p) => {
      const variants = db.variants.filter((v) => v.productId === p.id).map((v) => ({
        ...v,
        price: role === "guest" ? null : resolvePrice(v.id, agentId, level),
        stock: db.inventory.filter((i) => i.variantId === v.id && i.locationType === "warehouse").reduce((s, i) => s + i.qty, 0),
        ...(withTiers && {
          tiers: db.priceTiers.filter((t) => t.variantId === v.id),
        }),
      }));
      return { ...p, variants };
    });
  return ok({ products });
}

export async function POST(req: Request) {
  const input = await body<{ name: string; isPrivate?: boolean; clientId?: string | null; category?: string }>(req);
  const product = { id: uid("prod"), name: input.name, isPrivate: !!input.isPrivate, clientId: input.clientId ?? null, category: input.category };
  db.products.push(product);
  return ok({ product });
}
