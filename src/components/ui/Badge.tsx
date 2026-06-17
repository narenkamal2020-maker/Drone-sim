import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "info";
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    secondary: "bg-slate-900/60 text-slate-400 border-slate-800",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
