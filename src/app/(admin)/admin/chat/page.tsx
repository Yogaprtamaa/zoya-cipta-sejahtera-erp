"use client";

import { useEffect, useState, useCallback } from "react";
import { Bot, UserCog, Eye } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { ChatThread } from "@/components/chat/chat-thread";
import { ChannelList, type ChannelView } from "@/components/chat/channel-list";

const GROUPS: { type: string; label: string }[] = [
  { type: "customer_cs", label: "Customer (Web)" },
  { type: "agen_zoya", label: "Agen → Support" },
  { type: "reseller_cs", label: "Reseller → Support" },
  { type: "maklon_cs", label: "Klien Maklon" },
  { type: "reseller_agen", label: "Reseller ↔ Agen (pemantauan)" },
];

export default function AdminChatPage() {
  const [channels, setChannels] = useState<ChannelView[]>([]);
  const [active, setActive] = useState("");

  const load = useCallback(() => {
    api.get<{ channels: ChannelView[] }>("/chat?for=admin").then((r) => {
      if (r.data) {
        setChannels(r.data.channels);
        setActive((cur) => cur || r.data!.channels[0]?.id || "");
      }
    });
  }, []);
  useEffect(() => { load(); }, [load]);
  // refresh daftar berkala agar badge "perlu dibalas" & status bot ikut update
  useEffect(() => { const t = setInterval(load, 4000); return () => clearInterval(t); }, [load]);

  const activeCh = channels.find((c) => c.id === active);
  const isMonitorOnly = activeCh?.type === "reseller_agen";

  const toggleEscalation = async () => {
    if (!activeCh) return;
    await api.patch("/chat", { channelId: activeCh.id, escalated: !activeCh.escalated });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Live Chat" subtitle="Pusat percakapan semua role — eskalasi bot ke CS & pemantauan chat internal." />
      <Card className="grid h-[600px] grid-cols-1 overflow-hidden md:grid-cols-3">
        <div className="overflow-y-auto border-r border-slate-100">
          {GROUPS.map((g) => {
            const items = channels.filter((c) => c.type === g.type);
            if (items.length === 0) return null;
            return (
              <div key={g.type}>
                <div className="px-4 pb-1 pt-4 text-[10px] font-black uppercase tracking-wider text-slate-300">{g.label}</div>
                <ChannelList channels={items} activeId={active} onSelect={setActive} showNeedsReply={g.type !== "reseller_agen"} />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col md:col-span-2">
          {activeCh ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-black text-slate-900">{activeCh.label}</span>
                    {isMonitorOnly && <Badge tone="neutral"><Eye size={11} /> Pantau</Badge>}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">{activeCh.sublabel}</div>
                </div>
                {!isMonitorOnly && (
                  <Button size="sm" variant={activeCh.escalated ? "dark" : "secondary"} onClick={toggleEscalation}>
                    {activeCh.escalated ? <><UserCog size={15} /> Ditangani CS</> : <><Bot size={15} /> Ambil Alih</>}
                  </Button>
                )}
              </div>
              <ChatThread
                channelId={active}
                mySender="admin"
                placeholder="Balas sebagai CS Zoya..."
                disabled={isMonitorOnly}
                className="flex-1"
                onActivity={load}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-300">Pilih percakapan</div>
          )}
        </div>
      </Card>
    </div>
  );
}
