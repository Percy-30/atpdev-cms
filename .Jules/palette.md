## 2026-10-25 - WAI-ARIA Accordion Pattern for Collapsible UI
**Learning:** Accordion toggles across Next.js app components require explicit `aria-expanded`, `aria-controls`, `role="region"`, and `aria-labelledby` linkages to enable screen readers to announce section states and allow keyboard navigation. Decorative icons inside buttons need `aria-hidden="true"`.
**Action:** When working on accordion or collapsible components, ensure `aria-expanded={isOpen}`, unique IDs linking trigger to content region, and `focus-visible` outline rings are present.
