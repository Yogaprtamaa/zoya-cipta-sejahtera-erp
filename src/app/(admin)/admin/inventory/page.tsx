"use client";

import { useEffect, useState, useCallback } from "react";
import { Boxes, Plus, Warehouse, Users, Check } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Stat, Button, StatusBadge, SkeletonTable } from "@/components/ui";

type Inv = { id: string; qty: number; status: string; locationType: string; locationId: string; productName?: string; variantName?: string; variantId: string };

export default function AdminInventoryPage() {
  const [inv, setInv] = useState<Inv[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [qtyInput, setQtyInput] = useState<Record<string, string>>({});
  const [showInput, setShowInput] = useState<Record<string, boolean>>({});

  const load = useCallback(() => api.get<{ items: Inv[] }>("/inventory").then((r) => { if (r.data) setInv(r.data.items); setLoading(false); }), []);
  useEffect(() => { load(); }, [load]);

  const warehouse = inv.filter((i) => i.locationType === "warehouse");
  const atAgents = inv.filter((i) => i.locationType === "agent");

  const stockIn = async (variantId: string) => {
    const qty = Number(qtyInput[variantId] ?? 100);
    if (!qty || qty <= 0) return;
    setBusy(variantId);
    await api.post("/inventory/masuk", { variantId, qty });
    setBusy(null);
    setShowInput((s) => ({ ...s, [variantId]: false }));
    setQtyInput((q) => { const n = { ...q }; delete n[variantId]; return n; });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" subtitle="Stok gudang pusat & konsinyasi di agen." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat icon={<Warehouse size={18} />} label="Stok Gudang" value={`${warehouse.reduce((s, i) => s + i.qty, 0)} pcs`} />
        <Stat icon={<Users size={18} />} label="Di Agen" value={`${atAgents.reduce((s, i) => s + i.qty, 0)} pcs`} tone="info" />
        <Stat icon={<Boxes size={18} />} label="SKU" value={`${new Set(inv.map((i) => i.variantId)).size}`} />
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4"><h3 className="font-display text-base font-black text-slate-900">Gudang Pusat</h3></div>
        {loading ? <div className="p-6"><SkeletonTable rows={3} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">Produk</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3">Status</th><th className="px-6 py-3" /></tr></thead>
            <tbody className="divide-y divide-slate-50">{warehouse.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="font-bold text-slate-900">{i.productName}</div><div className="text-[11px] text-slate-400">{i.variantName}</div></td>
                <td className="px-4 py-4 text-right font-black text-slate-900">{i.qty}</td>
                <td className="px-4 py-4"><StatusBadge status={i.status} /></td>
                <td className="px-6 py-4 text-right">
                  {showInput[i.variantId] ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        value={qtyInput[i.variantId] ?? "100"}
                        onChange={(e) => setQtyInput((q) => ({ ...q, [i.variantId]: e.target.value }))}
                        className="w-20 rounded-lg border border-brand-300 bg-white px-2 py-1 text-right text-sm font-bold text-slate-800 focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") stockIn(i.variantId); if (e.key === "Escape") setShowInput((s) => ({ ...s, [i.variantId]: false })); }}
                      />
                      <Button size="sm" loading={busy === i.variantId} onClick={() => stockIn(i.variantId)}><Check size={13} /></Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setShowInput((s) => ({ ...s, [i.variantId]: true }))}><Plus size={13} /> Stok Masuk</Button>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      {atAgents.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4"><h3 className="font-display text-base font-black text-slate-900">Konsinyasi di Agen</h3></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">Produk</th><th className="px-4 py-3">Agen</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-50">{atAgents.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="font-bold text-slate-900">{i.productName}</div><div className="text-[11px] text-slate-400">{i.variantName}</div></td>
                <td className="px-4 py-4 font-medium text-slate-500">{i.locationId}</td>
                <td className="px-4 py-4 text-right font-black text-slate-900">{i.qty}</td>
                <td className="px-4 py-4"><StatusBadge status={i.status} /></td>
              </tr>
            ))}</tbody>
          </table></div>
        </Card>
      )}
    </div>
  );
}
