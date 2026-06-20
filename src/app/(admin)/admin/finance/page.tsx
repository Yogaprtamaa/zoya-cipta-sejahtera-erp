"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Wallet, Upload, Info, Clock, AlertCircle, Eye, X, PenLine } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, Stat, EmptyState } from "@/components/ui";

type Billing = {
  id: string;
  agentName?: string;
  agentId?: string;
  period: string;
  totalQty: number;
  totalValue: number;
  status: string;
  proofUrl: string | null;
};

export default function AdminFinancePage() {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying]   = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [koreksiId, setKoreksiId]   = useState<string | null>(null);
  const [koreksiVal, setKoreksiVal] = useState("");
  const [koreksiReason, setKoreksiReason] = useState("");
  const [koreksiSaving, setKoreksiSaving] = useState(false);

  const load = useCallback(() => {
    api.get<{ billings: Billing[] }>("/finance/setoran").then((r) => {
      if (r.data) setBillings(r.data.billings);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveKoreksi = async () => {
    if (!koreksiId) return;
    setKoreksiSaving(true);
    await api.patch(`/finance/setoran/${koreksiId}/koreksi`, { newValue: Number(koreksiVal), reason: koreksiReason, by: "admin" });
    setKoreksiSaving(false);
    setKoreksiId(null);
    setKoreksiVal("");
    setKoreksiReason("");
    load();
  };

  const verify = async (id: string, decision: "verify" | "reject") => {
    setVerifying(id);
    await api.post(`/finance/setoran/${id}/verifikasi`, { decision });
    setVerifying(null);
    load();
  };

  const needVerify = billings.filter((b) => b.status === "uploaded");
  const pending = billings.filter((b) => b.status === "unbilled" || b.status === "pending");
  const verified = billings.filter((b) => b.status === "verified");
  const totalReceivable = billings
    .filter((b) => b.status !== "verified")
    .reduce((s, b) => s + b.totalValue, 0);
  const totalVerified = verified.reduce((s, b) => s + b.totalValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Setoran & Pembayaran"
        subtitle="Verifikasi bukti transfer agen. Tagihan = nilai produk yang dilaporkan terjual."
      />

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat icon={<AlertCircle size={18} />} label="Perlu Verifikasi" value={`${needVerify.length}`} tone={needVerify.length > 0 ? "warning" : "neutral"} />
          <Stat icon={<Clock size={18} />} label="Menunggu Upload" value={`${pending.length}`} tone="info" />
          <Stat icon={<Wallet size={18} />} label="Total Piutang" value={formatIdr(totalReceivable)} tone="warning" />
          <Stat icon={<CheckCircle2 size={18} />} label="Sudah Lunas" value={formatIdr(totalVerified)} tone="success" />
        </div>
      )}

      {/* Info konsinyasi */}
      <Card className="border-brand-100 bg-brand-50/40 p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="mt-0.5 shrink-0 text-brand-500" />
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            <strong className="text-slate-800">Konsinyasi:</strong> Tagihan di sini berasal dari{" "}
            <strong>laporan penjualan agen</strong>, bukan dari stok yang dikirim.
            Stok sisa yang belum terjual tidak menimbulkan kewajiban — stok tersebut masih milik Zoya.
            Setelah agen upload bukti transfer, klik <strong>Verifikasi</strong> untuk konfirmasi lunas.
          </p>
        </div>
      </Card>

      {/* Needs verification — prioritas */}
      {!loading && needVerify.length > 0 && (
        <Card className="overflow-hidden border-amber-200">
          <div className="border-b border-amber-100 bg-amber-50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-amber-600" />
              <h3 className="font-display text-base font-black text-amber-800">
                Bukti Transfer Menunggu Verifikasi ({needVerify.length})
              </h3>
            </div>
            <p className="mt-0.5 text-xs font-medium text-amber-600">
              Agen sudah upload bukti transfer. Cek dan verifikasi di bawah.
            </p>
          </div>
          <div className="divide-y divide-amber-50">
            {needVerify.map((b) => (
              <div key={b.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-xs font-black text-white">
                      {(b.agentName ?? "A")[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{b.agentName}</div>
                      <div className="text-xs font-medium text-slate-400">Periode {b.period} · {b.id}</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-600">
                    <span className="font-bold text-slate-800">{b.totalQty} pcs terjual</span> × harga kewajiban ={" "}
                    <span className="font-black text-brand-700">{formatIdr(b.totalValue)}</span>
                    <div className="mt-1 text-slate-400">Stok sisa tidak masuk tagihan ini</div>
                  </div>
                  {b.proofUrl && (
                    <button
                      onClick={() => setPreviewUrl(b.proofUrl)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <Eye size={12} /> Lihat Bukti Transfer
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={verifying === b.id}
                    onClick={() => verify(b.id, "reject")}
                  >
                    <XCircle size={14} /> Tolak
                  </Button>
                  <Button
                    size="sm"
                    loading={verifying === b.id}
                    onClick={() => verify(b.id, "verify")}
                  >
                    <CheckCircle2 size={14} /> Verifikasi Lunas
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All billings */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-base font-black text-slate-900">Semua Tagihan Setoran</h3>
        </div>
        {loading ? (
          <div className="p-6"><SkeletonTable rows={4} /></div>
        ) : billings.length === 0 ? (
          <EmptyState
            icon={<Wallet size={26} />}
            title="Belum ada tagihan"
            description="Tagihan muncul setelah agen melaporkan penjualan."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">No.</th>
                  <th className="px-4 py-3">Agen</th>
                  <th className="px-4 py-3">Periode</th>
                  <th className="px-4 py-3 text-right">Qty Terjual</th>
                  <th className="px-4 py-3 text-right">Nilai Tagihan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {billings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{b.id}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{b.agentName ?? "—"}</td>
                    <td className="px-4 py-4 font-medium text-slate-500">{b.period}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-600">{b.totalQty} pcs</td>
                    <td className="px-4 py-4 text-right font-black text-slate-900">{formatIdr(b.totalValue)}</td>
                    <td className="px-4 py-4"><StatusBadge status={b.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        {b.proofUrl && (
                          <button
                            onClick={() => setPreviewUrl(b.proofUrl)}
                            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            <Eye size={11} /> Bukti
                          </button>
                        )}
                        {b.status === "uploaded" ? (
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="secondary" loading={verifying === b.id} onClick={() => verify(b.id, "reject")}>
                              <XCircle size={14} />
                            </Button>
                            <Button size="sm" loading={verifying === b.id} onClick={() => verify(b.id, "verify")}>
                              <CheckCircle2 size={14} /> Verifikasi
                            </Button>
                          </div>
                        ) : b.status === "verified" ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                            <CheckCircle2 size={12} /> Lunas
                          </span>
                        ) : (
                          <button
                            onClick={() => { setKoreksiId(b.id); setKoreksiVal(String(b.totalValue)); setKoreksiReason(""); }}
                            className="flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
                          >
                            <PenLine size={11} /> Koreksi Nilai
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Koreksi Tagihan Modal */}
      {koreksiId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-4" onClick={() => setKoreksiId(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-display text-base font-black text-slate-900">Koreksi Nilai Tagihan</h3>
                <p className="text-xs font-medium text-slate-400">{koreksiId} · aksi ini dicatat di audit trail</p>
              </div>
              <button onClick={() => setKoreksiId(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nilai Baru (Rp)</span>
                <input type="number" value={koreksiVal} onChange={(e) => setKoreksiVal(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alasan Koreksi <span className="text-rose-500">*</span></span>
                <textarea rows={2} value={koreksiReason} onChange={(e) => setKoreksiReason(e.target.value)} placeholder="mis. Salah hitung qty penjualan agen-001 bulan Mei…" className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 focus:border-brand-400 focus:bg-white focus:outline-none" />
              </label>
              <Button loading={koreksiSaving} onClick={saveKoreksi} className="w-full justify-center"><PenLine size={15} /> Simpan Koreksi</Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox bukti transfer */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl w-full overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-display text-base font-black text-slate-900">Bukti Transfer</h3>
                <p className="text-xs font-medium text-slate-400">Lampiran dari agen</p>
              </div>
              <button
                onClick={() => setPreviewUrl(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              {previewUrl.startsWith("blob:") || previewUrl.startsWith("http") ? (
                <img
                  src={previewUrl}
                  alt="Bukti transfer"
                  className="max-h-[70vh] w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                    <Upload size={28} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">File bukti tersimpan di server</p>
                  <p className="text-xs font-medium text-slate-400 font-mono">{previewUrl}</p>
                  <p className="text-xs text-slate-400">(Preview hanya tersedia untuk file yang diupload langsung)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
