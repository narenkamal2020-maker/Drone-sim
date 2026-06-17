import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ children, className, glass = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass ? "glass-card" : "bg-[var(--card-bg)] border-[var(--border-color)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pb-3 flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-bold tracking-tight text-[var(--text-primary)]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--text-muted)] font-medium", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pb-5 text-sm text-[var(--text-secondary)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-3 border-t border-[var(--border-color)] bg-[var(--canvas-bg)]/40 flex items-center justify-between rounded-b-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
