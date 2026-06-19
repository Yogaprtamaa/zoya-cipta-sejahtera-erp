"use client";

import { useEffect, useState } from "react";
import { MapPinned } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { PageHeader, Card, ProgressBar, StatusBadge, EmptyState } from "@/components/ui";

type Region = { id: string; kabupaten: string; agentId: string | null; monthlyTarget: number; omzetBotol: number; status: string };

export default function AgenWilayahPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  useEffect(() => { api.get<{ regions: Region[] }>("/wilayah").then((r) => r.data && setRegions(r.data.regions)); }, []);
  const mine = regions.find((r) => r.agentId === DEMO_AGENT_ID);

  return (
    <div className="space-y-6">
      <PageHeader title="Wilayah" subtitle="Status wilayah eksklusif & progress target bulanan (botol)." />
      {!mine ? <Card><EmptyState icon={<MapPinned size={26} />} title="Belum ada wilayah" description="Anda belum memiliki wilayah eksklusif." /></Card> : (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4 border-b border-slate-100 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><MapPinned size={22} /></span>
            <div><div className="font-display text-xl font-black text-slate-900">{mine.kabupaten}</div><div className="text-xs font-semibold text-slate-400">Wilayah eksklusif aktif</div></div>
            <div className="ml-auto"><StatusBadge status={mine.status} /></div>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500"><span>Target {mine.monthlyTarget} botol/bln</span><span>{Math.round((mine.omzetBotol / mine.monthlyTarget) * 100)}%</span></div>
            <ProgressBar value={(mine.omzetBotol / mine.monthlyTarget) * 100} tone={mine.omzetBotol >= mine.monthlyTarget ? "success" : "warning"} />
            <div className="flex justify-between text-xs font-medium text-slate-400"><span>Tercapai {mine.omzetBotol} botol</span><span>Sisa {Math.max(0, mine.monthlyTarget - mine.omzetBotol)} botol</span></div>
          </div>
        </Card>
      )}
    </div>
  );
}
