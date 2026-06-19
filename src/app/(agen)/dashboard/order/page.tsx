"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, PackagePlus, Info, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, EmptyState } from "@/components/ui";

type Order = { id: string; createdAt: string; items: { variantId: string; qty: number }[]; totalValue: number; status: string };

const STATUS_LABEL: Record<string, string> = {
  admin_review: "Menunggu Admin",
  director_review: "Eskalasi Direktur",
  approved: "Disetujui",
  shipped: "Dikirim → Stok Masuk",
  rejected: "Ditolak",
};

export default function AgenOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ orders: Order[] }>(`/order?agentId=${DEMO_AGENT_ID}`).then((r) => {
      if (r.data) setOrders(r.data.orders);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permintaan Stok Konsinyasi"
        subtitle="Ajukan permintaan stok ke Zoya. Tidak ada pembayaran di muka."
        actions={
          <Link href="/dashboard/order/baru">
            <Button><Plus size={16} /> Ajukan Stok</Button>
          </Link>
        }
      />

      {/* Info konsinyasi */}
      <Card className="border-brand-100 bg-brand-50/40 p-5">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-brand-500" />
          <div className="space-y-2 text-sm">
            <p className="font-bold text-slate-800">Bagaimana alur konsinyasi bekerja?</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { icon: CheckCircle2, text: "Ajukan permintaan stok — Zoya kirim tanpa DP" },
                { icon: CheckCircle2, text: "Jual produk ke konsumen, laporkan di menu Laporan Penjualan" },
                { icon: CheckCircle2, text: "Tagihan muncul otomatis hanya dari yang sudah terjual" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                  <s.icon size={13} className="mt-0.5 shrink-0 text-brand-500" />
                  {s.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={3} /></div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<PackagePlus size={26} />}
            title="Belum ada permintaan stok"
            description="Ajukan permintaan stok konsinyasi pertama Anda ke Zoya."
            action={<Link href="/dashboard/order/baru"><Button>Ajukan Stok Sekarang</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">No. Permintaan</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Jml Item</th>
                  <th className="px-4 py-3 text-right">Est. Nilai Stok</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{o.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-500">{o.createdAt.slice(0, 10)}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-600">
                      {o.items.reduce((s, i) => s + i.qty, 0)} pcs
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-700">
                      <span className="font-normal text-slate-400 text-xs">(titipan) </span>
                      {formatIdr(o.totalValue)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={o.status} />
                        <span className="text-[10px] text-slate-400">{STATUS_LABEL[o.status] ?? o.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-center text-xs font-medium text-slate-400">
        Stok yang sudah dikirim Zoya masuk ke menu{" "}
        <Link href="/dashboard/inventory" className="font-bold text-brand-600 hover:underline">Stok Konsinyasi</Link>.
        Tagihan muncul di{" "}
        <Link href="/dashboard/finance" className="font-bold text-brand-600 hover:underline">Setoran</Link>{" "}
        setelah Anda melaporkan penjualan.
      </p>
    </div>
  );
}
