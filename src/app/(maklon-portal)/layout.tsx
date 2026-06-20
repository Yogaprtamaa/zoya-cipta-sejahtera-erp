"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { maklonPortalNav } from "@/components/layout/nav-config";

export default function MaklonPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell workspace="Portal Maklon" userName="CV Natura Herbal" sections={maklonPortalNav}>
      {children}
    </DashboardShell>
  );
}
