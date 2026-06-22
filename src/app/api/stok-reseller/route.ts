import { db } from "@/lib/mock-db";
import { ok } from "@/lib/api-helpers";

/** Nama produk + varian untuk satu variantId. */
function variantLabel(variantId: string) {
  const variant = db.variants.find((v) => v.id === variantId);
  const product = db.products.find((p) => p.id === variant?.productId);
  return { productName: product?.name ?? "", variantName: variant?.name ?? "" };
}

/**
 * GET /api/stok-reseller — rekap stok reseller dikelompokkan per wilayah → agen pembina.
 * Dipakai super admin untuk memantau stok (termasuk yang belum terjual) seluruh reseller.
 */
export async function GET() {
  const groups = db.agents
    .filter((a) => a.level === "agen")
    .map((agen) => {
      const region = db.regions.find((r) => r.id === agen.regionId);
      const resellers = db.agents
        .filter((a) => a.level === "reseller" && a.parentId === agen.id)
        .map((r) => {
          const items = db.inventory
            .filter((i) => i.locationType === "agent" && i.locationId === r.id && i.status === "consigned")
            .map((i) => ({ variantId: i.variantId, ...variantLabel(i.variantId), qty: i.qty }));
          const reports = db.resellerReports.filter((rep) => rep.resellerId === r.id);
          return {
            id: r.id,
            name: r.name,
            items,
            stockQty: items.reduce((s, i) => s + i.qty, 0),
            soldQty: reports.reduce((s, rep) => s + rep.qty, 0),
            soldValue: reports.reduce((s, rep) => s + rep.value, 0),
            reportCount: reports.length,
          };
        });
      return {
        agentId: agen.id,
        agentName: agen.name,
        regionId: agen.regionId,
        kabupaten: region?.kabupaten ?? null,
        resellerCount: resellers.length,
        resellers,
        totalStock: resellers.reduce((s, r) => s + r.stockQty, 0),
        totalSoldQty: resellers.reduce((s, r) => s + r.soldQty, 0),
        totalSoldValue: resellers.reduce((s, r) => s + r.soldValue, 0),
      };
    })
    // tampilkan agen yang membina reseller lebih dulu
    .sort((a, b) => b.resellerCount - a.resellerCount);

  return ok({ groups });
}
