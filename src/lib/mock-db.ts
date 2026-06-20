import type {
  Agent, Region, Product, Variant, PriceTier, PriceOverride, InventoryItem,
  PurchaseOrder, Sale, MonthlyBilling, Return, MaklonLead, ChatMessage, Notification, AuditLog, Settings, InternalUser
} from "@/types";

/**
 * In-memory mock database. Lives as a module-level singleton on globalThis so
 * state stays consistent across Route Handler requests within one server session
 * (and survives Next.js dev HMR). Swap this layer for a real DB in production —
 * the API contract above it does not change.
 */
export type Db = {
  agents: Agent[];
  regions: Region[];
  products: Product[];
  variants: Variant[];
  priceTiers: PriceTier[];
  priceOverrides: PriceOverride[];
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  sales: Sale[];
  billings: MonthlyBilling[];
  returns: Return[];
  maklonLeads: MaklonLead[];
  chat: ChatMessage[];
  notifications: Notification[];
  audit: AuditLog[];
  settings: Settings;
  internalUsers: InternalUser[];
};

function seed(): Db {
  return {
    agents: [
      { id: "agent-001", name: "Nadia Putri", level: "agen", parentId: null, regionId: "reg-bandung", status: "active", email: "nadia@zoyamitra.id", phone: "+62 812-3456-7890" },
      { id: "agent-002", name: "Toko Sehat Jaya", level: "sub-agen", parentId: "agent-001", regionId: "reg-garut", status: "active", phone: "+62 813-2222-1111" },
      { id: "agent-003", name: "Berkah Herbal", level: "reseller", parentId: null, regionId: "reg-tasik", status: "active", phone: "+62 856-9090-3030" },
      { id: "agent-004", name: "Apotek Lestari", level: "agen", parentId: null, regionId: "reg-cimahi", status: "active" },
      { id: "agent-005", name: "Raka Farma", level: "reseller", parentId: "agent-001", regionId: null, status: "active" },
      { id: "agent-006", name: "Sari Wangi Store", level: "sub-agen", parentId: "agent-004", regionId: null, status: "active" },
      { id: "agent-007", name: "Mitra Hijau", level: "reseller", parentId: "agent-003", regionId: null, status: "active" },
      { id: "agent-008", name: "Apotek Mitra", level: "agen", parentId: null, regionId: null, status: "active" },
      { id: "agent-009", name: "Toko Barokah", level: "reseller", parentId: "agent-002", regionId: null, status: "active" },
      { id: "agent-010", name: "Herbal Sumedang", level: "agen", parentId: null, regionId: "reg-sumedang", status: "pending" }
    ],
    regions: [
      { id: "reg-bandung", kabupaten: "Kab. Bandung", agentId: "agent-001", monthlyTarget: 100 },
      { id: "reg-garut", kabupaten: "Kab. Garut", agentId: "agent-002", monthlyTarget: 100 },
      { id: "reg-tasik", kabupaten: "Kab. Tasikmalaya", agentId: "agent-003", monthlyTarget: 100 },
      { id: "reg-cimahi", kabupaten: "Kota Cimahi", agentId: "agent-004", monthlyTarget: 100 },
      { id: "reg-sumedang", kabupaten: "Kab. Sumedang", agentId: null, monthlyTarget: 100 }
    ],
    products: [
      { id: "prod-madu", name: "Madu Pahit", isPrivate: false, clientId: null, category: "Madu" },
      { id: "prod-sari", name: "Sari Kurma Plus", isPrivate: false, clientId: null, category: "Suplemen" },
      { id: "prod-maklon-sn", name: "Herbal Sachet Sehat Natura", isPrivate: true, clientId: "client-sn", category: "Maklon" }
    ],
    variants: [
      { id: "var-madu-100", productId: "prod-madu", name: "100 ml", unit: "botol" },
      { id: "var-madu-250", productId: "prod-madu", name: "250 ml", unit: "botol" },
      { id: "var-sari-250", productId: "prod-sari", name: "250 ml", unit: "botol" },
      { id: "var-maklon-5g", productId: "prod-maklon-sn", name: "5 g", unit: "sachet" }
    ],
    priceTiers: [
      { variantId: "var-madu-100", level: "agen",     price:  85000 }, { variantId: "var-madu-100", level: "sub-agen", price: 100000 }, { variantId: "var-madu-100", level: "reseller", price: 135000 }, { variantId: "var-madu-100", level: "default", price: 160000 },
      { variantId: "var-madu-250", level: "agen",     price: 150000 }, { variantId: "var-madu-250", level: "sub-agen", price: 175000 }, { variantId: "var-madu-250", level: "reseller", price: 225000 }, { variantId: "var-madu-250", level: "default", price: 260000 },
      { variantId: "var-sari-250", level: "agen",     price: 120000 }, { variantId: "var-sari-250", level: "sub-agen", price: 140000 }, { variantId: "var-sari-250", level: "reseller", price: 180000 }, { variantId: "var-sari-250", level: "default", price: 210000 }
    ],
    priceOverrides: [{ variantId: "var-sari-250", agentId: "agent-001", price: 112000 }],
    inventory: [
      { id: "inv-w1", variantId: "var-madu-100", locationType: "warehouse", locationId: "wh-pusat", status: "available", qty: 1200 },
      { id: "inv-w2", variantId: "var-madu-250", locationType: "warehouse", locationId: "wh-pusat", status: "available", qty: 420 },
      { id: "inv-w3", variantId: "var-sari-250", locationType: "warehouse", locationId: "wh-pusat", status: "available", qty: 90 },
      { id: "inv-a1", variantId: "var-madu-100", locationType: "agent", locationId: "agent-001", status: "consigned", qty: 70 },
      { id: "inv-a2", variantId: "var-sari-250", locationType: "agent", locationId: "agent-001", status: "consigned", qty: 34 },
      { id: "inv-a3", variantId: "var-madu-100", locationType: "agent", locationId: "agent-003", status: "consigned", qty: 25 }
    ],
    purchaseOrders: [
      { id: "PO-2026-0039", agentId: "agent-001", items: [{ variantId: "var-madu-100", qty: 50 }, { variantId: "var-sari-250", qty: 30 }], totalValue: 9610000, status: "shipped", createdAt: "2026-06-15" },
      { id: "PO-2026-0031", agentId: "agent-003", items: [{ variantId: "var-madu-100", qty: 100 }], totalValue: 9500000, status: "approved", createdAt: "2026-06-01" },
      { id: "PO-2026-0042", agentId: "agent-002", items: [{ variantId: "var-madu-100", qty: 200 }, { variantId: "var-sari-250", qty: 80 }], totalValue: 26800000, status: "pending_approval", createdAt: "2026-06-19" }
    ],
    sales: [
      { id: "SAL-0118", agentId: "agent-001", variantId: "var-madu-100", qty: 30, date: "2026-06-18", reportedAt: "2026-06-18T10:24:00" },
      { id: "SAL-0102", agentId: "agent-001", variantId: "var-sari-250", qty: 12, date: "2026-06-12", reportedAt: "2026-06-12T14:30:00" },
      { id: "SAL-0095", agentId: "agent-003", variantId: "var-madu-100", qty: 14, date: "2026-06-08", reportedAt: "2026-06-08T09:00:00" },
      { id: "SAL-0080", agentId: "agent-001", variantId: "var-madu-100", qty: 42, date: "2026-05-20", reportedAt: "2026-05-20T11:00:00" },
      { id: "SAL-0078", agentId: "agent-002", variantId: "var-sari-250", qty: 18, date: "2026-05-14", reportedAt: "2026-05-14T16:00:00" }
    ],
    billings: [
      { id: "BIL-2026-06-a001", agentId: "agent-001", period: "2026-06", totalQty: 42, totalValue: 3894000, status: "uploaded", proofUrl: null },
      { id: "BIL-2026-05-a001", agentId: "agent-001", period: "2026-05", totalQty: 42, totalValue: 3570000, status: "paid", proofUrl: "mock://proof-mei" },
      { id: "BIL-2026-06-a003", agentId: "agent-003", period: "2026-06", totalQty: 14, totalValue: 1330000, status: "unbilled", proofUrl: null }
    ],
    returns: [
      { id: "RTN-0007", agentId: "agent-001", variantId: "var-sari-250", qty: 2, evidenceUrl: "mock://retur-foto", status: "pending", reason: "Kemasan rusak saat distribusi" }
    ],
    maklonLeads: [
      { id: "MKL-0012", clientName: "PT Sehat Natura", productType: "Minuman Herbal Sachet", targetVolume: 10000, stage: "quote", consultationStatus: "approved", contact: "Bu Rina · 0812-1000-2000", value: 185000000, clientId: "mkl-client-001" },
      { id: "MKL-0010", clientName: "Klinik Sari Ayu", productType: "Serum Wajah Herbal", targetVolume: 3000, stage: "formulation", consultationStatus: "approved", contact: "dr. Maya · 0813-3000-4000", value: 144000000 },
      { id: "MKL-0009", clientName: "Toko Barokah", productType: "Kapsul Habbatussauda", targetVolume: 8000, stage: "production", consultationStatus: "approved", contact: "Pak Hasan · 0856-5000-6000", value: 120000000 },
      { id: "MKL-0013", clientName: "CV Natura Herbal", productType: "Minuman Kesehatan / Herbal", targetVolume: 5000, stage: "consultation", consultationStatus: "pending", contact: "Ibu Sari · 0812-9999-8888", clientId: "mkl-client-002" }
    ],
    chat: [
      { id: "msg-1", channelId: "chan-nadia", senderType: "customer", body: "Stok Madu Pahit masih ada?", attachmentUrl: null, createdAt: "2026-06-19T08:30:00" },
      { id: "msg-2", channelId: "chan-nadia", senderType: "bot", body: "Halo! Stok Madu Pahit 100ml tersedia. Ada yang bisa kami bantu?", attachmentUrl: null, createdAt: "2026-06-19T08:30:05" }
    ],
    notifications: [
      { id: "ntf-1", targetId: "agent-001", channel: "whatsapp", eventType: "billing_issued", payload: "Tagihan Juni 2026 telah terbit", status: "delivered", sentAt: "2026-06-18T07:00:00" },
      { id: "ntf-2", targetId: "agent-001", channel: "inapp", eventType: "po_shipped", payload: "PO-2026-0039 telah dikirim", status: "sent", sentAt: "2026-06-15T13:00:00" }
    ],
    audit: [
      { id: "aud-1", actorId: "admin", action: "verify_payment", entity: "monthly_billing", entityId: "BIL-2026-05-a001", before: { status: "uploaded" }, after: { status: "paid" }, timestamp: "2026-06-05T09:12:00" },
      { id: "aud-2", actorId: "admin", action: "approve_po", entity: "purchase_order", entityId: "PO-2026-0039", before: { status: "pending_approval" }, after: { status: "approved" }, timestamp: "2026-06-15T11:05:00" }
    ],
    settings: {
      approval_threshold: 12750000,
      consignment_limit: 20000000,
      cutoff_date: 1,
      region_target: 100,
      min_stock: { "prod-madu": 200, "prod-sari": 100, "prod-maklon-sn": 0 },
      price_defaults: { "prod-madu": 110000, "prod-sari": 160000, "prod-maklon-sn": 0 },
      rekening: [
        { bank: "BCA", accountNumber: "1234567890", accountName: "PT Zoya Cipta Sejahtera", notes: "Transfer utama" },
        { bank: "Mandiri", accountNumber: "1100009876543", accountName: "PT Zoya Cipta Sejahtera", notes: "Alternatif" },
        { bank: "BRI", accountNumber: "0987654321001", accountName: "PT Zoya Cipta Sejahtera", notes: "Alternatif" },
      ]
    },
    internalUsers: [
      {
        id: "usr-superadmin",
        name: "Katon Wijaya",
        email: "katon@zoyacipta.id",
        internalRole: "super_admin",
        permissions: [
          "kelola_pengguna", "akses_pengaturan", "persetujuan_order_besar",
          "approve_pendaftaran_agen", "kelola_produk", "kelola_inventory",
          "verifikasi_setoran", "koreksi_tagihan", "kelola_pipeline_maklon",
          "kelola_wilayah", "lihat_laporan_eksekutif"
        ],
        isActive: true,
        createdAt: "2024-01-01"
      },
      {
        id: "usr-ops",
        name: "Dewi Anggraini",
        email: "dewi@zoyacipta.id",
        internalRole: "admin_operasional",
        permissions: [
          "approve_pendaftaran_agen", "kelola_produk", "kelola_inventory",
          "verifikasi_setoran", "kelola_pipeline_maklon", "kelola_wilayah"
        ],
        isActive: true,
        createdAt: "2024-03-15"
      },
      {
        id: "usr-approver",
        name: "Bpk. Hartono",
        email: "hartono@zoyacipta.id",
        internalRole: "approver",
        permissions: ["persetujuan_order_besar", "lihat_laporan_eksekutif"],
        isActive: true,
        createdAt: "2024-03-15"
      }
    ]
  };
}

const globalForDb = globalThis as unknown as { __zoyaDb?: Db };
export const db: Db = globalForDb.__zoyaDb ?? (globalForDb.__zoyaDb = seed());

export function resetDb() {
  globalForDb.__zoyaDb = seed();
  return globalForDb.__zoyaDb;
}

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/** Price priority: agent override → level tier → default. */
export function resolvePrice(variantId: string, agentId?: string, level: string = "agen"): number {
  if (agentId) {
    const ov = db.priceOverrides.find((o) => o.variantId === variantId && o.agentId === agentId);
    if (ov) return ov.price;
  }
  const tier = db.priceTiers.find((t) => t.variantId === variantId && t.level === level);
  if (tier) return tier.price;
  const def = db.priceTiers.find((t) => t.variantId === variantId && t.level === "default");
  return def?.price ?? 0;
}

export function logAudit(actorId: string, action: string, entity: string, entityId: string, before: unknown, after: unknown) {
  db.audit.unshift({ id: uid("aud"), actorId, action, entity, entityId, before, after, timestamp: new Date().toISOString() });
}
