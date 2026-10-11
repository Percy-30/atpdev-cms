export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads' | 'standalone';
export type SocialNetwork = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads' | 'standalone';

export type StandaloneToolType = 'lista' | 'ruleta' | 'dados' | 'moneda' | 'numeros' | 'equipos';

export type GiveawayStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'finished' | 'cancelled';

export interface GiveawayRules {
  excludeDuplicates: boolean;
  minMentions: number;
  requiredHashtag?: string;
  blockedUsers: string[];
  winnersCount: number;
  substitutesCount: number;
}

export interface Participant {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  commentText?: string;
  likesCount?: number;
  timestamp?: string;
  isEligible: boolean;
  exclusionReason?: string;
  network?: SocialNetwork;
}

export interface Winner {
  id: string;
  participant: Participant;
  type: 'winner' | 'substitute';
  position: number;
  selectedAt: string;
}

export interface Giveaway {
  id: string;
  title: string;
  description?: string;
  platform?: SocialPlatform;
  network?: SocialNetwork;
  secondaryNetwork?: SocialNetwork;
  networks?: SocialNetwork[];
  postUrl?: string;
  secondPostUrl?: string;
  authorUsername?: string;
  totalCommentsCount?: number;
  status: GiveawayStatus;
  rules: GiveawayRules;
  participants?: Participant[];
  winners: Winner[];
  substitutes?: Winner[];
  certificateId?: string;
  verificationHash?: string;
  scheduledAt?: string;
  executedAt?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  giveawayId: string;
  giveawayTitle: string;
  platform?: SocialPlatform;
  network?: string;
  networks?: string[];
  winnerUsername?: string;
  winnerName?: string;
  winnerComment?: string;
  winners?: Winner[];
  substitutes?: Winner[];
  winnersCount?: number;
  substitutesCount?: number;
  totalParticipants?: number;
  verificationHash: string;
  createdAt?: string;
  issuedAt?: string;
  certificateUrl?: string;
  verificationUrl?: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'business' | 'enterprise';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  commentLimit: number;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Ideal para probar y sorteos personales',
    priceMonthly: 0,
    priceAnnual: 0,
    commentLimit: 100,
    features: [
      'Hasta 100 comentarios por sorteo',
      'Herramientas Standalone ilimitadas (Lista, Ruleta, Dados, Moneda)',
      '1 Ganador + 1 Suplente',
      'Landing pública con verificación',
      'Certificado digital básico'
    ],
    ctaLabel: 'Comenzar Gratis'
  },
  {
    id: 'pro',
    name: 'Pro Creador',
    tagline: 'Para influencers, creadores y marcas activas',
    priceMonthly: 9.99,
    priceAnnual: 95.90,
    commentLimit: 2500,
    isPopular: true,
    features: [
      'Hasta 2.500 comentarios por sorteo',
      'Filtro avanzado de @menciones mínimas',
      'Filtro de hashtag obligatorio',
      'Hasta 10 Ganadores + 10 Suplentes',
      'Certificado digital en alta resolución sin marca de agua',
      'Exportación completa de participantes en CSV'
    ],
    ctaLabel: 'Elegir Plan Pro'
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Para agencias de marketing y empresas de retail',
    priceMonthly: 24.99,
    priceAnnual: 239.90,
    commentLimit: 15000,
    features: [
      'Hasta 15.000 comentarios por sorteo',
      'Multi-post (combinar comentarios de varios reels o posts)',
      'Personalización de marca en landings y certificados (logo propio)',
      'Sorteos automáticos programados con fecha y hora',
      'Exportación CSV auditada para asesorías legales',
      'Soporte prioritario por WhatsApp'
    ],
    ctaLabel: 'Elegir Plan Business'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Eventos masivos y grandes corporaciones',
    priceMonthly: 79.99,
    priceAnnual: 769.90,
    commentLimit: 100000,
    features: [
      'Más de 100.000 comentarios por sorteo',
      'Infraestructura dedicada en colas de procesamiento',
      'Dominio personalizado para tus sorteos',
      'SLA garantizado del 99.9%',
      'Acuerdo de confidencialidad y compliance RGPD a medida',
      'Gerente de cuenta dedicado'
    ],
    ctaLabel: 'Contactar Ventas'
  }
];
