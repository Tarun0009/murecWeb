"use client";

import { type ReactNode } from "react";
import { useSmoothScroll } from "@shared/hooks/useSmoothScroll";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
