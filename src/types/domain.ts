export const PROJECT_CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Operations",
  "Events",
  "Outreach",
] as const;

export const MEMBER_ROLES = [
  "Lead",
  "Developer",
  "Designer",
  "Contributor",
  "Coordinator",
  "Volunteer",
] as const;

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export const TASK_STATUSES = ["todo", "inprogress", "done"] as const;
export const ACTIVITY_TYPES = [
  "task_created",
  "task_moved",
  "task_assigned",
  "project_created",
  "task_completed",
  "project_updated",
  "member_updated",
  "project_deleted",
  "member_removed",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type MemberRole = (typeof MEMBER_ROLES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface ProjectRecord {
  _id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface MemberRecord {
  _id: string;
  name: string;
  role: MemberRole;
  email: string;
  avatarColor: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TaskRecord {
  _id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: ProjectRecord | string;
  assignedTo?: MemberRecord | string | null;
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ActivityRecord {
  _id?: string;
  type: ActivityType;
  actorName: string;
  targetName: string;
  meta?: {
    fromStatus?: TaskStatus | string;
    toStatus?: TaskStatus | string;
    projectId?: string;
  };
  createdAt: Date | string;
}

export interface AnalyticsProjectBreakdown {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface AnalyticsMemberBreakdown {
  memberId: string;
  memberName: string;
  role: MemberRole;
  activeTasks: number;
  completedTasks: number;
}

export interface AnalyticsTimelinePoint {
  label: string;
  created: number;
  completed: number;
}

export interface AnalyticsSnapshot {
  totals: {
    tasks: number;
    projects: number;
    members: number;
    overdue: number;
    completionRate: number;
    throughput: number;
  };
  statusBreakdown: Record<TaskStatus, number>;
  priorityBreakdown: Record<TaskPriority, number>;
  projects: AnalyticsProjectBreakdown[];
  members: AnalyticsMemberBreakdown[];
  timeline: AnalyticsTimelinePoint[];
}

export interface WorkspaceSnapshot {
  tasks: TaskRecord[];
  projects: ProjectRecord[];
  members: MemberRecord[];
  activities: ActivityRecord[];
  analytics: AnalyticsSnapshot;
}

export interface WorkspaceQuery {
  search?: string;
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  projectId?: string | "all";
  assigneeId?: string | "all" | "unassigned";
}

export interface ProjectInput {
  name: string;
  description: string;
  category: ProjectCategory;
}

export interface MemberInput {
  name: string;
  email: string;
  role: MemberRole;
  avatarColor: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string;
  assignedTo?: string | null;
  dueDate?: Date | string | null;
}
