"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, ShoppingCart, ArrowLeft, Info, CheckCircle2,
  Upload, X, Copy, CreditCard, Image as ImageIcon, AlertCircle,
  ExternalLink, Building2,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID, DEMO_PERIOD } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, SkeletonTable, EmptyState, StatusBadge } from "@/components/ui";
import type { RekeningInfo } from "@/types";

type Sale = {
  id: string;
  productName: string;
  variantId: string;
  qty: number;
  value: number;
  date: string;
  status?: string;
  proofUrl?: string | null;
};
type Inv = { id: string; variantId: string; qty: number; productName?: string; variantName?: string };

/* ─── Rekening card ──────────────────────────────────────────────────── */
function RekeningCard({ rekening, highlightAmount }: { rekening: RekeningInfo[]; highlightAmount?: number }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="rounded-3xl border border-brand-200/60 bg-gradient-to-br from-brand-50/80 to-indigo-50/40 p-5 shadow-soft space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
          <Building2 size={17} />
        </div>
        <div>
          <div className="font-display text-sm font-black text-slate-900">Rekening Tujuan Transfer</div>
          <div className="text-[11px] font-semibold text-slate-400">PT Zoya Cipta Sejahtera</div>
        </div>
        {highlightAmount && (
          <div className="ml-auto text-right">
            <div className="text-xs font-bold text-slate-400">Total setoran</div>
            <div className="font-display text-base font-black text-brand-700">{formatIdr(highlightAmount)}</div>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {rekening.map((r, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 transition-all ${i === 0 ? "border-brand-200 bg-white shadow-soft" : "border-slate-200/60 bg-white/60"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-black text-slate-900">{r.bank}</span>
                  {i === 0 && (
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-700">
                      Utama
                    </span>
                  )}
                  {r.notes && i > 0 && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                      {r.notes}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs font-medium text-slate-500">{r.accountName}</div>
                <div className="mt-1.5 font-mono text-base font-black tracking-widest text-slate-900">
                  {r.accountNumber}
                </div>
              </div>
              <button
                onClick={() => copy(r.accountNumber, r.bank)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 shadow-soft transition-all hover:border-brand-300 hover:text-brand-700 cursor-pointer"
              >
                {copied === r.bank ? (
                  <><CheckCircle2 size={13} className="text-emerald-500" /> Tersalin</>
                ) : (
                  <><Copy size={13} /> Salin</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-amber-200/60 bg-amber-50/60 px-3.5 py-2.5">
        <AlertCircle size={13} className="mt-0.5 shrink-0 text-amber-500" />
        <p className="text-[11px] font-medium leading-relaxed text-amber-700">
          Pastikan nama pengirim sesuai dengan nama mitra terdaftar di Zoya. Upload bukti transfer setelah melakukan pembayaran.
        </p>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export default function AgenPenjualanPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [inv, setInv] = useState<Inv[]>([]);
  const [rekening, setRekening] = useState<RekeningInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // form state
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(5);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "rekening" | "done">("form");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<{ sales: Sale[] }>(`/penjualan?agentId=${DEMO_AGENT_ID}`),
      api.get<{ items: Inv[] }>(`/inventory?locationType=agent&locationId=${DEMO_AGENT_ID}`),
      api.get<{ settings: { rekening?: RekeningInfo[] } }>("/settings"),
    ]).then(([saleRes, invRes, settingsRes]) => {
      if (saleRes.data) setSales(saleRes.data.sales);
      if (invRes.data) {
        setInv(invRes.data.items);
        if (!variantId && invRes.data.items[0]) setVariantId(invRes.data.items[0].variantId);
      }
      if (settingsRes.data?.settings?.rekening) setRekening(settingsRes.data.settings.rekening);
      setLoading(false);
    });
  }, [variantId]);

  useEffect(() => { load(); }, [load]);

  const maxQty = inv.find((i) => i.variantId === variantId)?.qty ?? 0;
  const selectedInv = inv.find((i) => i.variantId === variantId);

  // Estimated value from billing price (simplified: use same calculation as server)
  const thisPeriod = sales.filter((s) => s.date.startsWith(DEMO_PERIOD));
  const totalQtyPeriod = thisPeriod.reduce((s, x) => s + x.qty, 0);
  const totalValuePeriod = thisPeriod.reduce((s, x) => s + x.value, 0);

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProofFile(f);
    setProofPreview(URL.createObjectURL(f));
  };

  const removeProof = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const submit = async () => {
    setError(null);
    setBusy(true);
    const res = await api.post("/penjualan", {
      agentId: DEMO_AGENT_ID,
      variantId,
      qty,
      proofUrl: proofFile ? `mock://bukti-${proofFile.name}` : null,
    });
    setBusy(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setStep("done");
    load();
  };

  const resetForm = () => {
    setCreating(false);
    setStep("form");
    setQty(5);
    setProofFile(null);
    setProofPreview(null);
    setError(null);
  };

  /* ─── Create form ──────────────────────────────────────────────────── */
  if (creating) {
    if (step === "done") {
      return (
        <div className="mx-auto max-w-lg">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-10 text-center shadow-soft animate-slide-up">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900">Laporan Terkirim!</h2>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-500">
              Laporan penjualan Anda berhasil direkam. Stok konsinyasi dan tagihan bulanan diperbarui otomatis.
            </p>
            {proofFile && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-700 w-full justify-center">
                <ImageIcon size={14} /> Bukti transfer terlampir: {proofFile.name}
              </div>
            )}
            <div className="w-full space-y-2.5 text-left">
              {[
                "Stok konsinyasi Anda berkurang sesuai qty terjual",
                "Tagihan setoran bulan ini diperbarui",
                "Admin Zoya menerima laporan ini secara real-time",
                ...(proofFile ? ["Bukti transfer dikirim ke admin untuk verifikasi"] : []),
              ].map((s) => (
                <div key={s} className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                  <CheckCircle2 size={15} className="text-emerald-500" /> {s}
                </div>
              ))}
            </div>
            <Button onClick={resetForm} className="w-full mt-2">
              Kembali ke Daftar Penjualan
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button onClick={resetForm} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>

        <PageHeader
          title="Input Laporan Penjualan"
          subtitle="Catat produk yang sudah terjual. Stok dan tagihan diperbarui otomatis."
        />

        {/* Step indicator */}
        <div className="flex gap-0">
          {[
            { key: "form", label: "Detail Penjualan" },
            { key: "rekening", label: "Transfer & Bukti" },
          ].map((s, i) => {
            const isActive = step === s.key;
            const isDone = step === "rekening" && i === 0;
            return (
              <div key={s.key} className="flex flex-1 items-center">
                {i > 0 && <div className={`h-0.5 w-6 shrink-0 transition-all ${isDone || step === "rekening" ? "bg-brand-400" : "bg-slate-200"}`} />}
                <div className="flex flex-1 items-center gap-2 rounded-2xl px-3 py-2">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-all
                    ${isDone ? "bg-brand-600 text-white" : isActive ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-slate-200 text-slate-400"}`}>
                    {isDone ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold transition-colors ${isActive ? "text-brand-700" : isDone ? "text-slate-500" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Step 1: Detail Penjualan ─── */}
        {step === "form" && (
          <div className="space-y-5 animate-fade-in">
            {/* Alur info */}
            <Card className="border-brand-100 bg-brand-50/40 p-5">
              <div className="flex items-start gap-3">
                <Info size={16} className="mt-0.5 shrink-0 text-brand-500" />
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <p className="font-bold text-slate-800">Yang terjadi setelah Anda submit laporan ini:</p>
                  <div className="grid gap-1.5 sm:grid-cols-3">
                    {[
                      "Stok konsinyasi Anda berkurang sesuai qty terjual",
                      "Tagihan setoran bulan ini bertambah otomatis",
                      "Admin Zoya menerima laporan penjualan ini",
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-brand-500" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="space-y-5 p-6">
              {/* Produk select */}
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Produk Yang Terjual <span className="text-rose-500">*</span>
                </span>
                <select
                  value={variantId}
                  onChange={(e) => setVariantId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-semibold text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {inv.map((i) => (
                    <option key={i.id} value={i.variantId}>
                      {i.productName} · {i.variantName} — sisa stok: {i.qty} pcs
                    </option>
                  ))}
                </select>
              </label>

              {/* Qty */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Jumlah Terjual (pcs) <span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none"
                  />
                  <span className="text-[11px] font-semibold text-slate-400">
                    Maks {maxQty} pcs (sisa stok konsinyasi Anda)
                  </span>
                </label>
                <div className="block space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stok Tersisa Setelah Laporan
                  </span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="font-black text-slate-900">{Math.max(0, maxQty - qty)} pcs</div>
                    <div className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      {selectedInv?.productName} · {selectedInv?.variantName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick rekening preview */}
              {rekening.length > 0 && (
                <div className="flex items-center justify-between rounded-2xl border border-brand-200/50 bg-brand-50/40 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={15} className="text-brand-500" />
                    <span className="text-xs font-bold text-brand-700">Transfer ke rekening Zoya</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("rekening")}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                  >
                    Lihat rekening <ExternalLink size={11} />
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
                <Button variant="secondary" onClick={resetForm}>Batal</Button>
                <Button disabled={qty <= 0 || qty > maxQty} onClick={() => setStep("rekening")}>
                  Lanjut — Transfer & Bukti
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* ─── Step 2: Rekening & Bukti Transfer ─── */}
        {step === "rekening" && (
          <div className="space-y-5 animate-fade-in">
            {/* Summary pill */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft flex flex-wrap items-center gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Produk</div>
                <div className="mt-0.5 text-sm font-bold text-slate-800">{selectedInv?.productName} · {selectedInv?.variantName}</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qty Terjual</div>
                <div className="mt-0.5 text-sm font-black text-slate-900">{qty} pcs</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div className="ml-auto text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ditambahkan ke tagihan</div>
                <div className="mt-0.5 text-sm font-black text-brand-700">dihitung oleh sistem</div>
              </div>
            </div>

            {/* Rekening card */}
            {rekening.length > 0 && <RekeningCard rekening={rekening} />}

            {/* Bukti transfer upload */}
            <Card className="space-y-4 p-6">
              <div>
                <div className="font-display text-sm font-black text-slate-900">Upload Bukti Transfer</div>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  Opsional — Anda juga bisa upload dari halaman <span className="font-bold text-brand-600">Setoran</span> setelah transfer dilakukan.
                </p>
              </div>

              {proofPreview ? (
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={proofPreview} alt="Bukti transfer" className="max-h-56 w-full object-contain p-2" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600 shadow-soft">
                      <ImageIcon size={10} /> {proofFile?.name}
                    </div>
                  </div>
                  <button
                    onClick={removeProof}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 cursor-pointer transition-colors"
                    aria-label="Hapus foto"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-8 text-center transition-all hover:border-brand-300 hover:bg-brand-50/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                    <Upload size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-600">Klik untuk pilih foto / screenshot</div>
                    <div className="mt-0.5 text-[11px] font-medium text-slate-400">JPG, PNG, PDF · maks 5 MB</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleProofChange}
                  />
                </label>
              )}

              {!proofFile && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 border border-amber-200/60">
                  <Info size={12} className="mt-0.5 shrink-0 text-amber-500" />
                  <p className="text-[11px] font-medium text-amber-700">
                    Jika belum transfer, lewati langkah ini — laporan tetap masuk dan bukti bisa diupload nanti dari menu Setoran.
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                  {error === "INSUFFICIENT_STOCK" ? "Stok tidak cukup — qty melebihi sisa konsinyasi Anda." : error}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <Button variant="ghost" onClick={() => setStep("form")}>
                  <ArrowLeft size={15} /> Kembali
                </Button>
                <div className="flex gap-2">
                  <Button variant="secondary" loading={busy} onClick={submit}>
                    Kirim Tanpa Bukti
                  </Button>
                  <Button loading={busy} disabled={!proofFile} onClick={submit}>
                    <Upload size={15} /> Kirim + Bukti Transfer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  /* ─── List view ─────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Penjualan"
        subtitle="Catat setiap penjualan — admin Zoya menerima laporan ini secara real-time."
        actions={
          <Button onClick={() => { setCreating(true); setStep("form"); }}>
            <Plus size={16} /> Input Penjualan
          </Button>
        }
      />

      {/* Monthly summary */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Periode</div>
            <div className="mt-1 font-display text-xl font-black text-slate-900">{DEMO_PERIOD}</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Terjual Bulan Ini</div>
            <div className="mt-1 font-display text-xl font-black text-slate-900">{totalQtyPeriod} pcs</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Nilai Kewajiban Bulan Ini</div>
            <div className="mt-1 font-display text-xl font-black text-brand-700">{formatIdr(totalValuePeriod)}</div>
            <div className="mt-0.5 text-[10px] font-semibold text-slate-400">akan muncul di Setoran</div>
          </Card>
        </div>
      )}

      {/* Rekening info strip — always visible */}
      {!loading && rekening.length > 0 && (
        <div className="rounded-2xl border border-brand-200/50 bg-brand-50/40 px-5 py-3.5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={15} className="text-brand-500" />
            <span className="text-xs font-bold text-brand-700">Rekening transfer setoran:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {rekening.map((r) => (
              <div key={r.bank} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <span className="font-black text-slate-800">{r.bank}</span>
                <span className="font-mono">{r.accountNumber}</span>
                <span className="text-slate-400">· {r.accountName}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setCreating(true); setStep("rekening"); }}
            className="ml-auto text-[11px] font-bold text-brand-600 hover:text-brand-800 cursor-pointer flex items-center gap-1"
          >
            Lihat detail <ExternalLink size={10} />
          </button>
        </div>
      )}

      {/* Info */}
      <Card className="border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="text-xs font-medium leading-relaxed text-slate-500">
            Setiap laporan yang Anda input diterima langsung oleh admin Zoya.
            Tagihan setoran bulanan dihitung <strong>hanya dari total penjualan yang dilaporkan di sini</strong>.
            Stok sisa yang tidak terjual tidak ditagih.
          </p>
        </div>
      </Card>

      {/* Sales list */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={4} /></div>
        ) : sales.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={26} />}
            title="Belum ada laporan penjualan"
            description="Catat produk yang sudah Anda jual ke konsumen."
            action={<Button onClick={() => { setCreating(true); setStep("form"); }}>Input Penjualan Pertama</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">No. Laporan</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Nilai Kewajiban</th>
                  <th className="px-4 py-3">Bukti Transfer</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{s.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-500">{s.date}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">{s.productName}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">{s.qty} pcs</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-800">{formatIdr(s.value)}</td>
                    <td className="px-4 py-4">
                      {s.proofUrl ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 size={11} /> Terlampir
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                          Belum ada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status ?? "confirmed"} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={3} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Total Semua</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">
                    {sales.reduce((s, x) => s + x.qty, 0)} pcs
                  </td>
                  <td className="px-4 py-3 text-right font-black text-brand-700">
                    {formatIdr(sales.reduce((s, x) => s + x.value, 0))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
