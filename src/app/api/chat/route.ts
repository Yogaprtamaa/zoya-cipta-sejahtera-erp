import { db, uid } from "@/lib/mock-db";
import { ok, body } from "@/lib/api-helpers";

/** GET /api/chat?channelId= — messages for a channel. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId");
  const messages = db.chat.filter((m) => !channelId || m.channelId === channelId);
  const channels = [...new Set(db.chat.map((m) => m.channelId))];
  return ok({ messages, channels });
}

/** POST /api/chat — send message; bot auto-replies unless escalated to a human. */
export async function POST(req: Request) {
  const input = await body<{ channelId: string; body: string; senderType?: "customer" | "agent" | "admin"; escalated?: boolean }>(req);
  const msg = { id: uid("msg"), channelId: input.channelId, senderType: input.senderType ?? "customer", body: input.body, attachmentUrl: null, createdAt: new Date().toISOString() };
  db.chat.push(msg);
  let botReply = null;
  if (!input.escalated && msg.senderType === "customer") {
    botReply = { id: uid("msg"), channelId: input.channelId, senderType: "bot" as const, body: "Terima kasih! Pesan Anda kami terima. Tim kami akan membantu segera.", attachmentUrl: null, createdAt: new Date().toISOString() };
    db.chat.push(botReply);
  }
  return ok({ message: msg, botReply });
}
