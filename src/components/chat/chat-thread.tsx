"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Bot } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui";
import type { ChatSender } from "@/types";

type Msg = { id: string; senderType: ChatSender; body: string; createdAt: string };

const SENDER_LABEL: Partial<Record<ChatSender, string>> = {
  bot: "Bot",
  admin: "CS Zoya",
  agent: "Agen",
  reseller: "Reseller",
  klien_maklon: "Klien",
  customer: "Customer",
};

type Props = {
  channelId: string;
  /** senderType pesan yang dikirim user ini — dipakai untuk perataan kanan. */
  mySender: ChatSender;
  placeholder?: string;
  /** read-only (mis. admin memantau chat internal reseller↔agen). */
  disabled?: boolean;
  className?: string;
  /** dipanggil setelah kirim, agar parent bisa refresh daftar channel. */
  onActivity?: () => void;
};

export function ChatThread({ channelId, mySender, placeholder = "Tulis pesan...", disabled, className = "", onActivity }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    if (!channelId) return;
    api.get<{ messages: Msg[] }>(`/chat?channelId=${channelId}`).then((r) => r.data && setMessages(r.data.messages));
  }, [channelId]);

  useEffect(() => { load(); }, [load]);
  // Polling ringan agar percakapan dua arah terasa hidup dalam demo.
  useEffect(() => {
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || disabled) return;
    setBusy(true);
    await api.post("/chat", { channelId, body: text, senderType: mySender });
    setText("");
    setBusy(false);
    load();
    onActivity?.();
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-5">
        {messages.length === 0 && <div className="py-10 text-center text-sm font-semibold text-slate-300">Belum ada pesan.</div>}
        {messages.map((m) => {
          const mine = m.senderType === mySender;
          const label = !mine ? SENDER_LABEL[m.senderType] : null;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-medium ${mine ? "rounded-tr-sm bg-brand-600 text-white" : "rounded-tl-sm bg-white text-slate-700 shadow-soft"}`}>
                {label && (
                  <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {m.senderType === "bot" && <Bot size={11} />} {label}
                  </span>
                )}
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={disabled}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium focus:border-brand-400 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          placeholder={disabled ? "Hanya pemantauan — tidak bisa membalas" : placeholder}
        />
        <Button size="sm" loading={busy} disabled={disabled || !text.trim()} onClick={send} aria-label="Kirim"><Send size={15} /></Button>
      </div>
    </div>
  );
}
