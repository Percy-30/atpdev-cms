"use client";

import { useEffect, useState, useRef } from "react";

export function SorteosCustomCursor() {
  const [styleType, setStyleType] = useState<string>("cursor-off");
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const updateStyle = () => {
      const modeAttr = document.body.getAttribute("data-cursor") || "";
      const interAttr = document.body.getAttribute("data-interaction") || "";
      
      let found = modeAttr;
      if (!found || found === "cursor-default" || found === "cursor-off") {
        const fromInter = interAttr.split(",").map(s => s.trim()).find(s => s.startsWith("cursor-"));
        if (fromInter) found = fromInter;
      }

      if (found && found !== "cursor-off" && found !== "cursor-default") {
        setStyleType(found);
      } else {
        setStyleType("cursor-off");
      }
    };

    updateStyle();

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setIsVisible(true);

      const el = e.target as HTMLElement | null;
      const hovering = Boolean(
        el &&
          el.closest(
            'button, a, input, select, textarea, [role="button"], .interactive-card, .glass-card, [data-interactive="true"]'
          )
      );
      setIsHovering(hovering);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Listen to iframe postMessage & BroadcastChannel
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data &&
        (e.data.type === "UPDATE_SORTEOS_THEME" || e.data.type === "UPDATE_THEME_PREVIEW")
      ) {
        const cursor = e.data.payload?.cursor_effect || e.data.payload?.cursorEffect;
        const glow = e.data.payload?.glow_style || e.data.payload?.glowStyle;

        let found = cursor;
        if (!found || found === "cursor-default" || found === "cursor-off") {
          if (glow) {
            const fromGlow = glow.split(",").map((s: string) => s.trim()).find((s: string) => s.startsWith("cursor-"));
            if (fromGlow) found = fromGlow;
          }
        }

        if (found && found !== "cursor-off" && found !== "cursor-default") {
          setStyleType(found);
        } else {
          setStyleType("cursor-off");
        }
      }
    };

    // Mutation observer on document.body for instant attribute sync
    const observer = new MutationObserver(() => {
      updateStyle();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-cursor", "data-interaction"] });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("message", handleMessage);

    // Smooth animation loop (lerp)
    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;

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
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("message", handleMessage);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  if (styleType === "cursor-off" || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {/* Primary Cursor Center */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 transition-transform ease-out will-change-transform"
        style={{ transform: `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)` }}
      >
        {styleType === "cursor-ia" && (
          <div className="relative flex items-center justify-center">
            <div
              className={`w-2.5 h-2.5 rounded-full bg-[var(--primary,#f50a5c)] shadow-[0_0_14px_var(--primary,#f50a5c)] transition-transform duration-200 ${
                isHovering ? "scale-175" : "scale-100"
              }`}
            />
          </div>
        )}

        {styleType === "cursor-dot" && (
          <div
            className={`w-3.5 h-3.5 rounded-full bg-[var(--primary,#f50a5c)] shadow-[0_0_18px_var(--primary,#f50a5c)] transition-transform duration-150 ${
              isHovering ? "scale-175" : "scale-100"
            }`}
          />
        )}

        {styleType === "cursor-crosshair" && (
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="w-full h-[1.5px] bg-[var(--primary,#f50a5c)] shadow-[0_0_8px_var(--primary,#f50a5c)] absolute" />
            <div className="h-full w-[1.5px] bg-[var(--primary,#f50a5c)] shadow-[0_0_8px_var(--primary,#f50a5c)] absolute" />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute shadow-[0_0_4px_#fff]" />
          </div>
        )}

        {styleType === "cursor-pulse" && (
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[var(--primary,#f50a5c)] shadow-[0_0_10px_var(--primary,#f50a5c)]" />
            <div className="absolute w-9 h-9 rounded-full border border-[var(--primary,#f50a5c)] animate-ping opacity-75" />
          </div>
        )}
      </div>

      {/* Trailing Outer Ring (IA Studio, Estela Neón & Burbujas) */}
      {(styleType === "cursor-ia" || styleType === "cursor-trail" || styleType === "cursor-bubbles") && (
        <div
          ref={trailRef}
          className="fixed top-0 left-0 will-change-transform"
          style={{ transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)` }}
        >
          {styleType === "cursor-ia" && (
            <div
              className={`w-8 h-8 rounded-full border border-[var(--primary,#f50a5c)] opacity-75 transition-all duration-300 shadow-[0_0_12px_color-mix(in_srgb,var(--primary,#f50a5c)_30%,transparent)] ${
                isHovering ? "scale-150 bg-[var(--primary,#f50a5c)]/15 border-white" : "scale-100"
              }`}
            />
          )}

          {styleType === "cursor-trail" && (
            <div className="w-6 h-6 rounded-full bg-[var(--primary,#f50a5c)]/35 blur-[2.5px] animate-pulse shadow-[0_0_16px_var(--primary,#f50a5c)]" />
          )}

          {styleType === "cursor-bubbles" && (
            <div className="w-7 h-7 rounded-full border border-white/50 bg-[var(--secondary,#e530e8)]/25 blur-[1px] shadow-[0_0_14px_var(--secondary,#e530e8)]" />
          )}
        </div>
      )}
    </div>
  );
}
