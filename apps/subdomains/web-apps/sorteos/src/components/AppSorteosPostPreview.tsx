"use client";

import React from 'react';
import { MessageSquare, ArrowRight, RotateCcw, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { SocialNetwork } from '@/lib/types';
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon, XIcon, ThreadsIcon } from './SocialIcons';

export interface AppSorteosPostPreviewProps {
  network: SocialNetwork;
  postUrl: string;
  authorName?: string;
  postTitle?: string;
  thumbnailUrl?: string;
  totalComments?: number;
  isLoading: boolean;
  onLoadComments: () => void;
  onBack: () => void;
}

const NETWORK_META = {
  facebook: { name: 'Facebook', title: 'Sorteo en Facebook', sub: 'Escoge un comentario ganador de tus posts y reels de Facebook.', icon: FacebookIcon, color: '#1877F2' },
  instagram: { name: 'Instagram', title: 'Sorteo en Instagram', sub: 'Elige un ganador de tus fotos, carruseles y reels de Instagram.', icon: InstagramIcon, color: '#E1306C' },
  tiktok: { name: 'TikTok', title: 'Sorteo en TikTok', sub: 'Selecciona ganadores entre todos los comentarios de tus videos de TikTok.', icon: TikTokIcon, color: '#00F2FE' },
  youtube: { name: 'YouTube', title: 'Sorteo en YouTube', sub: 'Extrae comentarios y filtra respuestas de tus videos y Shorts de YouTube.', icon: YoutubeIcon, color: '#FF0000' },
  x: { name: 'X (Twitter)', title: 'Sorteo en X (Twitter)', sub: 'Elige ganadores entre respuestas y retuits en X.', icon: XIcon, color: '#000000' },
  threads: { name: 'Threads', title: 'Sorteo en Threads', sub: 'Selecciona ganadores transparentes de publicaciones en Threads.', icon: ThreadsIcon, color: '#A855F7' },
  standalone: { name: 'Comunidad', title: 'Sorteo Digital', sub: 'Sorteo rápido con lista de participantes.', icon: FacebookIcon, color: '#ec4899' },
};

export const AppSorteosPostPreview: React.FC<AppSorteosPostPreviewProps> = ({
  network,
  postUrl,
  authorName = 'Profesoe Akla',
  postTitle = 'SITIOS WEB QUE DEBERÍAN SER ILEGALES',
  thumbnailUrl,
  totalComments = 16,
  isLoading,
  onLoadComments,
  onBack,
}) => {
  const currentMeta = NETWORK_META[network] || NETWORK_META.facebook;
  const NetIcon = currentMeta.icon;

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-300">
      {/* Network Header (Screenshot 1) */}
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10 mx-auto text-slate-800 dark:text-white">
          <NetIcon className="w-6 h-6" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
          {currentMeta.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
          {currentMeta.sub}
        </p>
      </div>

      {/* Post Preview Card (Screenshot 1 Card) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-5 text-left">
        {/* Post Image Thumbnail */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-inner flex items-center justify-center text-center p-4 group">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Miniatura de la publicación"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="space-y-2 max-w-xs">
              <span className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-wider drop-shadow-md block">
                {postTitle || 'PUBLICACIÓN OFICIAL'}
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase">
                {postUrl.slice(0, 35)}...
              </span>
            </div>
          )}

          {/* Social Network Badge Overlay */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold flex items-center gap-1.5 border border-white/20">
            <NetIcon className="w-3.5 h-3.5" />
            <span>{currentMeta.name}</span>
          </div>
        </div>

        {/* Author Avatar & Handle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {authorName}
            </div>
            <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
              Publicación seleccionada
            </div>
          </div>
        </div>

        {/* Comment Count Indicator */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-mono pt-1">
          <MessageSquare className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
          <span className="font-bold text-slate-900 dark:text-white">{totalComments}</span>
          <span>comentarios detectados</span>
        </div>

        {/* Action Buttons (Screenshot 1 Bottom) */}
        <div className="space-y-2.5 pt-2">
          {/* Cargar comentarios Primary Pink Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={onLoadComments}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d91a7a] to-[#c2186b] hover:from-[#c2186b] hover:to-[#a8145f] text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Cargando comentarios...' : 'Cargar comentarios'}</span>
          </button>

          {/* Regresar Outlined Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-zinc-300 font-bold text-xs border border-slate-300 dark:border-white/10 transition-colors cursor-pointer"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};
