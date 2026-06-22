import { db, uid, resolvePrice, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

/** Join a report row with variant/product/reseller/agent names for display. */
function decorate(r: (typeof db.resellerReports)[number]) {
  const variant = db.variants.find((v) => v.id === r.variantId);
  const product = db.products.find((p) => p.id === variant?.productId);
  const reseller = db.agents.find((a) => a.id === r.resellerId);
  const agent = db.agents.find((a) => a.id === r.agentId);
  return {
    ...r,
    productName: `${product?.name ?? ""} ${variant?.name ?? ""}`.trim(),
    resellerName: reseller?.name ?? r.resellerId,
    agentName: agent?.name ?? r.agentId,
  };
}

/**
 * GET /api/laporan-reseller
 *   ?resellerId=  → riwayat laporan satu reseller (mode reseller)
 *   ?agentId=     → laporan dari reseller binaan satu agen (mode agen)
 *   (tanpa filter)→ semua laporan lintas agen (mode super admin)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const resellerId = url.searchParams.get("resellerId");
  const agentId = url.searchParams.get("agentId");
  const reports = db.resellerReports
    .filter((r) => (!resellerId || r.resellerId === resellerId) && (!agentId || r.agentId === agentId))
    .map(decorate)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return ok({ reports });
}

/** POST /api/laporan-reseller — reseller mengirim laporan penjualan ke agen pembinanya. */
export async function POST(req: Request) {
  const input = await body<{ resellerId: string; variantId: string; qty: number; date?: string; notes?: string; proofUrl?: string }>(req);
  if (!input.qty || input.qty <= 0) return fail("Jumlah harus lebih dari 0", "VALIDATION_ERROR");

  const reseller = db.agents.find((a) => a.id === input.resellerId);
  if (!reseller) return fail("Reseller tidak ditemukan", "NOT_FOUND", 404);
  if (!reseller.parentId) return fail("Reseller belum memiliki agen pembina", "VALIDATION_ERROR");
  if (!db.variants.find((v) => v.id === input.variantId)) return fail("Varian tidak ditemukan", "NOT_FOUND", 404);

  // Laporan penjualan mengurangi stok konsinyasi reseller; sisa = stok belum terjual.
  const consigned = db.inventory.find((i) => i.variantId === input.variantId && i.locationType === "agent" && i.locationId === input.resellerId && i.status === "consigned");
  if (!consigned || consigned.qty < input.qty) return fail(`Stok reseller tidak cukup (tersisa ${consigned?.qty ?? 0})`, "INSUFFICIENT_STOCK");

  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const value = input.qty * resolvePrice(input.variantId, input.resellerId, "reseller");
  const report = {
    id: uid("RPT"),
    resellerId: input.resellerId,
    agentId: reseller.parentId,
    variantId: input.variantId,
    qty: input.qty,
    value,
    date,
    period: date.slice(0, 7),
    notes: input.notes,
    proofUrl: input.proofUrl ?? null,
    createdAt: new Date().toISOString(),
  };
  db.resellerReports.unshift(report);
  consigned.qty -= input.qty;

  logAudit(input.resellerId, "submit_reseller_report", "reseller_report", report.id, null, report);
  return ok({ report: decorate(report) });
}

/**
 * PATCH /api/laporan-reseller — super admin mengoreksi laporan reseller.
 * Body { id, qty?, notes?, date? }. Perubahan qty menyesuaikan stok konsinyasi reseller
 * (delta) dan menghitung ulang nilai. Tolak jika stok tidak cukup saat qty dinaikkan.
 */
export async function PATCH(req: Request) {
  const input = await body<{ id: string; qty?: number; notes?: string; date?: string }>(req);
  const report = db.resellerReports.find((r) => r.id === input.id);
  if (!report) return fail("Laporan tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...report };

  if (input.qty !== undefined && input.qty !== report.qty) {
    if (input.qty <= 0) return fail("Jumlah harus lebih dari 0", "VALIDATION_ERROR");
    const delta = input.qty - report.qty; // qty naik → stok berkurang
    const consigned = db.inventory.find((i) => i.variantId === report.variantId && i.locationType === "agent" && i.locationId === report.resellerId && i.status === "consigned");
    if (delta > 0 && (!consigned || consigned.qty < delta)) return fail(`Stok reseller tidak cukup untuk koreksi (tersisa ${consigned?.qty ?? 0})`, "INSUFFICIENT_STOCK");
    if (consigned) consigned.qty -= delta;
    report.qty = input.qty;
    report.value = input.qty * resolvePrice(report.variantId, report.resellerId, "reseller");
  }
  if (input.notes !== undefined) report.notes = input.notes || undefined;
  if (input.date !== undefined) { report.date = input.date; report.period = input.date.slice(0, 7); }

  logAudit("admin", "edit_reseller_report", "reseller_report", report.id, before, report);
  return ok({ report: decorate(report) });
}

/** DELETE /api/laporan-reseller?id= — hapus laporan & kembalikan stok reseller. */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  const idx = db.resellerReports.findIndex((r) => r.id === id);
  if (idx === -1) return fail("Laporan tidak ditemukan", "NOT_FOUND", 404);
  const [removed] = db.resellerReports.splice(idx, 1);
  const consigned = db.inventory.find((i) => i.variantId === removed.variantId && i.locationType === "agent" && i.locationId === removed.resellerId && i.status === "consigned");
  if (consigned) consigned.qty += removed.qty; // penjualan dibatalkan → stok kembali
  logAudit("admin", "delete_reseller_report", "reseller_report", removed.id, removed, null);
  return ok({ ok: true });
}
