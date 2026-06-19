"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { PageHeader, Card, ProgressBar } from "@/components/ui";

const TARGET = 2000;

export default function AgenRewardPage() {
  const [sold, setSold] = useState(0);
  useEffect(() => {
    api.get<{ sales: { qty: number }[] }>(`/penjualan?agentId=${DEMO_AGENT_ID}`).then((r) => { if (r.data) setSold(r.data.sales.reduce((s, x) => s + x.qty, 0)); });
  }, []);
  const pct = Math.min(100, Math.round((sold / TARGET) * 100));

  return (
    <div className="space-y-6">
      <PageHeader title="Reward Tahunan" subtitle="Progress menuju reward berdasarkan akumulasi penjualan." />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white"><Trophy size={28} /><div><div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-100">Program Aktif</div><div className="font-display text-xl font-black">Trip Umrah 2027</div></div></div>
        <div className="space-y-4 p-6">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500"><span>Progress</span><span>{sold} dari {TARGET.toLocaleString("id-ID")} pcs</span></div>
          <ProgressBar value={pct} tone="warning" />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligible</div><div className="mt-1 font-display text-xl font-black text-slate-900">{sold} pcs</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sisa</div><div className="mt-1 font-display text-xl font-black text-slate-900">{Math.max(0, TARGET - sold)} pcs</div></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
