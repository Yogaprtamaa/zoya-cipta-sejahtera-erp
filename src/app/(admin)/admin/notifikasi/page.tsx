"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Badge, SkeletonTable } from "@/components/ui";

type Ntf = { id: string; channel: string; eventType: string; payload: string; status: string; sentAt: string };

export default function AdminNotifikasiPage() {
  const [items, setItems] = useState<Ntf[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ notifications: Ntf[] }>("/notifikasi").then((r) => { if (r.data) setItems(r.data.notifications); setLoading(false); }); }, []);
  const tone = (s: string): "success" | "info" | "warning" => (s === "delivered" ? "success" : s === "sent" ? "info" : "warning");

  return (
    <div className="space-y-6">
      <PageHeader title="Notifikasi" subtitle="Log pengiriman in-app & WhatsApp (simulasi)." />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={3} /></div> : (
          <div className="divide-y divide-slate-50">{items.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400"><Bell size={16} /></span><div><div className="text-sm font-semibold text-slate-700">{n.payload}</div><div className="text-[11px] text-slate-400">{n.channel.toUpperCase()} · {n.eventType} · {n.sentAt.slice(0, 10)}</div></div></div>
              <Badge tone={tone(n.status)}>{n.status}</Badge>
            </div>
          ))}</div>
        )}
      </Card>
    </div>
  );
}
