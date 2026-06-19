import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";
import type { AgentLevel } from "@/types";

export async function GET() {
  const agents = db.agents.map((a) => ({
    ...a,
    region: db.regions.find((r) => r.id === a.regionId)?.kabupaten ?? null,
    outstanding: db.billings.filter((b) => b.agentId === a.id && b.status !== "paid").reduce((s, b) => s + b.totalValue, 0)
  }));
  return ok({ agents });
}

export async function POST(req: Request) {
  const input = await body<{ name: string; level?: AgentLevel; email?: string; phone?: string }>(req);
  if (!input.name) return fail("Nama agen wajib diisi", "VALIDATION_ERROR");
  const agent = { id: uid("agent"), name: input.name, level: (input.level ?? "agen") as AgentLevel, parentId: null, regionId: null, status: "active" as const, email: input.email, phone: input.phone };
  db.agents.push(agent);
  logAudit("admin", "create_agent", "agent", agent.id, null, agent);
  return ok({ agent });
}

export async function PATCH(req: Request) {
  const input = await body<{ id: string; status?: string; level?: AgentLevel; regionId?: string | null; name?: string; email?: string; phone?: string }>(req);
  const agent = db.agents.find((a) => a.id === input.id);
  if (!agent) return fail("Agen tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...agent };
  if (input.status !== undefined) agent.status = input.status as typeof agent.status;
  if (input.level !== undefined) agent.level = input.level;
  if (input.regionId !== undefined) agent.regionId = input.regionId;
  if (input.name !== undefined) agent.name = input.name;
  if (input.email !== undefined) agent.email = input.email;
  if (input.phone !== undefined) agent.phone = input.phone;
  logAudit("admin", "update_agent", "agent", agent.id, before, agent);
  return ok({ agent });
}
