"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, MapPinned, Users, Award, CheckCircle2, Building2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui";

type Region = { id: string; kabupaten: string; status: string };

const steps = [
  { label: "Data Usaha", icon: Building2 },
  { label: "Wilayah", icon: MapPinned },
  { label: "Level", icon: Users },
  { label: "Review", icon: CheckCircle2 },
];

const levels = [
  { v: "agen", label: "Agen Utama", d: "Wilayah eksklusif, margin tertinggi, membina reseller", color: "border-brand-500 bg-brand-50", badge: "bg-brand-100 text-brand-700" },
  { v: "reseller", label: "Reseller", d: "Di bawah agen, eceran dengan minimum volume lebih rendah", color: "border-emerald-400 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
];

export default function AjukanAgenPage() {
  const [step, setStep] = useState(0);
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState({ usaha: "", regionId: "", level: "agen" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<{ regions: Region[] }>("/wilayah").then((res) => {
      if (res.data) setRegions(res.data.regions);
    });
  }, []);

  const submit = async () => {
    setLoading(true);
    await api.post("/auth/ajukan-agen", { regionId: form.regionId || null, level: form.level });
    setLoading(false);
    setSubmitted(true);
  };

  const canNext = () => {
    if (step === 0) return form.usaha.trim().length > 0;
    if (step === 1) return form.regionId !== "";
    return true;
  };

  if (submitted) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-10 text-center shadow-soft animate-slide-up">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50">
            <Clock size={40} className="text-amber-500" />
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900">Pengajuan Terkirim!</h1>
          <p className="max-w-sm text-sm font-medium text-slate-500 leading-relaxed">
            Pengajuan agen Anda sedang ditinjau admin. Setelah disetujui, akun Anda otomatis menjadi Agen aktif.
          </p>
          <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Info Demo</div>
            <p className="text-xs font-medium text-amber-600">Ganti role ke <strong>Super Admin</strong> untuk approve, lalu ke <strong>Agen</strong> untuk melihat dashboard.</p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
              <CheckCircle2 size={16} className="text-emerald-500" /> Notifikasi dikirim via WhatsApp
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
              <CheckCircle2 size={16} className="text-emerald-500" /> Proses verifikasi &lt; 24 jam
            </div>
          </div>
        </div>
      </main>
    );
  }

  const last = steps.length - 1;
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">

      {/* Header */}
      <div className="animate-slide-up mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Users size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">Pengajuan Jadi Agen</h1>
            <p className="text-xs font-medium text-slate-400">Lengkapi 4 langkah berikut untuk memulai kemitraan</p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-start gap-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && <div className={`h-0.5 flex-1 transition-all duration-500 ${i <= step ? "bg-brand-500" : "bg-slate-200"}`} />}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300
                    ${done ? "bg-brand-600 text-white shadow-brand scale-95" : active ? "bg-brand-600 text-white shadow-brand ring-4 ring-brand-100" : "bg-slate-100 text-slate-400"}`}>
                    {done ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  {i < last && <div className={`h-0.5 flex-1 transition-all duration-500 ${i < step ? "bg-brand-500" : "bg-slate-200"}`} />}
                </div>
                <span className={`mt-2 text-[10px] font-bold text-center transition-colors ${active ? "text-brand-700" : done ? "text-slate-500" : "text-slate-300"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card content */}
      <div className="rounded-3xl border border-slate-200/70 bg-white shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="border-b border-slate-100 bg-gradient-to-r from-brand-50/60 to-transparent px-6 py-4">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Langkah {step + 1} dari {steps.length} — {steps[step].label}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Step 0: Data Usaha */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nama Usaha <span className="text-rose-500">*</span>
                </span>
                <input
                  value={form.usaha}
                  onChange={(e) => setForm({ ...form, usaha: e.target.value })}
                  placeholder="cth. Toko Herbal Sehat Jaya"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none transition-colors"
                />
                <p className="text-xs font-medium text-slate-400">Nama toko atau usaha yang akan menjadi identitas kemitraan Anda.</p>
              </label>
            </div>
          )}

          {/* Step 1: Wilayah */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm font-medium text-slate-500">Pilih satu kabupaten/kota sebagai wilayah distribusi eksklusif Anda.</p>
              <div className="grid gap-2 sm:grid-cols-2 max-h-72 overflow-y-auto">
                {regions.map((r) => {
                  const taken = r.status !== "available";
                  const selected = form.regionId === r.id;
                  return (
                    <button
                      key={r.id}
                      disabled={taken}
                      onClick={() => setForm({ ...form, regionId: r.id })}
                      className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all
                        ${selected ? "border-brand-500 bg-brand-50 shadow-brand/10 shadow-md" : taken ? "border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed" : "border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer"}`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        <MapPinned size={14} />
                      </div>
                      <div>
                        <span className={`text-sm font-bold ${selected ? "text-brand-700" : "text-slate-800"}`}>{r.kabupaten}</span>
                        <div className={`text-[10px] font-semibold ${taken ? "text-rose-400" : selected ? "text-brand-500" : "text-emerald-500"}`}>
                          {taken ? "Tidak tersedia" : "Tersedia"}
                        </div>
                      </div>
                      {selected && <Check size={16} className="ml-auto text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Level */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm font-medium text-slate-500">Pilih level kemitraan yang sesuai dengan kapasitas dan target Anda.</p>
              <div className="grid gap-3">
                {levels.map((l) => (
                  <button
                    key={l.v}
                    onClick={() => setForm({ ...form, level: l.v })}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all cursor-pointer
                      ${form.level === l.v ? l.color + " shadow-md" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${form.level === l.v ? "bg-white/60" : "bg-slate-100"}`}>
                      <Award size={18} className={form.level === l.v ? "text-brand-600" : "text-slate-400"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{l.label}</span>
                        {form.level === l.v && <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${l.badge}`}>Dipilih</span>}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-slate-500">{l.d}</div>
                    </div>
                    {form.level === l.v && <Check size={18} className="text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-slate-500">Periksa kembali data pengajuan Anda sebelum dikirim.</p>
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50 overflow-hidden">
                {[
                  { k: "Nama Usaha", v: form.usaha },
                  { k: "Wilayah", v: regions.find((r) => r.id === form.regionId)?.kabupaten ?? "Belum dipilih" },
                  { k: "Level", v: levels.find((l) => l.v === form.level)?.label ?? "" },
                ].map(({ k, v }, i) => (
                  <div key={k} className={`flex justify-between px-5 py-3.5 text-sm ${i > 0 ? "border-t border-slate-100" : ""}`}>
                    <span className="font-semibold text-slate-400">{k}</span>
                    <span className="font-bold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <Clock size={16} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-xs font-medium text-amber-700">Pengajuan akan ditinjau oleh admin dalam waktu kurang dari 24 jam. Notifikasi dikirim via WhatsApp & email.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft size={16} /> Kembali
            </Button>
            {step < last ? (
              <Button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                Lanjut <ChevronRight size={16} />
              </Button>
            ) : (
              <Button loading={loading} onClick={submit}>
                Kirim Pengajuan
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
