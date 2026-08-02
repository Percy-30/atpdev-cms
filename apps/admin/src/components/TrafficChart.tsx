"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "DAY 01", value: 1200 },
  { name: "DAY 07", value: 2100 },
  { name: "DAY 14", value: 1800 },
  { name: "DAY 21", value: 3200 },
  { name: "DAY 30", value: 2400 },
];

export function TrafficChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: "bold" }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: "#12141a", borderColor: "#1f2937", borderRadius: "12px", color: "#fff" }} 
            itemStyle={{ color: "#3b82f6" }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
