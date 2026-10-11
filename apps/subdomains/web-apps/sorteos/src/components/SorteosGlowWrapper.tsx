"use client";

import React, { useEffect, useRef } from "react";

interface SorteosGlowWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function SorteosGlowWrapper({ children, enabled = true, className = "" }: SorteosGlowWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    let activeCard: HTMLElement | null = null;
    let rafId: number | null = null;
    let latestEvent: PointerEvent | null = null;

    const updateActiveCard = () => {
      if (!latestEvent || !activeCard) {
        rafId = null;
        return;
      }

      const rect = activeCard.getBoundingClientRect();
      const x = latestEvent.clientX - rect.left;
      const y = latestEvent.clientY - rect.top;

      activeCard.style.setProperty("--x", `${x}px`);
      activeCard.style.setProperty("--y", `${y}px`);

      const mode = document.body.getAttribute("data-interaction") || "";
      if (mode.includes("tilt")) {
        const px = x / rect.width - 0.5;
        const py = y / rect.height - 0.5;
        activeCard.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
      }

      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const mode = document.body.getAttribute("data-interaction") || "";
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hoveredCard = target.closest(
        ".interactive-card, .glass-card, [data-interactive='true'], .rounded-2xl.border, .rounded-3xl.border, [class*='rounded-2xl'][class*='border'], [class*='rounded-3xl'][class*='border']"
      ) as HTMLElement | null;

      if (activeCard && activeCard !== hoveredCard) {
        activeCard.style.transform = "";
      }

      activeCard = hoveredCard;
      if (activeCard) {
        latestEvent = e;
        if (!rafId) {
          rafId = requestAnimationFrame(updateActiveCard);
        }
      }

      // Magnet effect for buttons & interactive elements
      if (mode.includes("magnet")) {
        const buttons = document.querySelectorAll("a, button, .btn-pro-primary");
        buttons.forEach((btn) => {
          const r = btn.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && r.width < 450) {
            (btn as HTMLElement).style.transition = "transform 0.1s ease-out";
            (btn as HTMLElement).style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
          } else if ((btn as HTMLElement).style.transform && (btn as HTMLElement).style.transform !== "translate(0, 0)") {
            (btn as HTMLElement).style.transition = "transform 0.3s ease-out";
            (btn as HTMLElement).style.transform = "translate(0, 0)";
          }
        });
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !activeCard?.contains(related)) {
        if (activeCard) {
          activeCard.style.transform = "";
          activeCard = null;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const mode = document.body.getAttribute("data-interaction") || "";
      if (!mode) return;

      const target = e.target as HTMLElement | null;
      const card = target ? (target.closest(
        ".interactive-card, .glass-card, [data-interactive='true'], .rounded-2xl.border, .rounded-3xl.border, [class*='rounded-2xl'][class*='border'], [class*='rounded-3xl'][class*='border']"
      ) as HTMLElement | null) : null;

      // 1. RIPPLE (Ondas Clic)
      if (mode.includes("ripple")) {
        const rippleGlobal = document.createElement("span");
        rippleGlobal.className = "interaction-ripple-global";
        rippleGlobal.style.left = `${e.clientX}px`;
        rippleGlobal.style.top = `${e.clientY}px`;
        document.body.appendChild(rippleGlobal);
        setTimeout(() => rippleGlobal.remove(), 850);

        if (card) {
          const rect = card.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          const el = document.createElement("span");
          el.className = "interaction-ripple";
          el.style.width = el.style.height = `${size}px`;
          el.style.left = `${e.clientX - rect.left}px`;
          el.style.top = `${e.clientY - rect.top}px`;
          card.appendChild(el);
          setTimeout(() => el.remove(), 850);
        }
      }

      // 2. BURST (Explosión Clic)
      if (mode.includes("burst")) {
        const count = 36;
        const cols = [
          "var(--primary, #f50a5c)",
          "var(--secondary, #e530e8)",
          "var(--tertiary, #f59e0b)",
          "#38bdf8",
          "#ffffff",
          "#4ade80"
        ];

        for (let i = 0; i < count; i++) {
          const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
          const spd = Math.random() * 85 + 40;
          const size = Math.random() * 6 + 4;
          const isSquare = Math.random() > 0.5;

          const p = document.createElement("div");
          p.className = "interaction-particle-global";
          p.style.left = `${e.clientX}px`;
          p.style.top = `${e.clientY}px`;
          p.style.width = `${size}px`;
          p.style.height = `${size}px`;
          p.style.borderRadius = isSquare ? "2px" : "50%";
          p.style.backgroundColor = cols[i % cols.length];
          p.style.boxShadow = `0 0 10px ${cols[i % cols.length]}`;
          p.style.setProperty("--vx", `${Math.cos(ang) * spd}px`);
          p.style.setProperty("--vy", `${Math.sin(ang) * spd + 16}px`);
          p.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);

          document.body.appendChild(p);
          setTimeout(() => p.remove(), 750);
        }
      }
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("click", handleClick, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className={className}>
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <filter id="atp-electric-jitter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="2" result="noise" seed="3">
              <animate attributeName="baseFrequency" values="0.015 0.03;0.025 0.05;0.015 0.03" dur="4s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="atp-electric-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="2" result="noise2" seed="3">
              <animate attributeName="baseFrequency" values="0.015 0.03;0.025 0.05;0.015 0.03" dur="4s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise2" scale="7" xChannelSelector="R" yChannelSelector="G" result="disp" />
            <feGaussianBlur in="disp" stdDeviation="4" />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
}
