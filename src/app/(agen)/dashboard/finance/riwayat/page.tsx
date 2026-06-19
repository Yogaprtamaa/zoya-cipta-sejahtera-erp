"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, StatusBadge, SkeletonTable } from "@/components/ui";

type Billing = { id: string; period: string; totalValue: number; status: string };

export default function FinanceRiwayatPage() {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ billings: Billing[] }>(`/finance/setoran?agentId=${DEMO_AGENT_ID}`).then((r) => { if (r.data) setBillings(r.data.billings); setLoading(false); }); }, []);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/finance" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Kembali ke setoran</Link>
      <PageHeader title="Riwayat Setoran" subtitle="Seluruh tagihan & status pembayaran." />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={3} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">No.</th><th className="px-4 py-3">Periode</th><th className="px-4 py-3 text-right">Nilai</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-50">{billings.map((b) => <tr key={b.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-bold text-slate-900">{b.id}</td><td className="px-4 py-4 font-medium text-slate-500">{b.period}</td><td className="px-4 py-4 text-right font-bold text-slate-700">{formatIdr(b.totalValue)}</td><td className="px-6 py-4"><StatusBadge status={b.status} /></td></tr>)}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
}
