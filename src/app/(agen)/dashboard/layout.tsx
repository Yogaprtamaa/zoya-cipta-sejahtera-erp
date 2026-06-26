"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { agenNav, resellerNav } from "@/components/layout/nav-config";
import { DEMO_AGENT_NAME, DEMO_RESELLER_NAME } from "@/lib/demo";
import { useClientLevel } from "@/lib/use-client-level";

export default function AgenLayout({ children }: { children: React.ReactNode }) {
  const isReseller = useClientLevel() === "reseller";
  return (
    <DashboardShell
      workspace={isReseller ? "Reseller" : "Agen"}
      userName={isReseller ? DEMO_RESELLER_NAME : DEMO_AGENT_NAME}
      sections={isReseller ? resellerNav : agenNav}
    >
      {children}
    </DashboardShell>
  );
}
