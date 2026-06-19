"use client";

import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Badge, SkeletonTable } from "@/components/ui";

type Log = { id: string; actorId: string; action: string; entity: string; entityId: string; timestamp: string };

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ logs: Log[] }>("/audit-trail").then((r) => { if (r.data) setLogs(r.data.logs); setLoading(false); }); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Trail" subtitle="Jejak append-only seluruh aksi sensitif (finance, pricing, approval, stok)." />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={5} /></div> : (
          <div className="divide-y divide-slate-50">{logs.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400"><ScrollText size={16} /></span><div><div className="text-sm font-semibold text-slate-700">{l.action} · <span className="text-slate-400">{l.entity}/{l.entityId}</span></div><div className="text-[11px] text-slate-400">oleh {l.actorId} · {new Date(l.timestamp).toLocaleString("id-ID")}</div></div></div>
              <Badge tone="neutral">{l.actorId}</Badge>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}
