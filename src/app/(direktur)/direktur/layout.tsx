"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { direkturNav } from "@/components/layout/nav-config";

export default function DirekturLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell workspace="Direktur" userName="Direktur Utama" sections={direkturNav}>{children}</DashboardShell>;
}
