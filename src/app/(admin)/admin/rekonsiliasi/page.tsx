"use client";

import { useEffect, useState } from "react";
import { Scale, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Badge, Stat, SkeletonTable } from "@/components/ui";

type Order = { agentId: string; agentName?: string; items: { qty: number }[]; status: string };
type Sale  = { agentId: string; agentName?: string; qty: number };
type Ret   = { agentId: string; qty: number; status: string };
type Inv   = { locationId: string; locationType: string; qty: number };

type Row = {
  agent: string;
  dikirim: number;
  laku: number;
  retur: number;
  expected: number;  // stok seharusnya di agen = dikirim - laku - retur
  physical: number;  // stok nyata (inventory)
  variance: number;
};

export default function AdminRekonsiliasiPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ orders: Order[] }>("/order"),
      api.get<{ sales: Sale[] }>("/penjualan"),
      api.get<{ returns: Ret[] }>("/retur"),
      api.get<{ items: Inv[] }>("/inventory?locationType=agent"),
    ]).then(([o, s, r, i]) => {
      const map: Record<string, Omit<Row, "expected" | "variance">> = {};
      const get = (id: string, name?: string) =>
        (map[id] = map[id] ?? { agent: name ?? id, dikirim: 0, laku: 0, retur: 0, physical: 0 });

      o.data?.orders
        .filter((x) => x.status === "shipped")
        .forEach((x) => { get(x.agentId, x.agentName).dikirim += x.items.reduce((a, it) => a + it.qty, 0); });
      s.data?.sales.forEach((x) => { get(x.agentId, x.agentName).laku += x.qty; });
      r.data?.returns.filter((x) => x.status === "approved").forEach((x) => { get(x.agentId).retur += x.qty; });
      i.data?.items.forEach((x) => { get(x.locationId).physical += x.qty; });

      setRows(
        Object.values(map).map((m) => ({
          ...m,
          expected: m.dikirim - m.laku - m.retur,
          variance: m.physical - (m.dikirim - m.laku - m.retur),
        }))
      );
      setLoading(false);
    });
  }, []);

  const ok    = rows.filter((r) => r.variance === 0);
  const diff  = rows.filter((r) => r.variance !== 0);
  const totalDikirim = rows.reduce((s, r) => s + r.dikirim, 0);
  const totalLaku    = rows.reduce((s, r) => s + r.laku, 0);
  const totalSisa    = rows.reduce((s, r) => s + r.physical, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rekonsiliasi Stok Konsinyasi"
        subtitle="Cek kesesuaian antara stok yang dikirim Zoya vs laporan penjualan agen vs fisik di lapangan."
      />

      {/* Summary */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat icon={<Scale size={18} />}      label="Total Dikirim"    value={`${totalDikirim} pcs`} tone="info" />
          <Stat icon={<CheckCircle2 size={18} />} label="Total Terlaporkan Laku" value={`${totalLaku} pcs`} tone="success" />
          <Stat icon={<Scale size={18} />}      label="Sisa di Agen"    value={`${totalSisa} pcs`} />
          <Stat icon={<AlertTriangle size={18} />} label="Variance Agen" value={`${diff.length}`} tone={diff.length > 0 ? "warning" : "success"} />
        </div>
      )}

      {/* Formula info */}
      <Card className="border-brand-100 bg-brand-50/40 p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="mt-0.5 shrink-0 text-brand-500" />
          <div className="space-y-2 text-xs font-medium text-slate-600">
            <p className="font-bold text-slate-800">Formula rekonsiliasi konsinyasi:</p>
            <div className="rounded-xl bg-white p-3 font-mono text-xs text-slate-700 border border-slate-100">
              <span className="text-brand-600 font-bold">Seharusnya</span> = Dikirim − Dilaporkan Laku − Retur Disetujui
              <br />
              <span className="text-emerald-600 font-bold">Variance</span>  = Fisik (inventory) − Seharusnya
            </div>
            <p className="text-slate-500">
              Variance 0 = stok agen cocok. Variance negatif = ada stok yang hilang / belum dilaporkan.
              Variance positif = ada kelebihan stok (mungkin retur belum diproses).
            </p>
          </div>
        </div>
      </Card>

      {/* Variance alert */}
      {!loading && diff.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-800">
              {diff.length} agen memiliki variance stok — perlu tindak lanjut.
            </p>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={4} /></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm font-semibold text-slate-400">
            Belum ada data — stok belum dikirim ke agen.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Agen</th>
                  <th className="px-4 py-3 text-right">Dikirim Zoya</th>
                  <th className="px-4 py-3 text-right">Dilaporkan Laku</th>
                  <th className="px-4 py-3 text-right">Retur</th>
                  <th className="px-4 py-3 text-right">Seharusnya</th>
                  <th className="px-4 py-3 text-right">Fisik (Inv)</th>
                  <th className="px-6 py-3 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r) => (
                  <tr key={r.agent} className={`hover:bg-slate-50 ${r.variance !== 0 ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-[10px] font-black text-white">
                          {r.agent[0]}
                        </div>
                        <span className="font-bold text-slate-900">{r.agent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">{r.dikirim}</td>
                    <td className="px-4 py-4 text-right font-semibold text-blue-600">{r.laku}</td>
                    <td className="px-4 py-4 text-right font-semibold text-rose-500">{r.retur}</td>
                    <td className="px-4 py-4 text-right font-black text-slate-900">{r.expected}</td>
                    <td className="px-4 py-4 text-right font-black text-slate-900">{r.physical}</td>
                    <td className="px-6 py-4 text-right">
                      {r.variance === 0 ? (
                        <Badge tone="success">
                          <CheckCircle2 size={11} className="inline mr-0.5" /> OK
                        </Badge>
                      ) : (
                        <Badge tone={r.variance < 0 ? "danger" : "warning"}>
                          <AlertTriangle size={11} className="inline mr-0.5" />
                          {r.variance > 0 ? "+" : ""}{r.variance}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Total</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">{totalDikirim}</td>
                  <td className="px-4 py-3 text-right font-black text-blue-600">{totalLaku}</td>
                  <td className="px-4 py-3 text-right font-black text-rose-500">{rows.reduce((s,r)=>s+r.retur,0)}</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">{rows.reduce((s,r)=>s+r.expected,0)}</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">{totalSisa}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {ok.length > 0 && !loading && (
        <p className="text-center text-xs font-semibold text-emerald-600">
          ✓ {ok.length} dari {rows.length} agen tidak ada variance stok
        </p>
      )}
    </div>
  );
}
