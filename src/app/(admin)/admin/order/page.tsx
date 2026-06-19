"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Truck, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, Badge } from "@/components/ui";

type Order = { id: string; agentName?: string; items: { qty: number }[]; totalValue: number; status: string };

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [threshold, setThreshold] = useState(12750000);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => api.get<{ orders: Order[] }>("/order").then((r) => { if (r.data) setOrders(r.data.orders); setLoading(false); }), []);
  useEffect(() => { load(); api.get<{ settings: { director_threshold: number } }>("/settings").then((r) => r.data && setThreshold(r.data.settings.director_threshold)); }, [load]);

  const act = async (id: string, action: "approve" | "reject" | "ship") => { await api.post(`/order/${id}/approve`, { action }); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Order / PO" subtitle="Validasi & otorisasi permintaan alokasi. Order ≥ threshold otomatis ke Direktur." />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={3} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">No. PO</th><th className="px-4 py-3">Agen</th><th className="px-4 py-3 text-right">Nilai</th><th className="px-4 py-3">Status</th><th className="px-6 py-3" /></tr></thead>
            <tbody className="divide-y divide-slate-50">{orders.map((o) => {
              const large = o.totalValue >= threshold;
              return (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{o.id}</td>
                  <td className="px-4 py-4 font-medium text-slate-600">{o.agentName}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-700">{formatIdr(o.totalValue)} {large && <span title="Butuh Direktur"><AlertTriangle size={12} className="ml-1 inline text-amber-500" /></span>}</td>
                  <td className="px-4 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-4 text-right">
                    {o.status === "admin_review" && <div className="flex justify-end gap-2"><Button size="sm" variant="secondary" onClick={() => act(o.id, "reject")}><XCircle size={14} /></Button><Button size="sm" onClick={() => act(o.id, "approve")}><CheckCircle2 size={14} /> {large ? "Teruskan" : "Approve"}</Button></div>}
                    {o.status === "director_review" && <Badge tone="info">Menunggu Direktur</Badge>}
                    {o.status === "approved" && <Button size="sm" onClick={() => act(o.id, "ship")}><Truck size={14} /> Kirim</Button>}
                    {(o.status === "shipped" || o.status === "rejected") && <StatusBadge status={o.status} />}
                  </td>
                </tr>
              );
            })}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
}
