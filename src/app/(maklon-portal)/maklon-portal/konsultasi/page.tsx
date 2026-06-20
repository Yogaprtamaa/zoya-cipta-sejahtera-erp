"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FlaskConical } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button } from "@/components/ui";

const productTypes = [
  "Minuman Kesehatan / Herbal",
  "Suplemen & Vitamin",
  "Skincare & Kosmetik",
  "Perawatan Rambut",
  "Produk Bayi",
  "Lainnya",
];

const DEMO_CLIENT_ID = "mkl-client-002";
const DEMO_CLIENT_NAME = "CV Natura Herbal";

export default function MaklonKonsultasiPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    productType: "",
    targetVolume: "",
    contact: "",
    notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post("/maklon/lead", {
      clientName: DEMO_CLIENT_NAME,
      productType: form.productType,
      targetVolume: Number(form.targetVolume) || 0,
      contact: form.contact,
      notes: form.notes,
      clientId: DEMO_CLIENT_ID,
    });
    setLoading(false);
    if (res.data) setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-6">
        <Link href="/maklon-portal" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <Card className="p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="mt-5 font-display text-2xl font-black text-slate-900">Konsultasi Terkirim!</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-relaxed text-slate-500">
            Pengajuan konsultasi Anda telah masuk dan berstatus <strong>Menunggu Persetujuan</strong>. Tim Zoya akan meninjau dan menghubungi Anda dalam 1×24 jam kerja.
          </p>
          <Link href="/maklon-portal" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">
            Pantau Status
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/maklon-portal" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </Link>
      <PageHeader
        title="Ajukan Konsultasi Maklon"
        subtitle="Isi detail kebutuhan produk Anda. Tim kami akan menghubungi Anda setelah konsultasi disetujui."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={submit} className="space-y-5">
            <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 text-sm font-medium text-violet-700">
              <span className="font-bold">Klien: </span>{DEMO_CLIENT_NAME} · Konsultasi ini akan direview oleh Super Admin Zoya sebelum pipeline dapat dimulai.
            </div>

            <div>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jenis Produk <span className="text-rose-500">*</span></span>
                <select
                  required
                  value={form.productType}
                  onChange={(e) => setForm({ ...form, productType: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                >
                  <option value="">Pilih jenis produk...</option>
                  {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Volume (pcs/batch) <span className="text-rose-500">*</span></span>
                <input
                  type="number"
                  required
                  placeholder="contoh: 5000"
                  value={form.targetVolume}
                  onChange={(e) => setForm({ ...form, targetVolume: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kontak PIC <span className="text-rose-500">*</span></span>
                <input
                  type="text"
                  required
                  placeholder="+62 812-xxxx atau email"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Catatan / Kebutuhan Detail</span>
              <textarea
                rows={4}
                placeholder="Jelaskan kebutuhan formulasi, preferensi bahan baku, target pasar, dll."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </label>

            <Button type="submit" loading={loading} className="w-full">
              Kirim Pengajuan Konsultasi
            </Button>
          </form>
        </Card>

        {/* Info sidebar */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FlaskConical size={20} />
            </span>
            <h3 className="font-display text-base font-black text-slate-900">Alur Setelah Submit</h3>
          </div>
          <ol className="space-y-3 text-sm">
            {[
              "Pengajuan masuk ke Super Admin",
              "Admin tinjau & setujui dalam 1×24 jam",
              "Pipeline berlanjut: Quote → Deal & DP → Formulasi → Produksi → QC → Selesai",
              "Pantau semua status di halaman ini"
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-black text-violet-700">{i + 1}</span>
                <span className="font-medium text-slate-500 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
