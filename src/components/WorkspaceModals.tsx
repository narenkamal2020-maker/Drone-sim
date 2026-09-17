"use client";

import React, { useState } from "react";
import { IProject } from "@/models/Project";
import { IMember } from "@/models/Member";
import { ITask } from "@/models/Task";
import Button from "@/components/ui/Button";
import { X, Loader2, ListTodo, FolderPlus, UserPlus, Edit, type LucideIcon } from "lucide-react";
import { MEMBER_ROLES, PROJECT_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "@/types/domain";

const AVATAR_COLORS = ["#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const inputCls =
  "w-full px-3.5 py-2.5 text-sm bg-[var(--canvas-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-sky-500/50";
const labelCls =
  "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5";
const overlayBase =
  "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in";
const panelBase =
  "w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-scale-up";

function ModalHeader({
  title,
  icon: Icon,
  onClose,
}: {
  title: string;
  icon: LucideIcon;
  onClose: () => void;
}) {
  return (
    <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
      <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Icon className="h-5 w-5 text-sky-400" />
        {title}
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
      {msg}
    </div>
  );
}

interface ProjectModalProps {
  mode: "create" | "edit";
  project?: IProject;
  onClose: () => void;
  onSubmit: (form: {
    name: string;
    description: string;
    category: string;
  }) => Promise<{ ok: boolean; error?: string }>;
}

export function ProjectModal({ mode, project, onClose, onSubmit }: ProjectModalProps) {
  const [form, setForm] = useState({
    name: project?.name ?? "",
    description: project?.description ?? "",
    category: project?.category ?? PROJECT_CATEGORIES[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await onSubmit(form);
    if (!result.ok) {
      setError(result.error ?? "Failed");
      setLoading(false);
      return;
    }

    onClose();
  };

  return (
    <div className={overlayBase}>
      <div className={`${panelBase} max-w-md`}>
        <ModalHeader
          title={mode === "create" ? "Create Project" : "Edit Project"}
          icon={mode === "create" ? FolderPlus : Edit}
          onClose={onClose}
        />
        <form onSubmit={submit} className="p-6 space-y-4">
          {error && <ErrorBanner msg={error} />}
          <div>
            <label className={labelCls}>Project Name</label>
            <input
              required
              className={inputCls}
              placeholder="Club website redesign"
              value={form.name}
              onChange={setField("name")}
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              required
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Goals, owners, and delivery expectations..."
              value={form.description}
              onChange={setField("description")}
            />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={form.category} onChange={setField("category")}>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Project"
              ) : (
                "Save Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface MemberModalProps {
  mode: "create" | "edit";
  member?: IMember;
  onClose: () => void;
  onSubmit: (form: {
    name: string;
    email: string;
    role: string;
    avatarColor: string;
  }) => Promise<{ ok: boolean; error?: string }>;
}

export function MemberModal({ mode, member, onClose, onSubmit }: MemberModalProps) {
  const [form, setForm] = useState({
    name: member?.name ?? "",
    email: member?.email ?? "",
    role: member?.role ?? MEMBER_ROLES[1],
    avatarColor: member?.avatarColor ?? AVATAR_COLORS[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await onSubmit(form);
    if (!result.ok) {
      setError(result.error ?? "Failed");
      setLoading(false);
      return;
    }

    onClose();
  };

  return (
    <div className={overlayBase}>
      <div className={`${panelBase} max-w-md`}>
        <ModalHeader
          title={mode === "create" ? "Add Team Member" : "Edit Team Member"}
          icon={mode === "create" ? UserPlus : Edit}
          onClose={onClose}
        />
        <form onSubmit={submit} className="p-6 space-y-4">
          {error && <ErrorBanner msg={error} />}
          <div>
            <label className={labelCls}>Full Name</label>
            <input
              required
              className={inputCls}
              placeholder="Alice Vance"
              value={form.name}
              onChange={setField("name")}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              required
              type="email"
              className={inputCls}
              placeholder="alice@club.org"
              value={form.email}
              onChange={setField("email")}
            />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <select className={inputCls} value={form.role} onChange={setField("role")}>
              {MEMBER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Avatar Color</label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, avatarColor: color }))}
                  className={`h-7 w-7 rounded-full border-2 cursor-pointer transition-transform ${
                    form.avatarColor === color
                      ? "border-white scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Add Member"
              ) : (
                "Save Member"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TaskModalProps {
  mode: "create" | "edit";
  task?: ITask;
  projects: IProject[];
  members: IMember[];
  onClose: () => void;
  onSubmit: (
    form: Record<string, string | null | undefined>
  ) => Promise<{ ok: boolean; error?: string }>;
}

export function TaskModal({ mode, task, projects, members, onClose, onSubmit }: TaskModalProps) {
  const formatDate = (date?: Date | string | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().split("T")[0];
  };

  const getProjectId = (): string => {
    if (!task?.projectId) return projects[0]?._id ?? "";
    if (typeof task.projectId === "object" && task.projectId) {
      if ("_id" in task.projectId) {
        return String((task.projectId as any)._id);
      }
      return String(task.projectId);
    }
    return String(task.projectId);
  };

  const getMemberId = (): string => {
    if (!task?.assignedTo) return "";
    if (typeof task.assignedTo === "object" && task.assignedTo) {
      if ("_id" in task.assignedTo) {
        return String((task.assignedTo as any)._id);
      }
      return String(task.assignedTo);
    }
    return String(task.assignedTo);
  };

  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? TASK_PRIORITIES[1],
    status: task?.status ?? TASK_STATUSES[0],
    projectId: getProjectId(),
    assignedTo: getMemberId(),
    dueDate: formatDate(task?.dueDate),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      assignedTo: form.assignedTo || null,
      dueDate: form.dueDate || null,
    };

    const result = await onSubmit(payload);
    if (!result.ok) {
      setError(result.error ?? "Failed");
      setLoading(false);
      return;
    }

    onClose();
  };

  return (
    <div className={overlayBase}>
      <div className={`${panelBase} max-w-lg`}>
        <ModalHeader
          title={mode === "create" ? "Create Task" : "Edit Task"}
          icon={mode === "create" ? ListTodo : Edit}
          onClose={onClose}
        />
        <form onSubmit={submit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <ErrorBanner msg={error} />}
          <div>
            <label className={labelCls}>Title</label>
            <input
              required
              className={inputCls}
              placeholder="Book venue for kickoff event"
              value={form.title}
              onChange={setField("title")}
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Notes, owners, and acceptance criteria..."
              value={form.description}
              onChange={setField("description")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Priority</label>
              <select className={inputCls} value={form.priority} onChange={setField("priority")}>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={setField("status")}>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Project</label>
              <select required className={inputCls} value={form.projectId} onChange={setField("projectId")}>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assignee</label>
              <select className={inputCls} value={form.assignedTo} onChange={setField("assignedTo")}>
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Due Date</label>
            <input type="date" className={inputCls} value={form.dueDate} onChange={setField("dueDate")} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border-color)]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Task"
              ) : (
                "Save Task"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
