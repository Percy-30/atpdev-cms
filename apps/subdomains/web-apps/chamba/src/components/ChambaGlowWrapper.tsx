"use client";

import React, { useEffect, useRef } from "react";

interface ChambaGlowWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function ChambaGlowWrapper({ children, enabled = true, className = "" }: ChambaGlowWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

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

      activeCard.style.setProperty('--x', `${x}px`);
      activeCard.style.setProperty('--y', `${y}px`);

      const mode = document.body.getAttribute("data-interaction") || "";
      if (mode.includes("tilt")) {
        const px = x / rect.width - 0.5;
        const py = y / rect.height - 0.5;
        activeCard.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
      }

      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hoveredCard = target.closest('.interactive-card, .glass-card') as HTMLElement | null;

      // If we moved away from the previously active card, reset it
      if (activeCard && activeCard !== hoveredCard) {
        activeCard.style.transform = '';
      }

      activeCard = hoveredCard;
      if (!activeCard) return;

      latestEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(updateActiveCard);
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !activeCard?.contains(related)) {
        if (activeCard) {
          activeCard.style.transform = '';
          activeCard = null;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const mode = document.body.getAttribute("data-interaction") || "";
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const card = target.closest('.interactive-card, .glass-card') as HTMLElement | null;
      if (!card) return;

      if (mode.includes("ripple")) {
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const el = document.createElement('span');
        el.className = 'interaction-ripple';
        el.style.width = el.style.height = `${size}px`;
        el.style.left = `${e.clientX - rect.left}px`;
        el.style.top = `${e.clientY - rect.top}px`;
        card.appendChild(el);
        setTimeout(() => el.remove(), 900);
      }

      if (mode.includes("burst")) {
        const rect = card.getBoundingClientRect();
        const cols = ['var(--accent-emerald, #10b981)', 'var(--primary, #10b981)', '#ffffff', '#38bdf8'];
        for (let i = 0; i < 16; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 3 + 1.5;
          const p = document.createElement('div');
          p.className = 'interaction-particle';
          p.style.left = `${e.clientX - rect.left}px`;
          p.style.top = `${e.clientY - rect.top}px`;
          p.style.backgroundColor = cols[i % cols.length];
          p.style.setProperty('--vx', `${Math.cos(ang) * spd * 12}px`);
          p.style.setProperty('--vy', `${Math.sin(ang) * spd * 12}px`);
          card.appendChild(p);
          setTimeout(() => p.remove(), 500);
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerout', handlePointerOut, { passive: true });
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerout', handlePointerOut);
      container.removeEventListener('click', handleClick);
      if (rafId) cancelAnimationFrame(rafId);
      if (activeCard) activeCard.style.transform = '';
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
