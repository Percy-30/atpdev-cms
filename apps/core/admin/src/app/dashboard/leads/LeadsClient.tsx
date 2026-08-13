"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Building, Calendar, ArrowRight, ArrowLeft, X, Reply, CheckCircle2, Clock, Sparkles, Send, Loader2, Settings, Smartphone } from "lucide-react";
import { updateLeadStatus } from "./actions";
import { generateAiReply, sendEmailReply, getSenderEmail } from "./email-actions";
import { Lead } from "@atpdev/database";

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Smart Reply State
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [senderEmail, setSenderEmail] = useState<string | null>(null);

  // Fetch sender email on mount
  useEffect(() => {
    getSenderEmail().then(email => setSenderEmail(email));
  }, []);

  // Status Metrics
  const responded = initialLeads.filter(l => l.status !== 'NUEVO').length;
  const pending = initialLeads.filter(l => l.status === 'NUEVO').length;
  const progressPercent = initialLeads.length > 0 ? (responded / initialLeads.length) * 100 : 0;

  const handleStatusChange = async (id: number, status: string) => {
    await updateLeadStatus(id, status);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleGenerateAiReply = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await generateAiReply(selectedLead.name, selectedLead.message);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.reply) {
        setReplyText(res.reply);
      }
    } catch (e: any) {
      setErrorMsg("Ocurrió un error inesperado al conectar con Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedLead || !replyText.trim()) return;
    setIsSending(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const subject = `Re: Tu contacto en ATP Dev`;
      const res = await sendEmailReply(selectedLead.email, subject, replyText);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("¡Correo enviado con éxito! Puedes cerrar esta caja o enviar el mismo mensaje por WhatsApp.");
        // Auto-marcar como en negociación
        if (selectedLead.status === 'NUEVO') {
          handleStatusChange(selectedLead.id, 'EN NEGOCIACIÓN');
        }
      }
    } catch (e: any) {
      setErrorMsg("Ocurrió un error inesperado al enviar el correo.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-4 sm:mx-0">
      
      {/* Metrics Header */}
      <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Rendimiento de Atención <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{initialLeads.length} Total</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Has respondido a <strong className="text-white">{responded} clientes</strong>. Te faltan <strong className="text-rose-400">{pending} mensajes</strong> por leer.
          </p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400">Progreso</span>
            <span className="text-emerald-400">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-[#12141a] rounded-full overflow-hidden border border-gray-800">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Gmail-like Interface */}
      <div className="flex-1 bg-[#12141a] sm:rounded-2xl border-y sm:border sm:border-gray-800 overflow-hidden flex relative">
        
        {/* Left Side: List */}
        <div className={`w-full ${selectedLead ? 'hidden md:flex' : 'flex'} md:w-[400px] flex-col border-r border-gray-800 bg-[#1a1c23]`}>
          <div className="p-4 border-b border-gray-800 bg-[#262626] sticky top-0 z-10 shadow-sm">
            <h3 className="font-bold text-white">Bandeja de Entrada</h3>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {initialLeads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Bandeja vacía.</div>
            ) : (
              initialLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowReplyBox(false);
                    setReplyText("");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`w-full text-left p-4 border-b border-gray-800/50 hover:bg-white/5 transition-colors relative ${
                    selectedLead?.id === lead.id ? 'bg-blue-600/10 hover:bg-blue-600/10' : ''
                  }`}
                >
                  {selectedLead?.id === lead.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold truncate pr-2 ${lead.status === 'NUEVO' ? 'text-white' : 'text-gray-400'}`}>
                      {lead.name}
                    </span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap pt-1">
                      {new Date(lead.created_at || "").toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${lead.status === 'NUEVO' ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                    {lead.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      lead.status === 'NUEVO' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      lead.status === 'CERRADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Detail View */}
        <div className={`flex-1 flex-col ${selectedLead ? 'flex' : 'hidden md:flex'} bg-[#0a0b0e] relative`}>
          {selectedLead ? (
            <div className="flex flex-col h-full absolute inset-0">
              
              {/* Detail Header */}
              <div className="px-6 py-4 border-b border-gray-800 bg-[#12141a] flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setSelectedLead(null);
                      setShowReplyBox(false);
                      setReplyText("");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedLead.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <p className="text-sm text-blue-400 flex items-center gap-1.5">
                        <Mail size={14} /> {selectedLead.email}
                      </p>
                      {selectedLead.phone && (
                        <p className="text-sm text-emerald-400 flex items-center gap-1.5">
                          <Smartphone size={14} /> {selectedLead.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedLead.status === 'NUEVO' && (
                    <button
                      onClick={() => handleStatusChange(selectedLead.id, 'EN NEGOCIACIÓN')}
                      className="text-xs bg-[#1a1c23] hover:bg-[#262626] border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                      title="Marcar como En Progreso"
                    >
                      <Clock size={14} /> Marcar en progreso
                    </button>
                  )}
                  {selectedLead.status !== 'CERRADO' && (
                    <button
                      onClick={() => handleStatusChange(selectedLead.id, 'CERRADO')}
                      className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                      title="Marcar como Resuelto"
                    >
                      <CheckCircle2 size={14} /> Finalizar
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedLead(null);
                      setShowReplyBox(false);
                      setReplyText("");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ml-2"
                    title="Cerrar Mensaje"
                  >
                    <X size={14} /> Cerrar
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {selectedLead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-200">De: {selectedLead.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedLead.created_at || "").toLocaleString('es-ES', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 shadow-inner mb-8">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {selectedLead.message}
                    </p>
                  </div>

                  {/* Smart Reply Section */}
                  <div className="border-t border-gray-800 pt-8 mt-4">
                    {successMsg && (
                      <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 font-medium">
                        <CheckCircle2 size={18} /> {successMsg}
                      </div>
                    )}
                    {errorMsg && (
                      <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-medium text-sm">
                        Error: {errorMsg}
                      </div>
                    )}

                    {!showReplyBox ? (
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => setShowReplyBox(true)}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                        >
                          <Reply size={18} /> Escribir Respuesta
                        </button>
                        <button
                          onClick={() => {
                            setShowReplyBox(true);
                            handleGenerateAiReply();
                          }}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] disabled:opacity-50"
                        >
                          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                          {isGenerating ? "Pensando..." : "Redactar con IA"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
                        <button 
                          onClick={() => setShowReplyBox(false)}
                          className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                          <X size={20} />
                        </button>
                        <h4 className="text-white font-bold mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Reply size={16} className="text-gray-400" />
                            Responder a {selectedLead.email}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-black/20 px-3 py-1.5 rounded-lg border border-gray-800" title="Para cambiar este correo, modifica GMAIL_USER en las variables de entorno de Vercel.">
                            <span>De:</span>
                            <span className="text-gray-300">{senderEmail || "No configurado"}</span>
                            <Settings size={12} className="opacity-50 ml-1" />
                          </div>
                        </h4>
                        
                        <div className="mb-4">
                          <button
                            onClick={handleGenerateAiReply}
                            disabled={isGenerating}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-colors mb-3 disabled:opacity-50"
                          >
                            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            Mejorar / Regenerar con Gemini
                          </button>
                          
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Escribe tu respuesta aquí..."
                            rows={8}
                            className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-blue-500 rounded-xl p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                          />
                        </div>
                        
                        <div className="flex flex-wrap justify-end gap-3 mt-2">
                          <button
                            onClick={() => setShowReplyBox(false)}
                            className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSendEmail}
                            disabled={isSending || !replyText.trim()}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm"
                          >
                            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {isSending ? "Enviando..." : "Enviar Correo"}
                          </button>
                          
                          {selectedLead.phone && (
                            <a
                              href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(replyText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                setSuccessMsg("¡Redirigiendo a WhatsApp!");
                                if (selectedLead.status === 'NUEVO') {
                                  handleStatusChange(selectedLead.id, 'EN NEGOCIACIÓN');
                                }
                              }}
                              className={`inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm ${!replyText.trim() ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              <Smartphone size={16} />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
              <Mail size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Selecciona un mensaje</p>
              <p className="text-sm mt-1">Haz clic en un lead a la izquierda para leerlo completo aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
