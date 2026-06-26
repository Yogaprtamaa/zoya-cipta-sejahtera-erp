"use client";

import { useEffect, useState, useCallback } from "react";
import { Store, Headset, Info } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID, DEMO_RESELLER_ID } from "@/lib/demo";
import { useClientLevel } from "@/lib/use-client-level";
import { PageHeader, Card } from "@/components/ui";
import { ChatThread } from "@/components/chat/chat-thread";
import { ChannelList, type ChannelView } from "@/components/chat/channel-list";

export default function DashboardChatPage() {
  const isReseller = useClientLevel() === "reseller";
  return isReseller ? <ResellerChat /> : <AgenChat />;
}

/* ----------------------------- RESELLER ----------------------------- */
// Reseller bisa memilih: ngobrol ke agen pembina, atau ke Zoya CS.
function ResellerChat() {
  const [channels, setChannels] = useState<ChannelView[]>([]);
  const [active, setActive] = useState("");

  const load = useCallback(() => {
    api.get<{ channels: ChannelView[] }>(`/chat?for=reseller&resellerId=${DEMO_RESELLER_ID}`).then((r) => {
      if (r.data) {
        setChannels(r.data.channels);
        setActive((cur) => cur || r.data!.channels.find((c) => c.type === "reseller_agen")?.id || r.data!.channels[0]?.id || "");
      }
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const pembina = channels.find((c) => c.type === "reseller_agen");
  const cs = channels.find((c) => c.type === "reseller_cs");
  const activeCh = channels.find((c) => c.id === active);

  const Tab = ({ ch, icon, title }: { ch?: ChannelView; icon: React.ReactNode; title: string }) =>
    ch ? (
      <button
        onClick={() => setActive(ch.id)}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${active === ch.id ? "bg-brand-600 text-white shadow-brand" : "text-slate-500 hover:bg-slate-100"}`}
      >
        {icon} {title}
      </button>
    ) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Chat" subtitle="Hubungi agen pembina untuk stok & operasional, atau Zoya CS untuk bantuan umum." />
      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1.5">
        <Tab ch={pembina} icon={<Store size={15} />} title="Agen Pembina" />
        <Tab ch={cs} icon={<Headset size={15} />} title="Zoya CS" />
      </div>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
          <Info size={13} className="text-slate-400" />
          {activeCh?.type === "reseller_agen"
            ? <>Percakapan dengan agen pembina Anda — <strong className="text-slate-700">{activeCh?.label}</strong>. Bersifat internal.</>
            : <>Percakapan dengan <strong className="text-slate-700">Zoya CS</strong> (bot → tim support).</>}
        </div>
        {active && <ChatThread channelId={active} mySender="reseller" className="h-[480px]" onActivity={load} />}
      </Card>
    </div>
  );
}

/* ------------------------------- AGEN ------------------------------- */
// Agen punya dua arah: ke atas (Zoya CS) dan ke bawah (reseller binaan).
function AgenChat() {
  const [channels, setChannels] = useState<ChannelView[]>([]);
  const [active, setActive] = useState("");

  const load = useCallback(() => {
    api.get<{ channels: ChannelView[] }>(`/chat?for=agent&agentId=${DEMO_AGENT_ID}`).then((r) => {
      if (r.data) {
        setChannels(r.data.channels);
        setActive((cur) => cur || r.data!.channels.find((c) => c.type === "agen_zoya")?.id || r.data!.channels[0]?.id || "");
      }
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const zoya = channels.filter((c) => c.type === "agen_zoya");
  const resellers = channels.filter((c) => c.type === "reseller_agen");
  const activeCh = channels.find((c) => c.id === active);

  return (
    <div className="space-y-6">
      <PageHeader title="Chat" subtitle="Support dari Zoya & percakapan dengan reseller binaan Anda." />
      <Card className="grid h-[560px] grid-cols-1 overflow-hidden md:grid-cols-3">
        <div className="overflow-y-auto border-r border-slate-100">
          <div className="px-4 pb-1 pt-4 text-[10px] font-black uppercase tracking-wider text-slate-300">Tim Zoya</div>
          <ChannelList channels={zoya} activeId={active} onSelect={setActive} />
          <div className="px-4 pb-1 pt-4 text-[10px] font-black uppercase tracking-wider text-slate-300">Reseller Binaan</div>
          <ChannelList channels={resellers} activeId={active} onSelect={setActive} showNeedsReply />
        </div>
        <div className="flex flex-col md:col-span-2">
          {activeCh ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div>
                  <div className="text-sm font-black text-slate-900">{activeCh.label}</div>
                  <div className="text-[11px] font-semibold text-slate-400">{activeCh.sublabel}</div>
                </div>
              </div>
              <ChatThread channelId={active} mySender="agent" className="flex-1" onActivity={load} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-300">Pilih percakapan</div>
          )}
        </div>
      </Card>
    </div>
  );
}
