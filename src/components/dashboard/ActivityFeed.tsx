"use client";

import React from "react";
import { ActivityRecord } from "@/types/domain";
import { relativeTime } from "@/lib/dateUtils";
import {
  GitMerge,
  Plus,
  CheckCheck,
  UserCheck,
  FolderPlus,
  Activity,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activityIcons: Record<ActivityRecord["type"], React.ElementType> = {
  task_created: Plus,
  task_moved: GitMerge,
  task_completed: CheckCheck,
  task_assigned: UserCheck,
  project_created: FolderPlus,
  project_updated: FolderPlus,
  member_updated: UserCheck,
  project_deleted: FolderPlus,
  member_removed: UserCheck,
};

const activityColors: Record<ActivityRecord["type"], string> = {
  task_created: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  task_moved: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  task_completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  task_assigned: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  project_created: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  project_updated: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  member_updated: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  project_deleted: "text-red-400 bg-red-500/10 border-red-500/20",
  member_removed: "text-red-400 bg-red-500/10 border-red-500/20",
};

const activityLabel: Record<ActivityRecord["type"], string> = {
  task_created: "Created task",
  task_moved: "Moved task",
  task_completed: "Completed",
  task_assigned: "Assigned",
  project_created: "Created project",
  project_updated: "Updated project",
  member_updated: "Updated member",
  project_deleted: "Deleted project",
  member_removed: "Removed member",
};

interface ActivityFeedProps {
  activities: ActivityRecord[];
  isLoading?: boolean;
  onRefresh: () => void;
}

export function ActivityFeed({ activities, isLoading = false, onRefresh }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Activity Feed
          </h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title="Refresh feed"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-[var(--border-color)] max-h-[380px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 animate-pulse">
                <div className="h-7 w-7 rounded-lg bg-[var(--border-color)] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-[var(--border-color)] rounded w-3/4" />
                  <div className="h-2 bg-[var(--border-color)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-xs">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No activity yet. Create a task or project to get started.</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] ?? Plus;
            const colorClass =
              activityColors[activity.type] ??
              "text-slate-400 bg-slate-500/10 border-slate-500/20";
            const label = activityLabel[activity.type] ?? activity.type;

            return (
              <div
                key={`${activity.targetName}-${index}`}
                className="px-4 py-3 flex items-start gap-3 hover:bg-[var(--border-color)]/30 transition-colors"
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5",
                    colorClass
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[var(--text-primary)] font-semibold leading-snug truncate">
                    <span className="text-[var(--text-muted)] font-normal">{label}: </span>
                    {activity.targetName}
                  </p>
                  {activity.meta?.fromStatus && activity.meta?.toStatus && (
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {activity.meta.fromStatus} to {activity.meta.toStatus}
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {relativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;
