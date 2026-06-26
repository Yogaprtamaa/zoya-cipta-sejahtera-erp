"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_CLIENT_ID } from "@/lib/demo";
import { PageHeader, Card } from "@/components/ui";
import { ChatThread } from "@/components/chat/chat-thread";
import type { ChannelView } from "@/components/chat/channel-list";

export default function MaklonChatPage() {
  const [channelId, setChannelId] = useState("");

  useEffect(() => {
    api.get<{ channels: ChannelView[] }>(`/chat?for=maklon&clientId=${DEMO_CLIENT_ID}`).then((r) => {
      if (r.data) setChannelId(r.data.channels.find((c) => c.type === "maklon_cs")?.id ?? "");
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Chat Tim Maklon" subtitle="Diskusi konsultasi, formulasi, dan progres produksi dengan tim maklon Zoya." />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
          <Info size={13} className="text-slate-400" />
          Pesan dijawab bot lebih dulu, lalu diteruskan ke <strong className="text-slate-700">tim maklon</strong> untuk penjadwalan & teknis.
        </div>
        {channelId
          ? <ChatThread channelId={channelId} mySender="klien_maklon" placeholder="Tulis pesan ke tim maklon..." className="h-[500px]" />
          : <div className="flex h-[500px] items-center justify-center text-sm text-slate-300">Memuat percakapan…</div>}
      </Card>
    </div>
  );
}
