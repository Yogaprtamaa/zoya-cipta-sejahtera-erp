"use client";

import { useEffect, useState, useCallback } from "react";
import { PackageX, CheckCircle2, XCircle, Image } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, Badge, EmptyState } from "@/components/ui";

type Retur = { id: string; agentId: string; agentName?: string; variantId: string; productName?: string; qty: number; reason?: string; evidenceUrl: string; status: string };

export default function AdminReturPage() {
  const [returns, setReturns] = useState<Retur[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const load = useCallback(() => api.get<{ returns: Retur[] }>("/retur").then((r) => { if (r.data) setReturns(r.data.returns); setLoading(false); }), []);
  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, status: "approved" | "rejected") => {
    setBusy(id);
    await api.patch("/retur", { id, status });
    setBusy(null);
    load();
  };

  const pending = returns.filter((r) => r.status === "pending").length;
  const approved = returns.filter((r) => r.status === "approved").length;

  const filtered = filter === "all" ? returns : returns.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retur"
        subtitle="Klaim retur barang dari agen — approve akan mengembalikan stok ke gudang."
        actions={pending > 0 ? <Badge tone="warning">{pending} menunggu</Badge> : undefined}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="p-5 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Retur</div>
          <div className="font-display text-2xl font-black text-slate-900">{returns.length}</div>
        </Card>
        <Card className="p-5 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Menunggu</div>
          <div className="font-display text-2xl font-black text-amber-600">{pending}</div>
        </Card>
        <Card className="p-5 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Disetujui</div>
          <div className="font-display text-2xl font-black text-emerald-600">{approved}</div>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${filter === f ? "bg-white text-slate-900 shadow-soft" : "text-slate-500 hover:text-slate-700"}`}>
            {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={3} /></div> : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState icon={<PackageX size={28} />} title="Tidak ada retur" description="Belum ada klaim retur dari agen." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">ID</th><th className="px-4 py-3">Agen</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3">Alasan</th><th className="px-4 py-3">Status</th><th className="px-6 py-3" /></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{r.id}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{r.agentName ?? r.agentId}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">{r.productName ?? r.variantId}</td>
                    <td className="px-4 py-4 text-right font-black text-slate-900">{r.qty}</td>
                    <td className="px-4 py-4 text-xs text-slate-400 max-w-[160px] truncate">{r.reason ?? "—"}</td>
                    <td className="px-4 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setPreview(r.evidenceUrl)}
                          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Lihat bukti"
                        >
                          <Image size={13} />
                        </button>
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" variant="secondary" loading={busy === r.id} onClick={() => decide(r.id, "rejected")}><XCircle size={13} /></Button>
                            <Button size="sm" loading={busy === r.id} onClick={() => decide(r.id, "approved")}><CheckCircle2 size={13} /> Setuju</Button>
                          </>
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

      {/* Evidence preview lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="relative max-w-lg w-full mx-4 rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-black text-slate-900">Bukti Retur</h3>
              <button onClick={() => setPreview(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"><XCircle size={18} /></button>
            </div>
            {preview.startsWith("blob:") || preview.startsWith("http") ? (
              <img src={preview} alt="Bukti retur" className="w-full rounded-2xl object-contain max-h-[60vh]" />
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
                <PackageX size={40} className="text-slate-200" />
                <p className="text-sm font-semibold">Preview tidak tersedia (mock URL)</p>
                <code className="text-[11px] bg-slate-50 px-3 py-1 rounded-lg">{preview}</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
