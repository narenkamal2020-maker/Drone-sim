import React from "react";
import { Search, Plus } from "lucide-react";
import Button from "../ui/Button";
import { IProject } from "@/models/Project";
import { IMember } from "@/models/Member";

export interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  projectId: string;
  setProjectId: (value: string) => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  projects: IProject[];
  members: IMember[];
  onOpenCreateTask: () => void;
  onOpenCreateProject: () => void;
  onOpenCreateMember: () => void;
}

const selectCls =
  "min-w-[130px] rounded-xl border border-[var(--border-color)] bg-[var(--canvas-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-sky-500/40";

export function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  projectId,
  setProjectId,
  assigneeId,
  setAssigneeId,
  projects,
  members,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenCreateMember,
}: FilterBarProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md p-4 md:p-5 space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by task, project, assignee, or status"
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--canvas-bg)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="glass" size="sm" onClick={onOpenCreateProject}>
            <Plus className="h-3.5 w-3.5" />
            Project
          </Button>
          <Button variant="glass" size="sm" onClick={onOpenCreateMember}>
            <Plus className="h-3.5 w-3.5" />
            Member
          </Button>
          <Button variant="default" size="sm" onClick={onOpenCreateTask}>
            <Plus className="h-3.5 w-3.5 text-white" />
            Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <select
          value={status}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value)}
          className={selectCls}
        >
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={priority}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setPriority(event.target.value)}
          className={selectCls}
        >
          <option value="all">All priorities</option>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>

        <select
          value={projectId}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setProjectId(event.target.value)}
          className={selectCls}
        >
          <option value="all">All projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={assigneeId}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setAssigneeId(event.target.value)}
          className={selectCls}
        >
          <option value="all">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
