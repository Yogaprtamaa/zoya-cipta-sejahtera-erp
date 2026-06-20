"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Wallet, ShoppingCart, CreditCard, PackagePlus, Undo2, Users, Briefcase, BadgeCheck, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { Card, Stat, Badge, SkeletonStat, SkeletonChart, SkeletonCard, Button } from "@/components/ui";
import { HBarChart } from "@/components/charts";

type Order   = { id: string; agentName?: string; status: string; totalValue: number; items: { qty: number }[] };
type Billing = { id: string; agentName?: string; totalValue: number; status: string };
type Sale    = { agentName?: string; value: number };
type Ret     = { status: string };

export default function AdminDashboard() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [sales, setSales]       = useState<Sale[]>([]);
  const [returns, setReturns]   = useState<Ret[]>([]);
  const [threshold, setThreshold] = useState(12750000);
  const [loading, setLoading]   = useState(true);

  const load = () => Promise.all([
    api.get<{ orders: Order[] }>("/order"),
    api.get<{ billings: Billing[] }>("/finance/setoran"),
    api.get<{ sales: Sale[] }>("/penjualan"),
    api.get<{ returns: Ret[] }>("/retur"),
    api.get<{ settings: { approval_threshold: number } }>("/settings"),
  ]).then(([oR, bR, sR, rR, stR]) => {
    if (oR.data) setOrders(oR.data.orders);
    if (bR.data) setBillings(bR.data.billings);
    if (sR.data) setSales(sR.data.sales);
    if (rR.data) setReturns(rR.data.returns);
    if (stR.data) setThreshold(stR.data.settings.approval_threshold);
    setLoading(false);
  });

  useEffect(() => { load(); }, []);

  const pendingApproval = orders.filter((o) => o.status === "pending_approval");
  const pendingPay      = billings.filter((b) => b.status === "uploaded").length;
  const pendingReturns  = returns.filter((r) => r.status === "pending").length;
  const receivable      = billings.filter((b) => b.status !== "paid" && b.status !== "verified").reduce((s, b) => s + b.totalValue, 0);
  const totalSales      = sales.reduce((s, x) => s + x.value, 0);

  const pendingAdminReview = orders.filter((o) => o.status === "admin_review").length;
  const totalPending = pendingAdminReview + pendingPay + pendingReturns;

  const byAgent = Object.values(
    sales.reduce<Record<string, { label: string; value: number }>>((acc, s) => {
      const k = s.agentName ?? "—";
      acc[k] = acc[k] ?? { label: k, value: 0 };
      acc[k].value += s.value;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value).slice(0, 5);

  const act = async (id: string, action: "approve" | "reject") => {
    await api.post(`/order/${id}/approve`, { action, by: "admin" });
    load();
  };

  return (
    <div className="space-y-6">
      {/* Stats row 1 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />) : (
          <>
            <Stat icon={<Boxes size={18} />}       label="Stok Gudang"    value="2.400 pcs" />
            <Stat icon={<ShoppingCart size={18} />} label="Total Sales"   value={formatIdr(totalSales)} tone="success" />
            <Stat icon={<Wallet size={18} />}       label="Piutang"       value={formatIdr(receivable)} tone="info" />
            <Stat icon={<PackagePlus size={18} />}  label="Order Pending" value={`${pendingAdminReview}`} tone={pendingAdminReview ? "warning" : "neutral"} />
          </>
        )}
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />) : (
          <>
            <Stat icon={<CreditCard size={18} />} label="Bukti Masuk"   value={`${pendingPay}`}     tone={pendingPay ? "warning" : "neutral"} />
            <Stat icon={<Undo2 size={18} />}      label="Retur Pending" value={`${pendingReturns}`} tone={pendingReturns ? "warning" : "neutral"} />
            <Stat icon={<Users size={18} />}      label="Agen Aktif"    value="9" />
            <Stat icon={<Briefcase size={18} />}  label="Maklon Leads"  value="4" tone="brand" />
          </>
        )}
      </div>

      {/* Large order approval queue */}
      {!loading && pendingApproval.length > 0 && (
        <Card className="overflow-hidden border-amber-200 bg-amber-50/40">
          <div className="flex items-center gap-3 border-b border-amber-100 px-6 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h3 className="font-display text-base font-black text-slate-900">Order Besar Menunggu Persetujuan</h3>
              <p className="text-xs text-slate-500">Order ≥ {formatIdr(threshold)} — perlu aksi persetujuan.</p>
            </div>
            <span className="ml-auto"><Badge tone="warning">{pendingApproval.length} order</Badge></span>
          </div>
          <div className="divide-y divide-amber-50">
            {pendingApproval.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <div className="font-bold text-slate-900">{o.id} · {o.agentName ?? "—"}</div>
                  <div className="text-xs text-slate-500">{o.items.reduce((s, it) => s + it.qty, 0)} pcs · {formatIdr(o.totalValue)}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => act(o.id, "reject")}>Tolak</Button>
                  <Button size="sm" onClick={() => act(o.id, "approve")}><BadgeCheck size={14} /> Setujui</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Chart */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-black tracking-tight text-slate-900">Penjualan per Agen</h3>
        <div className="mt-4">
          {loading ? (
            <SkeletonChart />
          ) : byAgent.length ? (
            <HBarChart data={byAgent} />
          ) : (
            <div className="py-12 text-center text-sm text-slate-300">Belum ada data penjualan</div>
          )}
        </div>
      </Card>

      {/* Action queue */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-base font-black tracking-tight text-slate-900">Antrean Tindakan</h3>
          {!loading && (
            <Badge tone={totalPending > 0 ? "warning" : "success"}>
              {totalPending > 0 ? `${totalPending} perlu ditindak` : "Semua clear ✓"}
            </Badge>
          )}
        </div>
        {loading ? (
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} lines={1} />)}
          </div>
        ) : (
          <div className="grid gap-3 p-5 sm:grid-cols-3 text-sm">
            <Link
              href="/admin/order"
              className={`rounded-2xl border p-4 font-bold transition-all hover:-translate-y-0.5 hover:shadow-soft ${pendingAdminReview > 0 ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
            >
              <div className="text-xl font-black">{pendingAdminReview}</div>
              <div className="mt-0.5">order menunggu approval →</div>
            </Link>
            <Link
              href="/admin/finance"
              className={`rounded-2xl border p-4 font-bold transition-all hover:-translate-y-0.5 hover:shadow-soft ${pendingPay > 0 ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
            >
              <div className="text-xl font-black">{pendingPay}</div>
              <div className="mt-0.5">bukti transfer perlu diverifikasi →</div>
            </Link>
            <Link
              href="/admin/agen"
              className="rounded-2xl border border-slate-200 p-4 font-bold text-slate-500 transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-soft"
            >
              <div className="text-xl font-black">→</div>
              <div className="mt-0.5">Kelola pengajuan agen baru</div>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
