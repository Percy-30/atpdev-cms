export const uiEs = {
  heroDesc: "Construyendo experiencias de software escalables y de alto rendimiento. Especializado en arquitecturas limpias, interfaces modernas y soluciones integradas con Inteligencia Artificial.",
  btnProjects: "Ver Proyectos →",
  btnAbout: "Sobre Mí (Detalles)",
  btnPdf: "Descargar PDF",
  techStack: "TECH STACK",
  featuredProjects: "Proyectos Destacados",
  featuredDesc: "Explora algunas de las aplicaciones y sistemas que he diseñado desde cero, enfocados en monetización y utilidad real.",
  filterAll: "Todos",
  techStackTitle: "Stack Tecnológico",
  btnDemo: "Ver Demo",
  btnPlayStore: "Ver en Play Store",
  footerBio: "Ingeniero de Sistemas y desarrollador Fullstack. Transformando ideas en productos digitales de alto rendimiento.",
  footerLinks: "Enlaces Rápidos",
  footerLegal: "Legal",
  allRights: "Todos los derechos reservados.",
  linkAbout: "Sobre Mí",
  linkExperience: "Experiencia",
  linkProjects: "Proyectos",
  linkPrivacy: "Política de Privacidad",
  linkTerms: "Términos de Servicio",
  aiTitle1: "Potenciado por",
  aiTitle2: "Inteligencia Artificial",
  aiDesc: "Integración de modelos fundacionales y aprendizaje automático para crear experiencias escalables y de próxima generación.",
  aiCaps: "Capacidades",
  aiActive: "Activo",
  availableForHire: "DISPONIBLE PARA CONTRATAR"
};

export const uiEn = {
  heroDesc: "Building scalable and high-performance software experiences. Specialized in clean architectures, modern interfaces, and solutions integrated with Artificial Intelligence.",
  btnProjects: "View Projects →",
  btnAbout: "About Me (Details)",
  btnPdf: "Download PDF",
  techStack: "TECH STACK",
  featuredProjects: "Featured Projects",
  featuredDesc: "Explore some of the applications and systems I have designed from scratch, focused on monetization and real utility.",
  filterAll: "All",
  techStackTitle: "Tech Stack",
  btnDemo: "View Demo",
  btnPlayStore: "View on Play Store",
  footerBio: "Systems Engineer and Fullstack developer. Transforming ideas into high-performance digital products.",
  footerLinks: "Quick Links",
  footerLegal: "Legal",
  allRights: "All rights reserved.",
  linkAbout: "About Me",
  linkExperience: "Experience",
  linkProjects: "Projects",
  linkPrivacy: "Privacy Policy",
  linkTerms: "Terms of Service",
  aiTitle1: "Powered by",
  aiTitle2: "Artificial Intelligence",
  aiDesc: "Integration of foundational models and machine learning to create scalable and next-generation experiences.",
  aiCaps: "Capabilities",
  aiActive: "Active",
  availableForHire: "AVAILABLE FOR HIRE"
};

export const uiRu = {
  heroDesc: "Создание масштабируемого и высокопроизводительного программного обеспечения. Специализируюсь на чистой архитектуре, современных интерфейсах и решениях с интеграцией Искусственного Интеллекта.",
  btnProjects: "Смотреть проекты →",
  btnAbout: "Обо мне (Подробно)",
  btnPdf: "Скачать PDF",
  techStack: "ТЕХНОЛОГИЧЕСКИЙ СТЕК",
  featuredProjects: "Популярные проекты",
  featuredDesc: "Изучите некоторые из приложений и систем, которые я разработал с нуля, ориентированные на монетизацию и реальную пользу.",
  filterAll: "Все",
  techStackTitle: "Стек технологий",
  btnDemo: "Смотреть демо",
  btnPlayStore: "Смотреть в Play Store",
  footerBio: "Системный инженер и Fullstack разработчик. Превращаю идеи в высокопроизводительные цифровые продукты.",
  footerLinks: "Быстрые ссылки",
  footerLegal: "Правовая информация",
  allRights: "Все права защищены.",
  linkAbout: "Обо мне",
  linkExperience: "Опыт работы",
  linkProjects: "Проекты",
  linkPrivacy: "Политика конфиденциальности",
  linkTerms: "Условия использования",
  aiTitle1: "На базе",
  aiTitle2: "Искусственного Интеллекта",
  aiDesc: "Интеграция базовых моделей и машинного обучения для создания масштабируемого опыта нового поколения.",
  aiCaps: "Возможности",
  aiActive: "Активен",
  availableForHire: "ДОСТУПЕН ДЛЯ НАЙМА"
};

export const uiDictionary: Record<string, typeof uiEs> = {
  es: uiEs,
  en: uiEn,
  ru: uiRu,
  hi: uiEn, // Default to English for now to save time
  zh: uiEn,
  fr: uiEn,
  de: uiEn,
  pt: uiEs, // Could default to Spanish or create uiPt
  ja: uiEn,
};

export function getUiDictionary(lang: string) {
  return uiDictionary[lang] || uiDictionary['es'];
}
