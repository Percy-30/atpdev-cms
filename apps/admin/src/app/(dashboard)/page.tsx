"use client";

import { useEffect, useState } from "react";
import { Lead } from "@atpdev/database";
import { getDashboardDataAction } from "./dashboardActions";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Eye, Users, DollarSign, Rocket } from "lucide-react";

// Mock data for the chart based on the image
const data = [
  { name: 'DAY 01', value: 200 },
  { name: 'DAY 07', value: 400 },
  { name: 'DAY 14', value: 300 },
  { name: 'DAY 21', value: 550 },
  { name: 'DAY 30', value: 350 },
];

export default function DashboardPage() {
  const [projectsCount, setProjectsCount] = useState(18);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  useEffect(() => {
    getDashboardDataAction().then(data => {
      setProjectsCount(data.projectsCount);
      setLeads(data.leads);
    });
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Monitoring real-time performance and lead generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            <Download size={16} /> Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Visitas totales", value: "42,891", icon: Eye, change: "+12.5%", color: "text-green-400 bg-green-500/10" },
          { label: "Leads nuevos", value: "1,204", icon: Users, change: "+8.2%", color: "text-green-400 bg-green-500/10" },
          { label: "Ingresos AdSense est.", value: "$3,450.00", icon: DollarSign, change: "+14.1%", color: "text-green-400 bg-green-500/10" },
          { label: "Proyectos activos", value: projectsCount.toString(), icon: Rocket, change: "+2", color: "text-green-400 bg-green-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#121212] p-5 rounded-xl border border-gray-800/60 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-gray-400 border border-gray-800">
                <stat.icon size={16} />
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${stat.color}`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-xs mb-1">{stat.label}</h3>
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-[#121212] p-6 rounded-xl border border-gray-800/60">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Tráfico de los últimos 30 días</h3>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Directo</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-600"></div> Orgánico</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => v === 0 ? '' : v} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Section */}
        <div className="bg-[#121212] p-6 rounded-xl border border-gray-800/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Leads recientes</h3>
            <button className="text-xs font-medium text-blue-500 hover:text-blue-400">Ver todos</button>
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-4 px-2 uppercase tracking-wider">
            <span>Lead</span>
            <span>Estado</span>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[250px] pr-2">
            {leads.length === 0 ? (
              <div className="text-center text-gray-500 text-xs py-10">No hay leads nuevos aún</div>
            ) : (
              leads.slice(0, 5).map((lead, i) => {
                let colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                if (lead.status === 'CONTACTADO') colorClass = "bg-green-500/10 text-green-400 border-green-500/20";
                if (lead.status === 'PENDIENTE') colorClass = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                if (lead.status === 'PERDIDO') colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
                
                // Formateo de fecha seguro para evitar errores de hidratación (SSR vs Client)
                const date = lead.created_at ? lead.created_at.split('T')[0] : 'Reciente';

                return (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <div>
                      <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{lead.name}</h4>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border mb-1 uppercase ${colorClass}`}>
                        {lead.status}
                      </span>
                      <p className="text-[10px] text-gray-600 block">{date}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
