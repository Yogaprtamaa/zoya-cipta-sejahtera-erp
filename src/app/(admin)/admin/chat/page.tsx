"use client";

import { useEffect, useState, useCallback } from "react";
import { Send, Bot, UserCog } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button, Badge } from "@/components/ui";

type Msg = { id: string; channelId: string; senderType: string; body: string };

export default function AdminChatPage() {
  const [channels, setChannels] = useState<string[]>([]);
  const [active, setActive] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [escalated, setEscalated] = useState(false);

  const loadChannels = useCallback(() => api.get<{ channels: string[] }>("/chat").then((r) => { if (r.data) { setChannels(r.data.channels); if (!active && r.data.channels[0]) setActive(r.data.channels[0]); } }), [active]);
  const loadMsgs = useCallback(() => { if (active) api.get<{ messages: Msg[] }>(`/chat?channelId=${active}`).then((r) => r.data && setMessages(r.data.messages)); }, [active]);
  useEffect(() => { loadChannels(); }, [loadChannels]);
  useEffect(() => { loadMsgs(); }, [loadMsgs]);

  const send = async () => { if (!text.trim()) return; await api.post("/chat", { channelId: active, body: text, senderType: "admin", escalated: true }); setText(""); loadMsgs(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Live Chat" subtitle="Percakapan customer & agen dengan eskalasi dari bot ke CS." />
      <Card className="grid h-[560px] grid-cols-1 overflow-hidden md:grid-cols-3">
        <div className="border-r border-slate-100">
          <div className="border-b border-slate-100 p-4 text-xs font-black uppercase tracking-wider text-slate-400">Percakapan</div>
          <div className="divide-y divide-slate-50">{channels.map((c) => (
            <button key={c} onClick={() => setActive(c)} className={`flex w-full items-center gap-3 p-4 text-left transition-colors cursor-pointer ${active === c ? "bg-brand-50/60" : "hover:bg-slate-50"}`}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">{c.replace("chan-", "").charAt(0).toUpperCase()}</div><span className="text-sm font-bold text-slate-700">{c.replace("chan-", "")}</span></button>
          ))}</div>
        </div>
        <div className="flex flex-col md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-4"><span className="text-sm font-black text-slate-900">{active.replace("chan-", "")}</span><Button size="sm" variant={escalated ? "dark" : "secondary"} onClick={() => setEscalated((e) => !e)}>{escalated ? <><UserCog size={15} /> Ditangani CS</> : <><Bot size={15} /> Ambil Alih</>}</Button></div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-5">{messages.map((m) => { const admin = m.senderType === "admin"; return (<div key={m.id} className={`flex ${admin ? "justify-end" : "justify-start"}`}><div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-medium ${admin ? "rounded-tr-sm bg-brand-600 text-white" : "rounded-tl-sm bg-white text-slate-700 shadow-soft"}`}>{m.senderType === "bot" && <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400"><Bot size={11} /> Bot</span>}{m.body}</div></div>); })}{messages.length === 0 && <div className="py-10 text-center text-sm text-slate-300">Pilih percakapan</div>}</div>
          <div className="flex items-center gap-2 border-t border-slate-100 p-4"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium focus:border-brand-400 focus:bg-white focus:outline-none" placeholder="Balas sebagai CS..." /><Button size="sm" onClick={send} aria-label="Kirim"><Send size={15} /></Button></div>
        </div>
      </Card>
    </div>
  );
}
