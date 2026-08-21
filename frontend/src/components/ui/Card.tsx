import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div className={cn("panel rounded-xl p-4 md:p-5", className)}>
      {title ? <div className="mb-4 text-sm font-medium text-[#F5F0E6]">{title}</div> : null}
      {children}
    </div>
  );
}
