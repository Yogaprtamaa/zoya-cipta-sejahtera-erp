import Link from "next/link";
import {
  ClipboardList, ShieldCheck, MapPinned, Boxes, FlaskConical, ArrowRight,
  TrendingUp, Award, MessageSquare, BarChart3, CheckCircle2, Star,
  Users, Zap, ChevronRight, Package, Sparkles, Scale,
} from "lucide-react";

const stats = [
  { value: "10+", label: "Mitra Agen Aktif", sub: "Di seluruh Jawa Barat (data demo)" },
  { value: "5",   label: "Wilayah Kabupaten", sub: "Eksklusif per mitra (data demo)" },
  { value: "3",   label: "Lini Produk", sub: "Herbal & kosmetik" },
  { value: "5+",  label: "Tahun Pengalaman", sub: "Berdiri sejak 2019" },
];

const regions = [
  "Kab. Bandung", "Kota Cimahi", "Kab. Garut", "Kab. Tasikmalaya",
  "Kab. Sumedang", "Kota Bekasi", "Kab. Cianjur", "Kota Bogor",
  "Kab. Sukabumi", "Kab. Majalengka", "Kota Cirebon", "Kab. Subang",
  "Kab. Karawang", "Kab. Purwakarta", "Kab. Indramayu",
];

const steps = [
  { num: "01", title: "Daftar & Ajukan Wilayah", desc: "Buat akun dalam hitungan menit, isi data diri, dan pilih kabupaten target distribusi Anda." },
  { num: "02", title: "Verifikasi & Persetujuan", desc: "Tim admin memverifikasi kelengkapan dokumen dan menyetujui pengajuan wilayah eksklusif Anda." },
  { num: "03", title: "Terima Stok Konsinyasi", desc: "Produk dikirim sebagai stok titip — tagihan baru muncul setelah produk terjual, bukan saat dikirim." },
  { num: "04", title: "Jual & Setor Hasil", desc: "Laporkan penjualan via portal, setorkan omzet, dan pantau komisi & reward secara real-time." },
];

const testimonials = [
  { name: "Siti Rahayu", region: "Agen Kab. Surabaya", content: "Sistem konsinyasi Zoya sangat membantu cash flow saya. Tidak perlu keluar modal besar di awal, dan laporan penjualannya bisa dipantau kapan saja.", rating: 5, initial: "SR", color: "from-brand-400 to-indigo-500" },
  { name: "Budi Santoso", region: "Agen Kab. Bandung", content: "Proses order mudah dan approval cepat. Kalau ada kendala bisa chat langsung di platform. Wilayah eksklusif bikin saya tidak khawatir ada agen lain bersaing.", rating: 5, initial: "BS", color: "from-emerald-400 to-teal-500" },
  { name: "Dewi Kurniawan", region: "Agen Kab. Semarang", content: "Mulai dari nol, kini sudah mencapai target 2.000 botol per bulan dan masuk program reward. Platform ERP-nya lengkap dan mudah dipahami siapa saja.", rating: 5, initial: "DK", color: "from-violet-400 to-purple-500" },
];

