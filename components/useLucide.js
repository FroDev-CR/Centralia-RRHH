"use client";
import { useEffect } from "react";
// Re-dibuja los íconos lucide (data-lucide) después de cada render.
export function useLucide(dep) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) window.lucide.createIcons();
  });
}
export function Ico({ name, size = 16, style }) {
  return <i data-lucide={name} style={{ width: size, height: size, ...style }} />;
}
