"use client";

import { useState } from "react";
import { Calendar, Download, ChevronDown } from "lucide-react";

export function DashboardActions({ totalVisits, totalLeads }: { totalVisits: number, totalLeads: number }) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");

  const periods = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Este Año", "Todo"];

  const handleDownloadReport = () => {
    // Generate a simple CSV report
    const now = new Date().toLocaleDateString("es-PE");
    const csvContent = [
      "ATP DEV - Reporte Generado: " + now,
      "",
      "Métrica,Valor",
      "Período," + selectedPeriod,
      "Visitas Totales," + totalVisits,
      "Leads Generados," + totalLeads,
      "Tasa de Conversión," + (totalVisits > 0 ? ((totalLeads / totalVisits) * 100).toFixed(1) + "%" : "0%"),
      "Ingresos AdSense Est.,$0.00",
    ].join("\n");

    // Agregamos BOM para que Excel lea los tildes correctamente
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `atp-dev-report-${now.replace(/\//g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Period Selector */}
      <div className="relative">
        <button 
          onClick={() => setPeriodOpen(!periodOpen)}
          className="flex items-center gap-2 bg-[#12141a] hover:bg-[#1a1c23] border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Calendar size={16} /> {selectedPeriod} <ChevronDown size={14} />
        </button>
        {periodOpen && (
          <div className="absolute right-0 top-12 w-48 bg-[#12141a] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => { setSelectedPeriod(p); setPeriodOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                  selectedPeriod === p 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Download Report */}
      <button 
        onClick={handleDownloadReport}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
      >
        <Download size={16} /> Report
      </button>
    </div>
  );
}
