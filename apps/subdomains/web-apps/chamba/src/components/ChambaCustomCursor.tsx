"use client";

import { useEffect, useState, useRef } from "react";

export function ChambaCustomCursor() {
  const [styleType, setStyleType] = useState<string>("cursor-ia");
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    // Read initial mode from body data-interaction or class
    const updateStyle = () => {
      const mode = document.body.getAttribute("data-interaction") || "";
      const match = mode.split(',').find(s => s.trim().startsWith('cursor-'));
      if (match) {
        setStyleType(match.trim());
      }
    };
    updateStyle();

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setIsVisible(prev => (!prev ? true : prev));

      const el = e.target as HTMLElement | null;
      const hovering = Boolean(el && el.closest('button, a, input, select, textarea, [role="button"], .interactive-card, .glass-card'));
      setIsHovering(prev => (prev !== hovering ? hovering : prev));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data && (e.data.type === "UPDATE_CHAMBA_THEME" || e.data.type === "UPDATE_THEME_PREVIEW")) {
        const glow = e.data.payload?.glow_style || e.data.payload?.glowStyle;
        if (glow) {
          const match = glow.split(',').find((s: string) => s.trim().startsWith('cursor-'));
          if (match) setStyleType(match.trim());
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("message", handleMessage);

    // Smooth animation loop (lerp)
    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;
      pos.current.x += (target.current.x - pos.current.x) * 0.25;
      pos.current.y += (target.current.y - pos.current.y) * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrame.current = requestAnimationFrame(loop);
    };
    animFrame.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("message", handleMessage);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  if (styleType === "cursor-off" || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Primary Cursor Head */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 transition-transform ease-out will-change-transform"
        style={{ transform: `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)` }}
      >
        {styleType === "cursor-ia" && (
          <div className="relative flex items-center justify-center">
            <div
              className={`w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald,#10b981)] shadow-[0_0_12px_var(--accent-emerald,#10b981)] transition-transform duration-200 ${
                isHovering ? "scale-150" : "scale-100"
              }`}
            />
          </div>
        )}

        {styleType === "cursor-dot" && (
          <div
            className={`w-3 h-3 rounded-full bg-[var(--accent-emerald,#10b981)] shadow-[0_0_15px_var(--accent-emerald,#10b981)] transition-transform duration-150 ${
              isHovering ? "scale-175" : "scale-100"
            }`}
          />
        )}

        {styleType === "cursor-crosshair" && (
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="w-full h-[1.5px] bg-[var(--accent-emerald,#10b981)] shadow-[0_0_6px_var(--accent-emerald,#10b981)] absolute" />
            <div className="h-full w-[1.5px] bg-[var(--accent-emerald,#10b981)] shadow-[0_0_6px_var(--accent-emerald,#10b981)] absolute" />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute" />
          </div>
        )}

        {styleType === "cursor-pulse" && (
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-emerald,#10b981)]" />
            <div className="absolute w-8 h-8 rounded-full border border-[var(--accent-emerald,#10b981)] animate-ping opacity-60" />
          </div>
        )}
      </div>

      {/* Trailing Outer Ring (IA Studio & Trails) */}
      {(styleType === "cursor-ia" || styleType === "cursor-trail" || styleType === "cursor-bubbles") && (
        <div
          ref={trailRef}
          className="fixed top-0 left-0 will-change-transform"
          style={{ transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)` }}
        >
          {styleType === "cursor-ia" && (
            <div
              className={`w-8 h-8 rounded-full border border-[var(--accent-emerald,#10b981)] opacity-70 transition-all duration-300 ${
                isHovering ? "scale-140 bg-[var(--accent-emerald,#10b981)]/10" : "scale-100"
              }`}
            />
          )}

          {styleType === "cursor-trail" && (
            <div className="w-5 h-5 rounded-full bg-[var(--accent-emerald,#10b981)]/30 blur-[2px] animate-pulse" />
          )}

          {styleType === "cursor-bubbles" && (
            <div className="w-6 h-6 rounded-full border border-white/40 bg-[var(--accent-emerald,#10b981)]/20 blur-[1px]" />
          )}
        </div>
      )}
    </div>
  );
}
