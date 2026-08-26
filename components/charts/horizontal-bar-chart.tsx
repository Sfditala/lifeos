"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

export function HorizontalBarChart({
  data,
  height,
  maxValue = 100,
}: {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  maxValue?: number;
}) {
  if (data.length === 0) return null;
  const computedHeight = height ?? Math.max(120, data.length * 44);

  return (
    <div style={{ width: "100%", height: computedHeight }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
        >
          <XAxis type="number" domain={[0, maxValue]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--foreground)",
            }}
          />
          <Bar dataKey="value" radius={4} barSize={14}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? "var(--primary)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
