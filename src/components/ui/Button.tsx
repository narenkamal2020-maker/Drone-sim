import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "danger" | "ghost" | "glass" | "sky";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variantStyles = {
    default:
      "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/15",
    secondary:
      "border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--canvas-bg)]",
    danger: "bg-red-500/90 hover:bg-red-500 text-white shadow-lg shadow-red-500/15",
    ghost:
      "text-[var(--text-muted)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)]",
    glass:
      "border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] backdrop-blur-md hover:border-sky-500/30 hover:text-[var(--text-primary)]",
    sky: "bg-sky-500 hover:bg-sky-400 text-slate-950",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
