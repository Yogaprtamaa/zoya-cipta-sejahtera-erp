"use client";

import { Bot } from "lucide-react";

export type ChannelView = {
  id: string;
  type: string;
  label: string;
  sublabel: string;
  escalated: boolean;
  lastMessage: string | null;
  lastAt: string | null;
  needsReply: boolean;
};

type Props = {
  channels: ChannelView[];
  activeId: string;
  onSelect: (id: string) => void;
  /** tampilkan badge "perlu dibalas" (untuk inbox CS/agen). */
  showNeedsReply?: boolean;
};

export function ChannelList({ channels, activeId, onSelect, showNeedsReply }: Props) {
  if (channels.length === 0) {
    return <div className="px-4 py-6 text-center text-xs font-semibold text-slate-300">Tidak ada percakapan.</div>;
  }
  return (
    <div className="divide-y divide-slate-50">
      {channels.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-center gap-3 p-3.5 text-left transition-colors cursor-pointer ${active ? "bg-brand-50/60" : "hover:bg-slate-50"}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">
              {c.label.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-slate-800">{c.label}</span>
                {showNeedsReply && c.needsReply && <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" title="Perlu dibalas" />}
              </div>
              <div className="truncate text-[11px] font-medium text-slate-400">{c.lastMessage ?? c.sublabel}</div>
            </div>
            {c.escalated && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                CS
              </span>
            )}
            {!c.escalated && c.type !== "reseller_agen" && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-400">
                <Bot size={9} /> Bot
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
