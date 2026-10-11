"use client";

import React from "react";

interface ChambaGlowWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function ChambaGlowWrapper({ children, className = "" }: ChambaGlowWrapperProps) {
  return <div className={className}>{children}</div>;
}
