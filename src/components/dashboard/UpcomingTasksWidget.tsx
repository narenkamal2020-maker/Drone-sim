"use client";

import React from "react";
import { ITask } from "@/models/Task";
import { IMember } from "@/models/Member";
import { getDeadlineStatus, formatDisplayDate } from "@/lib/dateUtils";
import { CalendarClock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingTasksWidgetProps {
  tasks: ITask[];
}

export function UpcomingTasksWidget({ tasks }: UpcomingTasksWidgetProps) {
  // Filter for active tasks that have a due date
  const activeTasksWithDue = tasks
    .filter((task) => task.dueDate && task.status !== "done")
    .sort((a, b) => {
      const aDate = new Date(a.dueDate!).getTime();
      const bDate = new Date(b.dueDate!).getTime();
      return aDate - bDate;
    })
    .slice(0, 5); // Limit to top 5 upcoming tasks

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      case "today":
        return "text-amber-400 border-amber-500/20 bg-amber-500/10 animate-pulse";
      default:
        return "text-sky-400 border-sky-500/20 bg-sky-500/10";
    }
  };

  const getStatusLabel = (status: string, date: Date | string) => {
    if (status === "overdue") return "Overdue";
    if (status === "today") return "Today";
    return formatDisplayDate(date);
  };

  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-sky-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Upcoming Deadlines
        </h3>
      </div>

      <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
        {activeTasksWithDue.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-6">
            No upcoming deadlines.
          </p>
        ) : (
          activeTasksWithDue.map((task) => {
            const dlStatus = getDeadlineStatus(task.dueDate);
            const projectName =
              task.projectId &&
              typeof task.projectId === "object" &&
              "name" in task.projectId
                ? (task.projectId as any).name
                : "";

            const member =
              task.assignedTo &&
              typeof task.assignedTo === "object" &&
              "name" in task.assignedTo
                ? (task.assignedTo as unknown as IMember)
                : null;

            return (
              <div
                key={task._id}
                className="rounded-xl border border-[var(--border-color)] p-2.5 hover:border-sky-500/30 transition-all bg-[var(--canvas-bg)]/40 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                    {projectName || "No Project"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {dlStatus && dlStatus !== "future" ? (
                    <span
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                        getStatusStyle(dlStatus)
                      )}
                    >
                      {getStatusLabel(dlStatus, task.dueDate!)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)] font-semibold">
                      {formatDisplayDate(task.dueDate)}
                    </span>
                  )}

                  {member ? (
                    <div
                      className="h-5.5 w-5.5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white shrink-0 border border-black/10"
                      style={{ backgroundColor: member.avatarColor || "#0EA5E9" }}
                      title={member.name}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="h-5.5 w-5.5 rounded-full bg-[var(--border-color)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                      <User className="h-2.5 w-2.5 text-[var(--text-muted)]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default UpcomingTasksWidget;
