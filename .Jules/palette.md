## 2025-05-18 - Mobile Drawer Accessibility Pattern in Subdomains
**Learning:** Slide-over drawer navigation and modal menus across the apps frequently lack default `Escape` key event listeners, proper ARIA dialog semantics (`role="dialog"`, `aria-modal="true"`), and dynamic state on trigger buttons (`aria-expanded`, dynamic `aria-label`).
**Action:** When working on navigation or overlay components in this monorepo, always ensure `Escape` key listeners are registered during open state, ARIA dialog roles are applied, and trigger buttons declare `aria-expanded` and focus rings.
