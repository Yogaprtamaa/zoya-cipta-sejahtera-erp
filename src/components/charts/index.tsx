"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie, LabelList, type TooltipProps,
} from "recharts";

const BRAND = "#5e39e0";
/** Single-hue brand ramp — professional dashboards rank with tonal steps, not rainbow hues. */
const RANK_FILLS = ["#5e39e0", "#7857e6", "#9277ec", "#ad9bf2", "#cabff8"];
const GRID = "#eef1f6";
const tnum: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

type Fmt = (n: number) => string;

/** Compact axis/label numbers: 1.500.000 → "1,5 jt", 12.000 → "12 rb". */
function abbr(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(a % 1e9 === 0 ? 0 : 1).replace(".", ",") + " M";
  if (a >= 1e6) return (n / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1).replace(".", ",") + " jt";
  if (a >= 1e3) return Math.round(n / 1e3) + " rb";
  return `${n}`;
}
const number = (n: number) => n.toLocaleString("id-ID");
const abbrLabel = (v: unknown) => abbr(Number(v));

/** Respect prefers-reduced-motion (skill: chart entrance animation must be optional). */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Refined tooltip: brand dot + label + tabular value. */
function ChartTooltip({ active, payload, label, fmt, unit }: TooltipProps<number, string> & { fmt?: Fmt; unit?: string }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value as number;
  const text = fmt ? fmt(v) : `${number(v)}${unit ? ` ${unit}` : ""}`;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-soft-lg backdrop-blur-sm">
      {label != null && <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>}
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: BRAND }} />
        <span className="font-display text-sm font-black text-slate-900" style={tnum}>{text}</span>
      </div>
    </div>
  );
}

export function SalesTrendChart({ data, valueFormatter, unit }: { data: { label: string; value: number }[]; valueFormatter?: Fmt; unit?: string }) {
  const reduced = useReducedMotion();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 18, right: 14, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.16} />
            <stop offset="92%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} />
        <YAxis tickLine={false} axisLine={false} width={46} tickFormatter={abbr} tick={{ fontSize: 11, fill: "#cbd5e1", fontWeight: 600 }} />
        <Tooltip content={<ChartTooltip fmt={valueFormatter} unit={unit} />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Area
          type="monotone" dataKey="value" stroke={BRAND} strokeWidth={2.5} fill="url(#trendFill)"
          dot={{ r: 3, fill: "#fff", stroke: BRAND, strokeWidth: 2 }}
          activeDot={{ r: 6, fill: BRAND, stroke: "#fff", strokeWidth: 2.5 }}
          isAnimationActive={!reduced} animationDuration={650} animationEasing="ease-out"
        >
          {data.length <= 8 && <LabelList dataKey="value" position="top" offset={10} formatter={abbrLabel} style={{ ...tnum, fontSize: 10, fontWeight: 800, fill: "#a3aab8" }} />}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HBarChart({ data, valueFormatter, unit }: { data: { label: string; value: number }[]; valueFormatter?: Fmt; unit?: string }) {
  const reduced = useReducedMotion();
  return (
    <ResponsiveContainer width="100%" height={Math.max(170, data.length * 50)}>
      <BarChart layout="vertical" data={data} margin={{ top: 2, right: 60, left: 8, bottom: 2 }} barCategoryGap={14}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={124} tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} />
        <Tooltip content={<ChartTooltip fmt={valueFormatter} unit={unit} />} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="value" radius={[0, 7, 7, 0]} barSize={16} isAnimationActive={!reduced} animationDuration={650} animationEasing="ease-out">
          {data.map((_, i) => <Cell key={i} fill={RANK_FILLS[Math.min(i, RANK_FILLS.length - 1)]} />)}
          <LabelList dataKey="value" position="right" offset={10} formatter={abbrLabel} style={{ ...tnum, fontSize: 11, fontWeight: 800, fill: "#334155" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniDonut({ value, label }: { value: number; label: string }) {
  const reduced = useReducedMotion();
  const data = [{ name: "done", value }, { name: "rest", value: Math.max(0, 100 - value) }];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <defs>
            <linearGradient id="donutFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7857e6" />
              <stop offset="100%" stopColor={BRAND} />
            </linearGradient>
          </defs>
          <Pie data={data} innerRadius={56} outerRadius={72} startAngle={90} endAngle={-270} dataKey="value" stroke="none" cornerRadius={9} isAnimationActive={!reduced} animationDuration={700} animationEasing="ease-out">
            <Cell fill="url(#donutFill)" /><Cell fill="#eef1f6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-black text-slate-900" style={tnum}>{value}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
      </div>
    </div>
  );
}
