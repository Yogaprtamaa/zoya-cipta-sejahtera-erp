"use client";

import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie
} from "recharts";

const BRAND = "#5e39e0";
const tooltipStyle = { borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 24px rgba(15,23,42,0.08)" };

export function SalesTrendChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#cbd5e1" }} width={40} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="value" stroke={BRAND} strokeWidth={3} dot={{ r: 3, fill: BRAND }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HBarChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
      <BarChart layout="vertical" data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={110} tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
          {data.map((_, i) => <Cell key={i} fill={i === 0 ? BRAND : "#c4b5fd"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniDonut({ value, label }: { value: number; label: string }) {
  const data = [{ name: "done", value }, { name: "rest", value: Math.max(0, 100 - value) }];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} innerRadius={52} outerRadius={70} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
            <Cell fill={BRAND} /><Cell fill="#eef2f7" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-black text-slate-900">{value}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
      </div>
    </div>
  );
}
