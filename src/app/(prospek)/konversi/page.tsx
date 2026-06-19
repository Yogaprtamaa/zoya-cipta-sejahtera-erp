import Link from "next/link";
import {
  ArrowRight, FlaskConical, ShieldCheck, MapPinned, TrendingUp, Gift,
  CheckCircle2, Clock, Boxes, ChevronRight, Users, Star, Zap,
  BarChart3, BadgeDollarSign, Award, Sparkles, DollarSign, Target,
  Calendar, Smartphone, Trophy,
} from "lucide-react";

const benefits = [
  { icon: Boxes, title: "Stok Konsinyasi", desc: "Ambil stok tanpa modal di muka — bayar hanya setelah terjual.", color: "bg-brand-50 text-brand-600 border-brand-200/50" },
  { icon: MapPinned, title: "Wilayah Eksklusif", desc: "Satu kabupaten satu agen. Tidak ada perang harga dengan sesama mitra.", color: "bg-sky-50 text-sky-600 border-sky-200/50" },
  { icon: TrendingUp, title: "Harga Tier Mitra", desc: "Margin lebih besar dibanding harga umum dengan harga khusus level agen.", color: "bg-emerald-50 text-emerald-600 border-emerald-200/50" },
  { icon: Gift, title: "Reward Tahunan", desc: "Program insentif berbasis volume setiap bulan untuk agen berprestasi.", color: "bg-amber-50 text-amber-600 border-amber-200/50" },
];

const onboardingSteps = [
  { num: 1, label: "Daftar Akun", done: true },
  { num: 2, label: "Ajukan Wilayah", done: false, active: true },
  { num: 3, label: "Verifikasi Admin", done: false },
  { num: 4, label: "Aktif sebagai Agen", done: false },
];

const comparisons = [
  { feature: "Stok Awal", public: "Beli sendiri", agen: "Konsinyasi gratis" },
  { feature: "Harga Beli", public: "Harga normal", agen: "Harga tier khusus" },
  { feature: "Wilayah", public: "Bebas (bersaing)", agen: "Eksklusif per kabupaten" },
  { feature: "Laporan Penjualan", public: "Manual", agen: "Via portal real-time" },
  { feature: "Reward", public: "Tidak ada", agen: "Program insentif bulanan" },
];

const incomeExamples = [
  {
    level: "Reseller",
    monthlyVol: "500 pcs",
    margin: "Rp 10.000/pcs",
    income: "Rp 5.000.000+",
    color: "from-emerald-50 to-teal-50/60",
    border: "border-emerald-200/50",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "⬆️",
    desc: "Mulai dari pengecer lokal. Modal rendah, risiko minimal.",
  },
  {
    level: "Sub-agen",
    monthlyVol: "1.500 pcs",
    margin: "Rp 12.000/pcs",
    income: "Rp 18.000.000+",
    color: "from-brand-50 to-indigo-50/60",
    border: "border-brand-200/50",
    badge: "bg-brand-100 text-brand-700",
    icon: "🚀",
    desc: "Kelola beberapa reseller di bawah Anda. Komisi berlapis.",
    highlight: true,
  },
  {
    level: "Agen Utama",
    monthlyVol: "3.000+ pcs",
    margin: "Rp 15.000/pcs",
    income: "Rp 45.000.000+",
    color: "from-violet-50 to-purple-50/60",
    border: "border-violet-200/50",
    badge: "bg-violet-100 text-violet-700",
    icon: "👑",
    desc: "Puncak jaringan distribusi. Reward eksklusif tiap kuartal.",
  },
];

const agenLifecycle = [
  { icon: Calendar, label: "Hari 1", title: "Onboarding", desc: "Akun aktif, wilayah dikunci, stok perdana dikirim.", color: "bg-brand-100 text-brand-700" },
  { icon: Smartphone, label: "Minggu 1-2", title: "Mulai Jualan", desc: "Posting produk, jaringan pertama, order masuk via portal.", color: "bg-sky-100 text-sky-700" },
  { icon: BarChart3, label: "Bulan 1", title: "Laporan & Setor", desc: "Rekap penjualan, setoran bulanan, pantau saldo konsinyasi.", color: "bg-emerald-100 text-emerald-700" },
  { icon: Trophy, label: "Bulan 3+", title: "Program Reward", desc: "Target tercapai, bonus bulanan, kesempatan naik level.", color: "bg-amber-100 text-amber-700" },
];

const agentTestimonials = [
  {
    name: "Rini Wahyuningsih",
    region: "Sub-agen · Kab. Cianjur",
    quote: "Mulai dari Rp 0 modal stok — sekarang udah bisa capai 1.500 pcs per bulan. Dashboard-nya membantu banget buat pantau penjualan harian.",
    income: "Rp 18 jt/bln",
    color: "from-brand-400 to-indigo-500",
    initial: "RW",
    months: "8 bulan bergabung",
    stars: 5,
  },
  {
    name: "Agus Firmansyah",
    region: "Agen Utama · Kab. Garut",
    quote: "Wilayah eksklusif bikin saya tenang — tidak ada agen Zoya lain di Garut. Fokus jualan, tidak rebutan sama kompetitor internal.",
    income: "Rp 42 jt/bln",
    color: "from-emerald-400 to-teal-500",
    initial: "AF",
    months: "14 bulan bergabung",
    stars: 5,
  },
];

