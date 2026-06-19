"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Info, Truck } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button } from "@/components/ui";

type Variant = { id: string; name: string; price: number | null };
type Product = { id: string; name: string; variants: Variant[] };

export default function OrderBaruPage() {
  const router = useRouter();
  const [variants, setVariants] = useState<{ id: string; label: string; price: number }[]>([]);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(50);
  const [threshold, setThreshold] = useState(12750000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<{ products: Product[] }>(`/produk?role=agent&agentId=${DEMO_AGENT_ID}&level=agen`).then((r) => {
      if (r.data) {
        const flat = r.data.products
          .flatMap((p) =>
            p.variants.filter((v) => v.price != null).map((v) => ({
              id: v.id,
              label: `${p.name} — ${v.name}`,
              price: v.price!,
            }))
          );
        setVariants(flat);
        setVariantId(flat[0]?.id ?? "");
      }
    });
    api.get<{ settings: { director_threshold: number } }>("/settings").then(
      (r) => r.data && setThreshold(r.data.settings.director_threshold)
    );
  }, []);

  const price = variants.find((v) => v.id === variantId)?.price ?? 0;
  const total = price * qty;
  const large = total >= threshold;

  const submit = async () => {
    setLoading(true);
    await api.post("/order", { agentId: DEMO_AGENT_ID, items: [{ variantId, qty }] });
    setLoading(false);
    router.push("/dashboard/order");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <PageHeader
        title="Ajukan Permintaan Stok"
        subtitle="Stok dikirim Zoya sebagai titipan — tidak ada pembayaran di muka."
      />

      {/* Konsinyasi info */}
      <Card className="border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex items-start gap-3">
          <Truck size={18} className="mt-0.5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Tidak ada DP atau pembayaran di muka</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-700">
              Stok yang Anda minta akan dikirim oleh Zoya sebagai titipan konsinyasi. Kewajiban bayar baru
              terbentuk setelah Anda melaporkan penjualan di menu <strong>Laporan Penjualan</strong>.
              Sisa stok yang belum terjual tetap menjadi milik Zoya.
            </p>
          </div>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        {/* Produk */}
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Produk</span>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-semibold text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          {price > 0 && (
            <p className="text-xs font-semibold text-slate-400">
              Harga kewajiban per pcs: <span className="text-slate-700">{formatIdr(price)}</span> (berlaku saat penjualan dilaporkan)
            </p>
          )}
        </label>

        {/* Jumlah */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Diminta (pcs)</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none"
            />
          </label>
          <div className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nilai Stok Titipan</span>
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3.5">
              <div className="font-bold text-slate-700">{formatIdr(total)}</div>
              <div className="mt-0.5 text-[10px] font-semibold text-slate-400">
                Bukan tagihan — hanya estimasi nilai konsinyasi
              </div>
            </div>
          </div>
        </div>

        {/* Escalation warning */}
        {large && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              Nilai stok ≥ threshold ({formatIdr(threshold)}). Permintaan ini akan otomatis dieskalasi ke Direktur untuk persetujuan tambahan.
            </div>
          </div>
        )}

        {/* Note */}
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="text-xs font-medium leading-relaxed text-slate-500">
            Setelah permintaan disetujui dan stok dikirim, produk akan muncul di <strong>Stok Konsinyasi</strong>.
            Laporkan penjualan setiap kali ada produk terjual.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
          <Button variant="secondary" onClick={() => router.back()}>Batal</Button>
          <Button loading={loading} disabled={qty <= 0 || !variantId} onClick={submit}>
            Ajukan Permintaan Stok
          </Button>
        </div>
      </Card>
    </div>
  );
}
