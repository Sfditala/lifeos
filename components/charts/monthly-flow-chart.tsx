"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function MonthlyFlowChart({
  data,
  incomeLabel,
  expenseLabel,
}: {
  data: { month: string; income: number; expense: number }[];
  incomeLabel: string;
  expenseLabel: string;
}) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--foreground)",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="income" name={incomeLabel} fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name={expenseLabel} fill="#F43F5E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
