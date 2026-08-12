import { getLeads } from "@atpdev/database";
import { Users, Mail, Building, Calendar, ArrowRight } from "lucide-react";
import { updateLeadStatus } from "./actions";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">CRM: Leads y Contactos</h1>
        <p className="text-gray-400">Gestiona los mensajes recibidos a través del formulario público.</p>
      </div>

      <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-\[\#1A1A1A\] border-b border-gray-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Contacto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Mensaje</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No tienes mensajes nuevos.
                  </td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{lead.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Mail size={12} /> {lead.email}
                          </div>
                          {lead.company && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <Building size={12} /> {lead.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-300 max-w-md line-clamp-2" title={lead.message}>
                        {lead.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar size={12} /> {new Date(lead.created_at || "").toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
                        lead.status === 'NUEVO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        lead.status === 'EN NEGOCIACIÓN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        lead.status === 'CERRADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <form className="flex gap-2">
                        <input type="hidden" name="id" value={lead.id} />
                        {lead.status !== 'CERRADO' && (
                          <button
                            formAction={async () => {
                              "use server";
                              await updateLeadStatus(lead.id, 'EN NEGOCIACIÓN');
                            }}
                            className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                            title="Mover a Negociación"
                          >
                            Negociar
                          </button>
                        )}
                        {lead.status !== 'CERRADO' && (
                          <button
                            formAction={async () => {
                              "use server";
                              await updateLeadStatus(lead.id, 'CERRADO');
                            }}
                            className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1"
                            title="Marcar como Cerrado"
                          >
                            Cerrar <ArrowRight size={12} />
                          </button>
                        )}
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
