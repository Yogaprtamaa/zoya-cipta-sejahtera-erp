import { db } from "@/lib/mock-db";
import { ok } from "@/lib/api-helpers";

/** GET /api/inventory?locationType=&locationId= — stock by location, joined with variant/product. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const locationType = url.searchParams.get("locationType");
  const locationId = url.searchParams.get("locationId");

  const items = db.inventory
    .filter((i) => (!locationType || i.locationType === locationType) && (!locationId || i.locationId === locationId))
    .map((i) => {
      const variant = db.variants.find((v) => v.id === i.variantId);
      const product = db.products.find((p) => p.id === variant?.productId);
      return { ...i, variantName: variant?.name, unit: variant?.unit, productName: product?.name, productId: product?.id };
    });
  return ok({ items });
}
