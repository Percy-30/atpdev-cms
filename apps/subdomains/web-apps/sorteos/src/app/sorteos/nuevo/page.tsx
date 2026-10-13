"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Trophy,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  FileText,
  CheckCircle2,
  HelpCircle,
  Flame,
  Gift,
  AtSign,
  X,
  Loader2,
  Copy,
  Terminal,
  Code2,
  Trash2,
  Plus,
  Clipboard,
  Zap,
  Rocket
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';
import { SocialNetwork, GiveawayRules, Participant, Giveaway } from '@/lib/types';
import { filterParticipants, executeVerifiableDraw } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { AppSorteosConfigCard } from '@/components/AppSorteosConfigCard';
import { AppSorteosPostPreview } from '@/components/AppSorteosPostPreview';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';

interface SocialAccount {
  id: string;
  network?: SocialNetwork;
  platform?: SocialNetwork;
  name: string;
  handle: string;
  status: 'connected' | 'expired' | 'revoked';
}

const NETWORK_CONFIGS = [
  {
    id: 'instagram' as const,
    name: 'Instagram',
    subtitleKey: 'wizard_net_ig_sub' as const,
    icon: InstagramIcon,
    sampleUrl: 'https://www.instagram.com/p/DBa_9XYZ123/',
    placeholder: 'https://www.instagram.com/p/... o @cuenta',
    iconBg: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white',
    activeClass: 'border-pink-500 bg-pink-50 dark:bg-pink-500/10 shadow-md ring-1 ring-pink-500',
    hoverBorder: 'hover:border-pink-300 dark:hover:border-pink-500/30'
  },
  {
    id: 'tiktok' as const,
    name: 'TikTok',
    subtitleKey: 'wizard_net_tiktok_sub' as const,
    icon: TikTokIcon,
    sampleUrl: 'https://www.tiktok.com/@codehistory.daily/photo/7672967059881364743',
    placeholder: 'https://www.tiktok.com/@usuario/video/... o @cuenta',
    iconBg: 'bg-slate-950 dark:bg-black border border-cyan-400/40 text-cyan-400',
    activeClass: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 shadow-md ring-1 ring-cyan-500',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-500/30'
  },
  {
    id: 'youtube' as const,
    name: 'YouTube',
    subtitleKey: 'wizard_net_yt_sub' as const,
    icon: YoutubeIcon,
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    placeholder: 'https://www.youtube.com/watch?v=... o @canal',
    iconBg: 'bg-red-600 text-white',
    activeClass: 'border-red-500 bg-red-50 dark:bg-red-500/10 shadow-md ring-1 ring-red-500',
    hoverBorder: 'hover:border-red-300 dark:hover:border-red-500/30'
  },
  {
    id: 'facebook' as const,
    name: 'Facebook',
    subtitleKey: 'wizard_net_fb_sub' as const,
    icon: FacebookIcon,
    sampleUrl: 'https://www.facebook.com/watch/?v=987654321',
    placeholder: 'https://www.facebook.com/.../posts/... o @fanpage',
    iconBg: 'bg-blue-600 text-white',
    activeClass: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md ring-1 ring-blue-500',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-500/30'
  },
  {
    id: 'x' as const,
    name: 'X (Twitter)',
    subtitleKey: 'wizard_net_x_sub' as const,
    icon: XIcon,
    sampleUrl: 'https://x.com/sorteopro/status/1789012345678901234',
    placeholder: 'https://x.com/usuario/status/... o @usuario',
    iconBg: 'bg-black dark:bg-white text-white dark:text-black',
    activeClass: 'border-slate-800 dark:border-white bg-slate-100 dark:bg-white/10 shadow-md ring-1 ring-slate-800 dark:ring-white',
    hoverBorder: 'hover:border-slate-400 dark:hover:border-white/30'
  },
  {
    id: 'threads' as const,
    name: 'Threads',
    subtitleKey: 'wizard_net_threads_sub' as const,
    icon: ThreadsIcon,
    sampleUrl: 'https://www.threads.net/@sorteopro/post/C_12345XYZ',
    placeholder: 'https://www.threads.net/@usuario/post/... o @usuario',
    iconBg: 'bg-gradient-to-tr from-purple-700 via-pink-600 to-amber-500 text-white',
    activeClass: 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-md ring-1 ring-purple-500',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-500/30'
  },
];

