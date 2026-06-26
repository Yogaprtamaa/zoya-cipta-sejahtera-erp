/**
 * Domain types — mirror of the prototype spec §3 schema.
 * These are the contract the real backend will follow (see system-architecture doc).
 */

export type Role = "guest" | "prospect" | "agent" | "klien_maklon" | "admin";
export type AgentLevel = "agen" | "reseller";
export type AccountStatus = "pending" | "active" | "rejected" | "suspended";

export type Permission =
  | "kelola_pengguna"
  | "akses_pengaturan"
  | "persetujuan_order_besar"
  | "approve_pendaftaran_agen"
  | "kelola_produk"
  | "kelola_inventory"
  | "verifikasi_setoran"
  | "koreksi_tagihan"
  | "kelola_pipeline_maklon"
  | "kelola_wilayah"
  | "lihat_laporan_eksekutif";

export type InternalUserRole = "super_admin" | "admin_operasional" | "approver";

export type InternalUser = {
  id: string;
  name: string;
  email: string;
  internalRole: InternalUserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
};

export type Region = { id: string; kabupaten: string; agentId: string | null; monthlyTarget: number };

export type Agent = {
  id: string;
  name: string;
  level: AgentLevel;
  parentId: string | null;
  regionId: string | null;
  status: AccountStatus;
  email?: string;
  phone?: string;
  createdAt?: string;
};

export type Product = { id: string; name: string; isPrivate: boolean; clientId: string | null; category?: string };
export type Variant = { id: string; productId: string; name: string; unit: string };
export type PriceTier = { variantId: string; level: AgentLevel | "default"; price: number };
export type PriceOverride = { variantId: string; agentId: string; price: number };

export type InventoryStatus = "available" | "consigned" | "sold_unbilled" | "paid";
export type InventoryItem = {
  id: string;
  variantId: string;
  locationType: "warehouse" | "agent";
  locationId: string;
  status: InventoryStatus;
  qty: number;
};

export type POStatus = "submitted" | "admin_review" | "pending_approval" | "approved" | "rejected" | "shipped";
export type PurchaseOrder = {
  id: string;
  agentId: string;
  items: { variantId: string; qty: number }[];
  totalValue: number;
  status: POStatus;
  createdAt: string;
};

export type Sale = { id: string; agentId: string; variantId: string; qty: number; date: string; reportedAt: string; proofUrl?: string | null };

/** Laporan penjualan yang disubmit reseller ke agen pembinanya (read-only monitoring). */
export type ResellerReport = {
  id: string;
  resellerId: string;   // agen ber-level reseller
  agentId: string;      // agen pembina (parent) penerima laporan
  variantId: string;
  qty: number;
  value: number;        // dihitung saat submit dari tier reseller
  date: string;         // YYYY-MM-DD
  period: string;       // YYYY-MM
  notes?: string;
  proofUrl?: string | null;
  createdAt: string;
};

export type BillingStatus = "unbilled" | "uploaded" | "verified" | "paid";
export type MonthlyBilling = {
  id: string;
  agentId: string;
  period: string;
  totalQty: number;
  totalValue: number;
  status: BillingStatus;
  proofUrl: string | null;
};

export type ReturnStatus = "pending" | "approved" | "rejected";
export type Return = { id: string; agentId: string; variantId: string; qty: number; evidenceUrl: string; status: ReturnStatus; reason?: string };

export type MaklonStage = "consultation" | "quote" | "deal_dp" | "formulation" | "production" | "qc" | "done";
export type ConsultationStatus = "pending" | "approved" | "rejected";

export type MaklonLead = {
  id: string;
  clientName: string;
  productType: string;
  targetVolume: number;
  stage: MaklonStage;
  consultationStatus: ConsultationStatus;
  contact: string;
  value?: number;
  clientId?: string;
  notes?: string;
};

export type ChatSender = "customer" | "agent" | "reseller" | "klien_maklon" | "admin" | "bot";

export type ChatMessage = {
  id: string;
  channelId: string;
  senderType: ChatSender;
  body: string;
  attachmentUrl: string | null;
  createdAt: string;
};

/**
 * A chat conversation between two parties. `type` fixes who talks to whom and
 * how routing/bot behaves:
 *  - customer_cs    : customer (web) ↔ Zoya CS (bot → admin)
 *  - agen_zoya      : agen ↔ Zoya CS (bot → admin)
 *  - reseller_agen  : reseller ↔ agen pembina (internal, no bot)
 *  - reseller_cs    : reseller ↔ Zoya CS (bot → admin)
 *  - maklon_cs      : klien maklon ↔ tim maklon/CS (bot → admin)
 */
export type ChatChannelType = "customer_cs" | "agen_zoya" | "reseller_agen" | "reseller_cs" | "maklon_cs";
export type ChatChannel = {
  id: string;
  type: ChatChannelType;
  agentId?: string | null;     // agen owner / pembina
  resellerId?: string | null;  // reseller party
  clientId?: string | null;    // klien maklon party
  customerName?: string | null;// nama customer (web)
  escalated: boolean;          // true = bot berhenti, ditangani CS/admin
};

export type Notification = {
  id: string;
  targetId: string;
  channel: "whatsapp" | "inapp";
  eventType: string;
  payload: string;
  status: "queued" | "sent" | "delivered";
  sentAt: string;
};

export type AuditLog = { id: string; actorId: string; action: string; entity: string; entityId: string; before: unknown; after: unknown; timestamp: string };

export type RekeningInfo = {
  bank: string;
  accountNumber: string;
  accountName: string;
  notes?: string;
};

export type Settings = {
  approval_threshold: number; // Rp — threshold nilai order besar yang butuh persetujuan
  consignment_limit: number; // Rp per agent
  cutoff_date: number; // day of month
  late_tolerance: number; // days — toleransi keterlambatan setoran setelah cutoff
  region_target: number; // botol/month
  min_stock: Record<string, number>; // per product id
  price_defaults: Record<string, number>; // per product id
  rekening: RekeningInfo[];
};

/** Standard API response envelope (spec §3.2 / §4). */
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: { code?: string; message: string } };
