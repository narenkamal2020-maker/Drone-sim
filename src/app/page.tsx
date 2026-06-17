"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import MetricsCard from "@/components/dashboard/MetricsCard";
import FilterBar from "@/components/dashboard/FilterBar";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import WorkloadGrid from "@/components/dashboard/WorkloadGrid";
import TaskChart from "@/components/dashboard/TaskChart";
import UpcomingTasksWidget from "@/components/dashboard/UpcomingTasksWidget";
import { DeadlineKPI } from "@/components/dashboard/DeadlineKPI";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { MemberModal, ProjectModal, TaskModal } from "@/components/WorkspaceModals";
import { useWorkspace } from "@/hooks/useWorkspace";
import { ITask } from "@/models/Task";
import { IProject } from "@/models/Project";
import { IMember } from "@/models/Member";
import {
  ListTodo,
  CheckCircle,
  Loader2,
  Briefcase,
  Users,
  FolderOpen,
  Trash2,
  Mail,
  FilterX,
  RefreshCw,
  Edit3,
  AlertTriangle,
  Target,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ModalType =
  | "project"
  | "editProject"
  | "member"
  | "editMember"
  | "task"
  | "editTask"
  | null;

export default function DashboardPage() {
  const {
    tasks,
    projects,
    members,
    activities,
    analytics,
    isLoading,
    syncingTasks,
    rollbackErrors,
    fetchAll,
    refreshActivities,
    updateTaskStatus,
    deleteTask,
    deleteMember,
    deleteProject,
    createProject,
    saveProjectEdits,
    createMember,
    saveMemberEdits,
    createTask,
    saveTaskEdits,
  } = useWorkspace();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [editingMember, setEditingMember] = useState<IMember | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => Promise<boolean>;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const triggerDelete = (opts: typeof confirmDialog) => setConfirmDialog(opts);

  const handleConfirmDelete = async () => {
    if (!confirmDialog) return;
    setConfirmLoading(true);
    await confirmDialog.onConfirm();
    setConfirmLoading(false);
    setConfirmDialog(null);
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const getProjectId = (task: ITask) =>
    typeof task.projectId === "object" && task.projectId
      ? task.projectId._id
      : String(task.projectId);

  const getMemberId = (task: ITask) =>
    typeof task.assignedTo === "object" && task.assignedTo
      ? task.assignedTo._id
      : task.assignedTo
        ? String(task.assignedTo)
        : "";

  const filteredTasks = tasks.filter((task) => {
    const projectName =
      task.projectId && typeof task.projectId === "object" && "name" in task.projectId
        ? (task.projectId as any).name
        : "";
    const assigneeName =
      task.assignedTo && typeof task.assignedTo === "object" && "name" in task.assignedTo
        ? (task.assignedTo as any).name
        : "";
    const haystack = [task.title, task.description, projectName, assigneeName, task.status, task.priority]
      .join(" ")
      .toLowerCase();

    if (search && !haystack.includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (projectFilter !== "all" && getProjectId(task) !== projectFilter) return false;
    if (assigneeFilter === "unassigned" && task.assignedTo) return false;
    if (
      assigneeFilter !== "all" &&
      assigneeFilter !== "unassigned" &&
      getMemberId(task) !== assigneeFilter
    ) {
      return false;
    }

    return true;
  });

  const hasActiveFilter =
    Boolean(search) ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    projectFilter !== "all" ||
    assigneeFilter !== "all";

  const openCreateTask = () => {
    if (projects.length === 0) {
      setActiveModal("project");
      return;
    }

    setActiveModal("task");
  };

  const handleEditTask = (task: ITask) => {
    setEditingTask(task);
    setActiveModal("editTask");
  };

  const handleEditProject = (project: IProject) => {
    setEditingProject(project);
    setActiveModal("editProject");
  };

  const handleEditMember = (member: IMember) => {
    setEditingMember(member);
    setActiveModal("editMember");
  };

  const handleDeleteTask = (task: ITask) => {
    triggerDelete({
      title: "Delete Task",
      description: `Delete "${task.title}" permanently? This cannot be undone.`,
      confirmLabel: "Delete Task",
      onConfirm: () => deleteTask(task._id),
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setProjectFilter("all");
    setAssigneeFilter("all");
  };

  const handleSaveTaskEdit = async (payload: Record<string, string | null | undefined>) => {
    if (!editingTask) return { ok: false, error: "Task not found" };

    const matchedProject = projects.find((project) => project._id === payload.projectId);
    const matchedMember = members.find((member) => member._id === payload.assignedTo);

    const optimistic: ITask = {
      ...editingTask,
      title: payload.title as string,
      description: payload.description as string,
      priority: payload.priority as "low" | "medium" | "high",
      status: payload.status as "todo" | "inprogress" | "done",
      projectId: matchedProject ?? (payload.projectId as string),
      assignedTo: matchedMember ?? null,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
    };

    return saveTaskEdits(editingTask._id, payload, optimistic);
  };

  const roleClassName = (role: string) =>
    ({
      Lead: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      Developer: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      Designer: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      Contributor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      Coordinator: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      Volunteer: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    }[role] ?? "text-slate-400 bg-slate-800 border-slate-700");

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "var(--canvas-bg)", color: "var(--text-primary)" }}
    >
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md px-5 py-6 md:px-7 md:py-7 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_42%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                Club Collaboration Platform
              </span>
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Run projects, tasks, and team execution from one workspace.
                </h2>
                <p className="mt-2 text-sm md:text-base text-[var(--text-muted)] max-w-xl">
                  Production-ready Kanban workflow, searchable work queues, workload visibility,
                  and MongoDB-backed persistence for club operations and delivery.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--canvas-bg)]/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Completion
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">
                  {analytics.totals.completionRate}%
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--canvas-bg)]/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Throughput
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">
                  {analytics.totals.throughput}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--canvas-bg)]/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Overdue
                </p>
                <p className="mt-2 text-2xl font-extrabold text-red-400">
                  {analytics.totals.overdue}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--canvas-bg)]/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Team
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">
                  {analytics.totals.members}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Operations Dashboard</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Search, prioritize, and ship work across projects and club teams.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:bg-rose-500/10 gap-1.5"
              >
                <FilterX className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}
            <Button
              variant="glass"
              size="sm"
              onClick={() => {
                void fetchAll();
              }}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Sync Workspace
            </Button>
          </div>
        </div>

        <DeadlineKPI tasks={tasks} />

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Tasks"
            value={analytics.totals.tasks}
            icon={<ListTodo className="h-5 w-5 text-sky-400" />}
            description="Tracked in MongoDB"
            glowColor="blue"
          />
          <MetricsCard
            title="In Progress"
            value={analytics.statusBreakdown.inprogress}
            icon={<Loader2 className="h-5 w-5 text-amber-400 animate-spin" />}
            description="Currently active"
            glowColor="amber"
          />
          <MetricsCard
            title="Completed"
            value={analytics.statusBreakdown.done}
            icon={<CheckCircle className="h-5 w-5 text-emerald-400" />}
            description="Finished and closed"
            trend={{ value: `${analytics.totals.completionRate}%`, positive: true }}
            glowColor="emerald"
          />
          <MetricsCard
            title="Projects"
            value={analytics.totals.projects}
            icon={<Briefcase className="h-5 w-5 text-[var(--text-muted)]" />}
            description="Active collaboration spaces"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-8 items-start">
          <div className="space-y-5">
            <FilterBar
              search={search}
              setSearch={setSearch}
              status={statusFilter}
              setStatus={setStatusFilter}
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              projectId={projectFilter}
              setProjectId={setProjectFilter}
              assigneeId={assigneeFilter}
              setAssigneeId={setAssigneeFilter}
              projects={projects}
              members={members}
              onOpenCreateTask={openCreateTask}
              onOpenCreateProject={() => setActiveModal("project")}
              onOpenCreateMember={() => setActiveModal("member")}
            />

            {projects.length === 0 && !isLoading ? (
              <EmptyState
                icon={FolderOpen}
                title="Create your first project"
                description="Projects anchor the whole workspace. Add one to start tracking tasks, owners, and delivery."
                action={{ label: "New Project", onClick: () => setActiveModal("project") }}
                secondaryAction={{ label: "Add Member", onClick: () => setActiveModal("member") }}
              />
            ) : (
              <KanbanBoard
                tasks={filteredTasks}
                allTasksCount={tasks.length}
                onUpdateTaskStatus={updateTaskStatus}
                onDeleteTask={(taskId) => {
                  const task = tasks.find((t) => t._id === taskId);
                  if (task) handleDeleteTask(task);
                  return Promise.resolve(false);
                }}
                onEditTask={handleEditTask}
                onOpenCreateTask={openCreateTask}
                isLoading={isLoading}
                syncingTasks={syncingTasks}
                rollbackErrors={rollbackErrors}
              />
            )}

            <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center gap-2">
                <Target className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Delivery Trend
                </h3>
              </div>
              <div className="p-4">
                {analytics.timeline.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">No delivery history yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {analytics.timeline.map((point) => (
                      <div
                        key={point.label}
                        className="rounded-2xl border border-[var(--border-color)] bg-[var(--canvas-bg)]/70 p-3"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {point.label}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div>
                            <p className="text-[10px] text-[var(--text-muted)]">Created</p>
                            <p className="text-lg font-extrabold text-[var(--text-primary)]">
                              {point.created}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[var(--text-muted)]">Completed</p>
                            <p className="text-lg font-extrabold text-emerald-400">
                              {point.completed}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Project Management
                </h3>
                <Button variant="glass" size="sm" onClick={() => setActiveModal("project")}>
                  New Project
                </Button>
              </div>
              <div className="p-3 space-y-3 max-h-[360px] overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-5">No projects yet.</p>
                ) : (
                  analytics.projects.map((projectSummary) => {
                    const project = projects.find((item) => item._id === projectSummary.projectId);
                    if (!project) return null;

                    const isActive = projectFilter === project._id;
                    return (
                      <div
                        key={project._id}
                        className={cn(
                          "rounded-2xl border p-3 transition-all",
                          isActive
                            ? "border-sky-500/40 bg-sky-500/10"
                            : "border-[var(--border-color)] hover:border-sky-500/30"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setProjectFilter(isActive ? "all" : project._id)}
                              className="text-left"
                            >
                              <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                                {project.name}
                              </p>
                              <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">
                                {project.description}
                              </p>
                            </button>
                            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-sky-400">
                              {project.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditProject(project)}
                              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                              title="Edit project"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                triggerDelete({
                                  title: "Delete Project",
                                  description: `Delete "${project.name}" and all its tasks permanently? This cannot be undone.`,
                                  confirmLabel: "Delete Project",
                                  onConfirm: () => deleteProject(project._id),
                                })
                              }
                              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                            style={{ width: `${projectSummary.completionRate}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                          <span>{projectSummary.completedTasks}/{projectSummary.totalTasks} done</span>
                          <span>{projectSummary.overdueTasks} overdue</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <UpcomingTasksWidget tasks={tasks} />
            <TaskChart tasks={tasks} />
            <WorkloadGrid tasks={tasks} members={members} />

            <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Team Management
                </h3>
                <Button variant="glass" size="sm" onClick={() => setActiveModal("member")}>
                  New Member
                </Button>
              </div>
              <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
                {members.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-4">No members yet.</p>
                ) : (
                  members.map((member) => {
                    const memberAnalytics = analytics.members.find(
                      (item) => item.memberId === member._id
                    );
                    return (
                      <div
                        key={member._id}
                        className="rounded-2xl border border-[var(--border-color)] p-3 hover:border-sky-500/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                            style={{ backgroundColor: member.avatarColor || "#0EA5E9" }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                                  {member.name}
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={cn(
                                      "text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider",
                                      roleClassName(member.role)
                                    )}
                                  >
                                    {member.role}
                                  </span>
                                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 truncate">
                                    <Mail className="h-2.5 w-2.5 shrink-0" />
                                    {member.email}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditMember(member)}
                                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                                  title="Edit member"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    triggerDelete({
                                      title: "Remove Member",
                                      description: `Remove "${member.name}" from the team? Their tasks will be unassigned but not deleted.`,
                                      confirmLabel: "Remove Member",
                                      onConfirm: () => deleteMember(member._id),
                                    })
                                  }
                                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Remove member"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
                              <span className="inline-flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {memberAnalytics?.activeTasks ?? 0} active
                              </span>
                              <span>{memberAnalytics?.completedTasks ?? 0} completed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Delivery Alerts
                </h3>
              </div>
              <div className="p-4 text-sm text-[var(--text-muted)] space-y-2">
                <p>{analytics.totals.overdue} overdue tasks require attention.</p>
                <p>{analytics.statusBreakdown.todo} tasks are still queued in backlog.</p>
                <p>{filteredTasks.length} tasks match the current filters.</p>
              </div>
            </section>

            <ActivityFeed
              activities={activities}
              onRefresh={() => {
                void refreshActivities();
              }}
            />
          </div>
        </div>
      </main>

      {activeModal === "project" && (
        <ProjectModal onClose={() => setActiveModal(null)} mode="create" onSubmit={createProject} />
      )}
      {activeModal === "editProject" && editingProject && (
        <ProjectModal
          mode="edit"
          project={editingProject}
          onClose={() => {
            setActiveModal(null);
            setEditingProject(null);
          }}
          onSubmit={(form) => saveProjectEdits(editingProject._id, form)}
        />
      )}
      {activeModal === "member" && (
        <MemberModal onClose={() => setActiveModal(null)} mode="create" onSubmit={createMember} />
      )}
      {activeModal === "editMember" && editingMember && (
        <MemberModal
          mode="edit"
          member={editingMember}
          onClose={() => {
            setActiveModal(null);
            setEditingMember(null);
          }}
          onSubmit={(form) => saveMemberEdits(editingMember._id, form)}
        />
      )}
      {activeModal === "task" && (
        <TaskModal
          mode="create"
          projects={projects}
          members={members}
          onClose={() => setActiveModal(null)}
          onSubmit={async (form) => {
            const result = await createTask(form);
            if (result.ok) setActiveModal(null);
            return result;
          }}
        />
      )}
      {activeModal === "editTask" && editingTask && (
        <TaskModal
          mode="edit"
          task={editingTask}
          projects={projects}
          members={members}
          onClose={() => {
            setActiveModal(null);
            setEditingTask(null);
          }}
          onSubmit={handleSaveTaskEdit}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmLabel={confirmDialog.confirmLabel}
          loading={confirmLoading}
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