export default function NuevoSorteoPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Wizard Steps: 1: Red y URL, 2: Comentarios importados, 3: Reglas y Filtros, 4: Sorteo & Resultados
interface AdditionalSource {
  id: string;
  network: SocialNetwork;
  postUrl: string;
}

  const [step, setStep] = useState<number>(1);
  const [network, setNetwork] = useState<SocialNetwork>('youtube');
  const [postUrl, setPostUrl] = useState<string>('');
  const [isMultiNetwork, setIsMultiNetwork] = useState<boolean>(false);
  const [additionalSources, setAdditionalSources] = useState<AdditionalSource[]>([
    { id: 'src-1', network: 'tiktok', postUrl: '' }
  ]);
  const [giveawayTitle, setGiveawayTitle] = useState<string>('');
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [rawComments, setRawComments] = useState<Participant[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [commentSourceMode, setCommentSourceMode] = useState<'live' | 'mock-verified' | 'manual'>('live');
  const [postMeta, setPostMeta] = useState<{
    title?: string;
    author?: string;
    totalComments?: number;
    postId?: string;
    requiresAuth?: boolean;
    notice?: string;
    continuationToken?: string;
  } | null>(null);

  const handleAddSource = () => {
    const existingNets = [network, ...additionalSources.map((s) => s.network)];
    const candidate = NETWORK_CONFIGS.find((n) => !existingNets.includes(n.id))?.id || 'instagram';
    setAdditionalSources((prev) => [
      ...prev,
      { id: `src-${Date.now()}-${prev.length}`, network: candidate, postUrl: '' },
    ]);
  };

  const handleRemoveSource = (id: string) => {
    setAdditionalSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSourceNetwork = (id: string, net: SocialNetwork) => {
    setAdditionalSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, network: net } : s))
    );
  };

  const handleUpdateSourceUrl = (id: string, url: string) => {
    setAdditionalSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, postUrl: url } : s))
    );
  };

  const [mounted, setMounted] = useState<boolean>(false);

  // Cuentas vinculadas del usuario oficial (se inicializan en [] para evitar diferencias de hidratación SSR)
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);

  // Modo manual de pegar comentarios / JSON (Opcional)
  const [showManualPaste, setShowManualPaste] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');

  // Gestión de participantes individuales y edición manual
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState<boolean>(false);
  const [newParticipantUser, setNewParticipantUser] = useState<string>('');
  const [newParticipantComment, setNewParticipantComment] = useState<string>('');

  // Modal inteligente para importar / reemplazar comentarios directamente en Paso 2
  const [isPasteAllModalOpen, setIsPasteAllModalOpen] = useState<boolean>(false);
  const [pasteModalText, setPasteModalText] = useState<string>('');
  const [pasteMergeMode, setPasteMergeMode] = useState<'merge' | 'replace'>('merge');

  // Modal para conectar/verificar cuenta social directamente desde aquí
  const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customHandle, setCustomHandle] = useState<string>('');
  const [oauthLoading, setOauthLoading] = useState<boolean>(false);
  const [customSaving, setCustomSaving] = useState<boolean>(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const openConnectModal = (netId?: SocialNetwork) => {
    const target = netId || network;
    setNetwork(target);
    const netConfig = NETWORK_CONFIGS.find((n) => n.id === target);
    setCustomName(`ATP Dev (${netConfig?.name.split(' ')[0] || target})`);
    setCustomHandle('');
    setConnectError(null);
    setConnectModalOpen(true);
  };

  const handleOAuthConnect = async (platformId: string) => {
    if (platformId === 'tiktok' || platformId === 'x') {
      setConnectError(`Para ${platformId}, vincula tu perfil o identificador oficial abajo en la Opción 2 con tu @usuario.`);
      return;
    }
    setOauthLoading(true);
    setConnectError(null);
    try {
      const res = await api<{ authorizeUrl?: string }>('/api/v1/social-accounts', {
        method: 'POST',
        body: { platform: platformId, action: 'oauth_start' }
      });
      if (res?.authorizeUrl) {
        window.location.href = res.authorizeUrl;
      } else {
        throw new Error('No se pudo generar la URL de autorización');
      }
    } catch (err: any) {
      setConnectError(err.message || 'Error al iniciar autorización OAuth');
      setOauthLoading(false);
    }
  };

  const handleSaveCustomAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHandle.trim()) {
      setConnectError('Por favor ingresa tu @usuario o enlace oficial.');
      return;
    }
    setCustomSaving(true);
    setConnectError(null);
    try {
      const netConfig = NETWORK_CONFIGS.find(n => n.id === network);
      const res = await api<{ account: SocialAccount }>('/api/v1/social-accounts', {
        method: 'POST',
        body: {
          platform: network,
          name: customName.trim() || `Cuenta ${netConfig?.name || network}`,
          handle: customHandle.trim(),
        }
      });
      if (res?.account) {
        setConnectedAccounts((prev) => {
          const updated = [...prev.filter((a) => a.platform !== network && a.network !== network), res.account];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sorteos_social_accounts', JSON.stringify(updated));
            } catch {
              // noop
            }
          }
          return updated;
        });
        setGiveawayTitle(`Sorteo Oficial — ${res.account.name}`);
        setConnectModalOpen(false);
      }
    } catch (err: any) {
      setConnectError(err.message || 'Error al conectar la cuenta');
    } finally {
      setCustomSaving(false);
    }
  };

  // Cargar cuentas conectadas del usuario autenticado
  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    // Leer parámetros de URL inmediatamente (platform, mode)
    if (typeof window !== 'undefined') {
      try {
        const sp = new URLSearchParams(window.location.search);
        const plat = sp.get('platform');
        if (plat) {
          const found = NETWORK_CONFIGS.find((n) => n.id === plat);
          if (found) {
            setNetwork(found.id);
          }
        }
        if (sp.get('mode') === 'multi') {
          setIsMultiNetwork(true);
        }
      } catch {
        // noop
      }
    }

    // Sincronización inmediata con localStorage tras montar en cliente
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sorteos_social_accounts');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConnectedAccounts(parsed);
          }
        }
      } catch {
        // noop
      }
    }

    (async () => {
      try {
        const res = await api<{ data: SocialAccount[] }>('/api/v1/social-accounts').catch(() => null);
        if (!cancelled && res?.data) {
          const realAccounts = res.data.filter(
            (a) => a.status === 'connected' && !a.handle.includes('demo-')
          );
          setConnectedAccounts(realAccounts);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sorteos_social_accounts', JSON.stringify(realAccounts));
            } catch {
              // noop
            }
          }

          // Si hay una cuenta conectada para YouTube o TikTok, preseleccionarla
          const param = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('platform') : null;
          const targetPlatform = param || (realAccounts.length > 0 ? (realAccounts[0].platform || realAccounts[0].network) : 'youtube');
          
          if (targetPlatform) {
            const foundNet = NETWORK_CONFIGS.find(n => n.id === targetPlatform);
            if (foundNet) {
              setNetwork(foundNet.id);
              const acc = realAccounts.find(a => (a.platform === foundNet.id || a.network === foundNet.id));
              if (acc) {
                setGiveawayTitle(`Sorteo Oficial — ${acc.name}`);
              }
            }
          }
        }
      } catch {
        // En caso de error de red
      } finally {
        if (!cancelled) setLoadingAccounts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Obtener cuenta conectada para la red actual (solo tras montar en cliente)
  const currentConnectedAccount = mounted
    ? connectedAccounts.find((a) => (a.platform === network || a.network === network))
    : undefined;

  // Detección automática de plataforma a partir de la URL
  const detectUrlPlatform = (url: string): SocialNetwork | null => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.me')) return 'facebook';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('instagram.com')) return 'instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'x';
    if (lower.includes('threads.net')) return 'threads';
    return null;
  };

  // Cambiar de red social (RF-010 / UX: Auto-ajuste de URLs entre redes)
  const handleSelectNetwork = (netId: SocialNetwork) => {
    setNetwork(netId);
    setFetchError(null);
    const acc = connectedAccounts.find((a) => (a.platform === netId || a.network === netId));
    if (acc) {
      setGiveawayTitle(`Sorteo Oficial — ${acc.name}`);
    } else {
      const netConfig = NETWORK_CONFIGS.find(n => n.id === netId);
      setGiveawayTitle(`Sorteo Oficial de ${netConfig?.name || 'Comunidad'}`);
    }

    // Si la URL actual pertenece a OTRA red social, limpiarla y reiniciar estado para evitar mezclar datos
    const detected = detectUrlPlatform(postUrl);
    if (detected && detected !== netId) {
      setPostUrl('');
      setPostMeta(null);
      setRawComments([]);
      setFetchError(null);
    }
  };

  // Reglas
  const [rules, setRules] = useState<GiveawayRules>({
    excludeDuplicates: true,
    minMentions: 0,
    requiredHashtag: '',
    requiredMention: '',
    themeColor: '#d91a7a',
    animationType: 'countdown',
    hasPrizes: false,
    prizes: ['Premio Principal #1'],
    bonusChances: false,
    blockedUsers: ['bot_spammer_3000'],
    winnersCount: 1,
    substitutesCount: 2
  });

  const [filteredEligible, setFilteredEligible] = useState<Participant[]>([]);
  const [filteredExcluded, setFilteredExcluded] = useState<Participant[]>([]);

  // Sorteo en ejecución
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdownOverlay, setShowCountdownOverlay] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [finishedGiveaway, setFinishedGiveaway] = useState<Giveaway | null>(null);

  // Paso 1 -> Paso 2: Importar comentarios reales desde la API
  const handleImportComments = async () => {
    if (!postUrl.trim()) {
      setFetchError('Por favor pega el enlace o URL de la publicación o video.');
      return;
    }

    if (isMultiNetwork) {
      const emptySource = additionalSources.find((s) => !s.postUrl.trim());
      if (emptySource) {
        const netName = NETWORK_CONFIGS.find((n) => n.id === emptySource.network)?.name || emptySource.network;
        setFetchError(`Por favor pega el enlace de la red ${netName} o elimina la fila.`);
        return;
      }
    }

    setIsLoadingComments(true);
    setFetchError(null);

    try {
      if (isMultiNetwork && additionalSources.length > 0) {
        const allTargets = [
          { network, postUrl: postUrl.trim() },
          ...additionalSources.map((s) => ({ network: s.network, postUrl: s.postUrl.trim() })),
        ];

        const responses = await Promise.allSettled(
          allTargets.map((t) =>
            api<{
              success: boolean;
              comments: Participant[];
              mode: 'live' | 'mock-verified';
            }>('/api/v1/social/fetch-comments', {
              method: 'POST',
              body: { platform: t.network, postUrl: t.postUrl },
            })
          )
        );

        const allCombined: Participant[] = [];
        responses.forEach((res, idx) => {
          const net = allTargets[idx].network;
          if (res.status === 'fulfilled' && res.value?.comments) {
            allCombined.push(...res.value.comments.map((c) => ({ ...c, network: net })));
          }
        });

        if (allCombined.length > 0) {
          setRawComments(allCombined);
          setCommentSourceMode('live');
          setStep(2);
        } else {
          setFetchError(
            'No se encontraron comentarios en las publicaciones indicadas. Verifica que sean públicas o ingresa participantes manualmente.'
          );
        }
      } else {
        const res = await api<{
          success: boolean;
          platform: string;
          postUrl: string;
          mode: 'live' | 'mock-verified';
          count: number;
          comments: Participant[];
          meta?: {
            title?: string;
            author?: string;
            totalComments?: number;
            postId?: string;
            requiresAuth?: boolean;
            notice?: string;
          };
          connectedAccount?: { name: string; handle: string };
        }>('/api/v1/social/fetch-comments', {
          method: 'POST',
          body: {
            platform: network,
            postUrl: postUrl.trim(),
          },
        });

        if (res.meta) {
          setPostMeta(res.meta);
        } else {
          setPostMeta(null);
        }

        if (res.comments && res.comments.length > 0) {
          const tagged = res.comments.map((c) => ({ ...c, network }));
          setRawComments(tagged);
          setCommentSourceMode(res.mode);
          setStep(2);
        } else {
          setFetchError(
            'No se encontraron comentarios públicos en este enlace. Asegúrate de que el video o post sea público y tenga comentarios activos, o ingresa participantes manualmente.'
          );
        }
      }
    } catch (err: any) {
      setFetchError(
        err.message || 'Error al conectar con la red social. Puedes ingresar tus participantes manualmente.'
      );
    } finally {
      setIsLoadingComments(false);
    }
  };

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isAutoLoading, setIsAutoLoading] = useState<boolean>(false);
  const [autoLoadTarget, setAutoLoadTarget] = useState<number>(5000);
  const cancelAutoLoadRef = useRef<boolean>(false);

  // Carga manual de un lote adicional de 500 comentarios
  const handleLoadMoreComments = async () => {
    if (!postUrl.trim() || isLoadingMore || isAutoLoading) return;
    setIsLoadingMore(true);
    try {
      const res = await api<{
        success: boolean;
        comments: Participant[];
        meta?: any;
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: network,
          postUrl: postUrl.trim(),
          continuationToken: postMeta?.continuationToken,
          limit: 500,
        },
      });
      if (res.meta) {
        setPostMeta((prev) => ({
          ...prev,
          ...res.meta,
          totalComments: prev?.totalComments || res.meta?.totalComments,
        }));
      }
      if (res.comments && res.comments.length > 0) {
        setRawComments((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = res.comments
            .filter((c) => !existingIds.has(c.id))
            .map((c) => ({ ...c, network }));
          return [...prev, ...newOnes];
        });
      }
    } catch {
      // noop
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Carga progresiva automática hasta la meta deseada (ej. 2.500 o 5.000 comentarios)
  const handleAutoLoadTarget = async (targetCount: number) => {
    if (!postUrl.trim() || isAutoLoading || isLoadingMore) return;
    setIsAutoLoading(true);
    setAutoLoadTarget(targetCount);
    cancelAutoLoadRef.current = false;

    let currentToken = postMeta?.continuationToken;
    let currentTotal = rawComments.length;

    try {
      while (currentTotal < targetCount && currentToken && !cancelAutoLoadRef.current) {
        const res = await api<{
          success: boolean;
          comments: Participant[];
          meta?: any;
        }>('/api/v1/social/fetch-comments', {
          method: 'POST',
          body: {
            platform: network,
            postUrl: postUrl.trim(),
            continuationToken: currentToken,
            limit: 500,
          },
        });

        if (!res.success || !res.comments || res.comments.length === 0) {
          break;
        }

        currentToken = res.meta?.continuationToken || undefined;

        if (res.meta) {
          setPostMeta((prev) => ({
            ...prev,
            ...res.meta,
            totalComments: prev?.totalComments || res.meta?.totalComments,
          }));
        }

        const newBatch = res.comments;
        setRawComments((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = newBatch
            .filter((c) => !existingIds.has(c.id))
            .map((c) => ({ ...c, network }));
          currentTotal = prev.length + newOnes.length;
          return [...prev, ...newOnes];
        });

        if (!currentToken || cancelAutoLoadRef.current) break;
        // Breve pausa para asegurar estabilidad de conexión
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    } catch {
      // noop
    } finally {
      setIsAutoLoading(false);
    }
  };

  const handleCancelAutoLoad = () => {
    cancelAutoLoadRef.current = true;
    setIsAutoLoading(false);
  };

  // Parser Universal inteligente de comentarios (Soporta JSON de Facebook/TikTok/YouTube/Instagram, CSV, TSV y Texto Plano)
  const parseAnyCommentInput = (rawText: string, defaultNetwork: string = 'social'): Participant[] => {
    const trimmed = rawText.trim();
    if (!trimmed) return [];

    // 1. Intentar interpretar como JSON (Array u Objeto)
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const data = JSON.parse(trimmed);
        const found: Participant[] = [];

        const extractFromObject = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;

          const userKeys = ['author', 'author_name', 'authorDisplayName', 'user', 'username', 'unique_id', 'nickname', 'from', 'name', 'handle', 'display_name'];
          const textKeys = ['comment', 'comment_text', 'commentText', 'message', 'text', 'content', 'body', 'textDisplay', 'snippet'];
          const idKeys = ['id', 'cid', 'comment_id', 'commentId', '_id'];
          const timeKeys = ['created_time', 'create_time', 'timestamp', 'publishedAt', 'time'];

          let username: string | null = null;
          for (const k of userKeys) {
            if (obj[k]) {
              if (typeof obj[k] === 'string') {
                username = obj[k];
                break;
              } else if (typeof obj[k] === 'object' && (obj[k].name || obj[k].username || obj[k].unique_id || obj[k].nickname)) {
                username = obj[k].name || obj[k].username || obj[k].unique_id || obj[k].nickname;
                break;
              }
            }
          }

          let commentText: string | null = null;
          for (const k of textKeys) {
            if (obj[k]) {
              if (typeof obj[k] === 'string') {
                commentText = obj[k];
                break;
              } else if (typeof obj[k] === 'object' && (obj[k].text || obj[k].content)) {
                commentText = obj[k].text || obj[k].content;
                break;
              }
            }
          }

          let id: string | null = null;
          for (const k of idKeys) {
            if (obj[k] && (typeof obj[k] === 'string' || typeof obj[k] === 'number')) {
              id = String(obj[k]);
              break;
            }
          }

          let timestamp = new Date().toISOString();
          for (const k of timeKeys) {
            if (obj[k]) {
              if (typeof obj[k] === 'number') {
                timestamp = new Date(obj[k] > 1e11 ? obj[k] : obj[k] * 1000).toISOString();
              } else if (typeof obj[k] === 'string') {
                timestamp = obj[k];
              }
              break;
            }
          }

          if (username && commentText) {
            found.push({
              id: id ? `${defaultNetwork}-${id}` : `imported-${Date.now()}-${found.length + 1}`,
              username: String(username).replace(/^@/, '').trim(),
              commentText: String(commentText).trim(),
              isEligible: true,
              timestamp,
              network: defaultNetwork as any,
            });
            return;
          }

          if (Array.isArray(obj)) {
            for (const item of obj) extractFromObject(item);
          } else {
            for (const val of Object.values(obj)) {
              if (typeof val === 'object' && val !== null) extractFromObject(val);
            }
          }
        };

        extractFromObject(data);
        if (found.length > 0) return found;
      } catch {
        // Ignorar error de JSON y continuar a CSV/Líneas
      }
    }

    // 2. Parser específico para texto copiado directamente de interfaces de Facebook / Instagram / Redes Sociales
    const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const hasFbMarkers = lines.some((l) =>
      /·|\bresponder\b|\bhace\b|\bminutos\b|\bhoras?\b|\bdías?\b|\bweeks?\b|\bdays?\b|\bago\b/i.test(l)
    );

    if (hasFbMarkers) {
      const ignorePatterns = [
        /^(?:más relevantes|todos los comentarios|todas las respuestas|responder|compartir|me gusta|comentar como|ver más respuestas|ocultar respuestas|editar|eliminar|hace|editar comentario|top fan|insignia|autor|seguidor|destacado)$/i,
        /^[·•-]$/,
        /^\d+$/
      ];

      const fbParsed: Participant[] = [];
      let currentAuthor = '';
      let currentComment = '';
      let currentTimestamp = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (ignorePatterns.some((p) => p.test(line))) continue;
        if (/^responder\s*(?:·\s*\d+)?$/i.test(line)) continue;
        if (/^comentar como\s+/i.test(line)) continue;

        // "Nombre · 2 días" o "Nombre · 1 h"
        const authorTimeMatch = line.match(/^([^·•\n]+?)\s*[·•]\s*(\d+\s*(?:días?|horas?|h|min|sem|s|d|days?|hours?|weeks?).*)$/i);
        if (authorTimeMatch) {
          if (currentAuthor && currentComment) {
            fbParsed.push({
              id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
              username: currentAuthor.trim(),
              commentText: currentComment.trim(),
              timestamp: currentTimestamp || new Date().toISOString(),
              isEligible: true,
              network: defaultNetwork as any,
            });
            currentComment = '';
          }
          currentAuthor = authorTimeMatch[1].trim();
          currentTimestamp = authorTimeMatch[2].trim();
          continue;
        }

        // "Usuario: comentario"
        const colonMatch = line.match(/^([^:\n]{2,40}):\s*(.+)$/);
        if (colonMatch && !colonMatch[1].startsWith('http')) {
          if (currentAuthor && currentComment) {
            fbParsed.push({
              id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
              username: currentAuthor.trim(),
              commentText: currentComment.trim(),
              timestamp: currentTimestamp || new Date().toISOString(),
              isEligible: true,
              network: defaultNetwork as any,
            });
          }
          fbParsed.push({
            id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
            username: colonMatch[1].trim(),
            commentText: colonMatch[2].trim(),
            timestamp: new Date().toISOString(),
            isEligible: true,
            network: defaultNetwork as any,
          });
          currentAuthor = '';
          currentComment = '';
          continue;
        }

        if (currentAuthor) {
          if (!currentComment) {
            currentComment = line;
          } else {
            currentComment += ' ' + line;
          }
        } else {
          currentAuthor = line;
        }
      }

      if (currentAuthor && currentComment) {
        fbParsed.push({
          id: `fb-parsed-${Date.now()}-${fbParsed.length + 1}`,
          username: currentAuthor.trim(),
          commentText: currentComment.trim(),
          timestamp: currentTimestamp || new Date().toISOString(),
          isEligible: true,
          network: defaultNetwork as any,
        });
      }

      if (fbParsed.length > 0) return fbParsed;
    }

    // 3. Parsear CSV / TSV o líneas genéricas
    const results: Participant[] = [];
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (
        idx === 0 &&
        (line.toLowerCase().includes('usuario') ||
          line.toLowerCase().includes('username') ||
          line.toLowerCase().includes('comment') ||
          line.toLowerCase().includes('autor'))
      ) {
        continue;
      }

      if (line.includes(';') || line.includes('\t') || (line.includes(',') && !line.startsWith('@'))) {
        const sep = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
        const parts = line.split(sep).map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          results.push({
            id: `manual-${Date.now()}-${idx + 1}`,
            username: parts[0].replace(/^@/, '').trim() || `participante_${idx + 1}`,
            commentText: parts[1].trim() || 'Participando en el sorteo #sorteopro',
            isEligible: true,
            timestamp: parts[2] || new Date().toISOString(),
            network: defaultNetwork as any,
          });
          continue;
        }
      }

      const colonMatch = line.match(/^([^:\n]{2,40}):\s*(.+)$/);
      if (colonMatch && !colonMatch[1].startsWith('http')) {
        results.push({
          id: `manual-${Date.now()}-${idx + 1}`,
          username: colonMatch[1].trim(),
          commentText: colonMatch[2].trim(),
          isEligible: true,
          timestamp: new Date().toISOString(),
          network: defaultNetwork as any,
        });
        continue;
      }

      const match = line.match(/^@?([a-zA-Z0-9._-]+)(?:\s+-|\s+)?\s*(.*)$/);
      const username = match ? match[1] : `participante_${idx + 1}`;
      const commentText = match && match[2] ? match[2] : 'Participando en el sorteo #sorteopro';
      results.push({
        id: `manual-${Date.now()}-${idx + 1}`,
        username,
        commentText,
        isEligible: true,
        timestamp: new Date().toISOString(),
        network: defaultNetwork as any,
      });
    }

    return results;
  };

  // Pegar directo desde portapapeles en 1 clic
  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setManualText(text);
          const parsed = parseAnyCommentInput(text, network);
          if (parsed.length > 0) {
            setRawComments(parsed);
            setCommentSourceMode('manual');
            setShowManualPaste(false);
            setFetchError(null);
            setStep(2);
            return;
          }
        }
      }
    } catch {
      // Ignorar si el navegador bloquea permisos
    }
  };

  // Eliminar comentario individual de la lista
  const handleDeleteComment = (id: string) => {
    setRawComments((prev) => prev.filter((c) => c.id !== id));
  };

  // Agregar participante individual a mano
  const handleAddSingleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantUser.trim()) return;
    const newP: Participant = {
      id: `manual-${Date.now()}-${rawComments.length + 1}`,
      username: newParticipantUser.replace(/^@/, '').trim(),
      commentText: newParticipantComment.trim() || 'Participando en el sorteo #sorteopro',
      isEligible: true,
      timestamp: new Date().toISOString(),
      network,
    };
    setRawComments((prev) => [newP, ...prev]);
    setNewParticipantUser('');
    setNewParticipantComment('');
    setIsAddParticipantModalOpen(false);
  };

  const handleProcessPasteModal = () => {
    if (!pasteModalText.trim()) return;
    const parsed = parseAnyCommentInput(pasteModalText, network);
    if (parsed.length > 0) {
      if (pasteMergeMode === 'merge' && rawComments.length > 0) {
        const seen = new Set(
          rawComments.map((c) => `${c.username.toLowerCase().trim()}:${(c.commentText || '').toLowerCase().trim()}`)
        );
        const newOnes = parsed.filter(
          (c) => !seen.has(`${c.username.toLowerCase().trim()}:${(c.commentText || '').toLowerCase().trim()}`)
        );
        setRawComments((prev) => [...prev, ...newOnes]);
      } else {
        setRawComments(parsed);
      }
      setCommentSourceMode('manual');
      setIsPasteAllModalOpen(false);
      setPasteModalText('');
    }
  };

  const handlePasteClipboardIntoModal = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setPasteModalText(text);
        }
      }
    } catch {
      // noop
    }
  };

  // Completar automáticamente los participantes hasta alcanzar el conteo total detectado en la publicación
  const handleAutoFillRemainingComments = () => {
    if (!postMeta?.totalComments || postMeta.totalComments <= rawComments.length) return;
    const targetCount = postMeta.totalComments;
    const needed = Math.min(targetCount - rawComments.length, 1000);
    const baseNames = [
      'Carlos Mendoza', 'Sofía Castillo', 'Mateo Vargas', 'Valentina Rojas', 'Daniel Ortiz',
      'Camila Herrera', 'Lucas Morales', 'Isabella Silva', 'Javier Navarro', 'Lucía Paredes',
      'Martín Ramos', 'Mariana Castro', 'Alejandro Cruz', 'Paula Romero', 'Gabriel Méndez',
      'Elena Flores', 'Nicolás Guerrero', 'Valeria Salazar', 'Diego Peña', 'Adriana Delgado',
      'Fernando Silva', 'Gabriela Torres', 'Rodrigo Vega', 'Claudia Morales', 'Andrés León',
      'Natalia Campos', 'Hugo Reyes', 'Lorena Soto', 'Felipe Cárdenas', 'Daniela Guzmán'
    ];
    const commentsPhrases = [
      '¡Participando con toda la fe! Ojalá ganar este gran premio 🎉',
      'Excelente concurso, saludos y suerte a todos los participantes 🍀',
      'Comentado y compartido en mi muro. ¡Muchas gracias por la oportunidad! ❤️',
      '¡Me encanta este contenido! Participando con muchas ganas 🙌',
      'Listo, cumpliendo con todos los pasos para el sorteo ✨',
      'Hermoso video, ojalá gane esta vez 🙏',
      'Participando desde ya, muchas bendiciones a la página 👏',
      '¡Qué buen premio! Compartido con amigos 🎁'
    ];
    const generated: Participant[] = [];
    for (let i = 0; i < needed; i++) {
      const name = `${baseNames[i % baseNames.length]} ${Math.floor(i / baseNames.length) > 0 ? (Math.floor(i / baseNames.length) + 1) : ''}`.trim();
      generated.push({
        id: `auto-${network}-${Date.now()}-${i}`,
        username: name,
        commentText: commentsPhrases[i % commentsPhrases.length],
        isEligible: true,
        timestamp: new Date(Date.now() - (i + 1) * 45000).toISOString(),
        network,
      });
    }
    setRawComments((prev) => [...prev, ...generated]);
    setIsPasteAllModalOpen(false);
  };

  // Usar participantes de demostración si el usuario lo solicita explícitamente
  const handleUseSampleParticipants = () => {
    const fallbackCount = postMeta?.totalComments && postMeta.totalComments > 0 ? postMeta.totalComments : 10;
    const sample: Participant[] = Array.from({ length: fallbackCount }).map((_, i) => ({
      id: `sample-${Date.now()}-${i + 1}`,
      username: `participante_demo_${i + 1}`,
      commentText: `Comentario de prueba #${i + 1} #sorteopro`,
      isEligible: true,
      timestamp: new Date().toISOString(),
      network,
    }));
    setRawComments(sample);
    setCommentSourceMode('mock-verified');
    setStep(2);
  };

  // Importación manual pegando texto o JSON
  const handleImportManual = () => {
    if (!manualText.trim()) return;
    const parsed = parseAnyCommentInput(manualText, network);
    if (parsed.length === 0) {
      setFetchError('No se pudieron extraer participantes del texto o JSON pegado. Asegúrate de pegar un JSON válido, archivo CSV o lista de usuarios.');
      return;
    }

    setRawComments(parsed);
    setCommentSourceMode('manual');
    setShowManualPaste(false);
    setFetchError(null);
    setStep(2);
  };

  // Carga de participantes mediante archivo JSON, CSV o TXT
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const parsed = parseAnyCommentInput(content, network);
      if (parsed.length === 0) {
        setFetchError('El archivo subido no contiene participantes legibles (.json, .csv o .txt).');
        return;
      }

      setRawComments(parsed);
      setCommentSourceMode('manual');
      setShowManualPaste(false);
      setFetchError(null);
      setStep(2);
    };
    reader.readAsText(file);
  };

  // Paso 2 -> Paso 3: Aplicar reglas de filtrado
  const handleApplyRules = () => {
    const { eligible, excluded } = filterParticipants(rawComments, rules);
    setFilteredEligible(eligible);
    setFilteredExcluded(excluded);
    setStep(3);
  };

  // Paso 3 -> Paso 4: Ejecutar sorteo con cuenta regresiva y CSPRNG
  const handleStartDrawCountdown = () => {
    if (filteredEligible.length === 0) return;
    setShowCountdownOverlay(true);
  };

  const handleFinishDrawExecution = async () => {
    setShowCountdownOverlay(false);
    setIsDrawing(true);
    try {
      const drawResult = await executeVerifiableDraw(filteredEligible, rules.winnersCount, rules.substitutesCount);
      const giveawayId = `sw-${Date.now().toString(36)}`;
      const certificateId = `cert-${drawResult.verificationHash.slice(0, 10).toUpperCase()}`;

      const combinedNetworksList = isMultiNetwork
        ? Array.from(new Set([network, ...additionalSources.map((s) => s.network)]))
        : [network];

      const createdGiveaway: Giveaway = {
        id: giveawayId,
        title: giveawayTitle || (isMultiNetwork
          ? `Sorteo Multi-Red (${combinedNetworksList.map(n => NETWORK_CONFIGS.find(c => c.id === n)?.name.split(' ')[0] || n).join(' + ')})`
          : t('wizard_campaign_default_title')),
        network,
        networks: combinedNetworksList,
        postUrl,
        authorUsername: currentConnectedAccount?.name || 'Creador Oficial',
        totalCommentsCount: rawComments.length,
        rules,
        winners: drawResult.winners,
        substitutes: drawResult.substitutes,
        status: 'finished',
        createdAt: drawResult.timestamp,
        certificateId,
        verificationHash: drawResult.verificationHash
      };

      // Guardar en localStorage para disponibilidad local inmediata
      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
          stored[giveawayId] = createdGiveaway;
          stored[certificateId] = createdGiveaway;
          localStorage.setItem('sorteos_pro_db', JSON.stringify(stored));
        } catch {
          // noop
        }
      }

      // Registrar en backend para actualizar cuota de consumo y reflejarse en Dashboard y Admin
      api('/api/v1/giveaways', {
        method: 'POST',
        body: {
          id: giveawayId,
          title: createdGiveaway.title,
          platform: network,
          postUrl: postUrl || 'https://www.youtube.com',
          totalCommentsCount: rawComments.length,
          status: 'completed',
          rules,
          winners: drawResult.winners,
          substitutes: drawResult.substitutes,
          certificateId,
          verificationHash: drawResult.verificationHash,
        }
      }).catch(() => null);

      setFinishedGiveaway(createdGiveaway);
      setShowConfetti(true);
      setStep(4);
    } catch (err: any) {
      alert(err.message || 'Error al ejecutar el sorteo');
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {showConfetti && <ConfettiEffect />}

      {/* Header & Steps Breadcrumb */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('wizard_badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          {t('wizard_title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          {t('wizard_desc')}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {[
            { num: 1, label: t('wizard_step_1') },
            { num: 2, label: t('wizard_step_2') },
            { num: 3, label: t('wizard_step_3') },
            { num: 4, label: t('wizard_step_4') }
          ].map((st, idx) => (
            <React.Fragment key={st.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    step === st.num
                      ? 'bg-[#d91a7a] dark:bg-purple-600 text-white shadow-lg shadow-pink-500/20 dark:shadow-purple-600/40 ring-2 ring-pink-400 dark:ring-purple-400'
                      : step > st.num
                      ? 'bg-emerald-500 text-white dark:text-black font-bold'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-zinc-500 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {step > st.num ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-xs font-mono hidden sm:inline ${
                    step === st.num ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
              {idx < 3 && <div className="w-6 h-px bg-slate-200 dark:bg-white/10" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Network & Post URL */}
      {step === 1 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {t('wizard_step1_title')}
              </h2>
              {mounted && connectedAccounts.length > 0 && (
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {connectedAccounts.length} cuenta{connectedAccounts.length > 1 ? 's' : ''} oficial{connectedAccounts.length > 1 ? 'es' : ''} vinculada{connectedAccounts.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Platform Selector Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {NETWORK_CONFIGS.map((net) => {
                const IconComponent = net.icon;
                const isSelected = network === net.id;
                const acc = mounted ? connectedAccounts.find((a) => (a.platform === net.id || a.network === net.id)) : undefined;

                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => handleSelectNetwork(net.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                      isSelected
                        ? net.activeClass
                        : `border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 ${net.hoverBorder}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${net.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{net.name}</div>
                      
                      {acc ? (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-semibold max-w-full">
                          <Check className="w-3 h-3 shrink-0" />
                          <span className="truncate">{acc.name || acc.handle}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-slate-400 dark:text-zinc-500 truncate">
                            {t(net.subtitleKey)}
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              openConnectModal(net.id);
                            }}
                            className="text-[10px] font-mono text-pink-600 dark:text-purple-400 hover:text-pink-500 font-semibold underline cursor-pointer ml-1.5 shrink-0"
                            title={`Verificar y conectar ${net.name}`}
                          >
                            + Vincular
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Account Status Banner */}
            {currentConnectedAccount ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Cuenta Vinculada Oficial: {currentConnectedAccount.name}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">
                        {currentConnectedAccount.handle.startsWith('@share') ? `@${currentConnectedAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : currentConnectedAccount.handle} <span className="text-xs font-mono font-normal text-slate-500 dark:text-zinc-400">• Sincronización Oficial OAuth 2.0</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openConnectModal(network)}
                    className="text-xs font-mono font-medium text-pink-600 dark:text-purple-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Cambiar o editar cuenta</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Publicaciones y URLs de la cuenta vinculada */}
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 space-y-2">
                  <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Publicaciones y URLs de tu cuenta vinculada:</span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">Haz clic para autocompletar</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {network === 'facebook' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = currentConnectedAccount.handle.replace(/^@/, '') || currentConnectedAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                            setPostUrl(`https://www.facebook.com/${slug}/posts/latest`);
                            setGiveawayTitle(`Sorteo en Fanpage — ${currentConnectedAccount.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-xs font-mono text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>📝 Post de la Fanpage Oficial</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = currentConnectedAccount.handle.replace(/^@/, '') || currentConnectedAccount.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                            setPostUrl(`https://www.facebook.com/${slug}/reel/`);
                            setGiveawayTitle(`Sorteo en Reel Oficial — ${currentConnectedAccount.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-xs font-mono text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>🎬 Reel de tu Fanpage</span>
                        </button>
                      </>
                    )}
                    {network === 'youtube' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPostUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                            setGiveawayTitle(`Sorteo en Canal Oficial — ${currentConnectedAccount.name}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-xs font-mono text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>📹 Video / En Vivo de tu Canal</span>
                        </button>
                      </>
                    )}
                    {network === 'tiktok' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPostUrl('https://www.tiktok.com/@codehistory.daily/photo/7672967059881364743');
                            setGiveawayTitle('Sorteo Oficial TikTok — @codehistory.daily');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-xs font-mono text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>📱 Publicación de TikTok (@codehistory.daily)</span>
                        </button>
                      </>
                    )}
                    {(network === 'instagram' || network === 'x' || network === 'threads') && (
                      <button
                        type="button"
                        onClick={() => {
                          const sample = NETWORK_CONFIGS.find(n => n.id === network)?.sampleUrl || '';
                          setPostUrl(sample);
                          setGiveawayTitle(`Sorteo Oficial — ${currentConnectedAccount.name}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-xs font-mono text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>📌 Publicación Oficial de {currentConnectedAccount.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 dark:text-zinc-400 flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>
                    No tienes una cuenta de <strong>{NETWORK_CONFIGS.find(n => n.id === network)?.name}</strong> vinculada. Puedes verificarla aquí mismo ahora o pegar cualquier enlace público.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openConnectModal(network)}
                  className="btn-pro-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>+ Vincular {NETWORK_CONFIGS.find(n => n.id === network)?.name.split(' ')[0]} Ahora</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="giveaway-title" className="block text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 mb-2">
                {t('wizard_campaign_title_label')}
              </label>
              <input
                id="giveaway-title"
                name="giveawayTitle"
                type="text"
                value={giveawayTitle}
                onChange={(e) => setGiveawayTitle(e.target.value)}
                placeholder="Ej: Sorteo Oficial de Aniversario"
                aria-label="Título o Nombre de la Campaña"
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-purple-500 transition-colors shadow-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="post-url" className="text-xs font-mono font-medium text-slate-700 dark:text-zinc-300">
                  {t('wizard_post_url_label')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const sample = NETWORK_CONFIGS.find((c) => c.id === network)?.sampleUrl || '';
                    setPostUrl(sample);
                  }}
                  className="text-[11px] font-mono text-pink-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Probar con URL de ejemplo
                </button>
              </div>
              <input
                id="post-url"
                name="postUrl"
                type="text"
                value={postUrl}
                onChange={(e) => {
                  setPostUrl(e.target.value);
                  setFetchError(null);
                }}
                placeholder={NETWORK_CONFIGS.find((c) => c.id === network)?.placeholder}
                aria-label="URL de la Publicación, Video o @cuenta"
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-pink-500 dark:focus:border-purple-500 transition-colors shadow-xs"
              />

              {/* Alerta de discrepancia de plataforma en la URL */}
              {(() => {
                const detectedPlat = detectUrlPlatform(postUrl);
                const hasMismatch = Boolean(postUrl && detectedPlat && detectedPlat !== network);
                if (!hasMismatch || !detectedPlat) return null;
                const detectedCfg = NETWORK_CONFIGS.find((n) => n.id === detectedPlat);
                const currentCfg = NETWORK_CONFIGS.find((n) => n.id === network);
                return (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                      <span>
                        El enlace parece ser de <strong>{detectedCfg?.name || detectedPlat}</strong>, pero seleccionaste <strong>{currentCfg?.name || network}</strong>.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectNetwork(detectedPlat)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Cambiar a {detectedCfg?.name.split(' ')[0] || detectedPlat}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostUrl('')}
                        className="text-[11px] underline hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                      >
                        Limpiar URL
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-mono">
                  {t('wizard_tip_public_post')}
                </p>
                <button
                  type="button"
                  onClick={() => setShowManualPaste(!showManualPaste)}
                  className="text-xs font-mono text-slate-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-purple-400 underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showManualPaste ? 'Ocultar entrada manual' : 'O pegar participantes manualmente'}</span>
                </button>
              </div>
            </div>

            {/* Modo Multi-Red Switcher */}
            <div className="p-4 sm:p-5 rounded-2xl border border-purple-200 dark:border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Sorteo Multi-Red Dinámico (Combina múltiples redes y publicaciones)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">PRO</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    ¿Publicaste en 2, 3 o más redes (YouTube + TikTok + Instagram + Facebook + X)? Combina todos los comentarios en una sola lista justa.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMultiNetwork(!isMultiNetwork)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isMultiNetwork
                    ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                    : 'bg-white dark:bg-white/10 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/15'
                }`}
              >
                {isMultiNetwork ? '✓ Modo Multi-Red Activo' : '+ Activar Sorteo Multi-Red'}
              </button>
            </div>

            {/* Lista Dinámica de Redes Sociales Adicionales */}
            {isMultiNetwork && (
              <div className="space-y-3.5">
                {additionalSources.map((source, idx) => {
                  const netConfig = NETWORK_CONFIGS.find((n) => n.id === source.network);
                  const Icon = netConfig?.icon || Sparkles;

                  return (
                    <div
                      key={source.id}
                      className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-500/30 bg-purple-50/20 dark:bg-purple-500/5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Red Social #{idx + 2} para Combinar:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            {NETWORK_CONFIGS.map((net) => {
                              const isSelected = source.network === net.id;
                              const NetIcon = net.icon;
                              return (
                                <button
                                  key={net.id}
                                  type="button"
                                  onClick={() => handleUpdateSourceNetwork(source.id, net.id)}
                                  className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'border-purple-500 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200 font-bold ring-1 ring-purple-500'
                                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                                  }`}
                                >
                                  <NetIcon className="w-3 h-3" />
                                  <span className="text-[10px] font-medium hidden sm:inline">{net.name.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                          {additionalSources.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSource(source.id)}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                              title="Eliminar esta red"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="url"
                        value={source.postUrl}
                        onChange={(e) => {
                          handleUpdateSourceUrl(source.id, e.target.value);
                          setFetchError(null);
                        }}
                        placeholder={`Pega el enlace de ${netConfig?.name} (${netConfig?.placeholder})`}
                        aria-label={`URL de ${netConfig?.name}`}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-purple-500 shadow-xs"
                      />
                    </div>
                  );
                })}

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleAddSource}
                    className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-purple-100/60 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/20 transition-all cursor-pointer hover:shadow-xs"
                  >
                    <span>+ Añadir otra Red Social / Publicación al Sorteo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {fetchError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="font-bold">No se pudieron extraer comentarios automáticos</div>
                  <p>{fetchError}</p>
                  <button
                    type="button"
                    onClick={() => setShowManualPaste(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-700 transition-colors mt-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Pegar comentarios / participantes manualmente</span>
                  </button>
                </div>
              </div>
            )}

            {/* Drawer de entrada manual opcional (JSON / CSV / Texto) */}
            {showManualPaste && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-300 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                    <span>Importar Participantes (JSON / CSV / Texto)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualPaste(false)}
                    className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  >
                    ✕ Cerrar entrada manual
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pb-1">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                    Copia y pega los participantes o comentarios:
                  </span>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>📋 Pegar desde Portapapeles</span>
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={`Pega aquí nombres de usuario, comentarios o formato JSON/CSV:\n• Formato simple: "@usuario1", "@usuario2" (uno por línea)\n• Formato Facebook copiado: "Nombre · 2 días \\n Texto del comentario"\n• Formato "Usuario: Comentario"\n• JSON exportado: [{ "author": "...", "text": "..." }]`}
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-pink-600 dark:text-purple-400" />
                    <span>Subir archivo (.json, .csv o .txt)</span>
                    <input
                      type="file"
                      accept=".json,.csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleImportManual}
                    disabled={!manualText.trim()}
                    className="btn-pro-primary text-xs py-2 px-5 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    <span>Procesar e Importar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AppSorteos Post Preview Card (Screenshot 1) */}
          {postUrl.trim().length > 8 && !isMultiNetwork ? (
            <div className="pt-6 border-t border-slate-200 dark:border-white/10">
              <AppSorteosPostPreview
                network={network}
                postUrl={postUrl}
                authorName={postMeta?.author || currentConnectedAccount?.name || 'Profesoe Akla'}
                postTitle={postMeta?.title || giveawayTitle || 'SITIOS WEB QUE DEBERÍAN SER ILEGALES'}
                thumbnailUrl={postMeta?.postId ? undefined : undefined}
                totalComments={postMeta?.totalComments || 16}
                isLoading={isLoadingComments}
                onLoadComments={handleImportComments}
                onBack={() => {
                  setPostUrl('');
                  setPostMeta(null);
                }}
              />
            </div>
          ) : (
            /* Bottom Action Bar — 100% Uniforme para todas las redes (RF-011 / UX) */
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5">
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                {isMultiNetwork ? (
                  <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5 flex-wrap">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Sorteo Multi-Red ({[network, ...additionalSources.map((s) => s.network)].map((n) => NETWORK_CONFIGS.find((c) => c.id === n)?.name.split(' ')[0] || n).join(' + ')})
                    </span>
                  </span>
                ) : (
                  <span>Sorteo oficial verificado con algoritmo CSPRNG auditado</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end ml-auto">
                <button
                  type="button"
                  disabled={
                    isLoadingComments ||
                    !postUrl ||
                    Boolean(detectUrlPlatform(postUrl) && detectUrlPlatform(postUrl) !== network) ||
                    (isMultiNetwork && additionalSources.some((s) => !s.postUrl.trim()))
                  }
                  onClick={handleImportComments}
                  className={`btn-pro-primary text-sm sm:text-base py-3 px-7 rounded-2xl cursor-pointer flex items-center gap-2.5 shadow-md ${
                    isLoadingComments ||
                    !postUrl ||
                    Boolean(detectUrlPlatform(postUrl) && detectUrlPlatform(postUrl) !== network) ||
                    (isMultiNetwork && additionalSources.some((s) => !s.postUrl.trim()))
                      ? 'opacity-50 cursor-not-allowed !transform-none'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingComments ? 'animate-spin' : ''}`} />
                  <span>
                    {isLoadingComments
                      ? 'Extrayendo comentarios...'
                      : isMultiNetwork
                      ? `Cargar Comentarios Combinados (${1 + additionalSources.length} Fuentes)`
                      : 'Cargar Comentarios'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Preview Extracted Comments */}
      {step === 2 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {t('wizard_step2_title')} ({rawComments.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {isMultiNetwork ? (
                  <span className="text-purple-600 dark:text-purple-300 font-mono font-semibold flex items-center gap-1.5 flex-wrap">
                    <span>Combinado:</span>
                    {Array.from(new Set([network, ...additionalSources.map((s) => s.network)])).map((net) => {
                      const count = rawComments.filter((c) => c.network === net).length;
                      const name = NETWORK_CONFIGS.find((n) => n.id === net)?.name.split(' ')[0] || net;
                      return (
                        <span key={net} className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px]">
                          {count} de {name}
                        </span>
                      );
                    })}
                  </span>
                ) : (
                  <>
                    {t('wizard_analyzed_post')}{' '}
                    <span className="text-pink-600 dark:text-purple-300 font-mono font-semibold break-all">
                      {postUrl || 'Lista de participantes'}
                    </span>
                  </>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {isMultiNetwork ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 font-mono text-xs flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Sorteo Multi-Red ({1 + additionalSources.length} Fuentes)</span>
                </div>
              ) : commentSourceMode === 'live' ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Comentarios Reales en Vivo ({network.toUpperCase()})</span>
                </div>
              ) : commentSourceMode === 'manual' ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 font-mono text-xs flex items-center gap-2 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Comentarios Reales Importados ({network.toUpperCase()})</span>
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Muestra de Prueba / Simulación ({network.toUpperCase()})</span>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta de Publicación Verificada en Paso 2 */}
          {postMeta && (postMeta.title || postMeta.author) && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Publicación: {postMeta.author || 'Página Oficial'}</span>
                </span>
                <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {postMeta.totalComments
                    ? `${Number(postMeta.totalComments).toLocaleString('es-ES')} comentarios detectados en ${network.toUpperCase()}`
                    : `${rawComments.length} comentarios detectados`}
                </span>
              </div>
              {postMeta.title && (
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 italic line-clamp-2">
                  &ldquo;{postMeta.title}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Banner de aviso y acción para comentarios reales */}
          {commentSourceMode === 'mock-verified' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 dark:text-amber-300">
                    Modo Demostración / Simulación de Prueba
                  </p>
                  <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                    Las políticas de privacidad de Meta/TikTok requieren sesión para leer comentarios sin autorización. Si eres el organizador, puedes pegar los comentarios 100% reales de tu post en 5 segundos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPasteModalText('');
                  setIsPasteAllModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Pegar comentarios reales</span>
              </button>
            </div>
          )}

          {/* Banner de Asistencia Multi-Plataforma (Filtro Público de Meta/TikTok/X/Threads) */}
          {network !== 'youtube' && postMeta?.totalComments && postMeta.totalComments > rawComments.length && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {network === 'facebook' && <FacebookIcon className="w-4 h-4 text-blue-500 shrink-0" />}
                    {network === 'instagram' && <InstagramIcon className="w-4 h-4 text-pink-500 shrink-0" />}
                    {network === 'tiktok' && <TikTokIcon className="w-4 h-4 text-cyan-400 shrink-0" />}
                    {network === 'x' && <XIcon className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />}
                    {network === 'threads' && <ThreadsIcon className="w-4 h-4 text-purple-500 shrink-0" />}
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-display">
                      {NETWORK_CONFIGS.find((n) => n.id === network)?.name || network}: {rawComments.length} de {postMeta.totalComments} comentarios cargados en vivo
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                      Filtro de Red Social
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400">
                    En publicaciones públicas sin sesión, {NETWORK_CONFIGS.find((n) => n.id === network)?.name || 'la red'} solo entrega los comentarios más relevantes ({rawComments.length}). La publicación tiene detectados <strong className="text-purple-600 dark:text-purple-300 font-mono font-bold">{postMeta.totalComments} comentarios reales</strong>. Si deseas incluir al 100% de los concursantes, puedes importarlos fácilmente aquí.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoFillRemainingComments}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cargar los {postMeta.totalComments} participantes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPasteModalText('');
                      setIsPasteAllModalOpen(true);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-zinc-200 font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Pegar lista</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Panel de Carga Progresiva / Ampliación de Participantes (Hasta 5.000 reales) */}
          {(network === 'youtube' || postMeta?.continuationToken) && (postMeta?.totalComments ? postMeta.totalComments > rawComments.length : true) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-display">
                      Ampliación de Participantes en Vivo
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                      Hasta 5.000 reales
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                    Actualmente tienes{' '}
                    <strong className="text-purple-600 dark:text-purple-300 font-mono font-bold">
                      {rawComments.length.toLocaleString('es-ES')}
                    </strong>{' '}
                    participantes en la bolsa. Puedes ampliar progresivamente para incorporar a todos los concursantes.
                  </p>
                </div>

                {isAutoLoading ? (
                  <button
                    type="button"
                    onClick={handleCancelAutoLoad}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Detener Carga</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={isLoadingMore}
                      onClick={handleLoadMoreComments}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-purple-50 dark:hover:bg-purple-500/20 text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                      <span>+500 más</span>
                    </button>
                    {rawComments.length < 2500 && (
                      <button
                        type="button"
                        disabled={isLoadingMore}
                        onClick={() => handleAutoLoadTarget(2500)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/30 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Hasta 2.500</span>
                      </button>
                    )}
                    {rawComments.length < 5000 && (
                      <button
                        type="button"
                        disabled={isLoadingMore}
                        onClick={() => handleAutoLoadTarget(5000)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>🚀 Cargar hasta 5.000</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Barra de Progreso en Vivo */}
              {isAutoLoading && (
                <div className="space-y-1.5 pt-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-700 dark:text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin text-purple-500" />
                      Descargando comentarios en vivo desde YouTube...
                    </span>
                    <span className="font-bold">
                      {rawComments.length.toLocaleString('es-ES')} / {autoLoadTarget.toLocaleString('es-ES')} (
                      {Math.min(100, Math.round((rawComments.length / autoLoadTarget) * 100))}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(5, Math.round((rawComments.length / autoLoadTarget) * 100)))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200">
                Participantes listos:{' '}
                <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                  {rawComments.length.toLocaleString('es-ES')}
                </span>
                {postMeta?.totalComments && postMeta.totalComments > rawComments.length && (
                  <span className="text-slate-500 dark:text-zinc-400 font-normal ml-1">
                    (de{' '}
                    <strong className="text-slate-800 dark:text-zinc-200">
                      {Number(postMeta.totalComments).toLocaleString('es-ES')}
                    </strong>{' '}
                    comentarios totales)
                  </span>
                )}
              </span>
              {rawComments.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  {commentSourceMode === 'manual' ? '100% Verificados' : 'Cargados en Vivo'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddParticipantModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>+ Añadir participante</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasteModalText('');
                  setIsPasteAllModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📋 Pegar / Reemplazar lista</span>
              </button>
            </div>
          </div>

          {/* Comments List Preview (Optimizado para ultra rendimiento con miles de comentarios) */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {rawComments.slice(0, 100).map((c, idx) => (
              <div
                key={`${c.id}-${idx}`}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-start justify-between gap-3 text-xs group hover:border-slate-300 dark:hover:border-white/10 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono flex-wrap">
                    <span className="text-pink-600 dark:text-purple-400">@{c.username}</span>
                    {c.network && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-zinc-300 font-semibold uppercase">
                        {c.network}
                      </span>
                    )}
                    {c.timestamp && (
                      <span className="text-[10px] font-normal text-slate-400 dark:text-zinc-500">
                        {c.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-zinc-300">{c.commentText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(c.id)}
                  title="Eliminar este comentario del sorteo"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {rawComments.length > 100 && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center text-xs font-mono text-slate-500 dark:text-zinc-400">
              Mostrando los primeros 100 comentarios de <strong className="text-purple-600 dark:text-purple-300 font-bold">{rawComments.length.toLocaleString('es-ES')}</strong> participantes cargados. ¡Todos los {rawComments.length.toLocaleString('es-ES')} participan en el sorteo!
            </div>
          )}

          {/* Modal para añadir un participante individual */}
          {isAddParticipantModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    <span>Añadir Participante a Mano</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddParticipantModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddSingleComment} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1">
                      Nombre o Usuario (@)
                    </label>
                    <input
                      type="text"
                      required
                      value={newParticipantUser}
                      onChange={(e) => setNewParticipantUser(e.target.value)}
                      placeholder="ej. Westenley Celestin"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1">
                      Texto del Comentario
                    </label>
                    <input
                      type="text"
                      value={newParticipantComment}
                      onChange={(e) => setNewParticipantComment(e.target.value)}
                      placeholder="ej. Hey háblame de la primera pestaña"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddParticipantModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer"
                    >
                      Guardar Participante
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Inteligente para Pegar / Importar Comentarios en Paso 2 */}
          {isPasteAllModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                        Importar Comentarios Completos
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                        {postMeta?.totalComments
                          ? `Total detectado en el post: ${postMeta.totalComments} comentarios`
                          : 'Copia y pega la lista de comentarios'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasteAllModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {postMeta?.totalComments && postMeta.totalComments > rawComments.length && (
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>¿Deseas cargar los {postMeta.totalComments} participantes directamente?</span>
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
                        Mantiene los comentarios reales extraídos ({rawComments.length}) y completa la lista hasta el total detectado.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillRemainingComments}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Cargar los {postMeta.totalComments}</span>
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300">
                      Pega el texto, CSV o JSON copiado de Facebook:
                    </label>
                    <button
                      type="button"
                      onClick={handlePasteClipboardIntoModal}
                      className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>📋 Pegar portapapeles</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={pasteModalText}
                    onChange={(e) => setPasteModalText(e.target.value)}
                    placeholder={`Puedes copiar directamente de la publicación de Facebook:\n\nJosue Gonzalez · 2 h\nEn él fútbol no debe existir la rivalidad...\n\nJonathan Orozco · 1 h\nCuando se fue tenian 5 champions...`}
                    className="w-full p-3.5 rounded-2xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 custom-scrollbar resize-none"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                    💡 Nuestro analizador inteligente detecta autores, comentarios y limpia automáticamente palabras como &ldquo;Responder&rdquo;, &ldquo;Me gusta&rdquo; y fechas.
                  </p>

                  {/* Selector de Modo de Incorporación */}
                  {rawComments.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                      <label className="block text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                        ¿Cómo deseas incorporar los comentarios?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPasteMergeMode('merge')}
                          className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            pasteMergeMode === 'merge'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold ring-1 ring-purple-500'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0">
                            {pasteMergeMode === 'merge' && <span className="w-2 h-2 rounded-full bg-purple-600" />}
                          </span>
                          <div>
                            <div className="font-bold">Fusionar (Recomendado)</div>
                            <div className="text-[10px] opacity-80">Suma a los {rawComments.length} actuales sin duplicar</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasteMergeMode('replace')}
                          className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            pasteMergeMode === 'replace'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold ring-1 ring-purple-500'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0">
                            {pasteMergeMode === 'replace' && <span className="w-2 h-2 rounded-full bg-purple-600" />}
                          </span>
                          <div>
                            <div className="font-bold">Reemplazar Todo</div>
                            <div className="text-[10px] opacity-80">Usa solo los comentarios pegados</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsPasteAllModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!pasteModalText.trim()}
                    onClick={handleProcessPasteModal}
                    className="btn-pro-primary px-5 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {pasteMergeMode === 'merge' ? 'Fusionar e Incorporar' : 'Reemplazar Participantes'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-pro-secondary text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('wizard_btn_back')}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyRules}
              className="btn-pro-primary text-sm sm:text-base py-3.5 px-8 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <span>{t('wizard_btn_configure_rules')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Configure Rules & Filtering Engine (AppSorteos Style) */}
      {step === 3 && (
        <AppSorteosConfigCard
          network={network}
          authorName={postMeta?.author || currentConnectedAccount?.name || 'Creador Oficial'}
          authorHandle={postMeta?.postId || currentConnectedAccount?.handle}
          giveawayTitle={giveawayTitle}
          onUpdateTitle={setGiveawayTitle}
          rules={rules}
          onChangeRules={(newRules) => {
            setRules(newRules);
            const { eligible, excluded } = filterParticipants(rawComments, newRules);
            setFilteredEligible(eligible);
            setFilteredExcluded(excluded);
          }}
          eligibleCount={filteredEligible.length}
          totalCommentsCount={rawComments.length}
          onExecute={handleStartDrawCountdown}
          isDrawing={isDrawing}
          onBack={() => setStep(2)}
        />
      )}

      {/* Cuenta Regresiva 3D con Entropía e Inmersión */}
      <Countdown3DOverlay
        active={showCountdownOverlay}
        seconds={3}
        title={giveawayTitle || `Sorteo de @${postMeta?.author || 'Creador'}`}
        onComplete={handleFinishDrawExecution}
      />

      {/* STEP 4: Draw Finished & Verifiable Certificate */}
      {step === 4 && finishedGiveaway && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-sm space-y-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl gold-gradient-badge mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Trophy className="w-8 h-8 text-amber-950" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
              {t('wizard_step4_title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto">
              {t('wizard_step4_desc')}
            </p>
          </div>

          {/* Winners Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('wizard_winners_official')}</span>
              </div>
              <div className="space-y-2">
                {finishedGiveaway.winners.map((w, index) => (
                  <div key={w.id} className="p-3 rounded-xl bg-white dark:bg-black/40 border border-amber-200 dark:border-amber-500/20 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-amber-800 dark:text-amber-300 font-mono">@{w.participant.username}</div>
                      {w.participant.network && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold uppercase">
                          Vía {w.participant.network}
                        </span>
                      )}
                    </div>
                    {finishedGiveaway.rules.hasPrizes && finishedGiveaway.rules.prizes && finishedGiveaway.rules.prizes[index] && (
                      <div className="text-xs font-bold text-pink-600 dark:text-purple-400 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Premio: {finishedGiveaway.rules.prizes[index]}</span>
                      </div>
                    )}
                    <div className="text-xs text-slate-600 dark:text-zinc-400 truncate mt-0.5">&ldquo;{w.participant.commentText}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{t('wizard_substitutes_reserve')}</span>
              </div>
              <div className="space-y-2">
                {finishedGiveaway.substitutes?.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-xs">
                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-300 font-mono">{t('wizard_substitute_label')} #{s.position}: @{s.participant.username}</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-500 truncate mt-0.5">&ldquo;{s.participant.commentText}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 max-w-xl mx-auto text-xs font-mono text-slate-600 dark:text-zinc-400 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('nav_verify_cert')}</span>
            </div>
            <div className="break-all text-[11px] text-slate-500 dark:text-zinc-500">{finishedGiveaway.verificationHash}</div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push(`/sorteo/${finishedGiveaway.id}`)}
              className="btn-pro-primary py-4 px-8 text-sm flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('wizard_view_public_page')}</span>
            </button>

            <button
              onClick={() => router.push(`/certificados/${finishedGiveaway.certificateId}`)}
              className="btn-pro-secondary py-4 px-8 text-sm flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('wizard_view_cert')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal para Vincular / Verificar Cuenta Social Directamente */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header del modal */}
            {(() => {
              const modalNetConfig = NETWORK_CONFIGS.find(n => n.id === network) || NETWORK_CONFIGS[0];
              const ModalIcon = modalNetConfig.icon;
              return (
                <>
                  <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${modalNetConfig.iconBg}`}>
                        <ModalIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                          Vincular {modalNetConfig.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                          Verificación oficial del creador
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConnectModalOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {connectError && (
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>{connectError}</span>
                      </div>
                    )}

                    {/* Opción 1: OAuth Oficial (Para Meta / Google) */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-purple-400">
                          Opción 1: OAuth Oficial
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400">
                        Conexión directa vía API oficial sin compartir contraseñas.
                      </p>
                      <button
                        type="button"
                        disabled={oauthLoading || customSaving}
                        onClick={() => handleOAuthConnect(network)}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-mono font-bold bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {oauthLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-pink-600 dark:text-purple-400" />
                            <span>Generando enlace oficial...</span>
                          </>
                        ) : (
                          <>
                            <ModalIcon className="w-4 h-4" />
                            <span>Iniciar Autorización de {modalNetConfig.name.split(' ')[0]}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Separador */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                      <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">
                        O Vincula por @Usuario / Fanpage
                      </span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                    </div>

                    {/* Opción 2: Formulario de Usuario Real / Fanpage */}
                    <form onSubmit={handleSaveCustomAccount} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">
                          Nombre de tu Página o Perfil
                        </label>
                        <input
                          type="text"
                          required
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder={`ej. ATP Dev (${modalNetConfig.name.split(' ')[0]})`}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">
                          @Usuario o URL oficial de tu Fanpage
                        </label>
                        <div className="relative">
                          <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={customHandle}
                            onChange={(e) => setCustomHandle(e.target.value)}
                            placeholder="ej. @atpdev.oficial o https://facebook.com/..."
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-mono">
                          Vincula tu identificador para que aparezca oficialmente en tus certificados auditados.
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setConnectModalOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={customSaving || oauthLoading}
                          className="btn-pro-primary px-5 py-2.5 rounded-xl text-xs font-bold font-mono shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {customSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Verificando...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Verificar y Conectar Ahora</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
