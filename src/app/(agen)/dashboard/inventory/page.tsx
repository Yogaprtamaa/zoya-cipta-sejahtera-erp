"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, TrendingUp, AlertTriangle, Info, MessagesSquare } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID, DEMO_PERIOD, DEMO_RESELLER_ID } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { useClientLevel } from "@/lib/use-client-level";
import { PageHeader, Card, Stat, SkeletonTable, EmptyState, ProgressBar } from "@/components/ui";

type Inv = { id: string; qty: number; status: string; productName?: string; variantName?: string; unit?: string; variantId: string };
type Sold = { variantId: string; qty: number };

export default function AgenInventoryPage() {
  const isReseller = useClientLevel() === "reseller";
  const [inv, setInv] = useState<Inv[]>([]);
  const [sold, setSold] = useState<Sold[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locationId = isReseller ? DEMO_RESELLER_ID : DEMO_AGENT_ID;
    const soldReq = isReseller
      ? api.get<{ reports: Sold[] }>(`/laporan-reseller?resellerId=${DEMO_RESELLER_ID}`).then((r) => r.data?.reports ?? [])
      : api.get<{ sales: Sold[] }>(`/penjualan?agentId=${DEMO_AGENT_ID}`).then((r) => r.data?.sales ?? []);
    Promise.all([
      api.get<{ items: Inv[] }>(`/inventory?locationType=agent&locationId=${locationId}`),
      soldReq,
    ]).then(([invRes, soldRows]) => {
      if (invRes.data) setInv(invRes.data.items);
      setSold(soldRows);
      setLoading(false);
    });
  }, [isReseller]);

  // Aggregate sold qty per variantId
  const soldByVariant = sold.reduce<Record<string, number>>((acc, s) => {
    acc[s.variantId] = (acc[s.variantId] ?? 0) + s.qty;
    return acc;
  }, {});

  const totalSisa = inv.reduce((s, i) => s + i.qty, 0);
  const totalTerjual = Object.values(soldByVariant).reduce((s, v) => s + v, 0);
  const totalDiterima = totalSisa + totalTerjual;
  const low = inv.filter((i) => i.qty <= 15);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok Konsinyasi"
        subtitle={isReseller
          ? `Stok titipan dari agen pembina Anda — periode ${DEMO_PERIOD}.`
          : `Inventaris titipan Zoya di lokasi Anda — periode ${DEMO_PERIOD}.`}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={<Boxes size={18} />} label="Total Diterima" value={`${totalDiterima} pcs`} tone="info" />
        <Stat icon={<TrendingUp size={18} />} label="Sudah Terjual" value={`${totalTerjual} pcs`} tone="success" />
        <Stat icon={<Boxes size={18} />} label="Sisa di Tangan" value={`${totalSisa} pcs`} />
        <Stat icon={<AlertTriangle size={18} />} label="Hampir Habis" value={`${low.length} SKU`} tone={low.length ? "warning" : "success"} />
      </div>

      {/* Konsinyasi info banner */}
      <Card className="border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="text-xs font-medium leading-relaxed text-slate-500">
            {isReseller ? (
              <>
                <strong className="text-slate-700">Stok ini titipan dari agen pembina Anda.</strong>{" "}
                Laporkan setiap penjualan agar tercatat dan stok Anda akurat.
                <Link href="/dashboard/laporan-reseller" className="ml-1 font-bold text-brand-600 hover:underline">Laporkan penjualan →</Link>
              </>
            ) : (
              <>
                <strong className="text-slate-700">Semua stok ini milik Zoya</strong> yang dititipkan ke Anda.
                Tagihan kewajiban hanya muncul dari produk yang sudah Anda laporkan terjual.
                Sisa {totalSisa} pcs yang belum terjual tidak membentuk tagihan.
                <Link href="/dashboard/penjualan" className="ml-1 font-bold text-brand-600 hover:underline">Laporkan penjualan →</Link>
              </>
            )}
          </p>
        </div>
      </Card>

      {/* Inventory table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={4} /></div>
        ) : inv.length === 0 ? (
          <EmptyState
            icon={<Boxes size={26} />}
            title="Belum ada stok konsinyasi"
            description={isReseller ? "Hubungi agen pembina Anda untuk pengisian stok." : "Ajukan permintaan stok ke Zoya untuk mulai berjualan."}
            action={isReseller
              ? <Link href="/dashboard/chat"><button className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Hubungi Agen Pembina</button></Link>
              : <Link href="/dashboard/order/baru"><button className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Ajukan Stok</button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Produk</th>
                  <th className="px-4 py-3 text-right">Diterima</th>
                  <th className="px-4 py-3 text-right">Terjual</th>
                  <th className="px-4 py-3 text-right">Sisa</th>
                  <th className="px-6 py-3">Progres Jual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inv.map((item) => {
                  const soldQty = soldByVariant[item.variantId] ?? 0;
                  const received = item.qty + soldQty;
                  const pct = received > 0 ? Math.round((soldQty / received) * 100) : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        <div className="text-[11px] text-slate-400">{item.variantName} · {item.unit}</div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-slate-500">{received}</td>
                      <td className="px-4 py-4 text-right font-semibold text-emerald-600">{soldQty}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`font-black ${item.qty <= 15 ? "text-amber-600" : "text-slate-900"}`}>
                          {item.qty}
                        </span>
                        {item.qty <= 15 && (
                          <div className="text-[10px] font-bold text-amber-500">hampir habis</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1"><ProgressBar value={pct} /></div>
                          <span className="w-10 text-right text-xs font-bold text-slate-500">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CTA if low stock */}
      {low.length > 0 && !loading && (
        <Card className="border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={16} className="shrink-0 text-amber-500" />
              <p className="text-sm font-semibold text-amber-800">
                {low.length} SKU hampir habis. {isReseller ? "Minta pengisian stok ke agen pembina Anda." : "Ajukan permintaan stok baru sebelum kehabisan."}
              </p>
            </div>
            {isReseller ? (
              <Link href="/dashboard/chat">
                <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50">
                  <MessagesSquare size={13} /> Hubungi Agen
                </button>
              </Link>
            ) : (
              <Link href="/dashboard/order/baru">
                <button className="shrink-0 rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50">
                  Ajukan Stok
                </button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
