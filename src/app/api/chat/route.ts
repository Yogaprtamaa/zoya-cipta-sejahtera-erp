import { db, uid } from "@/lib/mock-db";
import { ok, fail, body } from "@/lib/api-helpers";
import type { ChatChannel, ChatChannelType, ChatSender } from "@/types";

const agentName = (id?: string | null) => (id ? db.agents.find((a) => a.id === id)?.name ?? "Agen" : "Agen");
const clientName = (id?: string | null) => (id ? db.maklonLeads.find((l) => l.clientId === id)?.clientName ?? "Klien Maklon" : "Klien Maklon");

/** Pihak yang memulai (memicu balasan bot) untuk tiap tipe channel. */
const initiator: Record<ChatChannelType, ChatSender | null> = {
  customer_cs: "customer",
  agen_zoya: "agent",
  reseller_agen: null, // internal, tidak ada bot
  reseller_cs: "reseller",
  maklon_cs: "klien_maklon",
};

/** Label counterpart dari sudut pandang viewer. */
function view(ch: ChatChannel, viewer: string): { label: string; sublabel: string } {
  switch (ch.type) {
    case "customer_cs":
      return { label: ch.customerName ?? "Customer", sublabel: "Customer · Web" };
    case "agen_zoya":
      return viewer === "admin"
        ? { label: agentName(ch.agentId), sublabel: "Agen · Butuh support" }
        : { label: "Tim Zoya", sublabel: "Customer Service" };
    case "reseller_agen":
      if (viewer === "reseller") return { label: agentName(ch.agentId), sublabel: "Agen Pembina" };
      if (viewer === "agent") return { label: agentName(ch.resellerId), sublabel: "Reseller Binaan" };
      return { label: `${agentName(ch.resellerId)} ↔ ${agentName(ch.agentId)}`, sublabel: "Reseller · Internal" };
    case "reseller_cs":
      return viewer === "admin"
        ? { label: agentName(ch.resellerId), sublabel: "Reseller · Butuh support" }
        : { label: "Zoya CS", sublabel: "Customer Service" };
    case "maklon_cs":
      return viewer === "maklon"
        ? { label: "Tim Maklon", sublabel: "Customer Service" }
        : { label: clientName(ch.clientId), sublabel: "Klien Maklon" };
  }
}

/** Filter channel yang boleh dilihat tiap viewer. */
function visibleTo(ch: ChatChannel, viewer: string, ids: { agentId?: string; resellerId?: string; clientId?: string }): boolean {
  switch (viewer) {
    case "admin":
      return true; // super admin memantau semua
    case "agent":
      return (ch.type === "agen_zoya" && ch.agentId === ids.agentId) || (ch.type === "reseller_agen" && ch.agentId === ids.agentId);
    case "reseller":
      return (ch.type === "reseller_agen" && ch.resellerId === ids.resellerId) || (ch.type === "reseller_cs" && ch.resellerId === ids.resellerId);
    case "maklon":
      return ch.type === "maklon_cs" && ch.clientId === ids.clientId;
    case "customer":
      return ch.type === "customer_cs";
    default:
      return false;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId");

  if (channelId) {
    const messages = db.chat.filter((m) => m.channelId === channelId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const channel = db.chatChannels.find((c) => c.id === channelId) ?? null;
    return ok({ messages, channel });
  }

  const viewer = url.searchParams.get("for") ?? "admin";
  const ids = {
    agentId: url.searchParams.get("agentId") ?? undefined,
    resellerId: url.searchParams.get("resellerId") ?? undefined,
    clientId: url.searchParams.get("clientId") ?? undefined,
  };

  const channels = db.chatChannels
    .filter((ch) => visibleTo(ch, viewer, ids))
    .map((ch) => {
      const msgs = db.chat.filter((m) => m.channelId === ch.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const last = msgs[msgs.length - 1];
      const needsReply = !!last && last.senderType !== "admin" && last.senderType !== "bot";
      return {
        id: ch.id,
        type: ch.type,
        escalated: ch.escalated,
        ...view(ch, viewer),
        lastMessage: last?.body ?? null,
        lastAt: last?.createdAt ?? null,
        needsReply,
      };
    })
    .sort((a, b) => (b.lastAt ?? "").localeCompare(a.lastAt ?? ""));

  return ok({ channels });
}

export async function POST(req: Request) {
  const input = await body<{ channelId: string; body: string; senderType?: ChatSender; attachmentUrl?: string | null }>(req);
  if (!input.channelId || !input.body?.trim()) return fail("Pesan tidak boleh kosong", "VALIDATION_ERROR");

  const channel = db.chatChannels.find((c) => c.id === input.channelId);
  const sender: ChatSender = input.senderType ?? "customer";
  const msg = { id: uid("msg"), channelId: input.channelId, senderType: sender, body: input.body.trim(), attachmentUrl: input.attachmentUrl ?? null, createdAt: new Date().toISOString() };
  db.chat.push(msg);

  // Bot membalas hanya untuk channel "ke CS" yang belum diambil alih admin,
  // dan hanya ketika pihak pemulai yang mengirim.
  let botReply = null;
  if (channel && !channel.escalated && initiator[channel.type] && sender === initiator[channel.type]) {
    botReply = { id: uid("msg"), channelId: channel.id, senderType: "bot" as const, body: "Terima kasih! Pesan Anda kami terima. Tim kami akan membantu segera.", attachmentUrl: null, createdAt: new Date().toISOString() };
    db.chat.push(botReply);
  }
  return ok({ message: msg, botReply });
}

/** Admin mengambil alih / mengembalikan ke bot. */
export async function PATCH(req: Request) {
  const input = await body<{ channelId: string; escalated: boolean }>(req);
  const channel = db.chatChannels.find((c) => c.id === input.channelId);
  if (!channel) return fail("Channel tidak ditemukan", "NOT_FOUND", 404);
  channel.escalated = input.escalated;
  return ok({ channel });
}
