"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const weeklyData = [
  { name: "Lun", directo: 1800, organico: 1200 },
  { name: "Mar", directo: 2200, organico: 1600 },
  { name: "Mié", directo: 1900, organico: 1400 },
  { name: "Jue", directo: 2800, organico: 1900 },
  { name: "Vie", directo: 3200, organico: 2100 },
  { name: "Sáb", directo: 1500, organico: 900 },
  { name: "Dom", directo: 1200, organico: 700 },
];

export function AnalyticsCharts() {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 11, fontWeight: "bold" }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#12141a", borderColor: "#1f2937", borderRadius: "12px", color: "#fff" }} 
          />
          <Bar dataKey="directo" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          <Bar dataKey="organico" fill="#6b7280" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
