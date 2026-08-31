import { type ReactNode } from "react";
import { cn } from "@shared/lib/cn";

type Props = {
  index?: string;
  children: ReactNode;
  className?: string;
};

export function Eyebrow({ index, children, className }: Props) {
  return (
    <div className={cn("eyebrow flex items-center gap-3", className)}>
      {index && (
        <>
          <span className="text-brass">{index}</span>
          <span aria-hidden className="h-px w-8 bg-cream/25" />
        </>
      )}
      <span>{children}</span>
    </div>
  );
}
