"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Lock, ArrowRight, Tag, Layers } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, SkeletonTable, Badge } from "@/components/ui";

type Variant = { id: string; name: string; unit: string; price: number | null; stock: number };
type Product = { id: string; name: string; category?: string; isPrivate: boolean; variants: Variant[] };

const categoryGradients: Record<string, string> = {
  Madu: "from-amber-100 to-yellow-50",
  Herbal: "from-emerald-100 to-teal-50",
  Kosmetik: "from-pink-100 to-rose-50",
  Maklon: "from-brand-100 to-indigo-50",
};

const categoryTextColors: Record<string, string> = {
  Madu: "text-amber-600",
  Herbal: "text-emerald-600",
  Kosmetik: "text-pink-600",
  Maklon: "text-brand-600",
};

const productDescriptions: Record<string, string> = {
  "prod-madu": "Madu murni dari peternak lokal pilihan, tersedia dalam kemasan praktis 100ml hingga 500ml. Cocok untuk konsumsi harian keluarga maupun sebagai oleh-oleh.",
  "prod-sari": "Minuman sari herbal berbasis rempah pilihan Indonesia. Formulasi khusus untuk menjaga daya tahan tubuh dan vitalitas.",
  "prod-maklon-sn": "Produk private label eksklusif hasil kerjasama maklon. Tersedia hanya untuk mitra resmi Zoya Cipta.",
};

const productHighlights: Record<string, string[]> = {
  "prod-madu": ["100% Murni Tanpa Campuran", "Tersedia 3 Ukuran", "Kemasan Food-Grade"],
  "prod-sari": ["Formula Herbal Premium", "Diproduksi di BPOM", "Rasa Enak & Natural"],
  "prod-maklon-sn": ["Brand Eksklusif Mitra", "SKU Privat Terdaftar", "Harga Kompetitif"],
};

export default function ProdukPublikPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    api.get<{ products: Product[] }>("/produk?role=guest").then((res) => {
      if (res.data) setProducts(res.data.products);
      setLoading(false);
    });
  }, []);

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "Semua" ? products : products.filter((p) => p.category === activeCategory);
  const publicProducts = filtered.filter((p) => !p.isPrivate);
  const privateProducts = filtered.filter((p) => p.isPrivate);

  return (
    <main>
      {/* Header */}
      <section className="mesh-bg border-b border-slate-200/60 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
            Katalog
          </span>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Produk Unggulan Zoya
          </h1>
          <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-slate-500">
            Temukan lini produk herbal & kosmetik berkualitas dari PT Zoya Cipta Sejahtera. Harga mitra khusus tampil setelah Anda login sebagai agen.
          </p>

          {/* Category filter */}
          {!loading && categories.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-brand-600 text-white shadow-brand"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="mt-2">
              <SkeletonTable rows={3} />
            </div>
          ) : (
            <>
              {/* Public Products */}
              {publicProducts.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-2">
                    <Layers size={16} className="text-slate-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Produk Reguler
                    </h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {publicProducts.map((p) => {
                      const grad = categoryGradients[p.category ?? ""] ?? "from-slate-100 to-slate-50";
                      const textColor = categoryTextColors[p.category ?? ""] ?? "text-slate-400";
                      const desc = productDescriptions[p.id] ?? "Produk herbal berkualitas dari Zoya Cipta.";
                      const highlights = productHighlights[p.id] ?? [];
                      return (
                        <Card key={p.id} className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                          <div className={`flex aspect-video items-center justify-center bg-gradient-to-br ${grad}`}>
                            <Package size={48} className={`${textColor} opacity-40`} />
                          </div>
                          <div className="p-6">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-display text-lg font-bold text-slate-900">{p.name}</h3>
                              {p.category && (
                                <Badge tone="neutral">{p.category}</Badge>
                              )}
                            </div>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{desc}</p>

                            {highlights.length > 0 && (
                              <ul className="mt-4 space-y-1.5">
                                {highlights.map((h) => (
                                  <li key={h} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="mt-5 space-y-2">
                              {p.variants.map((v) => (
                                <div
                                  key={v.id}
                                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm"
                                >
                                  <div>
                                    <span className="font-semibold text-slate-700">{v.name}</span>
                                    <span className="ml-2 text-xs text-slate-400">/{v.unit}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-bold text-slate-400">
                                    <Lock size={11} />
                                    Login untuk harga
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Private Products */}
              {privateProducts.length > 0 && (
                <div className="mt-12">
                  <div className="mb-6 flex items-center gap-2">
                    <Tag size={16} className="text-brand-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Produk Private Label (Maklon)
                    </h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {privateProducts.map((p) => (
                      <Card key={p.id} className="overflow-hidden border-dashed opacity-80">
                        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-50">
                          <Lock size={36} className="text-brand-200" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-slate-700">{p.name}</h3>
                            <Badge tone="info">Privat</Badge>
                          </div>
                          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">
                            Produk private label eksklusif. Detail dan harga hanya tersedia untuk mitra maklon yang bersangkutan.
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-black tracking-tight">Ingin akses harga mitra?</h3>
                <p className="mt-2 max-w-md text-sm font-medium text-slate-400">
                  Daftar sebagai agen resmi dan dapatkan harga tier eksklusif, stok konsinyasi, dan dukungan langsung dari tim Zoya.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-400"
                >
                  Daftar Agen <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
