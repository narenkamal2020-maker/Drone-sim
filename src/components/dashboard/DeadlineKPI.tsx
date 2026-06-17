import React from "react";
import { ITask } from "@/models/Task";
import { getDeadlineStatus, formatDisplayDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CalendarClock } from "lucide-react";

interface DeadlineKPIProps {
  tasks: ITask[];
}

export function DeadlineKPI({ tasks }: DeadlineKPIProps) {
  const active = tasks.filter((t) => t.dueDate && t.status !== "done");
  const overdueCount = active.filter((t) => getDeadlineStatus(t.dueDate) === "overdue").length;
  const todayCount = active.filter((t) => getDeadlineStatus(t.dueDate) === "today").length;
  const upcomingCount = active.filter((t) => getDeadlineStatus(t.dueDate) === "upcoming").length;

  const kpis = [
    { label: "Overdue", count: overdueCount, Icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", pulse: overdueCount > 0 },
    { label: "Due Today", count: todayCount, Icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", pulse: false },
    { label: "This Week", count: upcomingCount, Icon: CalendarClock, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", pulse: false },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {kpis.map(({ label, count, Icon, color, bg, pulse }) => (
        <div key={label} className={cn("flex flex-col items-center p-3 rounded-xl border text-center", bg)}>
          <div className={cn("mb-1", color, pulse && count > 0 && "animate-pulse")}>
            <Icon className="h-4 w-4 mx-auto" />
          </div>
          <span className={cn("text-2xl font-extrabold tabular-nums", color)}>{count}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );
}

interface DeadlineBadgeProps {
  dueDate?: Date | string | null;
  status: string;
  className?: string;
}

export function DeadlineBadge({ dueDate, status, className }: DeadlineBadgeProps) {
  if (!dueDate || status === "done") return null;
  const ds = getDeadlineStatus(dueDate);
  if (!ds || ds === "future") return null;

  const variants = {
    overdue: { label: "Overdue", cls: "bg-red-500/15 text-red-400 border-red-500/25" },
    today: { label: "Due Today", cls: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
    upcoming: { label: formatDisplayDate(dueDate), cls: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  };

  const v = variants[ds];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", v.cls, className)}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {v.label}
    </span>
  );
}

export default DeadlineKPI;
