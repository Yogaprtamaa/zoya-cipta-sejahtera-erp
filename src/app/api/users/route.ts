import { db, uid, logAudit } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";
import type { InternalUser, Permission, InternalUserRole } from "@/types";

/** GET /api/users — internal users list. */
export async function GET() {
  return ok({ users: db.internalUsers });
}

/** POST /api/users — create internal user (Super Admin only). */
export async function POST(req: Request) {
  const input = await body<{ name: string; email: string; internalRole: InternalUserRole; permissions: Permission[] }>(req);
  const user: InternalUser = {
    id: uid("usr"),
    name: input.name,
    email: input.email,
    internalRole: input.internalRole,
    permissions: input.permissions,
    isActive: true,
    createdAt: new Date().toISOString().slice(0, 10)
  };
  db.internalUsers.push(user);
  logAudit("admin", "create_internal_user", "internal_user", user.id, null, user);
  return ok({ user });
}

/** PATCH /api/users — update user permissions (Super Admin only). */
export async function PATCH(req: Request) {
  const input = await body<{ id: string; permissions?: Permission[]; isActive?: boolean }>(req);
  const user = db.internalUsers.find((u) => u.id === input.id);
  if (!user) return ok({ error: "User tidak ditemukan" });
  const before = { ...user };
  if (input.permissions !== undefined) user.permissions = input.permissions;
  if (input.isActive !== undefined) user.isActive = input.isActive;
  logAudit("admin", "update_user_permissions", "internal_user", user.id, before, user);
  return ok({ user });
}
