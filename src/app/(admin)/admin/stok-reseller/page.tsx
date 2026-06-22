"use client";

import { useEffect, useState } from "react";
import { MapPinned, Boxes, Users, Wallet, ChevronRight } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Stat, SkeletonTable, EmptyState, Badge } from "@/components/ui";

type Item = { variantId: string; productName: string; variantName: string; qty: number };
type Reseller = { id: string; name: string; items: Item[]; stockQty: number; soldQty: number; soldValue: number; reportCount: number };
type Group = {
  agentId: string;
  agentName: string;
  kabupaten: string | null;
  resellerCount: number;
  resellers: Reseller[];
  totalStock: number;
  totalSoldQty: number;
  totalSoldValue: number;
};

export default function AdminStokResellerPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ groups: Group[] }>("/stok-reseller").then((r) => {
      if (r.data) setGroups(r.data.groups);
      setLoading(false);
    });
  }, []);

  const withResellers = groups.filter((g) => g.resellerCount > 0);
  const totalStock = withResellers.reduce((s, g) => s + g.totalStock, 0);
  const totalSoldValue = withResellers.reduce((s, g) => s + g.totalSoldValue, 0);
  const totalResellers = withResellers.reduce((s, g) => s + g.resellerCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok Reseller per Wilayah"
        subtitle="Rekap stok seluruh reseller — dikelompokkan per wilayah & agen pembina. Stok belum terjual ikut terpantau di sini."
      />

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat icon={<MapPinned size={16} />} label="Wilayah Aktif" value={`${withResellers.length}`} tone="brand" />
          <Stat icon={<Users size={16} />} label="Total Reseller" value={`${totalResellers}`} tone="info" />
          <Stat icon={<Boxes size={16} />} label="Stok Belum Terjual" value={`${totalStock} pcs`} tone="warning" />
          <Stat icon={<Wallet size={16} />} label="Nilai Terlaporkan" value={formatIdr(totalSoldValue)} tone="success" />
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={5} />
      ) : withResellers.length === 0 ? (
        <EmptyState icon={<Boxes size={26} />} title="Belum ada reseller" description="Belum ada agen yang membina reseller." />
      ) : (
        <div className="space-y-5">
          {withResellers.map((g) => (
            <Card key={g.agentId} className="overflow-hidden">
              {/* Header wilayah → agen */}
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/60 to-transparent px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
                  <MapPinned size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {g.kabupaten ?? "Tanpa Wilayah"} <ChevronRight size={12} /> Agen
                  </div>
                  <div className="font-display text-base font-black text-slate-900">{g.agentName}</div>
                </div>
                <Badge tone="brand">{g.resellerCount} reseller</Badge>
                <div className="flex gap-5 text-right">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stok</div>
                    <div className="font-display text-sm font-black text-amber-600">{g.totalStock} pcs</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Terjual</div>
                    <div className="font-display text-sm font-black text-slate-900">{g.totalSoldQty} pcs</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nilai</div>
                    <div className="font-display text-sm font-black text-brand-700">{formatIdr(g.totalSoldValue)}</div>
                  </div>
                </div>
              </div>

              {/* Reseller rows */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3">Reseller</th>
                      <th className="px-4 py-3">Stok Belum Terjual</th>
                      <th className="px-4 py-3 text-right">Total Stok</th>
                      <th className="px-4 py-3 text-right">Terjual (Laporan)</th>
                      <th className="px-6 py-3 text-right">Nilai Terjual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {g.resellers.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{r.name}</div>
                          <div className="text-[11px] text-slate-400">{r.id}</div>
                        </td>
                        <td className="px-4 py-4">
                          {r.items.length === 0 ? (
                            <span className="text-xs font-semibold text-slate-300">— tidak ada stok</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {r.items.map((i) => (
                                <span key={i.variantId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${i.qty === 0 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`}>
                                  {i.productName} {i.variantName}: <span className="font-black">{i.qty}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-amber-600">{r.stockQty} pcs</td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-700">{r.soldQty} pcs <span className="text-[10px] font-medium text-slate-400">({r.reportCount} laporan)</span></td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800">{formatIdr(r.soldValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
