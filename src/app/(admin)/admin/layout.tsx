"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNav } from "@/components/layout/nav-config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell workspace="Admin" userName="Super Admin" sections={adminNav}>{children}</DashboardShell>;
}
