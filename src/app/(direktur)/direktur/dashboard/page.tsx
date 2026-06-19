"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Wallet, ShoppingCart, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { Card, Stat, Button } from "@/components/ui";

type Order = { id: string; status: string; totalValue: number };
type Sale = { value: number };
type Billing = { totalValue: number; status: string };

export default function DirekturDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);

  useEffect(() => {
    api.get<{ orders: Order[] }>("/order").then((r) => r.data && setOrders(r.data.orders));
    api.get<{ sales: Sale[] }>("/penjualan").then((r) => r.data && setSales(r.data.sales));
    api.get<{ billings: Billing[] }>("/finance/setoran").then((r) => r.data && setBillings(r.data.billings));
  }, []);

  const pending = orders.filter((o) => o.status === "director_review");
  const receivable = billings.filter((b) => b.status !== "paid").reduce((s, b) => s + b.totalValue, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<BadgeCheck size={18} />} label="Menunggu Otorisasi" value={`${pending.length}`} tone={pending.length ? "warning" : "neutral"} />
        <Stat icon={<Wallet size={18} />} label="Paparan Pending" value={formatIdr(pending.reduce((s, o) => s + o.totalValue, 0))} tone="info" />
        <Stat icon={<ShoppingCart size={18} />} label="Total Sales" value={formatIdr(sales.reduce((s, x) => s + x.value, 0))} tone="success" />
        <Stat icon={<Wallet size={18} />} label="Receivable" value={formatIdr(receivable)} tone="info" />
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><AlertTriangle size={20} /></span><div><h3 className="font-display text-lg font-black text-slate-900">Order Besar Menunggu</h3><p className="text-xs text-slate-400">Order ≥ threshold yang butuh otorisasi Direktur.</p></div></div>
        {pending.length > 0 ? <div className="mt-4"><Link href="/direktur/approval"><Button>Tinjau {pending.length} Order</Button></Link></div> : <p className="mt-4 text-sm font-medium text-slate-400">Tidak ada antrean saat ini.</p>}
      </Card>
    </div>
  );
}
