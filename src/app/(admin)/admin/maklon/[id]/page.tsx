"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Lock, AlertTriangle, XCircle } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge } from "@/components/ui";

type Lead = { id: string; clientName: string; productType: string; targetVolume: number; stage: string; consultationStatus: string; contact: string; value?: number; notes?: string };

const stages = ["consultation", "quote", "deal_dp", "formulation", "production", "qc", "done"];
const labels: Record<string, string> = {
  consultation: "Konsultasi",
  quote: "Quotation",
  deal_dp: "Deal & DP",
  formulation: "Formulasi",
  production: "Produksi",
  qc: "QC",
  done: "Selesai"
};

export default function AdminMaklonDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const load = useCallback(() => api.get<{ leads: Lead[] }>("/maklon/lead").then((r) => { if (r.data) setLead(r.data.leads.find((l) => l.id === id) ?? null); }), [id]);
  useEffect(() => { load(); }, [load]);

  if (!lead) return <Card className="p-10 text-center text-sm font-semibold text-slate-400">Memuat…</Card>;

  const idx = stages.indexOf(lead.stage);
  const next = stages[Math.min(idx + 1, stages.length - 1)];
  const isConsultationPending = lead.stage === "consultation" && lead.consultationStatus === "pending";
  const isConsultationRejected = lead.stage === "consultation" && lead.consultationStatus === "rejected";
  const canAdvance = lead.stage !== "done" && !isConsultationPending;

  const advance = async () => {
    await api.patch(`/maklon/${lead.id}/stage`, { stage: next });
    load();
  };

  const approveConsultation = async () => {
    await api.patch(`/maklon/${lead.id}/konsultasi`, { action: "approve" });
    load();
  };

  const rejectConsultation = async () => {
    await api.patch(`/maklon/${lead.id}/konsultasi`, { action: "reject" });
    load();
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/maklon" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Kembali</Link>
      <PageHeader
        title={lead.clientName}
        subtitle={`${lead.id} · ${lead.productType}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.stage} />
            {canAdvance && (
              <Button size="sm" onClick={advance}>Naik ke {labels[next]}</Button>
            )}
          </div>
        }
      />

      {/* Consultation Gate */}
      {isConsultationPending && (
        <Card className="border-amber-200 bg-amber-50/30 p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle size={20} />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-base font-black text-slate-900">Konsultasi Menunggu Persetujuan</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Pipeline tidak dapat lanjut ke tahap Quote sebelum konsultasi ini disetujui. Tinjau detail pengajuan klien, lalu ambil keputusan.
              </p>
              {lead.notes && (
                <div className="mt-3 rounded-xl bg-white border border-amber-100 p-3 text-sm font-medium text-slate-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catatan klien: </span>
                  {lead.notes}
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <Button variant="secondary" onClick={rejectConsultation}><XCircle size={16} /> Tolak Konsultasi</Button>
                <Button onClick={approveConsultation}><CheckCircle2 size={16} /> Setujui Konsultasi</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {isConsultationRejected && (
        <Card className="border-rose-200 bg-rose-50/30 p-4">
          <p className="text-sm font-bold text-rose-700">Konsultasi ini telah ditolak. Pipeline tidak akan dilanjutkan.</p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3 p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-black text-slate-900">Ringkasan</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Kontak", lead.contact],
              ["Target Volume", `${lead.targetVolume.toLocaleString("id-ID")} pcs`],
              ["Estimasi Nilai", lead.value ? formatIdr(lead.value) : "-"],
              ["Stage", labels[lead.stage]],
              ["Status Konsultasi", lead.consultationStatus]
            ].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-slate-50 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</div>
                <div className="mt-1 font-bold text-slate-800">{v}</div>
              </div>
            ))}
          </div>
          {lead.stage === "done" && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
              <Lock size={16} /> Private SKU telah diterbitkan untuk {lead.clientName}.
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-display text-lg font-black text-slate-900">Progress</h3>
          <ol className="mt-4 space-y-2">
            {stages.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                {i < idx ? <CheckCircle2 size={18} className="text-brand-500" /> : i === idx ? <CheckCircle2 size={18} className="text-brand-500" /> : <Circle size={18} className="text-slate-200" />}
                <span className={i === idx ? "font-black text-brand-700" : i < idx ? "font-bold text-slate-700" : "font-medium text-slate-300"}>{labels[s]}</span>
                {s === "consultation" && lead.consultationStatus === "pending" && i === idx && (
                  <span className="ml-auto text-[9px] font-bold text-amber-600 bg-amber-100 rounded-full px-1.5 py-0.5">Pending</span>
                )}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
