# Palette's Journal - Critical UX & Accessibility Learnings

## 2026-03-31 - Explicit Label Association & Toggle Button ARIA States in Financial Calculators
**Learning:** Interactive financial calculators with custom toggle/pill buttons and numeric inputs often lack explicit input label association (`htmlFor` / `id`) and state announcements (`aria-pressed`), leaving screen reader users without context when toggling regime or pension options.
**Action:** Always associate numeric inputs explicitly with their labels using `htmlFor` and add `aria-pressed={isSelected}` and descriptive `aria-label`s to custom toggle button groups in calculator forms.
