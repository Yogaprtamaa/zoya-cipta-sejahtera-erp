import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

const PERIOD = "2026-06";

/** GET /api/wilayah — regions with current-period omzet (botol) vs target. */
export async function GET() {
  const regions = db.regions.map((r) => {
    const omzetBotol = r.agentId
      ? db.sales.filter((s) => s.agentId === r.agentId && s.date.startsWith(PERIOD)).reduce((sum, s) => sum + s.qty, 0)
      : 0;
    const agent = db.agents.find((a) => a.id === r.agentId);
    const status = !r.agentId ? "available" : omzetBotol >= r.monthlyTarget ? "eligible_extra" : omzetBotol >= r.monthlyTarget * 0.6 ? "active" : "under_evaluation";
    return { ...r, agentName: agent?.name ?? null, omzetBotol, status };
  });
  return ok({ regions });
}

/** POST /api/wilayah — assign agent to region OR create new wilayah. */
export async function POST(req: Request) {
  const input = await body<{ regionId?: string; agentId?: string; kabupaten?: string; monthlyTarget?: number }>(req);
  if (input.kabupaten) {
    const region = { id: uid("reg"), kabupaten: input.kabupaten, agentId: input.agentId ?? null, monthlyTarget: input.monthlyTarget ?? 100 };
    db.regions.push(region);
    logAudit("admin", "create_region", "region", region.id, null, region);
    return ok({ region });
  }
  const region = db.regions.find((r) => r.id === input.regionId);
  if (!region) return fail("Wilayah tidak ditemukan", "NOT_FOUND", 404);
  if (region.agentId && region.agentId !== input.agentId) return fail("Wilayah sudah dimiliki agen lain", "REGION_TAKEN");
  const before = { ...region };
  region.agentId = input.agentId ?? null;
  logAudit("admin", "assign_region", "region", region.id, before, region);
  return ok({ region });
}

/** PATCH /api/wilayah — edit target or unassign agent. */
export async function PATCH(req: Request) {
  const input = await body<{ id: string; monthlyTarget?: number; agentId?: string | null }>(req);
  const region = db.regions.find((r) => r.id === input.id);
  if (!region) return fail("Wilayah tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...region };
  if (input.monthlyTarget !== undefined) region.monthlyTarget = input.monthlyTarget;
  if (input.agentId !== undefined) region.agentId = input.agentId;
  logAudit("admin", "update_region", "region", region.id, before, region);
  return ok({ region });
}

/** DELETE /api/wilayah?id= */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  const idx = db.regions.findIndex((r) => r.id === id);
  if (idx === -1) return fail("Wilayah tidak ditemukan", "NOT_FOUND", 404);
  const [removed] = db.regions.splice(idx, 1);
  logAudit("admin", "delete_region", "region", removed.id, removed, null);
  return ok({ ok: true });
}
