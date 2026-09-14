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
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const mode = document.body.getAttribute("data-interaction") || "spotlight-border";
      const cards = container.querySelectorAll('.interactive-card, .glass-card');
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Track mouse coordinates for neon spotlight & effects
        (card as HTMLElement).style.setProperty('--x', `${x}px`);
        (card as HTMLElement).style.setProperty('--y', `${y}px`);
        
        if (mode.includes("tilt")) {
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          (card as HTMLElement).style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
        }
      });
      
      // Magnet effect for buttons
      if (mode.includes("magnet")) {
        const buttons = container.querySelectorAll('a, button, [role="button"]');
        buttons.forEach(btn => {
          const r = btn.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = e.clientX - cx, dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && r.width < 400) {
            (btn as HTMLElement).style.transition = 'transform 0.1s ease-out';
            (btn as HTMLElement).style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
          } else {
            (btn as HTMLElement).style.transition = 'transform 0.3s ease-out';
            (btn as HTMLElement).style.transform = 'translate(0,0)';
          }
        });
      }
    };

    const handleMouseLeave = () => {
      const cards = container.querySelectorAll('.interactive-card, .glass-card');
      cards.forEach((card) => {
        (card as HTMLElement).style.transform = 'rotateY(0) rotateX(0)';
      });
      const buttons = container.querySelectorAll('a, button, [role="button"]');
      buttons.forEach(btn => {
        (btn as HTMLElement).style.transition = 'transform 0.3s ease-out';
        (btn as HTMLElement).style.transform = 'translate(0,0)';
      });
    };

    const handleClick = (e: MouseEvent) => {
      const mode = document.body.getAttribute("data-interaction") || "spotlight-border";
      const target = e.target as HTMLElement;
      const card = target.closest('.interactive-card, .glass-card') as HTMLElement;
      if (!card) return;

      const rect = card.getBoundingClientRect();

      if (mode.includes("ripple")) {
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
        const cols = ['var(--accent-emerald, #10b981)', 'var(--primary, #10b981)', '#ffffff', '#38bdf8'];
        for (let i = 0; i < 30; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 4 + 1.5;
          const p = document.createElement('div');
          p.className = 'interaction-particle';
          p.style.left = `${e.clientX - rect.left}px`;
          p.style.top = `${e.clientY - rect.top}px`;
          p.style.backgroundColor = cols[i % cols.length];
          p.style.setProperty('--vx', `${Math.cos(ang) * spd * 15}px`);
          p.style.setProperty('--vy', `${Math.sin(ang) * spd * 15}px`);
          card.appendChild(p);
          setTimeout(() => p.remove(), 600);
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);
    
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className={className}>
      {/* SVG Noise Filter for Electric Glow Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="atp-electric-jitter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.95" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" dur="0.15s" values="0.04 0.95;0.08 0.85;0.03 0.98;0.04 0.95" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
}
