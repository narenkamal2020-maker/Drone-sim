import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  align?: "center" | "left";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  align = "center",
  className,
}: EmptyStateProps) {
  const sizeMap = {
    sm: { wrapper: "p-6", icon: "h-10 w-10", iconInner: "h-5 w-5", title: "text-sm", desc: "text-xs" },
    md: { wrapper: "p-10", icon: "h-14 w-14", iconInner: "h-7 w-7", title: "text-base", desc: "text-sm" },
    lg: { wrapper: "p-14", icon: "h-20 w-20", iconInner: "h-10 w-10", title: "text-lg", desc: "text-sm" },
  };

  const s = sizeMap[size];

  return (
    <div
      className={cn(
        "flex flex-col border-2 border-dashed rounded-2xl",
        "border-[var(--border-color)]",
        align === "center" ? "items-center text-center" : "items-start text-left",
        s.wrapper,
        className
      )}
    >
      {/* Illustrated Icon Container */}
      <div
        className={cn(
          s.icon,
          "flex items-center justify-center rounded-2xl mb-4",
          "bg-[var(--card-bg)] border border-[var(--border-color)]",
          "text-[var(--text-muted)] shadow-inner"
        )}
      >
        <Icon className={cn(s.iconInner, "opacity-60")} strokeWidth={1.5} />
      </div>

      <h3 className={cn("font-bold text-[var(--text-primary)] mb-1.5", s.title)}>
        {title}
      </h3>
      <p className={cn("text-[var(--text-muted)] leading-relaxed max-w-xs", s.desc)}>
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-5 flex-wrap">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition-all duration-200 cursor-pointer shadow-md shadow-sky-500/20"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary-accent)] transition-all duration-200 cursor-pointer"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
