import React from "react";
import { ITask } from "@/models/Task";
import { IProject } from "@/models/Project";
import { IMember } from "@/models/Member";
import { Calendar, Trash2, ArrowLeft, ArrowRight, User, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "./ui/Badge";
import { DeadlineBadge } from "./dashboard/DeadlineKPI";

export interface TaskCardProps {
  task: ITask;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: "todo" | "inprogress" | "done") => void;
  onDeleteTask: (taskId: string) => void;
  onEditClick: (task: ITask) => void;
  isSyncing?: boolean;
}

const priorityColors = {
  low: "info" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

const priorityDots = {
  low: "bg-sky-500",
  medium: "bg-amber-500",
  high: "bg-red-500 animate-pulse",
};

export function TaskCard({
  task,
  onDragStart,
  onMoveTask,
  onDeleteTask,
  onEditClick,
  isSyncing = false,
}: TaskCardProps) {
  const project = task.projectId as unknown as IProject;
  const member = task.assignedTo as unknown as IMember | null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => onEditClick(task)}
      className={cn(
        "rounded-xl border p-3.5 cursor-grab active:cursor-grabbing",
        "bg-[var(--card-bg)] border-[var(--border-color)]",
        "hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg",
        "transition-all duration-200 relative group",
        isSyncing && "opacity-60 border-amber-500/40"
      )}
    >
      {isSyncing && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
          Syncing
        </div>
      )}

      {/* Project + Priority Row */}
      <div className="flex justify-between items-center gap-2 mb-2">
        {project && (
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide truncate max-w-[130px]">
            {project.name}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", priorityDots[task.priority])} />
          <Badge variant={priorityColors[task.priority] || "default"}>
            {task.priority}
          </Badge>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1 group-hover:text-sky-400 transition-colors line-clamp-1">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Deadline Badge */}
      {task.dueDate && (
        <div className="mb-2.5">
          <DeadlineBadge dueDate={task.dueDate} status={task.status} />
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center gap-2 pt-2.5 border-t border-[var(--border-color)]">
        {/* Due Date */}
        <div className="flex items-center gap-1 text-[var(--text-muted)] text-[10px] font-semibold">
          {task.dueDate ? (
            <>
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </>
          ) : <span />}
        </div>

        {/* Assignee + Controls */}
        <div className="flex items-center gap-2">
          {member ? (
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 border border-black/10"
              style={{ backgroundColor: member.avatarColor || "#0EA5E9" }}
              title={`${member.name}`}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-[var(--border-color)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
              <User className="h-3 w-3 text-[var(--text-muted)]" />
            </div>
          )}

          {/* Quick action buttons — stop propagation to not trigger edit */}
          <div
            className="flex items-center gap-0.5 bg-[var(--border-color)] p-0.5 rounded border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {task.status !== "todo" && (
              <button
                type="button"
                onClick={() => onMoveTask(task._id, task.status === "done" ? "inprogress" : "todo")}
                className="p-1 hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer"
                title="Move Left"
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onEditClick(task)}
              className="p-1 hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-sky-400 rounded transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit3 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteTask(task._id)}
              className="p-1 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 rounded transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
            {task.status !== "done" && (
              <button
                type="button"
                onClick={() => onMoveTask(task._id, task.status === "todo" ? "inprogress" : "done")}
                className="p-1 hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer"
                title="Move Right"
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
