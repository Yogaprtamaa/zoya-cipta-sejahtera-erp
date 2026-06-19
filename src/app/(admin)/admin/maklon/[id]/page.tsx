"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Lock } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge } from "@/components/ui";

type Lead = { id: string; clientName: string; productType: string; targetVolume: number; stage: string; contact: string; value?: number };
const stages = ["lead", "quote", "formulation", "production", "qc", "done"];
const labels: Record<string, string> = { lead: "New Lead", quote: "Quotation", formulation: "Formulasi", production: "Produksi", qc: "QC", done: "Selesai" };

export default function AdminMaklonDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const load = useCallback(() => api.get<{ leads: Lead[] }>("/maklon/lead").then((r) => { if (r.data) setLead(r.data.leads.find((l) => l.id === id) ?? null); }), [id]);
  useEffect(() => { load(); }, [load]);

  if (!lead) return <Card className="p-10 text-center text-sm font-semibold text-slate-400">Memuat…</Card>;
  const idx = stages.indexOf(lead.stage);
  const next = stages[Math.min(idx + 1, stages.length - 1)];

  const advance = async () => { await api.patch(`/maklon/${lead.id}/stage`, { stage: next }); load(); };

  return (
    <div className="space-y-6">
      <Link href="/admin/maklon" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Kembali</Link>
      <PageHeader title={lead.clientName} subtitle={`${lead.id} · ${lead.productType}`} actions={<div className="flex items-center gap-2"><StatusBadge status={lead.stage} />{lead.stage !== "done" && <Button size="sm" onClick={advance}>Naik ke {labels[next]}</Button>}</div>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3 p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-black text-slate-900">Ringkasan</h3>
          <div className="grid grid-cols-2 gap-3">
            {[["Kontak", lead.contact], ["Target Volume", `${lead.targetVolume.toLocaleString("id-ID")} pcs`], ["Estimasi Nilai", lead.value ? formatIdr(lead.value) : "-"], ["Stage", labels[lead.stage]]].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</div><div className="mt-1 font-bold text-slate-800">{v}</div></div>
            ))}
          </div>
          {lead.stage === "done" && <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700"><Lock size={16} /> Private SKU telah diterbitkan untuk {lead.clientName}.</div>}
        </Card>
        <Card className="p-6">
          <h3 className="font-display text-lg font-black text-slate-900">Progress</h3>
          <ol className="mt-4 space-y-2">
            {stages.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">{i <= idx ? <CheckCircle2 size={18} className="text-brand-500" /> : <Circle size={18} className="text-slate-200" />}<span className={i === idx ? "font-black text-brand-700" : i < idx ? "font-bold text-slate-700" : "font-medium text-slate-300"}>{labels[s]}</span></li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
