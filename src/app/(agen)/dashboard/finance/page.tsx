"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Upload, Wallet, Info, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable } from "@/components/ui";

type Billing = {
  id: string;
  period: string;
  totalQty: number;
  totalValue: number;
  status: string;
  proofUrl: string | null;
};

const STATUS_INFO: Record<string, { icon: React.ElementType; text: string; color: string }> = {
  unbilled:  { icon: Clock,        text: "Belum ditagih — periode belum tutup buku",       color: "text-slate-400" },
  pending:   { icon: Clock,        text: "Menunggu konfirmasi admin Zoya",                  color: "text-amber-500" },
  uploaded:  { icon: Clock,        text: "Bukti transfer diterima, menunggu verifikasi",    color: "text-blue-500"  },
  verified:  { icon: CheckCircle2, text: "Setoran dikonfirmasi oleh Zoya — lunas",          color: "text-emerald-500" },
  overdue:   { icon: AlertCircle,  text: "Melewati batas jatuh tempo",                      color: "text-rose-500"  },
};

export default function AgenFinancePage() {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadFor, setUploadFor] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get<{ billings: Billing[] }>(`/finance/setoran?agentId=${DEMO_AGENT_ID}`).then((r) => {
      if (r.data) setBillings(r.data.billings);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const submitProof = async (id: string) => {
    setBusy(true);
    await api.post(`/finance/setoran/${id}/bukti`, { proofUrl: preview ?? "mock://bukti" });
    setBusy(false);
    setUploadFor(null);
    setPreview(null);
    load();
  };

  const totalUnpaid = billings
    .filter((b) => b.status === "unbilled" || b.status === "pending" || b.status === "uploaded")
    .reduce((s, b) => s + b.totalValue, 0);

  const totalPaid = billings
    .filter((b) => b.status === "verified")
    .reduce((s, b) => s + b.totalValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Setoran"
        subtitle="Tagihan bulanan dihitung hanya dari penjualan yang Anda laporkan."
      />

      {/* Summary */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Periode</div>
            <div className="mt-1 font-display text-2xl font-black text-slate-900">{billings.length}</div>
          </Card>
          <Card className="border-amber-100 bg-amber-50/40 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Belum Lunas</div>
            <div className="mt-1 font-display text-2xl font-black text-amber-700">{formatIdr(totalUnpaid)}</div>
            <div className="text-[10px] font-semibold text-amber-500">dari produk yang sudah terjual</div>
          </Card>
          <Card className="border-emerald-100 bg-emerald-50/40 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sudah Lunas</div>
            <div className="mt-1 font-display text-2xl font-black text-emerald-700">{formatIdr(totalPaid)}</div>
          </Card>
        </div>
      )}

      {/* Konsinyasi billing info */}
      <Card className="border-brand-100 bg-brand-50/40 p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="mt-0.5 shrink-0 text-brand-500" />
          <div className="space-y-1.5 text-xs font-medium text-slate-600">
            <p className="font-bold text-slate-800">Cara kerja tagihan konsinyasi:</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                "Tagihan terbentuk otomatis dari laporan penjualan Anda — bukan dari stok yang diterima",
                "Stok sisa yang belum terjual tidak masuk hitungan tagihan",
                "Upload bukti transfer, admin Zoya verifikasi, status berubah jadi Lunas",
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

      {/* Billing list */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={3} /></div>
        ) : billings.length === 0 ? (
          <div className="p-10 text-center">
            <Wallet size={32} className="mx-auto text-slate-200" />
            <p className="mt-3 text-sm font-semibold text-slate-400">Belum ada tagihan.</p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Input laporan penjualan untuk memulai.{" "}
              <Link href="/dashboard/penjualan" className="font-bold text-brand-600 hover:underline">Laporan Penjualan →</Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {billings.map((b) => {
              const info = STATUS_INFO[b.status] ?? STATUS_INFO.pending;
              const StatusIcon = info.icon;
              return (
                <div key={b.id} className="p-5 sm:p-6">
                  {/* Header row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-base font-black text-slate-900">
                        Periode {b.period}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold">
                        <StatusIcon size={12} className={info.color} />
                        <span className={info.color}>{info.text}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-black text-slate-900">{formatIdr(b.totalValue)}</div>
                      <div className="text-xs font-semibold text-slate-400">{b.totalQty} pcs terjual</div>
                    </div>
                  </div>

                  {/* Context */}
                  <div className="mt-3 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-500">
                    <span className="font-bold text-slate-700">Tagihan ini</span> = {b.totalQty} pcs yang dilaporkan terjual × harga kewajiban.
                    Stok sisa <strong>tidak ditagih</strong>.
                  </div>

                  {/* Status badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-xs font-bold text-slate-400">{b.id}</span>
                  </div>

                  {/* Upload proof */}
                  {(b.status === "unbilled" || b.status === "pending" || b.status === "uploaded") && (
                    <div className="mt-4">
                      {uploadFor === b.id ? (
                        <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold text-slate-600">Upload bukti transfer ke rekening Zoya:</p>
                          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-8 text-center hover:border-brand-300 transition-colors">
                            {preview ? (
                              <img src={preview} alt="bukti transfer" className="max-h-40 rounded-xl" />
                            ) : (
                              <>
                                <Upload size={24} className="text-slate-300" />
                                <span className="text-xs font-bold text-slate-500">Klik untuk pilih foto/screenshot</span>
                                <span className="text-[10px] text-slate-400">JPG, PNG, PDF — preview lokal (demo)</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setPreview(URL.createObjectURL(f));
                              }}
                            />
                          </label>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => { setUploadFor(null); setPreview(null); }}>
                              Batal
                            </Button>
                            <Button size="sm" loading={busy} onClick={() => submitProof(b.id)}>
                              Kirim Bukti Transfer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant={b.status === "uploaded" ? "secondary" : "primary"}
                          onClick={() => setUploadFor(b.id)}
                        >
                          <Upload size={15} />
                          {b.status === "uploaded" ? "Ganti Bukti Transfer" : "Upload Bukti Transfer"}
                        </Button>
                      )}
                    </div>
                  )}

                  {b.status === "verified" && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <CheckCircle2 size={14} />
                      Setoran dikonfirmasi oleh admin Zoya — periode ini lunas.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
