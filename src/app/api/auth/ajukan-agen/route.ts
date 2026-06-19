import { db, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const input = await body<{ agentId?: string; regionId?: string; level?: string }>(req);
  const agent = db.agents.find((a) => a.id === input.agentId) ?? db.agents.find((a) => a.status === "pending");
  if (!agent) return fail("Pengajuan tidak ditemukan", "NOT_FOUND", 404);
  const before = { ...agent };
  if (input.regionId) agent.regionId = input.regionId;
  if (input.level) agent.level = input.level as typeof agent.level;
  agent.status = "pending";
  logAudit(agent.id, "ajukan_agen", "agent", agent.id, before, agent);
  return ok({ agent });
}
