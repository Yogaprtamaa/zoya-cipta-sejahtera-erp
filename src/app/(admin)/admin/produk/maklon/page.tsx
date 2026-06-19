"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, EyeOff, Package } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Badge, EmptyState, SkeletonTable } from "@/components/ui";

type Product = { id: string; name: string; isPrivate: boolean; clientId: string | null; variants: { id: string; name: string }[] };

export default function AdminProdukMaklonPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ products: Product[] }>("/produk?role=admin").then((r) => { if (r.data) setProducts(r.data.products.filter((p) => p.isPrivate)); setLoading(false); }); }, []);

  return (
    <div className="space-y-6">
      <Link href="/admin/produk" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Kembali ke produk</Link>
      <PageHeader title="Produk Maklon (Private)" subtitle="SKU privat hanya untuk pemilik brand terkait." />
      {loading ? <SkeletonTable rows={2} /> : products.length === 0 ? (
        <Card><EmptyState icon={<EyeOff size={26} />} title="Belum ada SKU privat" description="SKU privat terbit otomatis saat lead maklon mencapai tahap Selesai." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Package size={18} /></span><div className="font-bold text-slate-900">{p.name}</div></div><Badge tone="warning"><EyeOff size={11} /> Private</Badge></div>
              <div className="mt-3 text-xs font-medium text-slate-400">Client: {p.clientId ?? "—"} · {p.variants.length} varian</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
