## 2026-05-18 - Navigation Dropdown & Mobile Drawer Accessibility Pattern
**Learning:** Custom Next.js UI elements like dropdown menus and slide-over drawers often lack `Escape` key handlers and ARIA state attributes (`aria-expanded`, `aria-controls`, dynamic `aria-label`).
**Action:** Always pair dropdown trigger buttons and mobile menu drawers with `Escape` key event listeners for keyboard navigation and complete `aria-expanded` and `aria-controls` bindings for screen reader support.