const productShowcase = [
  { name: "Madu Pahit", tag: "Herbal", margin: "Rp 10-15rb/botol", demand: "Tinggi", demandC: "text-emerald-600", demandBg: "bg-emerald-50" },
  { name: "Sari Kurma Plus", tag: "Suplemen", margin: "Rp 12-18rb/botol", demand: "Tinggi", demandC: "text-emerald-600", demandBg: "bg-emerald-50" },
  { name: "Produk Maklon", tag: "Private Label", margin: "Custom", demand: "Eksklusif", demandC: "text-violet-600", demandBg: "bg-violet-50" },
];

export default function KonversiPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">

      {/* ─── Welcome hero ─────────────────────────────────────────── */}
      <div className="animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-700 p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-indigo-300/10 blur-2xl" />
            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="relative grid items-center gap-8 sm:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/80 ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Status: Prospek — Satu langkah lagi
              </span>
              <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">
                Selamat datang!<br />Lengkapi pengajuan agen Anda
              </h1>
              <p className="mt-3 text-sm font-medium text-white/75 leading-relaxed">
                Akun Anda sudah terdaftar. Sekarang ajukan wilayah eksklusif dan level kemitraan untuk membuka akses penuh ke dashboard agen, stok konsinyasi, dan program reward.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ajukan-agen" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:scale-[1.02] hover:shadow-md">
                  Ajukan Jadi Agen <ArrowRight size={16} />
                </Link>
                <Link href="/request-maklon" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/20 transition-all hover:bg-white/20">
                  <FlaskConical size={16} /> Request Maklon
                </Link>
              </div>
            </div>

            {/* Onboarding progress */}
            <div className="hidden sm:block">
              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-4">Progress Onboarding</div>
                <div className="space-y-3">
                  {onboardingSteps.map((step) => (
                    <div key={step.num} className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all
                        ${step.done ? "bg-emerald-400 text-white" : step.active ? "bg-white text-brand-700 shadow-lg" : "bg-white/10 text-white/40"}`}>
                        {step.done ? <CheckCircle2 size={14} /> : step.num}
                      </div>
                      <span className={`text-sm font-semibold ${step.done ? "text-emerald-300 line-through" : step.active ? "text-white font-bold" : "text-white/40"}`}>
                        {step.label}
                      </span>
                      {step.active && <span className="ml-auto rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold text-amber-300">Sekarang</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Action cards ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Link href="/ajukan-agen" className="group relative overflow-hidden rounded-3xl border border-brand-200/60 bg-gradient-to-br from-brand-50 to-indigo-50/40 p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft-lg">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-brand transition-transform group-hover:scale-110">
              <Users size={22} />
            </div>
            <ChevronRight size={18} className="text-brand-400 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 font-display text-xl font-black text-slate-900">Ajukan Jadi Agen</h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500">
            Pilih wilayah, tentukan level kemitraan, dan mulai distribusi produk Zoya tanpa modal stok.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Konsinyasi", "Wilayah eksklusif", "Reward"].map((t) => (
              <span key={t} className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-bold text-brand-700">{t}</span>
            ))}
          </div>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
            Mulai pengajuan <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link href="/request-maklon" className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-violet-50/30 p-6 transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-soft-lg">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white transition-transform group-hover:scale-110">
              <FlaskConical size={22} />
            </div>
            <ChevronRight size={18} className="text-slate-300 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 font-display text-xl font-black text-slate-900">Request Maklon</h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500">
            Punya formula sendiri? Kami produksi dengan kapasitas minimal terjangkau dan penerbitan SKU privat.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Formulasi kustom", "SKU privat", "QC ketat"].map((t) => (
              <span key={t} className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">{t}</span>
            ))}
          </div>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-600">
            Submit request <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* ─── Potensi Penghasilan Agen ──────────────────────────────── */}
      <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Potensi Penghasilan</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-slate-900">Berapa bisa Anda hasilkan?</h2>
            <p className="mt-1.5 text-sm font-medium text-slate-500">Ilustrasi pendapatan bulanan berdasarkan level dan volume penjualan rata-rata mitra aktif kami.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {incomeExamples.map((ex, i) => (
            <div
              key={ex.level}
              className={`relative overflow-hidden rounded-3xl border ${ex.border} bg-gradient-to-br ${ex.color} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg animate-slide-up ${ex.highlight ? "ring-2 ring-brand-400/30" : ""}`}
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              {ex.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-black text-white">
                  Populer
                </div>
              )}
              <div className="text-2xl">{ex.icon}</div>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${ex.badge}`}>{ex.level}</span>
              <div className="mt-3 font-display text-2xl font-black text-slate-900">{ex.income}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">estimasi per bulan</div>
              <div className="mt-3 space-y-1.5 text-xs font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Volume bulanan</span>
                  <span className="font-bold text-slate-700">{ex.monthlyVol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margin per pcs</span>
                  <span className="font-bold text-slate-700">{ex.margin}</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] font-medium leading-relaxed text-slate-400">{ex.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
          * Estimasi ilustratif. Hasil aktual tergantung wilayah, jaringan, dan aktivitas penjualan.
        </p>
      </div>

      {/* ─── Alur Harian Agen ──────────────────────────────────────── */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900">Apa yang dilakukan agen Zoya?</h2>
          <p className="mt-1.5 text-sm font-medium text-slate-500">Dari hari pertama bergabung hingga aktif berjalan sebagai mitra distribusi.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {agenLifecycle.map((step, i) => (
            <div
              key={step.label}
              className="relative rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
              style={{ animationDelay: `${0.08 * i}s` }}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${step.color}`}>
                <step.icon size={17} />
              </div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{step.label}</div>
              <h3 className="mt-1 font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Testimonial agen ──────────────────────────────────────── */}
      <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900">Cerita sukses mitra kami</h2>
          <p className="mt-1.5 text-sm font-medium text-slate-500">Bergabung dari nol, kini mereka menjadi salah satu mitra distribusi terbaik.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {agentTestimonials.map((t, i) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="absolute right-5 top-4 font-display text-7xl font-black leading-none text-slate-100 select-none">&ldquo;</div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="relative flex-1 text-sm font-medium leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-black text-white`}>{t.initial}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs font-medium text-slate-400">{t.region} · {t.months}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-base font-black text-emerald-600">{t.income}</div>
                  <div className="text-[10px] font-semibold text-slate-400">per bulan</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Produk yang bisa dijual ───────────────────────────────── */}
      <div className="animate-fade-in overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Katalog Mitra</div>
            <h3 className="mt-0.5 font-display text-base font-black text-slate-900">Produk yang bisa Anda distribusikan</h3>
          </div>
          <Link href="/produk" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
            Lihat semua <ChevronRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {productShowcase.map((p) => (
            <div key={p.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-400">
                <FlaskConical size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900">{p.name}</div>
                <div className="text-xs font-medium text-slate-400">{p.tag}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">{p.margin}</div>
                <div className="text-[10px] font-semibold text-slate-400">per pcs</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${p.demandBg} ${p.demandC}`}>{p.demand}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Benefits grid ─────────────────────────────────────────── */}
      <div className="animate-fade-in" style={{ animationDelay: "0.35s" }}>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900">Keuntungan menjadi mitra</h2>
          <p className="mt-1.5 text-sm font-medium text-slate-500">Yang Anda dapatkan setelah menjadi agen aktif Zoya.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`rounded-2xl border ${b.color} bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg`}
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${b.color}`}>
                <b.icon size={20} />
              </span>
              <h3 className="mt-3.5 font-bold text-slate-900">{b.title}</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Comparison table ──────────────────────────────────────── */}
      <div className="animate-fade-in overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft" style={{ animationDelay: "0.4s" }}>
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h3 className="font-display text-base font-black text-slate-900">Mitra Agen vs Pembeli Umum</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 w-1/3">Fitur</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">Pembeli Umum</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50/40">Mitra Agen ✦</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {comparisons.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-semibold text-slate-700">{row.feature}</td>
                  <td className="px-4 py-3.5 text-center text-slate-400">{row.public}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-brand-700 bg-brand-50/20">{row.agen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Info card ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-soft animate-fade-in" style={{ animationDelay: "0.45s" }}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
          <Clock size={20} />
        </div>
        <div>
          <div className="font-bold text-slate-900">Butuh waktu kurang dari 24 jam</div>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Setelah mengirim pengajuan, tim admin akan memverifikasi data Anda dalam 24 jam. Notifikasi persetujuan akan dikirim via WhatsApp & email.
          </p>
        </div>
      </div>

      {/* ─── Final CTA ─────────────────────────────────────────────── */}
      <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 p-8 text-white text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Zap size={24} />
            </div>
            <h2 className="mt-5 font-display text-2xl font-black sm:text-3xl">Siap mulai perjalanan Anda?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium text-white/75 leading-relaxed">
              Ratusan mitra sudah bergabung dan membangun penghasilan dari distribusi produk herbal Zoya. Giliran Anda.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/ajukan-agen" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-700 transition-all hover:scale-[1.02] hover:shadow-lg">
                Ajukan Kemitraan Sekarang <ArrowRight size={16} />
              </Link>
              <Link href="/request-maklon" className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10">
                <FlaskConical size={16} /> Request Maklon
              </Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
