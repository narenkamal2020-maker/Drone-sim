import React from "react";
import { Card, CardContent } from "../ui/Card";
import { cn } from "@/lib/utils";

export interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  glowColor?: "blue" | "emerald" | "amber" | "rose";
}

export function MetricsCard({
  title,
  value,
  icon,
  description,
  trend,
  glowColor,
}: MetricsCardProps) {
  const glowClasses = {
    blue: "glow-blue border-sky-500/10",
    emerald: "glow-emerald border-emerald-500/10",
    amber: "shadow-[0_0_15px_rgba(245,158,11,0.08)] border-amber-500/10",
    rose: "shadow-[0_0_15px_rgba(239,68,68,0.08)] border-red-500/10",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        glowColor && glowClasses[glowColor]
      )}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-white">
              {value}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            {icon}
          </div>
        </div>
        {description && (
          <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
            {trend && (
              <span
                className={cn(
                  "font-bold px-1 rounded text-[10px]",
                  trend.positive
                    ? "bg-emerald-500/10 text-emerald-450"
                    : "bg-red-500/10 text-red-450"
                )}
              >
                {trend.value}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricsCard;
