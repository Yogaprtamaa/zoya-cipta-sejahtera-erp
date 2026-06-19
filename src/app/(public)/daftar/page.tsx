"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api-client";
import { setSession } from "@/lib/auth-mock";
import { Card, Button } from "@/components/ui";

const perks = [
  "Wilayah distribusi eksklusif per kabupaten",
  "Stok konsinyasi tanpa modal di muka",
  "Harga tier khusus mitra agen",
  "Dashboard penjualan & stok real-time",
];

export default function DaftarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await api.post<{ agent: unknown }>("/auth/register", {
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
    setLoading(false);
    if (res.error) { setError(res.error.message); return; }
    setSession("prospect", "pending");
    router.push("/konversi");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-4xl flex-col justify-center px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Left: Benefits */}
        <div className="lg:sticky lg:top-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
            <UserPlus size={24} />
          </div>
          <h1 className="mt-5 font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Daftar Jadi Mitra Agen
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Bergabunglah dengan 200+ agen aktif yang mendistribusikan produk herbal & kosmetik Zoya di seluruh Indonesia.
          </p>

          <ul className="mt-6 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <CheckCircle2 size={16} className="shrink-0 text-brand-500" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600">Proses Setelah Daftar</div>
            <ol className="mt-3 space-y-2">
              {["Lengkapi profil & pilih wilayah", "Admin verifikasi dokumen (< 24 jam)", "Akun aktif — mulai order stok"].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-black text-brand-700">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-6 text-xs font-medium text-slate-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Masuk
            </Link>
          </p>
        </div>

        {/* Right: Form */}
        <Card className="p-7">
          <h2 className="font-display text-xl font-black tracking-tight text-slate-900">Buat Akun Baru</h2>
          <p className="mt-1 text-xs font-medium text-slate-400">Isi data diri di bawah untuk memulai pengajuan kemitraan.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field
              label="Nama Lengkap"
              placeholder="Nama sesuai KTP"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Email"
              type="email"
              placeholder="email@domain.com"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />
            <Field
              label="No. WhatsApp"
              placeholder="+62 812-xxxx-xxxx"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              required
            />
            <Field
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
            />

            {error && (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Daftar & Lanjutkan <ArrowRight size={16} />
            </Button>

            <p className="text-center text-[11px] font-medium text-slate-400">
              Dengan mendaftar, Anda menyetujui syarat & ketentuan kemitraan Zoya Cipta.
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:border-brand-400 focus:bg-white focus:outline-none"
      />
    </label>
  );
}
