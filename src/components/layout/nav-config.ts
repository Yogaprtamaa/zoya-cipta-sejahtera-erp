import {
  LayoutDashboard, Package, ClipboardList, ShoppingCart, Boxes, Wallet, MapPinned, Gift, Undo2,
  MessagesSquare, Users, Warehouse, BarChart3, Scale, Briefcase, Bell, ScrollText, Settings, BadgeCheck,
  FlaskConical, FileText,
  type LucideIcon
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavSection = { label?: string; items: NavItem[] };

export const agenNav: NavSection[] = [
  { items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Operasional", items: [
    { href: "/dashboard/produk", label: "Katalog & Harga", icon: Package },
    { href: "/dashboard/order", label: "Order Stok", icon: ClipboardList },
    { href: "/dashboard/penjualan", label: "Penjualan", icon: ShoppingCart },
    { href: "/dashboard/inventory", label: "Stok Saya", icon: Boxes },
    { href: "/dashboard/retur", label: "Retur", icon: Undo2 }
  ]},
  { label: "Keuangan & Wilayah", items: [
    { href: "/dashboard/finance", label: "Setoran", icon: Wallet },
    { href: "/dashboard/wilayah", label: "Wilayah", icon: MapPinned },
    { href: "/dashboard/reward", label: "Reward", icon: Gift }
  ]},
  { label: "Lainnya", items: [{ href: "/dashboard/chat", label: "Chat", icon: MessagesSquare }] }
];

export const adminNav: NavSection[] = [
  { items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Mitra & Katalog", items: [
    { href: "/admin/agen", label: "Agen & Approval", icon: Users },
    { href: "/admin/produk", label: "Produk & Harga", icon: Package },
    { href: "/admin/maklon", label: "Maklon", icon: Briefcase }
  ]},
  { label: "Rantai Pasok", items: [
    { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
    { href: "/admin/order", label: "Order / PO", icon: ClipboardList },
    { href: "/admin/penjualan", label: "Penjualan", icon: ShoppingCart },
    { href: "/admin/retur", label: "Retur", icon: Undo2 },
    { href: "/admin/rekonsiliasi", label: "Rekonsiliasi", icon: Scale }
  ]},
  { label: "Keuangan & Lainnya", items: [
    { href: "/admin/finance", label: "Finance", icon: Wallet },
    { href: "/admin/wilayah", label: "Wilayah", icon: MapPinned },
    { href: "/admin/chat", label: "Chat", icon: MessagesSquare },
    { href: "/admin/notifikasi", label: "Notifikasi", icon: Bell },
    { href: "/admin/users", label: "Kelola Pengguna", icon: Users },
    { href: "/admin/audit-trail", label: "Audit Trail", icon: ScrollText },
    { href: "/admin/settings", label: "Pengaturan", icon: Settings }
  ]}
];

export const maklonPortalNav: NavSection[] = [
  { items: [{ href: "/maklon-portal", label: "Dashboard Maklon", icon: FlaskConical }] },
  { items: [{ href: "/maklon-portal/konsultasi", label: "Ajukan Konsultasi", icon: FileText }] },
  { items: [{ href: "/maklon-portal/status", label: "Status Pipeline", icon: BadgeCheck }] },
  { items: [{ href: "/maklon-portal/laporan", label: "Monitoring", icon: BarChart3 }] }
];
