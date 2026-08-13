"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Check, Upload, Trash2 } from "lucide-react";

const PRESET_AVATARS = [
  "/avatar.png",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

export function AvatarPicker({ initialAvatarUrl }: { initialAvatarUrl: string }) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || "/avatar.png");
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Camera size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Fotografía de Perfil (Avatar)</h3>
          <p className="text-xs text-gray-500">Sube una foto desde tu equipo o selecciona una de la galería.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
        {/* AVATAR PREVIEW */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-blue-600/20 border-2 border-blue-500/50 p-1 overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            {!previewError ? (
              <img 
                src={avatarUrl} 
                alt="Avatar Preview" 
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
                <ImageIcon size={24} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-all cursor-pointer"
            title="Cambiar foto"
          >
            <Upload size={14} />
          </button>
        </div>

        {/* INPUT, FILE UPLOAD & PRESETS */}
        <div className="flex-1 space-y-4 w-full">
          
          {/* UPLOAD BUTTON + URL INPUT */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                URL o Imagen Cargada
              </label>
              <input
                type="text"
                name="avatar_url"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://... o sube una imagen"
                className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm w-full font-mono"
              />
            </div>

            <div className="flex items-end gap-2">
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50 px-4 py-2.5 rounded-xl font-medium text-xs transition-all h-[42px] shrink-0"
              >
                <Upload size={14} /> Subir Imagen desde Equipo
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              O elige de la galería predefinida:
            </span>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((preset, idx) => {
                const isSelected = avatarUrl === preset;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset);
                      setPreviewError(false);
                    }}
                    className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      isSelected ? "border-blue-500 scale-105 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "border-gray-800 hover:border-gray-600 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
