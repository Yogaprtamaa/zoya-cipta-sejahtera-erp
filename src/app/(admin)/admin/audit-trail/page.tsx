"use client";

import { useEffect, useState, useMemo } from "react";
import { ScrollText, Filter } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Badge, SkeletonTable } from "@/components/ui";

type Log = {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
};

type Category = "all" | "finance" | "approval" | "maklon" | "user_mgmt" | "inventory";

const categories: { value: Category; label: string }[] = [
  { value: "all",       label: "Semua" },
  { value: "finance",   label: "Finance" },
  { value: "approval",  label: "Persetujuan" },
  { value: "maklon",    label: "Maklon" },
  { value: "user_mgmt", label: "Pengguna" },
  { value: "inventory", label: "Inventory" },
];

const categoryMatch: Record<Category, (l: Log) => boolean> = {
  all:       () => true,
  finance:   (l) => ["billing", "setoran"].includes(l.entity) || ["verify_setoran", "reject_setoran", "koreksi_tagihan"].includes(l.action),
  approval:  (l) => l.action.includes("approve") || l.action.includes("reject") || l.entity === "purchase_order" || l.entity === "return",
  maklon:    (l) => l.entity.includes("maklon") || l.action.includes("consultation"),
  user_mgmt: (l) => l.entity === "user" || l.action.includes("user"),
  inventory: (l) => l.entity === "inventory" || l.action.includes("stock"),
};

const actionTone = (action: string): "success" | "danger" | "warning" | "info" | "neutral" => {
  if (action.includes("approve") || action.includes("verify"))  return "success";
  if (action.includes("reject"))                                return "danger";
  if (action.includes("koreksi") || action.includes("update"))  return "warning";
  if (action.includes("create") || action.includes("register")) return "info";
  return "neutral";
};

export default function AdminAuditPage() {
  const [logs, setLogs]       = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]         = useState<Category>("all");

  useEffect(() => {
    api.get<{ logs: Log[] }>("/audit-trail").then((r) => {
      if (r.data) setLogs(r.data.logs);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => logs.filter(categoryMatch[cat]), [logs, cat]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail"
        subtitle="Jejak append-only seluruh aksi sensitif — finance, approval, koreksi tagihan, maklon, stok."
      />

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-slate-400 shrink-0" />
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCat(c.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              cat === c.value
                ? "bg-brand-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            {c.label}
            {c.value !== "all" && <span className="ml-1 opacity-60">({logs.filter(categoryMatch[c.value]).length})</span>}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm font-semibold text-slate-400">Tidak ada log untuk kategori ini.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((l) => (
              <div key={l.id} className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <ScrollText size={14} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      <span className="font-black text-slate-900">{l.action}</span>
                      <span className="mx-1.5 text-slate-300">·</span>
                      <span className="font-mono text-xs text-slate-500">{l.entity}/{l.entityId}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                      oleh <span className="font-bold text-slate-600">{l.actorId}</span>
                      {" · "}
                      {new Date(l.timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 mt-0.5"><Badge tone={actionTone(l.action)}>{l.action}</Badge></span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="text-center text-xs font-medium text-slate-400">
        {filtered.length} log ditampilkan · append-only, tidak dapat dihapus
      </p>
    </div>
  );
}