const faqs = [
  { q: "Apakah saya perlu modal untuk mulai?", a: "Tidak. Sistem konsinyasi Zoya memungkinkan Anda menerima stok produk tanpa membayar di muka. Tagihan hanya muncul setelah produk terjual dan dilaporkan melalui portal." },
  { q: "Berapa lama proses verifikasi agen?", a: "Rata-rata kurang dari 24 jam. Tim admin kami akan memeriksa kelengkapan data dan mengirimkan notifikasi persetujuan via WhatsApp dan email." },
  { q: "Apa itu wilayah eksklusif?", a: "Setiap agen mendapatkan hak distribusi eksklusif untuk satu kabupaten/kota. Sistem kami otomatis mencegah dua agen aktif berada di wilayah yang sama, sehingga tidak ada perang harga antar mitra." },
  { q: "Bagaimana sistem harga untuk agen?", a: "Harga bervariasi berdasarkan level kemitraan (Agen, Reseller). Agen mendapat margin lebih besar dibanding reseller. Tersedia juga override harga manual untuk mitra khusus." },
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-[#fdfbf7]">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative border-b border-slate-200/50 px-6 pb-20 pt-24 lg:pb-28 lg:pt-32">
        {/* Warm gradient BG */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-brand-100/50 to-indigo-100/30 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-100/30 to-brand-50/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-amber-50/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Left: Copy */}
            <div className="animate-slide-up">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-soft backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Prototype Demo · Mock API aktif
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700">
                  <Sparkles size={11} /> Tanpa modal awal
                </span>
              </div>

              <h1 className="mt-7 font-display text-5xl font-black leading-[1.04] tracking-tight text-slate-900 sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
                Platform ERP untuk{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
                    Konsinyasi
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-brand-400 to-indigo-400 opacity-30" />
                </span>
                {" "}&{" "}
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Maklon</span>
                {" "}Herbal
              </h1>

              <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-slate-500 sm:text-lg">
                Kelola distribusi, laporan penjualan, setoran bulanan, wilayah eksklusif, dan pipeline maklon dalam satu platform terintegrasi untuk PT Zoya Cipta Sejahtera.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/daftar" className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white shadow-brand transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg">
                  Daftar Jadi Agen <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link href="/maklon" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-bold text-slate-700 shadow-soft backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft-lg">
                  Layanan Maklon <ChevronRight size={16} />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  "Tanpa modal stok di muka",
                  "Wilayah distribusi eksklusif",
                  "Dashboard real-time",
                  "Approval dalam 24 jam",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <CheckCircle2 size={13} className="text-emerald-500" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 -m-10 rounded-[3rem] bg-gradient-to-br from-brand-200/25 to-indigo-200/15 blur-3xl" />
              <div className="relative animate-float rounded-3xl border border-slate-200/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.10)] overflow-hidden">
                {/* Chrome bar */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="ml-4 h-5 w-40 rounded-full bg-slate-200/70" />
                  <div className="ml-auto flex gap-1">
                    <div className="h-5 w-5 rounded-md bg-slate-200/40" />
                    <div className="h-5 w-5 rounded-md bg-slate-200/40" />
                  </div>
                </div>
                <div className="bg-white p-5 space-y-4">
                  {/* Stat row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { l: "Stok Gudang", v: "1.620 pcs", c: "text-slate-900", bg: "bg-slate-50" },
                      { l: "Di Agen", v: "129 pcs", c: "text-brand-700", bg: "bg-brand-50/60" },
                      { l: "Tagihan Aktif", v: "Rp 5,2 jt", c: "text-emerald-700", bg: "bg-emerald-50/60" },
                    ].map(({ l, v, c, bg }) => (
                      <div key={l} className={`rounded-xl ${bg} p-3`}>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{l}</div>
                        <div className={`mt-1 text-sm font-black ${c}`}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mini chart */}
                  <div className="rounded-xl bg-slate-50/60 p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Omzet Bulanan</div>
                      <div className="text-[8px] font-bold text-brand-600">+24% vs bulan lalu</div>
                    </div>
                    <div className="flex h-14 items-end gap-1">
                      {[35, 55, 40, 70, 50, 80, 65, 88, 60, 95, 75, 100].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col justify-end h-full">
                          <div className={`w-full rounded-t-sm ${i === 11 ? "bg-brand-500" : i >= 9 ? "bg-brand-300" : "bg-brand-100"}`} style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-1.5 flex justify-between text-[7px] font-semibold text-slate-300">
                      <span>Jan</span><span>Jun</span>
                    </div>
                  </div>
                  {/* Mini agent rows */}
                  <div className="space-y-1">
                    {[
                      { n: "Nadia Putri", r: "Kab. Bandung · 87%", g: "from-brand-400 to-indigo-500", s: "active", pct: 87 },
                      { n: "Berkah Herbal", r: "Kab. Tasikmalaya · 64%", g: "from-emerald-400 to-teal-500", s: "active", pct: 64 },
                      { n: "Herbal Sumedang", r: "Kab. Sumedang · menunggu", g: "from-amber-400 to-orange-400", s: "pending", pct: 0 },
                    ].map(({ n, r, g, s, pct }) => (
                      <div key={n} className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-slate-50">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${g} text-[9px] font-black text-white shadow-sm`}>{n[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-slate-800 truncate">{n}</div>
                          <div className="text-[8px] text-slate-400">{r}</div>
                        </div>
                        {s === "active" ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-1 w-14 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full rounded-full bg-brand-400" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <div className="absolute -right-8 top-10 z-10 animate-slide-in-right rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-soft-lg" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50"><CheckCircle2 size={16} className="text-emerald-500" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Order Disetujui</div>
                    <div className="text-[10px] text-slate-400">50 botol · PO-0039</div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-8 bottom-16 z-10 animate-slide-in-right rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-soft-lg" style={{ animationDelay: "0.7s" }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50"><TrendingUp size={16} className="text-brand-500" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Target 87%</div>
                    <div className="text-[10px] text-slate-400">Kab. Bandung · Juni</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REGION MARQUEE ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-white/60 py-3.5 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#fdfbf7]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#fdfbf7]" />
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {[...regions, ...regions].map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <MapPinned size={11} className="text-brand-400" /> {r}
            </div>
          ))}
        </div>
      </div>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:divide-x sm:divide-slate-100">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center animate-slide-up stagger-${i + 1}`}>
                <div className="font-display text-4xl font-black text-brand-600">{s.value}</div>
                <div className="mt-1.5 text-sm font-bold text-slate-700">{s.label}</div>
                <div className="mt-0.5 text-xs font-medium text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE BENTO (Clay-style saturated cards) ───────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center animate-slide-up">
            <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">Fitur Unggulan</span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Kenapa memilih Zoya ERP?</h2>
            <p className="mx-auto mt-3 max-w-xl text-base font-medium leading-relaxed text-slate-500">Dirancang khusus untuk model bisnis konsinyasi herbal & kosmetik Indonesia.</p>
          </div>

          <div className="mt-14 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {/* Hero feature card — Brand teal/indigo, 2×2 */}
            <div className="card-glow relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-700 p-7 text-white transition-transform duration-300 hover:-translate-y-1 sm:p-8 lg:row-span-2 animate-slide-up">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" />
              </div>
              <div className="relative">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Boxes size={26} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-black leading-snug">Konsinyasi Terkontrol</h3>
                <p className="mt-2.5 text-base font-medium leading-relaxed text-white/75">Stok dititip ke agen — tagihan baru muncul setelah terjual, bukan saat dikirim. Cash flow agen tetap sehat.</p>
                <div className="mt-6 space-y-3">
                  {["Agen ambil stok tanpa DP", "Billing hanya dari penjualan", "Stok sisa tetap milik Zoya", "Laporan real-time via portal"].map((p) => (
                    <div key={p} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <CheckCircle2 size={13} className="text-brand-300" />
                      </div> {p}
                    </div>
                  ))}
                </div>
                {/* Mini mock UI */}
                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-white/50 mb-2">Tagihan Aktif</div>
                  <div className="space-y-1.5">
                    {[["Nadia Putri · 42 pcs", "Rp 3,9 jt"], ["Berkah Herbal · 14 pcs", "Rp 1,3 jt"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[10px]">
                        <span className="text-white/70">{k}</span>
                        <span className="font-bold text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 — Hot pink: Approval */}
            <div className="card-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 p-5 text-white transition-transform duration-300 hover:-translate-y-1 animate-slide-up stagger-2">
              <ShieldCheck size={22} className="opacity-80" />
              <h3 className="mt-3 font-display text-base font-bold">Approval Berlapis</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">Order besar otomatis masuk ke antrean persetujuan sesuai threshold konfigurasi.</p>
              <div className="mt-4 rounded-xl bg-white/10 p-3 text-[9px] font-bold text-white/60">
                <div className="flex justify-between"><span>Admin review</span><CheckCircle2 size={10} className="text-white/40" /></div>
                <div className="mt-1 flex justify-between"><span>Persetujuan order besar</span><div className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" /></div>
              </div>
            </div>

            {/* Card 3 — Teal: Wilayah */}
            <div className="card-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 p-5 text-white transition-transform duration-300 hover:-translate-y-1 animate-slide-up stagger-3">
              <MapPinned size={22} className="opacity-80" />
              <h3 className="mt-3 font-display text-base font-bold">Wilayah Eksklusif</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">Satu kabupaten satu agen — sistem mencegah persaingan antar mitra.</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Kab. Bandung", "Kota Cimahi", "Kab. Garut"].map((w) => (
                  <span key={w} className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold">{w}</span>
                ))}
              </div>
            </div>

            {/* Card 4 — Lavender: Harga */}
            <div className="card-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white transition-transform duration-300 hover:-translate-y-1 animate-slide-up stagger-4">
              <TrendingUp size={22} className="opacity-80" />
              <h3 className="mt-3 font-display text-base font-bold">Harga Bertingkat</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">Tier harga otomatis per level agen dengan override manual per mitra.</p>
              <div className="mt-4 space-y-1 text-[9px] font-bold">
                {["Agen Utama", "Reseller"].map((l) => (
                  <div key={l} className="flex justify-between text-white/80"><span>{l}</span><span className="text-white/40">Login untuk lihat harga</span></div>
                ))}
              </div>
            </div>

            {/* Card 5 — Ochre: Reward */}
            <div className="card-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white transition-transform duration-300 hover:-translate-y-1 animate-slide-up stagger-5">
              <Award size={22} className="opacity-80" />
              <h3 className="mt-3 font-display text-base font-bold">Reward Penjualan</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">Program insentif tahunan berbasis volume akumulasi penjualan untuk agen terbaik.</p>
              <div className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-center">
                <div className="text-xl font-black">2.000 pcs</div>
                <div className="text-[9px] font-bold text-white/60">target reward tahunan</div>
              </div>
            </div>

            {/* Card 6 — Sky: Maklon */}
            <div className="card-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-5 text-white transition-transform duration-300 hover:-translate-y-1 animate-slide-up stagger-6">
              <FlaskConical size={22} className="opacity-80" />
              <h3 className="mt-3 font-display text-base font-bold">Maklon End-to-End</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">Lead → formulasi → QC → penerbitan SKU privat dengan brand Anda.</p>
              <div className="mt-4 flex gap-1 flex-wrap">
                {["Lead", "Quote", "Formulasi", "Produksi", "QC", "Done"].map((s) => (
                  <span key={s} className="rounded-full bg-white/15 px-2 py-0.5 text-[8px] font-bold">{s}</span>
                ))}
              </div>
            </div>

            {/* Card 7 — Emerald: Laporan */}
            <div className="card-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white transition-transform duration-300 hover:-translate-y-1 animate-slide-up stagger-1">
              <BarChart3 size={22} className="opacity-80" />
              <h3 className="mt-3 font-display text-base font-bold">Laporan Real-time</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">Omzet per wilayah, tren penjualan, rekonsiliasi setoran langsung.</p>
            </div>

            {/* Card 8 — Slate: Chat */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg animate-slide-up stagger-2">
              <MessageSquare size={22} className="text-slate-500" />
              <h3 className="mt-3 font-display text-base font-bold text-slate-900">Chat Terintegrasi</h3>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">Komunikasi agen-admin dalam satu platform tanpa WhatsApp terpisah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-slate-900 px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">Alur Kemitraan</span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Dari daftar hingga jual —<br />4 langkah saja</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-400">Proses bergabung dirancang cepat, transparan, dan bisa dimulai dari mana saja.</p>
          </div>

          <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.num} className={`relative rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/8 hover:border-white/15 animate-slide-up stagger-${i + 1}`}>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-10 hidden lg:block z-10">
                    <ChevronRight size={16} className="text-white/20" />
                  </div>
                )}
                <span className="font-display text-4xl font-black text-brand-400/60">{s.num}</span>
                <h3 className="mt-4 font-display text-base font-bold leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/daftar" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-brand">
              Mulai Bergabung <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUE NUMBERS ────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Users, value: "Rp 0", label: "Modal Stok di Muka", sub: "Konsinyasi = titip dulu, bayar setelah laku", bg: "bg-brand-600", shadow: "shadow-brand" },
              { icon: Zap, value: "< 24 jam", label: "Waktu Persetujuan", sub: "Verifikasi dokumen cepat oleh tim admin", bg: "bg-emerald-600", shadow: "" },
              { icon: Award, value: "2.000 pcs", label: "Target Reward Tahunan", sub: "Capai target, dapatkan insentif tambahan", bg: "bg-amber-600", shadow: "" },
            ].map((item, i) => (
              <div key={item.label} className={`flex gap-4 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg animate-slide-up stagger-${i + 1}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.shadow} text-white`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="font-display text-2xl font-black text-slate-900">{item.value}</div>
                  <div className="mt-0.5 text-sm font-bold text-slate-700">{item.label}</div>
                  <p className="mt-1 text-xs font-medium text-slate-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center animate-slide-up">
            <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">Testimonial Mitra</span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Apa kata mitra agen kami?</h2>
            <p className="mx-auto mt-3 max-w-lg text-base font-medium text-slate-500">Bergabunglah dengan mitra agen kami yang sudah membuktikan manfaatnya di seluruh Jawa Barat.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`relative flex flex-col rounded-3xl border border-slate-200/70 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg animate-slide-up stagger-${i + 1}`}>
                <div className="absolute right-6 top-5 font-display text-8xl font-black leading-none text-slate-100 select-none">&ldquo;</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="relative mt-4 flex-1 text-sm font-medium leading-relaxed text-slate-600">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-black text-white`}>{t.initial}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs font-medium text-slate-400">{t.region}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUK STRIP ─────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">Produk Unggulan</span>
              <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-slate-900">Mulai dari produk herbal terpercaya</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">Madu Pahit, Sari Kurma Plus, dan private label maklon eksklusif Anda.</p>
            </div>
            <Link href="/produk" className="shrink-0 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition-all hover:border-brand-200 hover:text-brand-700">
              <Package size={15} /> Lihat Semua <ChevronRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { name: "Madu Pahit", cat: "Madu Herbal", price: "Login untuk harga mitra", tag: "Bestseller", tagC: "bg-brand-100 text-brand-700", border: "border-brand-200/50", bg: "bg-brand-50/30" },
              { name: "Sari Kurma Plus", cat: "Suplemen", price: "Login untuk harga mitra", tag: "Populer", tagC: "bg-emerald-100 text-emerald-700", border: "border-emerald-200/50", bg: "bg-emerald-50/20" },
              { name: "Produk Maklon", cat: "Private Label", price: "Custom · Konsultasi dulu", tag: "Eksklusif", tagC: "bg-violet-100 text-violet-700", border: "border-violet-200/50", bg: "bg-violet-50/20" },
            ].map((p, i) => (
              <div key={p.name} className={`flex items-center gap-4 rounded-2xl border ${p.border} ${p.bg} p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-soft animate-fade-in stagger-${i + 1}`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft text-brand-300">
                  <FlaskConical size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate">{p.name}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${p.tagC}`}>{p.tag}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-400">{p.cat}</div>
                  <div className="mt-0.5 text-xs font-bold text-brand-600">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#fdfbf7]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 animate-slide-up">
            <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">FAQ</span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900">Pertanyaan yang sering ditanya</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft animate-fade-in stagger-${i + 1}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-black text-brand-700 mt-0.5">Q</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{faq.q}</h4>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KOMITMEN ─────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Stok Transparan", desc: "Agen pantau saldo konsinyasi & histori pergerakan stok real-time kapan saja.", icon: Boxes, color: "from-brand-500 to-brand-600" },
              { title: "Tagihan Adil", desc: "Billing hanya dari penjualan terkonfirmasi — bukan dari stok yang masuk gudang.", icon: Scale, color: "from-emerald-500 to-teal-600" },
              { title: "Wilayah Terlindungi", desc: "Sistem mencegah dua agen aktif di satu kabupaten yang sama — eksklusivitas terjamin.", icon: MapPinned, color: "from-sky-500 to-blue-600" },
            ].map((item, i) => (
              <div key={item.title} className={`flex items-start gap-4 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 animate-slide-up stagger-${i + 1}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-soft`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#fdfbf7]">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-700 px-10 py-14 text-white sm:px-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-20 left-1/4 h-60 w-60 rounded-full bg-indigo-400/10 blur-3xl" />
              <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <div className="relative mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <ClipboardList size={30} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Siap menjadi mitra distribusi?
              </h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-white/70">
                Daftar hari ini, ajukan wilayah eksklusif, dan mulai jual produk Zoya tanpa modal stok di muka. Tim kami siap membantu onboarding Anda.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/daftar" className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl sm:w-auto">
                  Mulai Daftar Sekarang <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/maklon" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/25 px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:bg-white/10 sm:w-auto">
                  Tentang Maklon
                </Link>
              </div>
              <p className="mt-6 text-xs font-medium text-white/40">
                Bergabung dengan mitra agen aktif kami di seluruh Jawa Barat dan sekitarnya.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
