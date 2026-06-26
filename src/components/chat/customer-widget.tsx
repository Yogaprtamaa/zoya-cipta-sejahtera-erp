"use client";

import { useState } from "react";
import { MessageCircle, X, Headset } from "lucide-react";
import { DEMO_CUSTOMER_CHANNEL } from "@/lib/demo";
import { ChatThread } from "@/components/chat/chat-thread";

/** Widget chat customer di website publik — bot dulu, lalu eskalasi ke CS Zoya. */
export function CustomerChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[460px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft-lg animate-slide-in-right">
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><Headset size={18} /></div>
            <div className="flex-1">
              <div className="text-sm font-black">Zoya Customer Care</div>
              <div className="text-[11px] font-semibold text-white/70">Biasanya membalas dalam beberapa menit</div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Tutup chat"><X size={18} /></button>
          </div>
          <ChatThread channelId={DEMO_CUSTOMER_CHANNEL} mySender="customer" placeholder="Tanya stok, harga, atau agen terdekat..." className="flex-1" />
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-brand transition-transform hover:scale-105"
        aria-label={open ? "Tutup chat" : "Buka chat"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
