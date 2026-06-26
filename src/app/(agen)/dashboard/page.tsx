"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Wallet, TrendingUp, ReceiptText, PackagePlus, ShoppingCart, Upload, Undo2, FileText, Package, MessagesSquare } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID, DEMO_PERIOD, DEMO_RESELLER_ID } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { useClientLevel } from "@/lib/use-client-level";
import { Card, Stat, StatusBadge, SkeletonStat, SkeletonChart, SkeletonTable } from "@/components/ui";
import { SalesTrendChart } from "@/components/charts";

type Inv     = { id: string; qty: number; productName?: string; variantName?: string };
type Sale    = { id: string; productName: string; qty: number; value: number; date: string; status?: string };
type Billing = { id: string; period: string; totalValue: number; status: string };
type Report  = { id: string; qty: number; value: number; date: string; period: string; productName: string };

const monthName = (p: string) =>
  ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][Number(p.split("-")[1]) - 1] ?? p;

export default function DashboardHome() {
  const isReseller = useClientLevel() === "reseller";
  return isReseller ? <ResellerDashboard /> : <AgenDashboard />;
}

/* ------------------------------- AGEN ------------------------------- */

const agenActions = [
  { label: "Ajukan Stok",    icon: PackagePlus, href: "/dashboard/order/baru"  },
  { label: "Input Penjualan",icon: ShoppingCart, href: "/dashboard/penjualan"  },
  { label: "Upload Bukti",   icon: Upload,       href: "/dashboard/finance"     },
  { label: "Ajukan Retur",   icon: Undo2,        href: "/dashboard/retur"       },
];

