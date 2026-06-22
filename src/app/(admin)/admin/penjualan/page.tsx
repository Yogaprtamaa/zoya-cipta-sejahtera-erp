"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingCart, Filter } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Stat, StatusBadge, SkeletonTable, EmptyState } from "@/components/ui";
import { HBarChart } from "@/components/charts";

type Sale = {
  id: string;
  agentName?: string;
  agentId?: string;
  productName: string;
  variantId?: string;
  qty: number;
  value: number;
  date: string;
  status?: string;
};

export default function AdminPenjualanPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAgent, setFilterAgent] = useState("all");

  useEffect(() => {
    api.get<{ sales: Sale[] }>("/penjualan").then((r) => {
      if (r.data) setSales(r.data.sales);
      setLoading(false);
    });
  }, []);

  // Per-agent summary
  const agentMap = sales.reduce<Record<string, { name: string; qty: number; value: number; reports: number }>>((acc, s) => {
    const key = s.agentId ?? s.agentName ?? "—";
    if (!acc[key]) acc[key] = { name: s.agentName ?? key, qty: 0, value: 0, reports: 0 };
    acc[key].qty += s.qty;
    acc[key].value += s.value;
    acc[key].reports += 1;
    return acc;
  }, {});

  const agentList = Object.entries(agentMap).sort((a, b) => b[1].value - a[1].value);
  const agents = ["all", ...agentList.map(([id]) => id)];

  const filtered = filterAgent === "all" ? sales : sales.filter((s) => (s.agentId ?? s.agentName) === filterAgent);

  const totalQty = filtered.reduce((s, x) => s + x.qty, 0);
  const totalValue = filtered.reduce((s, x) => s + x.value, 0);

  const ranking = agentList.map(([, v]) => ({ label: v.name, value: v.value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Penjualan Agen"
        subtitle="Semua laporan penjualan yang masuk dari agen — real-time."
      />

      {/* Summary stats */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat icon={<Users size={18} />} label="Total Agen Melapor" value={`${agentList.length}`} tone="info" />
          <Stat icon={<ShoppingCart size={18} />} label="Total Laporan" value={`${sales.length}`} />
          <Stat icon={<TrendingUp size={18} />} label="Total Terjual" value={`${totalQty} pcs`} tone="success" />
          <Stat icon={<TrendingUp size={18} />} label="Total Nilai" value={formatIdr(totalValue)} tone="success" />
        </div>
      )}

      {/* Ranking chart */}
      {!loading && ranking.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-brand-600" />
            <h3 className="font-display text-lg font-black text-slate-900">Ranking Omzet Agen</h3>
          </div>
          <HBarChart data={ranking} valueFormatter={formatIdr} />
        </Card>
      )}

      {/* Per-agent summary table */}
      {!loading && agentList.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="font-display text-base font-black text-slate-900">Ringkasan Per Agen</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-400">Total penjualan yang dilaporkan, menjadi dasar tagihan setoran.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Agen</th>
                  <th className="px-4 py-3 text-right">Jml Laporan</th>
                  <th className="px-4 py-3 text-right">Total Terjual</th>
                  <th className="px-6 py-3 text-right">Nilai Kewajiban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {agentList.map(([id, a]) => (
                  <tr
                    key={id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setFilterAgent(filterAgent === id ? "all" : id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-xs font-black text-white">
                          {a.name[0]}
                        </div>
                        <span className="font-bold text-slate-900">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-600">{a.reports}×</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">{a.qty} pcs</td>
                    <td className="px-6 py-4 text-right font-black text-brand-700">{formatIdr(a.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail laporan */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="font-display text-base font-black text-slate-900">Detail Laporan Penjualan</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-400">
              {filterAgent === "all" ? "Semua agen" : `Filter: ${agentMap[filterAgent]?.name ?? filterAgent}`}
              {" "}· {filtered.length} laporan
            </p>
          </div>
          {filterAgent !== "all" && (
            <button
              onClick={() => setFilterAgent("all")}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              <Filter size={12} /> Semua
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<ShoppingCart size={26} />} title="Belum ada laporan penjualan" description="Agen belum menginput laporan penjualan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">No. Laporan</th>
                  <th className="px-4 py-3">Agen</th>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Nilai</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{s.id}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{s.agentName ?? "—"}</td>
                    <td className="px-4 py-4 font-medium text-slate-500">{s.productName}</td>
                    <td className="px-4 py-4 font-medium text-slate-400">{s.date}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">{s.qty} pcs</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-800">{formatIdr(s.value)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status ?? "confirmed"} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={4} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total {filterAgent === "all" ? "Semua" : agentMap[filterAgent]?.name}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">
                    {totalQty} pcs
                  </td>
                  <td className="px-4 py-3 text-right font-black text-brand-700">
                    {formatIdr(totalValue)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
