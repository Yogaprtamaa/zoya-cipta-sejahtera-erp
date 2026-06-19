"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Undo2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, EmptyState } from "@/components/ui";

type Ret = { id: string; productName: string; qty: number; status: string; reason?: string };
type Inv = { id: string; variantId: string; qty: number; productName?: string; variantName?: string };

export default function AgenReturPage() {
  const [returns, setReturns] = useState<Ret[]>([]);
  const [inv, setInv] = useState<Inv[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("Kemasan rusak");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get<{ returns: Ret[] }>(`/retur?agentId=${DEMO_AGENT_ID}`).then((r) => { if (r.data) setReturns(r.data.returns); setLoading(false); });
    api.get<{ items: Inv[] }>(`/inventory?locationType=agent&locationId=${DEMO_AGENT_ID}`).then((r) => { if (r.data) { setInv(r.data.items); if (!variantId && r.data.items[0]) setVariantId(r.data.items[0].variantId); } });
  }, [variantId]);
  useEffect(() => { load(); }, [load]);

  const submit = async () => { setBusy(true); await api.post("/retur", { agentId: DEMO_AGENT_ID, variantId, qty, reason }); setBusy(false); setCreating(false); load(); };

  if (creating) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button onClick={() => setCreating(false)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 cursor-pointer"><ArrowLeft size={16} /> Kembali</button>
        <PageHeader title="Ajukan Retur" subtitle="Lampirkan kondisi barang. Admin akan meninjau." />
        <Card className="space-y-5 p-6">
          <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Produk</span>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-semibold text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none">{inv.map((i) => <option key={i.id} value={i.variantId}>{i.productName} {i.variantName}</option>)}</select></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah</span><input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none" /></label>
            <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kondisi/Alasan</span><input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-semibold text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none" /></label>
          </div>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-6 text-center hover:border-brand-300"><Undo2 size={20} className="text-slate-300" /><span className="text-xs font-bold text-slate-500">Upload foto bukti (preview lokal)</span><input type="file" className="hidden" /></label>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><Button variant="secondary" onClick={() => setCreating(false)}>Batal</Button><Button loading={busy} onClick={submit}>Kirim Retur</Button></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Retur" subtitle="Pengajuan retur barang konsinyasi." actions={<Button onClick={() => setCreating(true)}><Plus size={16} /> Ajukan Retur</Button>} />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={3} /></div> : returns.length === 0 ? (
          <EmptyState icon={<Undo2 size={26} />} title="Belum ada retur" description="Ajukan retur jika ada barang rusak / tidak layak jual." action={<Button onClick={() => setCreating(true)}>Ajukan Retur</Button>} />
        ) : (
          <div className="divide-y divide-slate-50">{returns.map((r) => <div key={r.id} className="flex items-center justify-between p-4"><div><div className="font-bold text-slate-900">{r.id} · {r.productName}</div><div className="text-[11px] text-slate-400">{r.qty} pcs · {r.reason}</div></div><StatusBadge status={r.status} /></div>)}</div>
        )}
      </Card>
    </div>
  );
}
