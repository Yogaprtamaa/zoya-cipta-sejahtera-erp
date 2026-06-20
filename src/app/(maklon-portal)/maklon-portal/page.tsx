"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical, FileText, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, PageHeader, StatusBadge } from "@/components/ui";

type Lead = { id: string; clientName: string; productType: string; targetVolume: number; stage: string; consultationStatus: string; value?: number; clientId?: string };

const stageLabel: Record<string, string> = {
  consultation: "Konsultasi",
  quote: "Quotation",
  deal_dp: "Deal & DP",
  formulation: "Formulasi",
  production: "Produksi",
  qc: "QC",
  done: "Selesai"
};

const DEMO_CLIENT_ID = "mkl-client-002";

export default function MaklonPortalDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ leads: Lead[] }>("/maklon/lead")
      .then((r) => {
        if (r.data) setLeads(r.data.leads.filter((l) => l.clientId === DEMO_CLIENT_ID));
        setLoading(false);
      });
  }, []);

  const myLead = leads[0];

  const consultationIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (status === "rejected") return <XCircle size={16} className="text-rose-500" />;
    return <Clock size={16} className="text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Klien Maklon"
        subtitle="Pantau status konsultasi dan pipeline proyek maklon Anda."
      />

      {/* Welcome card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white">
          <FlaskConical size={28} />
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">Portal Klien Maklon</div>
            <div className="font-display text-xl font-black">CV Natura Herbal</div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm font-medium text-slate-500">
            Selamat datang di portal klien maklon PT Zoya Cipta Sejahtera. Di sini Anda dapat mengajukan konsultasi, memantau progress pipeline, dan melihat status produk privat Anda.
          </p>
          {!myLead && !loading && (
            <div className="mt-4">
              <Link
                href="/maklon-portal/konsultasi"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
              >
                Ajukan Konsultasi Pertama <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Active pipeline */}
      {loading && (
        <Card className="p-10 text-center text-sm text-slate-400">Memuat data…</Card>
      )}

      {!loading && myLead && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="font-display text-base font-black text-slate-900">Proyek Aktif</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-bold text-slate-900">{myLead.clientName}</div>
                <div className="text-sm text-slate-500">{myLead.productType} · {myLead.targetVolume.toLocaleString("id-ID")} pcs</div>
              </div>
              <StatusBadge status={myLead.stage} />
            </div>

            {/* Consultation status */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
              {consultationIcon(myLead.consultationStatus)}
              <span className="text-sm font-semibold text-slate-700">
                Konsultasi:{" "}
                <span className={
                  myLead.consultationStatus === "approved" ? "text-emerald-600" :
                  myLead.consultationStatus === "rejected" ? "text-rose-600" :
                  "text-amber-600"
                }>
                  {myLead.consultationStatus === "approved" ? "Disetujui" :
                   myLead.consultationStatus === "rejected" ? "Ditolak" :
                   "Menunggu Persetujuan"}
                </span>
              </span>
            </div>

            {myLead.consultationStatus === "pending" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                Tim kami sedang meninjau pengajuan konsultasi Anda. Kami akan menghubungi Anda dalam 1×24 jam kerja setelah disetujui.
              </div>
            )}

            {myLead.consultationStatus === "approved" && (
              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Progress Pipeline</div>
                <div className="space-y-1.5">
                  {["consultation", "quote", "deal_dp", "formulation", "production", "qc", "done"].map((s, i) => {
                    const stages = ["consultation", "quote", "deal_dp", "formulation", "production", "qc", "done"];
                    const currentIdx = stages.indexOf(myLead.stage);
                    const isDone = i <= currentIdx;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 size={16} className="shrink-0 text-brand-500" />
                        ) : (
                          <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-200" />
                        )}
                        <span className={`text-sm ${i === currentIdx ? "font-black text-brand-700" : isDone ? "font-bold text-slate-700" : "font-medium text-slate-300"}`}>
                          {stageLabel[s]}
                        </span>
                        {i === currentIdx && (
                          <span className="ml-auto text-[10px] font-bold text-brand-600 bg-brand-50 rounded-full px-2 py-0.5">Tahap Saat Ini</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Link href="/maklon-portal/status" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700">
              Lihat detail pipeline <ArrowRight size={14} />
            </Link>
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/maklon-portal/konsultasi" className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-soft-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <FileText size={20} />
          </span>
          <div>
            <div className="font-bold text-slate-900">Ajukan Konsultasi</div>
            <div className="text-xs font-medium text-slate-400">Mulai proyek maklon baru</div>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-300" />
        </Link>
        <Link href="/maklon-portal/status" className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FlaskConical size={20} />
          </span>
          <div>
            <div className="font-bold text-slate-900">Status Pipeline</div>
            <div className="text-xs font-medium text-slate-400">Pantau progress produksi</div>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-300" />
        </Link>
      </div>
    </div>
  );
}
