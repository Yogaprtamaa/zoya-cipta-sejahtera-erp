"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { agenNav } from "@/components/layout/nav-config";
import { DEMO_AGENT_NAME } from "@/lib/demo";

export default function AgenLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell workspace="Agen" userName={DEMO_AGENT_NAME} sections={agenNav}>{children}</DashboardShell>;
}
