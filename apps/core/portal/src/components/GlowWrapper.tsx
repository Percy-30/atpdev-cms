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
      // Find all glow elements (both styles) inside this container
      const cards = container.querySelectorAll('.glow-element-full, .glow-element-border');
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Use type assertion to avoid TypeScript errors on style.setProperty
        (card as HTMLElement).style.setProperty('--x', `${x}px`);
        (card as HTMLElement).style.setProperty('--y', `${y}px`);
      });
    };

    container.addEventListener('pointermove', handlePointerMove);
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
