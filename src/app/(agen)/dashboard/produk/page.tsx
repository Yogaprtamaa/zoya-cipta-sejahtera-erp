"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID, DEMO_RESELLER_ID } from "@/lib/demo";
import { useClientLevel } from "@/lib/use-client-level";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, SkeletonTable, Badge } from "@/components/ui";

type Variant = { id: string; name: string; unit: string; price: number | null; stock: number };
type Product = { id: string; name: string; category?: string; variants: Variant[] };

export default function AgenProdukPage() {
  const level = useClientLevel();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    const agentId = level === "reseller" ? DEMO_RESELLER_ID : DEMO_AGENT_ID;
    api.get<{ products: Product[] }>(`/produk?role=agent&agentId=${agentId}&level=${level}`).then((r) => { if (r.data) setProducts(r.data.products); setLoading(false); });
  }, [level]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Katalog & Harga"
        subtitle={`Harga sudah disesuaikan untuk level ${level.replace("-", " ")} & override khusus Anda.`}
      />
      {loading ? <SkeletonTable rows={4} /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-slate-300"><Package size={36} /></div>
              <div className="p-5">
                <div className="flex items-center justify-between"><h3 className="font-display text-lg font-bold text-slate-900">{p.name}</h3>{p.category && <Badge tone="neutral">{p.category}</Badge>}</div>
                <div className="mt-3 space-y-2">
                  {p.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <span className="font-semibold text-slate-600">{v.name}</span>
                      <span className="font-black text-brand-700">{v.price != null ? formatIdr(v.price) : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
