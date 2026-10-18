## 2025-05-18 - Accessible Navigation & Menu Toggles
**Learning:** Dropdowns and slide-over drawers require synchronized ARIA attributes (`aria-expanded`, `aria-haspopup`, and context-aware `aria-label`) alongside `Escape` key event listeners to ensure full screen reader and keyboard accessibility.
**Action:** When building custom toggle components or drawer overlays, always bind `aria-expanded` and an `Escape` key handler to allow keyboard users to easily dismiss open menus.
