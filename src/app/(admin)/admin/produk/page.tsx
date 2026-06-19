"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Package, Save, EyeOff, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button, Badge, SkeletonTable, Drawer } from "@/components/ui";

type Variant = { id: string; name: string; price: number | null; stock: number };
type Product = { id: string; name: string; category?: string; isPrivate: boolean; variants: Variant[] };

const CATEGORIES = ["Madu", "Suplemen", "Herbal", "Maklon", "Lainnya"];

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceEdit, setPriceEdit] = useState<Record<string, number>>({});

  // create product drawer
  const [createOpen, setCreateOpen] = useState(false);
  const [newProd, setNewProd] = useState({ name: "", category: "Madu" });
  const [creating, setCreating] = useState(false);

  // add variant drawer
  const [variantFor, setVariantFor] = useState<Product | null>(null);
  const [newVar, setNewVar] = useState({ name: "", unit: "botol", price: "" });
  const [addingVar, setAddingVar] = useState(false);

  // edit product inline
  const [editProd, setEditProd] = useState<Record<string, { name: string; category: string }>>({});

  // delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = useCallback(() => api.get<{ products: Product[] }>("/produk?role=admin&level=agen").then((r) => { if (r.data) setProducts(r.data.products); setLoading(false); }), []);
  useEffect(() => { load(); }, [load]);

  const savePrice = async (productId: string, variantId: string) => {
    const price = priceEdit[variantId];
    if (price == null) return;
    await api.post(`/produk/${productId}/harga`, { variantId, level: "agen", price });
    setPriceEdit((e) => { const n = { ...e }; delete n[variantId]; return n; });
    load();
  };

  const createProduct = async () => {
    if (!newProd.name) return;
    setCreating(true);
    await api.post("/produk", { name: newProd.name, category: newProd.category });
    setCreating(false);
    setCreateOpen(false);
    setNewProd({ name: "", category: "Madu" });
    load();
  };

  const saveProductEdit = async (p: Product) => {
    const e = editProd[p.id];
    if (!e) return;
    await api.patch(`/produk/${p.id}`, { name: e.name, category: e.category });
    setEditProd((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
    load();
  };

  const addVariant = async () => {
    if (!variantFor || !newVar.name) return;
    setAddingVar(true);
    await api.post(`/produk/${variantFor.id}/variant`, { name: newVar.name, unit: newVar.unit, price: newVar.price ? Number(newVar.price) : undefined });
    setAddingVar(false);
    setVariantFor(null);
    setNewVar({ name: "", unit: "botol", price: "" });
    load();
  };

  const deleteVariant = async (productId: string, variantId: string) => {
    await api.delete(`/produk/${productId}/variant?variantId=${variantId}`);
    load();
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/produk/${id}`);
    setDeleteConfirm(null);
    load();
  };

  const publicProducts = products.filter((p) => !p.isPrivate);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produk & Harga"
        subtitle="Kelola katalog, varian, dan harga tier agen."
        actions={
          <div className="flex gap-2">
            <Link href="/admin/maklon"><Button variant="secondary" size="sm"><EyeOff size={15} /> Produk Maklon</Button></Link>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> Produk Baru</Button>
          </div>
        }
      />

      {loading ? <SkeletonTable rows={4} /> : (
        <div className="space-y-4">
          {publicProducts.map((p) => {
            const isEditing = !!editProd[p.id];
            const ep = editProd[p.id] ?? { name: p.name, category: p.category ?? "" };
            return (
              <Card key={p.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Package size={18} /></span>
                    {isEditing ? (
                      <div className="flex flex-1 gap-2">
                        <input value={ep.name} onChange={(e) => setEditProd((s) => ({ ...s, [p.id]: { ...ep, name: e.target.value } }))} className="flex-1 rounded-xl border border-brand-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none" />
                        <select value={ep.category} onChange={(e) => setEditProd((s) => ({ ...s, [p.id]: { ...ep, category: e.target.value } }))} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer">
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div><div className="font-display text-lg font-bold text-slate-900">{p.name}</div>{p.category && <Badge tone="neutral">{p.category}</Badge>}</div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {isEditing ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setEditProd((s) => { const n = { ...s }; delete n[p.id]; return n; })}><X size={13} /></Button>
                        <Button size="sm" onClick={() => saveProductEdit(p)}><Check size={13} /></Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setEditProd((s) => ({ ...s, [p.id]: { name: p.name, category: p.category ?? "" } }))}><Pencil size={13} /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setVariantFor(p)}><Plus size={13} /> Varian</Button>
                        {deleteConfirm === p.id ? (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)}><X size={13} /></Button>
                            <Button size="sm" variant="danger" onClick={() => deleteProduct(p.id)}>Hapus?</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(p.id)}><Trash2 size={13} className="text-rose-500" /></Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {p.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                      <div><span className="font-semibold text-slate-700">{v.name}</span><span className="ml-2 text-[11px] text-slate-400">stok {v.stock}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">Harga agen</span>
                        <input type="number" defaultValue={v.price ?? 0} onChange={(e) => setPriceEdit((s) => ({ ...s, [v.id]: Number(e.target.value) }))} className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right font-bold text-slate-800 focus:border-brand-400 focus:outline-none" />
                        <Button size="sm" variant={priceEdit[v.id] != null ? "primary" : "ghost"} disabled={priceEdit[v.id] == null} onClick={() => savePrice(p.id, v.id)}><Save size={13} /></Button>
                        <button onClick={() => deleteVariant(p.id, v.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer" title="Hapus varian"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                  {p.variants.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-xs font-semibold text-slate-400">Belum ada varian — <button onClick={() => setVariantFor(p)} className="text-brand-600 hover:underline cursor-pointer">tambah varian</button></div>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Product Drawer */}
      <Drawer open={createOpen} onClose={() => setCreateOpen(false)} title="Produk Baru">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Produk <span className="text-rose-500">*</span></span>
            <input value={newProd.name} onChange={(e) => setNewProd((f) => ({ ...f, name: e.target.value }))} placeholder="cth. Propolis Murni" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kategori</span>
            <select value={newProd.category} onChange={(e) => setNewProd((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none cursor-pointer">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={creating} onClick={createProduct} disabled={!newProd.name}>Buat Produk</Button>
          </div>
        </div>
      </Drawer>

      {/* Add Variant Drawer */}
      <Drawer open={!!variantFor} onClose={() => setVariantFor(null)} title={`Tambah Varian — ${variantFor?.name ?? ""}`}>
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Varian <span className="text-rose-500">*</span></span>
            <input value={newVar.name} onChange={(e) => setNewVar((f) => ({ ...f, name: e.target.value }))} placeholder="cth. 100 ml" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Satuan</span>
            <input value={newVar.unit} onChange={(e) => setNewVar((f) => ({ ...f, unit: e.target.value }))} placeholder="botol / sachet / pcs" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Harga Dasar (agen)</span>
            <input type="number" value={newVar.price} onChange={(e) => setNewVar((f) => ({ ...f, price: e.target.value }))} placeholder="85000" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
            <p className="text-[11px] text-slate-400">Otomatis dikalkulasi ke tier sub-agen, reseller, & default.</p>
          </label>
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={addingVar} onClick={addVariant} disabled={!newVar.name}>Tambah Varian</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