function AgenDashboard() {
  const [inv, setInv]           = useState<Inv[]>([]);
  const [sales, setSales]       = useState<Sale[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ items: Inv[] }>(`/inventory?locationType=agent&locationId=${DEMO_AGENT_ID}`),
      api.get<{ sales: Sale[] }>(`/penjualan?agentId=${DEMO_AGENT_ID}`),
      api.get<{ billings: Billing[] }>(`/finance/setoran?agentId=${DEMO_AGENT_ID}`),
    ]).then(([invR, saleR, billR]) => {
      if (invR.data)  setInv(invR.data.items);
      if (saleR.data) setSales(saleR.data.sales);
      if (billR.data) setBillings(billR.data.billings);
      setLoading(false);
    });
  }, []);

  const totalUnits  = inv.reduce((s, i) => s + i.qty, 0);
  const current     = billings.find((b) => b.period === DEMO_PERIOD);
  const outstanding = billings.filter((b) => b.status !== "paid" && b.status !== "verified").reduce((s, b) => s + b.totalValue, 0);
  const salesThisMonth = sales.filter((s) => s.date.startsWith(DEMO_PERIOD));

  const trendMap = new Map<string, number>();
  sales.forEach((s) => trendMap.set(s.date.slice(0, 7), (trendMap.get(s.date.slice(0, 7)) ?? 0) + s.qty));
  const trend = [...trendMap.entries()].sort().map(([p, v]) => ({ label: monthName(p), value: v }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <Stat icon={<Boxes size={18} />}       label="Stok Konsinyasi"  value={`${totalUnits} pcs`}                            hint="Sisa titipan Zoya" />
            <Stat icon={<TrendingUp size={18} />}  label={`Terjual ${DEMO_PERIOD.slice(5)}`} value={`${salesThisMonth.reduce((a, s) => a + s.qty, 0)} pcs`} tone="success" />
            <Stat icon={<ReceiptText size={18} />} label="Tagihan Bulan Ini" value={formatIdr(current?.totalValue ?? 0)}            hint={current?.status ?? "—"} tone="warning" />
            <Stat icon={<Wallet size={18} />}      label="Outstanding"       value={formatIdr(outstanding)}                         tone="info" />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-8">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Tren Penjualan</h3>
          <p className="text-xs font-medium text-slate-400">Volume per bulan (pcs)</p>
          <div className="mt-4">
            {loading ? <SkeletonChart /> : trend.length ? <SalesTrendChart data={trend} unit="pcs" /> : (
              <div className="py-16 text-center text-sm text-slate-300">Belum ada data penjualan</div>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-4">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Aksi Cepat</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {agenActions.map((a) => (
              <Link key={a.label} href={a.href} className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><a.icon size={18} /></span>
                <span className="text-xs font-bold text-slate-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Penjualan Terakhir</h3>
        </div>
        {loading ? (
          <div className="p-6"><SkeletonTable rows={3} /></div>
        ) : sales.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-slate-300">
            Belum ada penjualan. <Link href="/dashboard/penjualan" className="font-bold text-brand-500 hover:underline">Input sekarang →</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {sales.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-3.5 text-sm hover:bg-slate-50">
                <div>
                  <div className="font-bold text-slate-900">{s.productName}</div>
                  <div className="text-[11px] text-slate-400">{s.date} · {s.qty} pcs</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">{formatIdr(s.value)}</span>
                  {s.status && <StatusBadge status={s.status} />}
                </div>
              </div>
            ))}
            <div className="px-6 py-3">
              <Link href="/dashboard/penjualan" className="text-xs font-bold text-brand-600 hover:underline">Lihat semua laporan penjualan →</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ----------------------------- RESELLER ----------------------------- */

const resellerActions = [
  { label: "Input Laporan",   icon: FileText,       href: "/dashboard/laporan-reseller" },
  { label: "Katalog & Harga", icon: Package,        href: "/dashboard/produk"           },
  { label: "Stok Saya",       icon: Boxes,          href: "/dashboard/inventory"        },
  { label: "Chat",            icon: MessagesSquare, href: "/dashboard/chat"             },
];

function ResellerDashboard() {
  const [inv, setInv]         = useState<Inv[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ items: Inv[] }>(`/inventory?locationType=agent&locationId=${DEMO_RESELLER_ID}`),
      api.get<{ reports: Report[] }>(`/laporan-reseller?resellerId=${DEMO_RESELLER_ID}`),
    ]).then(([invR, repR]) => {
      if (invR.data) setInv(invR.data.items);
      if (repR.data) setReports(repR.data.reports);
      setLoading(false);
    });
  }, []);

  const totalStock   = inv.reduce((s, i) => s + i.qty, 0);
  const soldThisMonth = reports.filter((r) => r.period === DEMO_PERIOD).reduce((a, r) => a + r.qty, 0);
  const totalValue   = reports.reduce((s, r) => s + r.value, 0);

  const trendMap = new Map<string, number>();
  reports.forEach((r) => trendMap.set(r.date.slice(0, 7), (trendMap.get(r.date.slice(0, 7)) ?? 0) + r.qty));
  const trend = [...trendMap.entries()].sort().map(([p, v]) => ({ label: monthName(p), value: v }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <Stat icon={<Boxes size={18} />}      label="Stok Konsinyasi"  value={`${totalStock} pcs`} hint="Titipan agen pembina" />
            <Stat icon={<TrendingUp size={18} />} label={`Terjual ${DEMO_PERIOD.slice(5)}`} value={`${soldThisMonth} pcs`} tone="success" />
            <Stat icon={<FileText size={18} />}   label="Total Laporan"    value={`${reports.length}`} tone="info" />
            <Stat icon={<Wallet size={18} />}     label="Nilai Terlapor"   value={formatIdr(totalValue)} tone="warning" />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-8">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Tren Penjualan Saya</h3>
          <p className="text-xs font-medium text-slate-400">Unit dilaporkan ke agen pembina per bulan (pcs)</p>
          <div className="mt-4">
            {loading ? <SkeletonChart /> : trend.length ? <SalesTrendChart data={trend} unit="pcs" /> : (
              <div className="py-16 text-center text-sm text-slate-300">Belum ada laporan penjualan</div>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-4">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Aksi Cepat</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {resellerActions.map((a) => (
              <Link key={a.label} href={a.href} className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><a.icon size={18} /></span>
                <span className="text-xs font-bold text-slate-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Laporan Terakhir</h3>
        </div>
        {loading ? (
          <div className="p-6"><SkeletonTable rows={3} /></div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-slate-300">
            Belum ada laporan. <Link href="/dashboard/laporan-reseller" className="font-bold text-brand-500 hover:underline">Input sekarang →</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {reports.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-3.5 text-sm hover:bg-slate-50">
                <div>
                  <div className="font-bold text-slate-900">{r.productName}</div>
                  <div className="text-[11px] text-slate-400">{r.date} · {r.qty} pcs</div>
                </div>
                <span className="font-bold text-slate-700">{formatIdr(r.value)}</span>
              </div>
            ))}
            <div className="px-6 py-3">
              <Link href="/dashboard/laporan-reseller" className="text-xs font-bold text-brand-600 hover:underline">Lihat semua laporan →</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
