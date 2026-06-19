"use client";

import { useState } from "react";
import { CheckCircle2, FlaskConical, Shield, Clock, Package, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui";

const benefits = [
  { icon: FlaskConical, title: "Formulasi Kustom", desc: "Tim R&D kami mengembangkan formula sesuai kebutuhan spesifik Anda — dari herbal hingga kosmetik.", color: "bg-violet-100 text-violet-700" },
  { icon: Shield, title: "QC Ketat & Bersertifikat", desc: "Setiap batch melewati uji kualitas ketat. Produk kami memiliki izin edar resmi.", color: "bg-emerald-100 text-emerald-700" },
  { icon: Package, title: "SKU Privat End-to-End", desc: "Dari formula, packaging, labeling, hingga penerbitan kode produk eksklusif milik Anda.", color: "bg-sky-100 text-sky-700" },
  { icon: Clock, title: "Timeline Transparan", desc: "Setiap tahap — lead, formulasi, QC, produksi — bisa dipantau real-time di portal maklon.", color: "bg-amber-100 text-amber-700" },
];

const stages = [
  { label: "Lead", desc: "Diskusi awal & estimasi" },
  { label: "Penawaran", desc: "Proposal & kontrak" },
  { label: "Formulasi", desc: "R&D & sampel" },
  { label: "Produksi", desc: "Manufaktur batch" },
  { label: "QC", desc: "Uji kualitas" },
  { label: "Selesai", desc: "Pengiriman & SKU" },
];

export default function RequestMaklonPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ clientName: "", productType: "", targetVolume: "", contact: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post("/maklon/lead", { ...form, targetVolume: Number(form.targetVolume) || 0 });
    setLoading(false);
    if (res.data) setSent(true);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start">

        {/* ─── Left: Info ───────────────────────────────────────────── */}
        <div className="space-y-7 lg:col-span-2 animate-slide-up">
          {/* Header */}
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-brand-600 text-white shadow-brand">
              <FlaskConical size={26} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-slate-900">Request Maklon</h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
              Wujudkan produk herbal atau kosmetik Anda sendiri — formulasi kustom, SKU privat, kapasitas fleksibel.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg animate-fade-in"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${b.color}`}>
                  <b.icon size={17} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{b.title}</div>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline preview */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={15} className="text-brand-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline Maklon</span>
            </div>
            <div className="space-y-2">
              {stages.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[9px] font-black text-brand-700">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{s.label}</span>
                      <span className="text-[10px] font-medium text-slate-400">— {s.desc}</span>
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="ml-auto">
                      <ChevronRight size={12} className="text-slate-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-medium text-slate-400">
            Sudah ada agen Zoya?{" "}
            <a href="/ajukan-agen" className="font-bold text-brand-600 hover:text-brand-700">
              Ajukan kemitraan agen →
            </a>
          </p>
        </div>

        {/* ─── Right: Form ───────────────────────────────────────────── */}
        <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          {sent ? (
            <div className="flex flex-col items-center gap-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-10 text-center shadow-soft animate-slide-up">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900">Lead Terkirim!</h2>
              <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-500">
                Permintaan maklon Anda telah masuk ke pipeline kami. Tim R&D akan menghubungi Anda dalam 1 × 24 jam untuk diskusi lebih lanjut.
              </p>
              <div className="w-full space-y-2.5 text-left">
                {["Tim meninjau spesifikasi produk Anda", "Diskusi estimasi biaya & timeline", "Proposal formulasi dikirim via email"].map((s) => (
                  <div key={s} className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 size={15} className="text-emerald-500" /> {s}
                  </div>
                ))}
              </div>
              <a href="/konversi" className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-2.5 text-sm font-bold text-brand-700 hover:bg-brand-50 transition-colors">
                Kembali ke Dashboard <ArrowRight size={14} />
              </a>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200/70 bg-white shadow-soft overflow-hidden">
              <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/60 to-transparent px-6 py-4">
                <h2 className="font-display text-lg font-black text-slate-900">Detail Permintaan Maklon</h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400">Semua field wajib diisi agar tim kami bisa menyiapkan estimasi yang akurat.</p>
              </div>

              <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
                {/* Form fields */}
                {[
                  { label: "Nama Perusahaan / Usaha", key: "clientName", type: "text", placeholder: "cth. PT Sehat Natura" },
                  { label: "Jenis Produk", key: "productType", type: "text", placeholder: "cth. Minuman Herbal Sachet, Serum Wajah..." },
                  { label: "Target Volume (pcs/batch)", key: "targetVolume", type: "number", placeholder: "cth. 5000" },
                  { label: "Kontak (WhatsApp / Email)", key: "contact", type: "text", placeholder: "+62 812-xxxx-xxxx atau email@domain.com" },
                ].map(({ label, key, type, placeholder }) => (
                  <label key={key} className="block space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {label} <span className="text-rose-500">*</span>
                    </span>
                    <input
                      required
                      type={type}
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none transition-colors"
                    />
                  </label>
                ))}

                <div className="rounded-2xl border border-violet-200/60 bg-violet-50/40 p-4 text-xs font-medium text-violet-700">
                  <strong>Kapasitas minimum:</strong> 2.000 pcs per batch. Tim kami akan membantu kalkulasi MOQ yang tepat sesuai jenis produk Anda.
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Kirim Permintaan Maklon <ArrowRight size={16} />
                </Button>

                <p className="text-center text-[11px] font-medium text-slate-400">
                  Data Anda digunakan hanya untuk keperluan kalkulasi penawaran. Tidak disebarkan ke pihak ketiga.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
