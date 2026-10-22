## 2025-05-20 - WAI-ARIA Accordion Pattern for Collapsible UI
**Learning:** Collapsible components in Next.js apps often lack standard ARIA attributes (`aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`) and clear focus rings, which prevents screen readers and keyboard users from understanding item states and navigating efficiently.
**Action:** Always verify interactive disclosure components (accordions, dropdowns, collapsibles) have full ARIA state attributes and `focus-visible:ring-2` styles.
