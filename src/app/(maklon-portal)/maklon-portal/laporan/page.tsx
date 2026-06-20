"use client";

import { useEffect, useState } from "react";
import { FlaskConical, CheckCircle2, Clock, Package, TrendingUp, Calendar } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, PageHeader, Stat } from "@/components/ui";

type Lead = {
  id: string;
  productType: string;
  targetVolume: number;
  stage: string;
  consultationStatus: string;
  value?: number;
  clientId?: string;
  notes?: string;
};

const STAGES = ["consultation", "quote", "deal_dp", "formulation", "production", "qc", "done"] as const;

const stageLabel: Record<string, string> = {
  consultation: "Konsultasi",
  quote:        "Quotation",
  deal_dp:      "Deal & DP",
  formulation:  "Formulasi",
  production:   "Produksi",
  qc:           "QC",
  done:         "Selesai",
};

const stageBg: Record<string, string> = {
  consultation: "bg-violet-100 text-violet-700",
  quote:        "bg-blue-100 text-blue-700",
  deal_dp:      "bg-amber-100 text-amber-700",
  formulation:  "bg-orange-100 text-orange-700",
  production:   "bg-brand-100 text-brand-700",
  qc:           "bg-teal-100 text-teal-700",
  done:         "bg-emerald-100 text-emerald-700",
};

const DEMO_CLIENT_ID = "mkl-client-002";

function stageProgress(stage: string): number {
  const idx = STAGES.indexOf(stage as typeof STAGES[number]);
  return idx < 0 ? 0 : Math.round(((idx + 1) / STAGES.length) * 100);
}

export default function MaklonLaporanPage() {
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ leads: Lead[] }>("/maklon/lead").then((r) => {
      if (r.data) setLeads(r.data.leads.filter((l) => l.clientId === DEMO_CLIENT_ID));
      setLoading(false);
    });
  }, []);

  const done       = leads.filter((l) => l.stage === "done");
  const active     = leads.filter((l) => l.stage !== "done");
  const totalValue = leads.reduce((s, l) => s + (l.value ?? 0), 0);

  if (loading) return <Card className="p-10 text-center text-sm font-semibold text-slate-400">Memuat laporan…</Card>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring & Laporan"
        subtitle="Ringkasan seluruh proyek maklon CV Natura Herbal dengan PT Zoya Cipta Sejahtera."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat icon={<FlaskConical size={18} />} label="Total Proyek"    value={`${leads.length}`}    tone="info" />
        <Stat icon={<TrendingUp   size={18} />} label="Sedang Berjalan" value={`${active.length}`}   tone="warning" />
        <Stat icon={<CheckCircle2 size={18} />} label="Selesai"         value={`${done.length}`}     tone="success" />
        <Stat icon={<Package      size={18} />} label="Total Volume"    value={`${leads.reduce((s,l)=>s+l.targetVolume,0).toLocaleString("id-ID")} pcs`} />
      </div>

      {leads.length === 0 ? (
        <Card className="p-12 text-center">
          <FlaskConical size={32} className="mx-auto mb-3 text-slate-200" />
          <p className="text-sm font-semibold text-slate-400">Belum ada proyek maklon.</p>
          <p className="mt-1 text-xs font-medium text-slate-300">Ajukan konsultasi untuk memulai.</p>
        </Card>
      ) : (
        <>
          {/* Per-project cards */}
          <div className="space-y-4">
            {leads.map((l) => {
              const pct = stageProgress(l.stage);
              const approvedIdx = STAGES.indexOf(l.stage as typeof STAGES[number]);
              return (
                <Card key={l.id} className="overflow-hidden">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
                    <div>
                      <div className="font-display text-base font-black text-slate-900">{l.productType}</div>
                      <div className="mt-0.5 text-xs font-medium text-slate-400">
                        ID: {l.id} · Target: {l.targetVolume.toLocaleString("id-ID")} pcs
                        {l.value ? ` · Est. Rp ${(l.value / 1_000_000).toFixed(0)}jt` : ""}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${stageBg[l.stage] ?? "bg-slate-100 text-slate-600"}`}>
                      {stageLabel[l.stage] ?? l.stage}
                    </span>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Progress bar */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Progress Pipeline</span>
                        <span className="text-xs font-black text-brand-600">{pct}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Stage timeline */}
                    <div className="grid grid-cols-7 gap-1">
                      {STAGES.map((s, i) => {
                        const isActive  = s === l.stage;
                        const isPast    = i < approvedIdx;
                        return (
                          <div key={s} className="flex flex-col items-center gap-1 text-center">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black transition-colors ${
                              isActive ? "bg-brand-600 text-white ring-2 ring-brand-300 ring-offset-1" :
                              isPast   ? "bg-brand-100 text-brand-700" :
                                         "bg-slate-100 text-slate-300"
                            }`}>
                              {isPast ? <CheckCircle2 size={12} /> : i + 1}
                            </div>
                            <span className={`text-[9px] font-bold leading-tight ${isActive ? "text-brand-700" : isPast ? "text-slate-500" : "text-slate-300"}`}>
                              {stageLabel[s]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Consultation status chip */}
                    {l.stage === "consultation" && (
                      <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                        l.consultationStatus === "approved" ? "bg-emerald-50 text-emerald-700" :
                        l.consultationStatus === "rejected" ? "bg-rose-50 text-rose-700" :
                                                              "bg-amber-50 text-amber-700"
                      }`}>
                        {l.consultationStatus === "approved" ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                        Konsultasi:{" "}
                        {l.consultationStatus === "approved" ? "Disetujui — pipeline siap dilanjutkan" :
                         l.consultationStatus === "rejected" ? "Ditolak oleh tim Zoya" :
                                                              "Menunggu persetujuan admin Zoya (1×24 jam kerja)"}
                      </div>
                    )}

                    {/* Notes */}
                    {l.notes && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Catatan</span>
                        <p className="text-xs font-medium text-slate-600">{l.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary table for multiple projects */}
          {leads.length > 1 && (
            <Card className="overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="font-display text-base font-black text-slate-900">Ringkasan Semua Proyek</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-4 py-3">Produk</th>
                      <th className="px-4 py-3 text-right">Volume</th>
                      <th className="px-4 py-3">Tahap</th>
                      <th className="px-6 py-3 text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-mono text-xs font-bold text-slate-500">{l.id}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{l.productType}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-600">{l.targetVolume.toLocaleString("id-ID")} pcs</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stageBg[l.stage] ?? "bg-slate-100 text-slate-600"}`}>
                            {stageLabel[l.stage]}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-brand-500" style={{ width: `${stageProgress(l.stage)}%` }} />
                            </div>
                            <span className="text-xs font-black text-brand-600">{stageProgress(l.stage)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="flex items-center gap-2 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 text-xs font-medium text-slate-500">
            <Calendar size={14} className="shrink-0 text-brand-400" />
            Data laporan ini diperbarui secara real-time setiap kali tim Zoya menggerakkan pipeline proyek Anda.
            Untuk pertanyaan, hubungi tim Zoya melalui halaman Status Pipeline.
          </div>
        </>
      )}
    </div>
  );
}
