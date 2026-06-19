"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Badge } from "@/components/ui";

type Lead = { id: string; clientName: string; productType: string; targetVolume: number; stage: string; value?: number };
const stages = ["lead", "quote", "formulation", "production", "qc", "done"];
const stageLabel: Record<string, string> = { lead: "New Lead", quote: "Quotation", formulation: "Formulasi", production: "Produksi", qc: "QC", done: "Selesai" };

export default function AdminMaklonPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const load = useCallback(() => api.get<{ leads: Lead[] }>("/maklon/lead").then((r) => r.data && setLeads(r.data.leads)), []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title="Pipeline Maklon" subtitle="Lead kontrak maklon dari masuk sampai penerbitan SKU privat." actions={<Badge tone="brand">{leads.length} lead</Badge>} />
      <div className="flex gap-4 overflow-x-auto pb-4 kanban-scrollbar">
        {stages.map((st) => {
          const cards = leads.filter((l) => l.stage === st);
          return (
            <div key={st} className="flex w-64 shrink-0 flex-col">
              <div className="mb-3 flex items-center justify-between px-1"><span className="text-xs font-black uppercase tracking-wider text-slate-500">{stageLabel[st]}</span><span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1.5 text-[10px] font-black text-slate-600">{cards.length}</span></div>
              <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-slate-100/70 p-2.5">
                {cards.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-[11px] font-semibold text-slate-300">Kosong</div> : cards.map((l) => (
                  <Link key={l.id} href={`/admin/maklon/${l.id}`} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-200">
                    <div className="text-sm font-black text-slate-900">{l.clientName}</div>
                    <div className="mt-0.5 text-xs font-medium text-slate-400">{l.productType}</div>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-2 text-[11px]"><span className="font-semibold text-slate-400">{l.targetVolume.toLocaleString("id-ID")} pcs</span><span className="font-black text-slate-700">{l.value ? formatIdr(l.value) : "-"}</span></div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
