"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, BadgeCheck } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, EmptyState, SkeletonTable } from "@/components/ui";

type Order = { id: string; agentName?: string; items: { qty: number }[]; totalValue: number; status: string };

export default function DirekturApprovalPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => api.get<{ orders: Order[] }>("/order").then((r) => { if (r.data) setOrders(r.data.orders.filter((o) => o.status === "director_review")); setLoading(false); }), []);
  useEffect(() => { load(); }, [load]);

  const act = async (id: string, action: "approve" | "reject") => { await api.post(`/order/${id}/approve`, { action, by: "director" }); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Approval Order Besar" subtitle="Otorisasi alokasi yang melewati threshold." />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={2} /></div> : orders.length === 0 ? (
          <EmptyState icon={<BadgeCheck size={26} />} title="Tidak ada antrean" description="Belum ada order besar yang menunggu otorisasi Direktur." />
        ) : (
          <div className="divide-y divide-slate-50">{orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div><div className="font-bold text-slate-900">{o.id} · {o.agentName}</div><div className="text-[11px] text-slate-400">{o.items.reduce((s, it) => s + it.qty, 0)} pcs · {formatIdr(o.totalValue)}</div></div>
              <div className="flex items-center gap-2"><StatusBadge status={o.status} /><Button size="sm" variant="secondary" onClick={() => act(o.id, "reject")}><XCircle size={14} /> Tolak</Button><Button size="sm" onClick={() => act(o.id, "approve")}><CheckCircle2 size={14} /> Otorisasi</Button></div>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}
