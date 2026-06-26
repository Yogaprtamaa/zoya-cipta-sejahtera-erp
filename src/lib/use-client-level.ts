"use client";

import { useEffect, useState } from "react";
import { getClientLevel, SESSION_EVENT } from "@/lib/auth-mock";

/**
 * Reactive read of the current agent level (agen | reseller) from the mock
 * session cookie. Re-syncs when the role switcher fires SESSION_EVENT, so the
 * sidebar/dashboard update instantly without a full reload.
 */
export function useClientLevel(): string {
  const [level, setLevel] = useState("agen");
  useEffect(() => {
    const sync = () => setLevel(getClientLevel());
    sync();
    window.addEventListener(SESSION_EVENT, sync);
    return () => window.removeEventListener(SESSION_EVENT, sync);
  }, []);
  return level;
}
