"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FlaskConical, CheckCircle2, Factory, ShieldCheck, ArrowRight,
  Phone, ChevronDown, ChevronUp, Sparkles, Package, Microscope, Truck,
  BadgeCheck, Users, Clock,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, Button } from "@/components/ui";

const stages = [
  {
    icon: Phone,
    label: "Lead",
    title: "Konsultasi Awal",
    desc: "Diskusi kebutuhan produk, target pasar, estimasi volume, dan ruang lingkup proyek maklon Anda.",
  },
  {
    icon: FlaskConical,
    label: "Quote",
    title: "Penawaran & Persetujuan",
    desc: "Tim kami menyiapkan penawaran harga detail. Setelah kedua pihak setuju, proyek resmi dimulai.",
  },
  {
    icon: Microscope,
    label: "Formulasi",
    title: "R&D & Formulasi",
    desc: "Tim R&D mengembangkan formula sesuai brief, termasuk uji stabilitas dan seleksi bahan baku.",
  },
  {
    icon: Factory,
    label: "Produksi",
    title: "Produksi Massal",
    desc: "Setelah formula disetujui, produksi batch dilakukan di fasilitas berstandar GMP.",
  },
  {
    icon: Microscope,
    label: "QC",
    title: "Quality Control",
    desc: "Setiap batch melewati QC ketat: uji kandungan, batas cemaran, dan kesesuaian standar BPOM.",
  },
  {
    icon: BadgeCheck,
    label: "Done",
    title: "Penerbitan SKU Privat",
    desc: "Produk jadi diterbitkan dengan SKU privat eksklusif brand Anda dan siap distribusi.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Fasilitas Berstandar GMP",
    desc: "Produksi dilakukan di fasilitas yang memenuhi standar Good Manufacturing Practice dengan sertifikasi BPOM.",
  },
  {
    icon: FlaskConical,
    title: "Tim R&D Berpengalaman",
    desc: "Lebih dari 50 formulasi herbal telah berhasil dikembangkan dengan tim farmasis dan ahli kosmetik.",
  },
  {
    icon: Package,
    title: "MOQ Fleksibel",
    desc: "Minimum order quantity dapat disesuaikan dengan skala bisnis Anda, mulai dari batch kecil hingga produksi massal.",
  },
  {
    icon: Sparkles,
    title: "Desain Kemasan Custom",
    desc: "Kami membantu merancang kemasan yang sesuai identitas brand Anda, mulai dari artwork hingga cetak siap kirim.",
  },
  {
    icon: Users,
    title: "Dukungan Legalitas",
    desc: "Pendampingan proses notifikasi BPOM, pengurusan izin edar, dan dokumen legalitas produk kosmetik/herbal.",
  },
  {
    icon: Clock,
    title: "Estimasi Waktu Jelas",
    desc: "Timeline produksi transparan dari formulasi hingga pengiriman — rata-rata 45-90 hari kerja per proyek.",
  },
];

const faqs = [
  {
    q: "Berapa minimum order quantity (MOQ) untuk jasa maklon?",
    a: "MOQ kami fleksibel tergantung jenis produk. Untuk produk herbal cair (minuman kesehatan) mulai 500 botol per batch. Untuk kosmetik dan skincare mulai 1.000 pcs. Hubungi kami untuk diskusi kebutuhan spesifik Anda.",
  },
  {
    q: "Apakah Zoya membantu pengurusan izin BPOM?",
    a: "Ya, kami menyediakan layanan pendampingan notifikasi BPOM untuk produk kosmetik dan izin edar BPOM untuk produk obat tradisional/herbal. Biaya pengurusan terpisah dari biaya produksi dan akan dijelaskan dalam penawaran.",
  },
  {
    q: "Berapa lama proses dari formulasi hingga produk jadi?",
    a: "Rata-rata 45–90 hari kerja tergantung kompleksitas formulasi dan volume. Formulasi baru memerlukan waktu R&D lebih lama dibanding repeat order menggunakan formula yang sudah ada. Timeline detail diberikan di awal proyek.",
  },
  {
    q: "Apakah saya bisa menggunakan brand/nama produk sendiri?",
    a: "Tentu. Itulah inti dari maklon — Anda adalah pemilik brand. Produk jadi akan diterbitkan dengan SKU privat eksklusif atas nama Anda dan dilindungi dalam sistem kami.",
  },
  {
    q: "Bagaimana pembayaran dilakukan?",
    a: "Skema umum: DP 30% di awal, pelunasan 70% sebelum pengiriman. Untuk proyek besar dengan volume tinggi, tersedia opsi pembayaran bertahap yang disesuaikan dengan milestones produksi.",
  },
];

const productTypes = [
  "Minuman Kesehatan / Herbal",
  "Suplemen & Vitamin",
  "Skincare & Kosmetik",
  "Perawatan Rambut",
  "Produk Bayi",
  "Lainnya",
];

