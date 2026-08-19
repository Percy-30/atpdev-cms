import Link from "next/link";
import { SiteConfig } from "@atpdev/database";

export default function Footer({
  config,
  ui
}: {
  config: SiteConfig | null;
  ui: Record<string, string>;
}) {
  return (
    <footer className="pt-16 pb-8 border-t transition-colors" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div>
          <h3 className="text-2xl font-black mb-4" style={{ color: 'var(--text-color)' }}>ATP DEV</h3>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>{ui.footerBio}</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-xs" style={{ color: 'var(--text-color)' }}>{ui.footerLinks}</h4>
          <ul className="space-y-3">
            <li><a href="#about" className="hover:text-blue-500 text-sm transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.linkAbout}</a></li>
            <li><a href="#experience" className="hover:text-blue-500 text-sm transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.linkExperience}</a></li>
            <li><a href="#portfolio" className="hover:text-blue-500 text-sm transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.linkProjects}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-xs" style={{ color: 'var(--text-color)' }}>{ui.footerLegal}</h4>
          <ul className="space-y-3">
            <li><Link href="/privacy" className="hover:text-blue-500 text-sm transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.linkPrivacy}</Link></li>
            <li><Link href="/terms" className="hover:text-blue-500 text-sm transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.linkTerms}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 border-t pt-8 flex flex-col md:flex-row items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-sm mb-4 md:mb-0" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
          &copy; {new Date().getFullYear()} {config?.full_name || "Percy Acha Taipe"} (ATP Dev). {ui.allRights}
        </p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          {[
            { key: 'whatsapp', name: 'WhatsApp' },
            { key: 'telegram', name: 'Telegram' },
            { key: 'github', name: 'GitHub' },
            { key: 'linkedin', name: 'LinkedIn' },
            { key: 'twitter', name: 'Twitter' },
          ].map(social => {
            if (!config) return null;
            const enabledKey = `${social.key}_enabled` as keyof typeof config;
            const urlKey = `${social.key}_url` as keyof typeof config;
            if (!config[enabledKey] || !config[urlKey]) return null;
            return (
              <a key={social.key} href={config[urlKey] as string} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
                {social.name}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
