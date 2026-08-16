"use client";

import React, { useEffect, useRef } from "react";

interface GlowWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function GlowWrapper({ children, enabled = true, className = "" }: GlowWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const mode = document.body.getAttribute("data-interaction") || "spotlight";
      const cards = container.querySelectorAll('.interactive-card');
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Always track mouse coordinates for effects that need it
        (card as HTMLElement).style.setProperty('--x', `${x}px`);
        (card as HTMLElement).style.setProperty('--y', `${y}px`);
        
        if (mode.includes("tilt")) {
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          (card as HTMLElement).style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 16}deg)`;
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
      const cards = container.querySelectorAll('.interactive-card');
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
      const mode = document.body.getAttribute("data-interaction") || "spotlight";
      const target = e.target as HTMLElement;
      const card = target.closest('.interactive-card') as HTMLElement;
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
        const cols = ['var(--primary)','var(--secondary)','var(--tertiary)','#ffffff'];
        for(let i=0; i<36; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 4 + 1.5;
          const p = document.createElement('div');
          p.className = 'interaction-particle';
          p.style.left = `${e.clientX - rect.left}px`;
          p.style.top = `${e.clientY - rect.top}px`;
          p.style.backgroundColor = cols[i%4];
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
    <main ref={containerRef} className={className}>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="atp-electric-jitter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="2" result="noise" seed="3">
              <animate attributeName="baseFrequency" values="0.015 0.03;0.025 0.05;0.015 0.03" dur="4s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="atp-electric-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="2" result="noise2" seed="3">
              <animate attributeName="baseFrequency" values="0.015 0.03;0.025 0.05;0.015 0.03" dur="4s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise2" scale="7" xChannelSelector="R" yChannelSelector="G" result="disp"/>
            <feGaussianBlur in="disp" stdDeviation="4"/>
          </filter>
        </defs>
      </svg>
      {children}
    </main>
  );
}