export default function MaklonPublikPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ clientName: "", productType: "", targetVolume: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post("/maklon/lead", { ...form, targetVolume: Number(form.targetVolume) || 0 });
    setLoading(false);
    if (res.data) setSent(true);
  };

  return (
    <main>
      {/* Hero */}
      <section className="mesh-bg border-b border-slate-200/60 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mx-auto">
            <FlaskConical size={28} />
          </span>
          <h1 className="mt-5 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Jasa Maklon<br />
            <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
              Herbal & Kosmetik
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-slate-500">
            Wujudkan brand produk kesehatan & kecantikan Anda sendiri bersama Zoya Cipta. MOQ fleksibel, formulasi profesional, fasilitas GMP, dan pendampingan legalitas BPOM.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#konsultasi" className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-brand-700 sm:w-auto">
              Ajukan Konsultasi <ArrowRight size={18} />
            </a>
            <a href="#proses" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-slate-300 sm:w-auto">
              Lihat Proses
            </a>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-b border-slate-200/60 bg-white px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "50+", label: "Formulasi Dikembangkan" },
              { value: "GMP", label: "Standar Fasilitas" },
              { value: "45–90", label: "Hari per Proyek" },
              { value: "BPOM", label: "Pendampingan Izin" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-black text-brand-600">{s.value}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Stage Process */}
      <section id="proses" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
              Alur Produksi
            </span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900">
              7 Tahap dari Konsultasi ke Produk Jadi
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base font-medium text-slate-500">
              Setiap proyek maklon mengikuti alur terstruktur dengan update status real-time di dashboard Anda.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-100 sm:left-1/2 sm:-translate-x-0.5" />
            <div className="space-y-8">
              {stages.map((s, i) => (
                <div key={s.label} className={`relative flex gap-6 sm:gap-8 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className="absolute left-4 top-4 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-500 bg-white sm:left-1/2 sm:-translate-x-1.5" />
                  <div className="ml-12 sm:ml-0 sm:w-1/2">
                    <div className={`rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft ${i % 2 !== 0 ? "sm:mr-8" : "sm:ml-8"}`}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <s.icon size={16} />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">{s.label}</span>
                          <h3 className="font-display text-base font-bold text-slate-900">{s.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              Keunggulan Kami
            </span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight">
              Kenapa maklon bersama Zoya?
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">
                  <b.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{b.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
              FAQ
            </span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900">
              Pertanyaan Umum
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="shrink-0 text-brand-500" />
                  ) : (
                    <ChevronDown size={18} className="shrink-0 text-slate-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                    <p className="text-sm font-medium leading-relaxed text-slate-500">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="konsultasi" className="bg-brand-50/40 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
              Mulai Sekarang
            </span>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-slate-900">
              Ajukan Konsultasi Gratis
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-slate-500">
              Isi formulir di bawah dan tim maklon kami akan menghubungi Anda dalam 1x24 jam kerja.
            </p>
          </div>

          <Card className="mx-auto mt-8 p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display text-2xl font-black text-slate-900">Terima kasih!</h3>
                <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-500">
                  Lead Anda sudah masuk pipeline maklon kami. Tim akan menghubungi Anda via kontak yang sudah diisi dalam 1x24 jam kerja.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link href="/produk" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    Lihat Produk
                  </Link>
                  <Link href="/daftar" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                    Daftar Agen
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Nama Perusahaan / Brand"
                    placeholder="contoh: PT Herbal Nusantara"
                    value={form.clientName}
                    onChange={(v) => setForm({ ...form, clientName: v })}
                    required
                  />
                  <div className="block space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Jenis Produk <span className="text-rose-500">*</span>
                    </span>
                    <select
                      required
                      value={form.productType}
                      onChange={(e) => setForm({ ...form, productType: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                    >
                      <option value="">Pilih jenis produk...</option>
                      {productTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    label="Target Volume (pcs/batch)"
                    placeholder="contoh: 1000"
                    type="number"
                    value={form.targetVolume}
                    onChange={(v) => setForm({ ...form, targetVolume: v })}
                  />
                  <InputField
                    label="Kontak (WA / Email)"
                    placeholder="+62 812-xxxx atau email@domain.com"
                    value={form.contact}
                    onChange={(v) => setForm({ ...form, contact: v })}
                    required
                  />
                </div>
                <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-xs font-medium text-brand-700">
                  Konsultasi awal <strong>gratis</strong> — tidak ada kewajiban pembelian. Tim kami akan menyiapkan penawaran yang sesuai kebutuhan Anda.
                </div>
                <Button type="submit" loading={loading} className="w-full">
                  Kirim & Mulai Konsultasi
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </main>
  );
}

function InputField({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none"
      />
    </label>
  );
}
