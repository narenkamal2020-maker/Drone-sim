import React, { useState } from "react";
import { ITask } from "@/models/Task";
import TaskCard from "../TaskCard";
import EmptyState from "../ui/EmptyState";
import { ArrowRightLeft, ShieldAlert, LayoutList, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KanbanBoardProps {
  tasks: ITask[];
  allTasksCount: number; // total before filtering, to detect empty-search
  onUpdateTaskStatus: (taskId: string, newStatus: "todo" | "inprogress" | "done") => Promise<boolean>;
  onDeleteTask: (taskId: string) => Promise<boolean>;
  onEditTask: (task: ITask) => void;
  onOpenCreateTask: () => void;
  isLoading: boolean;
  syncingTasks: Record<string, boolean>;
  rollbackErrors: Record<string, string>;
}

const COLUMNS: { id: "todo" | "inprogress" | "done"; title: string; accent: string; dropHighlight: string }[] = [
  { id: "todo",       title: "To Do",       accent: "bg-sky-500",     dropHighlight: "border-sky-500/30 bg-sky-500/[0.03]" },
  { id: "inprogress", title: "In Progress", accent: "bg-amber-500",   dropHighlight: "border-amber-500/30 bg-amber-500/[0.03]" },
  { id: "done",       title: "Done",        accent: "bg-emerald-500", dropHighlight: "border-emerald-500/30 bg-emerald-500/[0.03]" },
];

export function KanbanBoard({
  tasks,
  allTasksCount,
  onUpdateTaskStatus,
  onDeleteTask,
  onEditTask,
  onOpenCreateTask,
  isLoading,
  syncingTasks,
  rollbackErrors,
}: KanbanBoardProps) {
  const [draggedOverCol, setDraggedOverCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, colId: "todo" | "inprogress" | "done") => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== colId) onUpdateTaskStatus(taskId, colId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 min-h-[420px] space-y-3 animate-pulse">
            <div className="flex justify-between items-center mb-3">
              <div className="h-3 w-20 bg-[var(--border-color)] rounded-md" />
              <div className="h-5 w-6 bg-[var(--border-color)] rounded-full" />
            </div>
            <div className="h-[90px] bg-[var(--border-color)] rounded-xl opacity-60" />
            <div className="h-[90px] bg-[var(--border-color)] rounded-xl opacity-40" />
          </div>
        ))}
      </div>
    );
  }

  // Empty search state — tasks exist globally but none match filters
  if (tasks.length === 0 && allTasksCount > 0) {
    return (
      <EmptyState
        icon={Search}
        title="No matching nodes found"
        description="Refine your query filters or clear the active query criteria to see all tasks."
        secondaryAction={{ label: "Clear Filters", onClick: () => window.location.reload() }}
        className="min-h-[300px]"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const isOver = draggedOverCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => { e.preventDefault(); setDraggedOverCol(col.id); }}
            onDragLeave={() => setDraggedOverCol(null)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={cn(
              "rounded-2xl border min-h-[420px] flex flex-col transition-all duration-200 p-4",
              "bg-[var(--card-bg)] backdrop-blur-md",
              isOver ? cn("border-dashed", col.dropHighlight) : "border-[var(--border-color)]"
            )}
          >
            {/* Column header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{col.title}</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--border-color)] text-[var(--text-muted)] border border-[var(--border-color)]">
                {colTasks.length}
              </span>
            </div>

            {/* Task cards */}
            <div className="flex-1 flex flex-col gap-2.5">
              {colTasks.length > 0 ? (
                colTasks.map((task) => (
                  <div key={task._id} className="relative">
                    {rollbackErrors[task._id] && (
                      <div
                        className="absolute -top-1 -left-1 z-10 p-1 bg-red-500 rounded-full text-white shadow-lg animate-bounce"
                        title={`Sync failed: ${rollbackErrors[task._id]}`}
                      >
                        <ShieldAlert className="h-3 w-3" />
                      </div>
                    )}
                    <TaskCard
                      task={task}
                      onDragStart={handleDragStart}
                      onMoveTask={onUpdateTaskStatus}
                      onDeleteTask={onDeleteTask}
                      onEditClick={onEditTask}
                      isSyncing={!!syncingTasks[task._id]}
                    />
                  </div>
                ))
              ) : (
                <div className="flex-1 border-2 border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center p-6 text-center min-h-[140px]">
                  <ArrowRightLeft className="h-5 w-5 text-[var(--text-muted)] mb-1.5 opacity-30" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] opacity-50">
                    {col.id === "todo" ? "No tasks yet" : "Drop here"}
                  </p>
                  {col.id === "todo" && (
                    <button
                      type="button"
                      onClick={onOpenCreateTask}
                      className="mt-3 text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      + Create task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
