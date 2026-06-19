"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button } from "@/components/ui";

type Msg = { id: string; senderType: string; body: string; createdAt: string };
const CHANNEL = "chan-nadia";

export default function AgenChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = () => api.get<{ messages: Msg[] }>(`/chat?channelId=${CHANNEL}`).then((r) => r.data && setMessages(r.data.messages));
  useEffect(() => { load(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setBusy(true);
    await api.post("/chat", { channelId: CHANNEL, body: text, senderType: "agent" });
    setText(""); setBusy(false); load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Chat" subtitle="Percakapan dengan tim Zoya (bot + CS)." />
      <Card className="flex h-[540px] flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-5">
          {messages.map((m) => {
            const mine = m.senderType === "agent";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-medium ${mine ? "rounded-tr-sm bg-brand-600 text-white" : "rounded-tl-sm bg-white text-slate-700 shadow-soft"}`}>
                  {m.senderType === "bot" && <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"><Bot size={11} /> Bot</span>}
                  {m.body}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 p-4">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium focus:border-brand-400 focus:bg-white focus:outline-none" placeholder="Tulis pesan..." />
          <Button size="sm" loading={busy} onClick={send} aria-label="Kirim"><Send size={15} /></Button>
        </div>
      </Card>
    </div>
  );
}
