"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function TopLoader() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    clear();
    setVisible(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(25), 50);
    const t2 = setTimeout(() => setWidth(60), 200);
    const t3 = setTimeout(() => setWidth(85), 500);
    const t4 = setTimeout(() => setWidth(100), 800);
    const t5 = setTimeout(() => setVisible(false), 1100);
    timers.current = [t1, t2, t3, t4, t5];

    return clear;
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-0.5 bg-brand-500 transition-all duration-300 ease-out will-change-transform"
      style={{ width: `${width}%` }}
    />
  );
}
