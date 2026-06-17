import Task from "@/models/Task";
import Project from "@/models/Project";
import Member from "@/models/Member";
import Activity from "@/models/Activity";
import {
  AnalyticsSnapshot,
  MemberRecord,
  ProjectRecord,
  TaskRecord,
  TaskStatus,
  WorkspaceQuery,
  WorkspaceSnapshot,
} from "@/types/domain";
import { getDeadlineStatus } from "@/lib/dateUtils";

const TASK_POPULATE: any[] = [
  { path: "projectId", model: Project },
  { path: "assignedTo", model: Member },
];

function normalizeQueryValue(value?: string | null) {
  return value && value !== "all" ? value : undefined;
}

function matchesWorkspaceQuery(
  task: TaskRecord,
  query: WorkspaceQuery,
  projects: ProjectRecord[],
  members: MemberRecord[]
) {
  const projectId =
    typeof task.projectId === "object" ? task.projectId._id : String(task.projectId);
  const assigneeId =
    typeof task.assignedTo === "object"
      ? task.assignedTo?._id
      : task.assignedTo
        ? String(task.assignedTo)
        : null;

  const projectName =
    typeof task.projectId === "object"
      ? task.projectId.name
      : projects.find((project) => project._id === projectId)?.name ?? "";

  const assigneeName =
    typeof task.assignedTo === "object"
      ? task.assignedTo?.name ?? ""
      : members.find((member) => member._id === assigneeId)?.name ?? "";

  const searchValue = query.search?.trim().toLowerCase();
  if (searchValue) {
    const haystack = [
      task.title,
      task.description,
      projectName,
      assigneeName,
      task.priority,
      task.status,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(searchValue)) {
      return false;
    }
  }

  if (query.status && query.status !== "all" && task.status !== query.status) {
    return false;
  }

  if (query.priority && query.priority !== "all" && task.priority !== query.priority) {
    return false;
  }

  const projectFilter = normalizeQueryValue(query.projectId);
  if (projectFilter && projectId !== projectFilter) {
    return false;
  }

  if (query.assigneeId === "unassigned") {
    return !assigneeId;
  }

  const assigneeFilter = normalizeQueryValue(query.assigneeId);
  if (assigneeFilter && assigneeId !== assigneeFilter) {
    return false;
  }

  return true;
}

function getAnalytics(
  tasks: TaskRecord[],
  projects: ProjectRecord[],
  members: MemberRecord[]
): AnalyticsSnapshot {
  const statusBreakdown: Record<TaskStatus, number> = {
    todo: 0,
    inprogress: 0,
    done: 0,
  };

  const priorityBreakdown = {
    low: 0,
    medium: 0,
    high: 0,
  };

  for (const task of tasks) {
    statusBreakdown[task.status] += 1;
    priorityBreakdown[task.priority] += 1;
  }

  const overdue = tasks.filter(
    (task) => task.status !== "done" && getDeadlineStatus(task.dueDate) === "overdue"
  ).length;
  const completedTasks = statusBreakdown.done;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const projectBreakdown = projects.map((project) => {
    const projectTasks = tasks.filter((task) => {
      const taskProjectId =
        typeof task.projectId === "object" ? task.projectId._id : String(task.projectId);
      return taskProjectId === project._id;
    });
    const projectCompleted = projectTasks.filter((task) => task.status === "done").length;
    const projectActive = projectTasks.filter((task) => task.status !== "done").length;
    const projectOverdue = projectTasks.filter(
      (task) => task.status !== "done" && getDeadlineStatus(task.dueDate) === "overdue"
    ).length;

    return {
      projectId: project._id,
      projectName: project.name,
      totalTasks: projectTasks.length,
      completedTasks: projectCompleted,
      activeTasks: projectActive,
      overdueTasks: projectOverdue,
      completionRate: projectTasks.length
        ? Math.round((projectCompleted / projectTasks.length) * 100)
        : 0,
    };
  });

  const memberBreakdown = members.map((member) => {
    const memberTasks = tasks.filter((task) => {
      const assignedId =
        typeof task.assignedTo === "object"
          ? task.assignedTo?._id
          : task.assignedTo
            ? String(task.assignedTo)
            : null;
      return assignedId === member._id;
    });

    return {
      memberId: member._id,
      memberName: member.name,
      role: member.role,
      activeTasks: memberTasks.filter((task) => task.status !== "done").length,
      completedTasks: memberTasks.filter((task) => task.status === "done").length,
    };
  });

  const timeline = Array.from({ length: 6 }, (_, index) => {
    const anchor = new Date();
    anchor.setDate(anchor.getDate() - (5 - index) * 7);
    const start = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const created = tasks.filter((task) => {
      if (!task.createdAt) return false;
      const date = new Date(task.createdAt);
      return date >= start && date < end;
    }).length;

    const completed = tasks.filter((task) => {
      if (task.status !== "done" || !task.updatedAt) return false;
      const date = new Date(task.updatedAt);
      return date >= start && date < end;
    }).length;

    return {
      label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created,
      completed,
    };
  });

  return {
    totals: {
      tasks: tasks.length,
      projects: projects.length,
      members: members.length,
      overdue,
      completionRate,
      throughput: timeline[timeline.length - 1]?.completed ?? 0,
    },
    statusBreakdown,
    priorityBreakdown,
    projects: projectBreakdown.sort((left, right) => right.totalTasks - left.totalTasks),
    members: memberBreakdown.sort((left, right) => right.activeTasks - left.activeTasks),
    timeline,
  };
}

export async function getWorkspaceSnapshot(query: WorkspaceQuery = {}): Promise<WorkspaceSnapshot> {
  const [tasksResult, projectsResult, membersResult, activitiesResult] = await Promise.all([
    Task.find({}).populate(TASK_POPULATE).sort({ createdAt: -1 }).lean<TaskRecord[]>(),
    Project.find({}).sort({ createdAt: -1 }).lean<ProjectRecord[]>(),
    Member.find({}).sort({ name: 1 }).lean<MemberRecord[]>(),
    Activity.find({}).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const analytics = getAnalytics(tasksResult, projectsResult, membersResult);
  const filteredTasks = tasksResult.filter((task) =>
    matchesWorkspaceQuery(task, query, projectsResult, membersResult)
  );

  return {
    tasks: filteredTasks,
    projects: projectsResult,
    members: membersResult,
    activities: activitiesResult.map((act: any) => ({
      ...act,
      _id: String(act._id),
    })),
    analytics,
  };
}

export async function getActivities(limit = 40) {
  const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  return activities.map((act: any) => ({
    ...act,
    _id: String(act._id),
  }));
}
