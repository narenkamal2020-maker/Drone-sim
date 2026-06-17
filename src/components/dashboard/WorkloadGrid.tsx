import React from "react";
import { ITask } from "@/models/Task";
import { IMember } from "@/models/Member";
import { cn } from "@/lib/utils";
import { Users, AlertTriangle } from "lucide-react";

interface WorkloadGridProps {
  tasks: ITask[];
  members: IMember[];
}

export function WorkloadGrid({ tasks, members }: WorkloadGridProps) {
  // Build workload map: memberId -> active task count
  const workloadMap = members.map((member) => {
    const activeTasks = tasks.filter((t) => {
      if (!t.assignedTo) return false;
      const assignedId =
        typeof t.assignedTo === "object"
          ? (t.assignedTo as IMember)._id
          : String(t.assignedTo);
      return (
        assignedId === member._id &&
        (t.status === "todo" || t.status === "inprogress")
      );
    });
    return { member, activeCount: activeTasks.length };
  });

  // Sort by workload descending
  workloadMap.sort((a, b) => b.activeCount - a.activeCount);

  const OVERLOAD_THRESHOLD = 5;

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center gap-2">
        <Users className="h-4 w-4 text-sky-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Team Workload
        </h3>
      </div>

      <div className="p-3 space-y-2.5 max-h-[280px] overflow-y-auto">
        {members.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-6">
            No team members yet.
          </p>
        ) : (
          workloadMap.map(({ member, activeCount }) => {
            const isOverloaded = activeCount > OVERLOAD_THRESHOLD;
            const barPercent = Math.min((activeCount / Math.max(OVERLOAD_THRESHOLD + 2, 1)) * 100, 100);

            return (
              <div
                key={member._id}
                className={cn(
                  "p-2.5 rounded-xl border transition-all duration-300",
                  isOverloaded
                    ? "border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                    : "border-[var(--border-color)] bg-[var(--border-color)]/20"
                )}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0 border border-black/10"
                    style={{ backgroundColor: member.avatarColor || "#0EA5E9" }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isOverloaded && (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded animate-pulse">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Overloaded
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[var(--text-muted)] tabular-nums">
                          {activeCount} active
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">{member.role}</p>
                  </div>
                </div>

                {/* Workload progress bar */}
                <div className="h-1 w-full bg-[var(--border-color)] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      isOverloaded
                        ? "bg-gradient-to-r from-red-500 to-rose-600"
                        : "bg-gradient-to-r from-sky-500 to-indigo-500"
                    )}
                    style={{ width: `${barPercent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default WorkloadGrid;
