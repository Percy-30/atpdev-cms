'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, Copy, Check, Download, Upload, RotateCcw, Trash2, 
  Sparkles, Eye, ZoomIn, ZoomOut, Maximize2, ShieldCheck, FileText, Info
} from 'lucide-react';
import { CvData, CvTemplateId } from './cv/types';
import { SAMPLE_CV_DATA } from './cv/sampleData';
import { CvTemplateSelector } from './cv/CvTemplateSelector';
import { CvForm } from './cv/CvForm';
import { TemplateServirCas } from './cv/templates/TemplateServirCas';
import { TemplateModernExecutive } from './cv/templates/TemplateModernExecutive';
import { TemplateMinimalAts } from './cv/templates/TemplateMinimalAts';
import { TemplateTechCreative } from './cv/templates/TemplateTechCreative';
import { generatePlainResumeText } from './cv/textExport';
import { downloadCvAsWord } from './cv/wordExport';

const STORAGE_KEY_DATA = 'chamba_pro_cv_data_v2';
const STORAGE_KEY_TEMPLATE = 'chamba_pro_cv_template_v2';

export function CvCasGenerator() {
  const [data, setData] = useState<CvData>(SAMPLE_CV_DATA);
  const [templateId, setTemplateId] = useState<CvTemplateId>('servir-cas');
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(85); // % zoom for preview
  const [showPrintTips, setShowPrintTips] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved state from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedData) {
        setData(JSON.parse(savedData));
      }
      const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE) as CvTemplateId;
      if (savedTemplate) {
        setTemplateId(savedTemplate);
      }
    } catch (err) {
      console.warn('Error reading CV data from localStorage:', err);
    }
  }, []);

  // Auto-save changes to localStorage
  const handleDataChange = (updated: CvData) => {
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  const handleTemplateChange = (id: CvTemplateId) => {
    setTemplateId(id);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, id);
    } catch (e) {
      console.warn('LocalStorage template save failed:', e);
    }
  };

  // Actions
  const handleCopyText = () => {
    const text = generatePlainResumeText(data);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadWord = () => {
    downloadCvAsWord(data, templateId);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetExample = () => {
    if (confirm('¿Deseas restaurar los datos del modelo de ejemplo? Se sobrescribirá el borrador actual.')) {
      handleDataChange(SAMPLE_CV_DATA);
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Seguro que deseas limpiar todos los campos? Esta acción iniciará un CV vacío.')) {
      const emptyData: CvData = {
        personal: {
          fullName: '',
          headline: '',
          dni: '',
          ruc: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          colegiatoria: '',
          linkedin: '',
          website: '',
          photoUrl: '',
        },
        profileSummary: '',
        education: [],
        courses: [],
        experiences: [],
        skills: [],
        languages: [],
        swornStatementAccepted: true,
      };
      handleDataChange(emptyData);
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify({ templateId, data }, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_CHAMBA_PRO_${data.personal.dni || 'BORRADOR'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data) {
          handleDataChange(parsed.data);
          if (parsed.templateId) handleTemplateChange(parsed.templateId);
          alert('¡Borrador de CV importado exitosamente!');
        }
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Render chosen template
  const renderTemplate = () => {
    switch (templateId) {
      case 'servir-cas':
        return <TemplateServirCas data={data} />;
      case 'modern-executive':
        return <TemplateModernExecutive data={data} />;
      case 'minimal-ats':
        return <TemplateMinimalAts data={data} />;
      case 'tech-creative':
        return <TemplateTechCreative data={data} />;
      default:
        return <TemplateServirCas data={data} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden input for importing JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJson}
        accept=".json"
        className="hidden"
      />

      {/* Action Header Bar (Print hidden) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold">
              100% Calibrado A4
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Auto-guardado continuo en tu navegador
            </span>
          </div>
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <span>Editor & Exportador de CV Profesional</span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Download Word (.DOC) Button */}
          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-display text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            title="Descargar tu CV en formato Word (.doc) 100% editable con tablas y membrete oficial"
          >
            <FileText size={16} />
            <span>Descargar en Word (.DOC)</span>
          </button>

          {/* Main Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            title="Abre el diálogo para guardar como PDF o imprimir en papel A4"
          >
            <Printer size={16} />
            <span>Guardar / Imprimir PDF</span>
          </button>

          {/* Copy Plain Text Resume */}
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold font-mono text-xs transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
            title="Copia la Ficha Resumen en texto plano para mesas de partes virtuales"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          {/* Help Tips Tooltip Toggle */}
          <button
            type="button"
            onClick={() => setShowPrintTips(!showPrintTips)}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10 cursor-pointer"
            title="¿Problemas con la impresora? Ver ayuda de exportación"
          >
            <Info size={16} className="text-amber-400" />
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10 cursor-pointer"
            title="Exportar respaldo de datos en archivo JSON"
          >
            <Download size={15} />
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10 cursor-pointer"
            title="Importar un respaldo de CV en JSON"
          >
            <Upload size={15} />
          </button>

          {/* Reset sample */}
          <button
            type="button"
            onClick={handleResetExample}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-white/10 cursor-pointer"
            title="Cargar datos de ejemplo"
          >
            <RotateCcw size={15} />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClearAll}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-white/10 cursor-pointer"
            title="Limpiar formulario"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* PDF Export Tips Banner (Collapsible) */}
      {showPrintTips && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5 print:hidden">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>¿Te sale &quot;Esperando conexión de impresora...&quot; en Windows?</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPrintTips(false)}
              className="text-amber-400 hover:text-white cursor-pointer"
            >
              Entendido ✕
            </button>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Ese mensaje del sistema aparece cuando Windows intenta comunicarse con una impresora física que está apagada o desconectada. Para resolverlo en 1 segundo:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            <li>
              👉 <strong>Opción 1 (Más rápida):</strong> Pulsa el botón azul <strong className="text-blue-400 font-bold">&quot;Descargar en Word (.DOC)&quot;</strong> arriba. Se descargará el archivo de inmediato, 100% editable en Microsoft Word o Google Docs, y puedes guardarlo como PDF cuando quieras.
            </li>
            <li>
              👉 <strong>Opción 2 (PDF directo sin impresora física):</strong> En la ventana de impresión de Windows, cambia la impresora a <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">Microsoft Print to PDF</strong> o <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">Guardar como PDF</strong>. De esa manera Windows no busca ninguna máquina física y genera el PDF al instante.
            </li>
            <li>
              👉 <strong>Disposición Vertical (Hoja A4):</strong> En la ventana de impresión, asegúrate de que la <strong>Disposición</strong> esté seleccionada en <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">Vertical</strong> para que la hoja encaje con exactitud y no se divida.
            </li>
            <li>
              👉 <strong>Gráficos de fondo:</strong> Recuerda verificar que la casilla <strong className="text-white">&quot;Gráficos de fondo&quot;</strong> esté marcada para que se impriman con máxima nitidez los bordes, insignias y colores institucionales.
            </li>
          </ul>
        </div>
      )}

      {/* Template Selector Bar (Print hidden) */}
      <div className="print:hidden">
        <CvTemplateSelector
          selectedId={templateId}
          onSelect={handleTemplateChange}
        />
      </div>

      {/* Main Grid: Left Editor + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Editor (Col 5) */}
        <div className="lg:col-span-5 print:hidden">
          <CvForm
            data={data}
            onChange={handleDataChange}
          />
        </div>

        {/* Right Preview Column (Col 7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Zoom and Preview Controls Header */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/10 print:hidden text-xs">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-emerald-400" />
              <span className="font-bold font-display text-white">Vista Previa Hoja A4</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                (Visualización en tiempo real)
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Alejar vista"
              >
                <ZoomOut size={13} />
              </button>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 font-bold">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(120, zoomLevel + 10))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Acercar vista"
              >
                <ZoomIn size={13} />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
                title="Ajustar al 100%"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Printable Container */}
          <div className="w-full overflow-x-auto p-2 sm:p-4 rounded-3xl bg-slate-950/90 border border-white/10 flex justify-center print:border-none print:bg-white print:p-0 print:m-0 print:overflow-visible">
            <div
              id="cv-print-area"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="w-full max-w-[820px] print:max-w-none print:w-full print:transform-none"
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
