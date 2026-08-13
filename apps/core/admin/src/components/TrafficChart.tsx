"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type TrafficData = {
  date: string;
  directo: number;
  organico: number;
};

export function TrafficChart({ data }: { data: TrafficData[] }) {
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
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: "bold" }}
            dy={10}
            tickFormatter={(val) => {
              // Convert "YYYY-MM-DD" to "DD MMM"
              const d = new Date(val);
              return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            }}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: "#12141a", borderColor: "#1f2937", borderRadius: "12px", color: "#fff" }} 
            itemStyle={{ color: "#3b82f6" }}
          />
          <Area 
            type="monotone" 
            dataKey="directo" 
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
