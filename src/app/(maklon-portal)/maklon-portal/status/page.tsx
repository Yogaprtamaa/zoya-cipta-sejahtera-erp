"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, StatusBadge } from "@/components/ui";

type Lead = { id: string; clientName: string; productType: string; targetVolume: number; stage: string; consultationStatus: string; value?: number; clientId?: string };

const stages = ["consultation", "quote", "deal_dp", "formulation", "production", "qc", "done"];
const stageLabel: Record<string, string> = {
  consultation: "Konsultasi",
  quote: "Quotation",
  deal_dp: "Deal & DP",
  formulation: "Formulasi",
  production: "Produksi",
  qc: "QC",
  done: "Selesai"
};
const stageDesc: Record<string, string> = {
  consultation: "Pengajuan konsultasi diterima dan sedang ditinjau oleh tim Zoya.",
  quote: "Tim kami sedang menyiapkan penawaran MOQ, harga, dan estimasi waktu.",
  deal_dp: "Finalisasi kesepakatan dan pencatatan down payment.",
  formulation: "Tim R&D mengembangkan formula sesuai kebutuhan Anda.",
  production: "Produksi batch sedang berlangsung di fasilitas GMP.",
  qc: "Quality control — setiap batch diperiksa kualitas dan kesesuaian standar.",
  done: "Produk selesai! SKU privat telah diterbitkan atas nama brand Anda."
};

const DEMO_CLIENT_ID = "mkl-client-002";

export default function MaklonStatusPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ leads: Lead[] }>("/maklon/lead")
      .then((r) => {
        if (r.data) setLeads(r.data.leads.filter((l) => l.clientId === DEMO_CLIENT_ID));
        setLoading(false);
      });
  }, []);

  if (loading) return <Card className="p-10 text-center text-sm text-slate-400">Memuat…</Card>;

  if (!leads.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Status Pipeline" subtitle="Pantau perkembangan proyek maklon Anda." />
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-400">Belum ada proyek maklon. Ajukan konsultasi terlebih dahulu.</p>
          <Link href="/maklon-portal/konsultasi" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            Ajukan Konsultasi <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Status Pipeline" subtitle="Pantau perkembangan proyek maklon Anda secara real-time." />
      {leads.map((lead) => {
        const idx = stages.indexOf(lead.stage);
        return (
          <Card key={lead.id} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-display text-base font-black text-slate-900">{lead.clientName}</h3>
                <p className="text-xs font-medium text-slate-400">{lead.id} · {lead.productType} · {lead.targetVolume.toLocaleString("id-ID")} pcs</p>
              </div>
              <div className="flex items-center gap-3">
                {lead.value && <span className="text-sm font-bold text-slate-700">{formatIdr(lead.value)}</span>}
                <StatusBadge status={lead.stage} />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stages.map((s, i) => {
                  const isDone = i < idx;
                  const isCurrent = i === idx;
                  return (
                    <div key={s} className={`flex gap-4 ${isCurrent ? "opacity-100" : isDone ? "opacity-70" : "opacity-30"}`}>
                      <div className="flex flex-col items-center">
                        {isDone || isCurrent ? (
                          <CheckCircle2 size={20} className={isCurrent && lead.stage !== "done" ? "text-brand-500" : "text-emerald-500"} />
                        ) : (
                          <Circle size={20} className="text-slate-200" />
                        )}
                        {i < stages.length - 1 && <div className={`mt-1 h-8 w-0.5 ${isDone ? "bg-emerald-200" : "bg-slate-100"}`} />}
                      </div>
                      <div className="pb-2">
                        <div className={`text-sm font-bold ${isCurrent ? "text-brand-700" : isDone ? "text-slate-700" : "text-slate-300"}`}>
                          {stageLabel[s]}
                          {isCurrent && s !== "done" && <span className="ml-2 text-[10px] font-bold text-brand-600 bg-brand-50 rounded-full px-2 py-0.5">Sedang Berjalan</span>}
                        </div>
                        {isCurrent && (
                          <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{stageDesc[s]}</p>
                        )}
                        {s === "done" && lead.stage === "done" && (
                          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                            <Lock size={12} /> SKU privat telah diterbitkan untuk brand Anda.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
