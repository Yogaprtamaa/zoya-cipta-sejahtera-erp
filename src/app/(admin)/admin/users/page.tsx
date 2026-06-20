"use client";

import { useEffect, useState } from "react";
import { UserPlus, Shield, BadgeCheck, Users as UsersIcon } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, StatusBadge, Badge, SkeletonTable, Button } from "@/components/ui";

type Agent = { id: string; name: string; level: string; status: string; email?: string };
type InternalUser = { id: string; name: string; email: string; internalRole: string; permissions: string[]; isActive: boolean };

const roleLabel: Record<string, string> = {
  super_admin: "Super Admin (Utama)",
  admin_operasional: "Admin Operasional",
  approver: "Approver / Direktur"
};

const roleTone: Record<string, "brand" | "success" | "warning"> = {
  super_admin: "brand",
  admin_operasional: "success",
  approver: "warning"
};

const permissionLabel: Record<string, string> = {
  kelola_pengguna: "Kelola Pengguna",
  akses_pengaturan: "Akses Pengaturan",
  persetujuan_order_besar: "Persetujuan Order Besar",
  approve_pendaftaran_agen: "Approve Pendaftaran Agen",
  kelola_produk: "Kelola Produk & Harga",
  kelola_inventory: "Kelola Inventory",
  verifikasi_setoran: "Verifikasi Setoran",
  koreksi_tagihan: "Koreksi Tagihan",
  kelola_pipeline_maklon: "Kelola Pipeline Maklon",
  kelola_wilayah: "Kelola Wilayah",
  lihat_laporan_eksekutif: "Lihat Laporan Eksekutif"
};

export default function AdminUsersPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [internalUsers, setInternalUsers] = useState<InternalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<{ agents: Agent[] }>("/agen"),
      api.get<{ users: InternalUser[] }>("/users")
    ]).then(([aR, uR]) => {
      if (aR.data) setAgents(aR.data.agents);
      if (uR.data) setInternalUsers(uR.data.users);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Pengguna"
        subtitle="Akun internal backoffice & mitra agen. Hanya Super Admin yang dapat membuat dan mengatur permission."
        actions={<Button size="sm"><UserPlus size={15} /> Tambah Pengguna</Button>}
      />

      {/* Internal Users */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <Shield size={16} className="text-brand-600" />
          <h3 className="font-display text-base font-black text-slate-900">Pengguna Internal</h3>
          <span className="ml-auto"><Badge tone="brand">{internalUsers.length} akun</Badge></span>
        </div>
        {loading ? (
          <div className="p-6"><SkeletonTable rows={3} /></div>
        ) : (
          <div className="divide-y divide-slate-50">
            {internalUsers.map((u) => (
              <div key={u.id}>
                <div
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 text-sm font-black">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-xs font-medium text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={roleTone[u.internalRole] ?? "brand"}>{roleLabel[u.internalRole] ?? u.internalRole}</Badge>
                    <Badge tone={u.isActive ? "success" : "warning"}>{u.isActive ? "Aktif" : "Nonaktif"}</Badge>

                  </div>
                </div>
                {expanded === u.id && (
                  <div className="border-t border-slate-50 bg-slate-50/50 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Permission</div>
                    <div className="flex flex-wrap gap-1.5">
                      {u.permissions.map((p) => (
                        <span key={p} className="flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-700">
                          <BadgeCheck size={10} /> {permissionLabel[p] ?? p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Agent accounts */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <UsersIcon size={16} className="text-slate-500" />
          <h3 className="font-display text-base font-black text-slate-900">Akun Mitra (Agen)</h3>
        </div>
        {loading ? <div className="p-6"><SkeletonTable rows={4} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">Nama</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Email</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-50">{agents.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">{a.name}</td>
                <td className="px-4 py-4 font-medium text-slate-500">{a.level}</td>
                <td className="px-4 py-4 font-medium text-slate-500">{a.email ?? "—"}</td>
                <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
}
