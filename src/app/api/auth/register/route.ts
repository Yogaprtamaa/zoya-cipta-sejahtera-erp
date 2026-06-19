import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const input = await body<{ name?: string; email?: string; phone?: string }>(req);
  if (!input.name) return fail("Nama wajib diisi", "VALIDATION_ERROR");
  const agent = {
    id: uid("agent"), name: input.name, level: "agen" as const,
    parentId: null, regionId: null, status: "pending" as const, email: input.email, phone: input.phone
  };
  db.agents.push(agent);
  logAudit("system", "register", "agent", agent.id, null, agent);
  return ok({ agent });
}
