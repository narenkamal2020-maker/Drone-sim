"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ITask } from "@/models/Task";
import { IProject } from "@/models/Project";
import { IMember } from "@/models/Member";
import {
  ActivityRecord,
  AnalyticsSnapshot,
  TaskStatus,
  WorkspaceSnapshot,
} from "@/types/domain";

const EMPTY_ANALYTICS: AnalyticsSnapshot = {
  totals: {
    tasks: 0,
    projects: 0,
    members: 0,
    overdue: 0,
    completionRate: 0,
    throughput: 0,
  },
  statusBreakdown: {
    todo: 0,
    inprogress: 0,
    done: 0,
  },
  priorityBreakdown: {
    low: 0,
    medium: 0,
    high: 0,
  },
  projects: [],
  members: [],
  timeline: [],
};

export function useWorkspace() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot>(EMPTY_ANALYTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingTasks, setSyncingTasks] = useState<Record<string, boolean>>({});
  const [rollbackErrors, setRollbackErrors] = useState<Record<string, string>>({});

  // Use a ref so delete/update handlers always call the latest fetchAll
  const fetchAllRef = useRef<(showLoading?: boolean) => Promise<void>>(async () => {});

  const applySnapshot = (snapshot: WorkspaceSnapshot) => {
    setTasks(snapshot.tasks as ITask[]);
    setProjects(snapshot.projects as IProject[]);
    setMembers(snapshot.members as IMember[]);
    setActivities(snapshot.activities);
    setAnalytics(snapshot.analytics);
  };

  const fetchAll = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await fetch("/api/workspace", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load workspace");
      const snapshot = (await response.json()) as WorkspaceSnapshot;
      applySnapshot(snapshot);
    } catch (error) {
      console.error("fetchAll error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Keep ref always up to date
  useEffect(() => {
    fetchAllRef.current = fetchAll;
  }, [fetchAll]);

  const refreshActivities = useCallback(async () => {
    try {
      const response = await fetch("/api/activities", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load activities");
      const nextActivities = (await response.json()) as ActivityRecord[];
      setActivities(nextActivities);
    } catch (error) {
      console.error("refreshActivities error:", error);
    }
  }, []);

  useEffect(() => {
    void fetchAll(false);
    const interval = setInterval(() => {
      void refreshActivities();
    }, 30_000);
    return () => clearInterval(interval);
  }, [fetchAll, refreshActivities]);

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    const original = tasks.find((task) => task._id === taskId);
    if (!original) return false;

    // Optimistic remove immediately
    setTasks((current) => current.filter((task) => task._id !== taskId));
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      void fetchAllRef.current(false);
      return true;
    } catch (error) {
      console.error("deleteTask error:", error);
      setTasks((current) => [original, ...current]);
      return false;
    }
  }, [tasks]);

  const deleteMember = useCallback(async (memberId: string): Promise<boolean> => {
    const original = members.find((member) => member._id === memberId);
    if (!original) return false;

    setMembers((current) => current.filter((member) => member._id !== memberId));
    try {
      const response = await fetch(`/api/members/${memberId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      // Unassign member from tasks locally
      setTasks((current) =>
        current.map((task) => {
          const assignedId =
            typeof task.assignedTo === "object" && task.assignedTo
              ? task.assignedTo._id
              : String(task.assignedTo ?? "");
          return assignedId === memberId ? { ...task, assignedTo: null } : task;
        })
      );
      void fetchAllRef.current(false);
      return true;
    } catch (error) {
      console.error("deleteMember error:", error);
      setMembers((current) => [...current, original]);
      return false;
    }
  }, [members]);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    const original = projects.find((project) => project._id === projectId);
    if (!original) return false;

    setProjects((current) => current.filter((project) => project._id !== projectId));
    setTasks((current) =>
      current.filter((task) => {
        const taskProjectId =
          typeof task.projectId === "object" ? task.projectId._id : String(task.projectId);
        return taskProjectId !== projectId;
      })
    );
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      void fetchAllRef.current(false);
      return true;
    } catch (error) {
      console.error("deleteProject error:", error);
      void fetchAllRef.current(false);
      return false;
    }
  }, [projects]);

  const createProject = useCallback(async (form: { name: string; description: string; category: string }) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, error: data.error || "Failed" };
    setProjects((current) => [data, ...current]);
    void fetchAllRef.current(false);
    return { ok: true };
  }, []);

  const saveProjectEdits = useCallback(async (
    projectId: string,
    form: { name: string; description: string; category: string }
  ) => {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, error: data.error || "Failed" };
    setProjects((current) => current.map((project) => (project._id === projectId ? data : project)));
    setTasks((current) =>
      current.map((task) => {
        const taskProjectId =
          typeof task.projectId === "object" ? task.projectId._id : String(task.projectId);
        return taskProjectId === projectId ? { ...task, projectId: data } : task;
      })
    );
    void fetchAllRef.current(false);
    return { ok: true };
  }, []);

  const createMember = useCallback(async (form: { name: string; email: string; role: string; avatarColor: string }) => {
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, error: data.error || "Failed" };
    setMembers((current) => [...current, data]);
    void fetchAllRef.current(false);
    return { ok: true };
  }, []);

  const saveMemberEdits = useCallback(async (
    memberId: string,
    form: { name: string; email: string; role: string; avatarColor: string }
  ) => {
    const response = await fetch(`/api/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, error: data.error || "Failed" };
    setMembers((current) => current.map((member) => (member._id === memberId ? data : member)));
    setTasks((current) =>
      current.map((task) => {
        const assignedId =
          typeof task.assignedTo === "object" && task.assignedTo
            ? task.assignedTo._id
            : String(task.assignedTo ?? "");
        return assignedId === memberId ? { ...task, assignedTo: data } : task;
      })
    );
    void fetchAllRef.current(false);
    return { ok: true };
  }, []);

  const createTask = useCallback(async (form: Record<string, string | null | undefined>) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, error: data.error || "Failed" };
    setTasks((current) => [data, ...current]);
    void fetchAllRef.current(false);
    return { ok: true };
  }, []);

  const saveTaskEdits = useCallback(async (
    taskId: string,
    payload: Record<string, string | null | undefined>,
    optimistic: ITask
  ) => {
    const original = tasks.find((task) => task._id === taskId);
    if (!original) return { ok: false, error: "Task not found" };

    setTasks((current) => current.map((task) => (task._id === taskId ? optimistic : task)));
    setSyncingTasks((current) => ({ ...current, [taskId]: true }));

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      setTasks((current) => current.map((task) => (task._id === taskId ? original : task)));
      setSyncingTasks((current) => {
        const next = { ...current };
        delete next[taskId];
        return next;
      });
      return { ok: false, error: data.error };
    }

    setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
    setSyncingTasks((current) => {
      const next = { ...current };
      delete next[taskId];
      return next;
    });
    void fetchAllRef.current(false);
    return { ok: true };
  }, [tasks]);

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus): Promise<boolean> => {
    const original = tasks.find((task) => task._id === taskId);
    if (!original) return false;

    setTasks((current) =>
      current.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
    );
    setSyncingTasks((current) => ({ ...current, [taskId]: true }));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("sync failed");
      const data = await response.json();
      setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
      setSyncingTasks((current) => {
        const next = { ...current };
        delete next[taskId];
        return next;
      });
      void fetchAllRef.current(false);
      return true;
    } catch (error) {
      console.error("updateTaskStatus error:", error);
      setTasks((current) =>
        current.map((task) => (task._id === taskId ? { ...task, status: original.status } : task))
      );
      setRollbackErrors((current) => ({ ...current, [taskId]: "Sync failed" }));
      setSyncingTasks((current) => {
        const next = { ...current };
        delete next[taskId];
        return next;
      });
      setTimeout(() => {
        setRollbackErrors((current) => {
          const next = { ...current };
          delete next[taskId];
          return next;
        });
      }, 5000);
      return false;
    }
  }, [tasks]);

  return {
    tasks,
    setTasks,
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
  };
}
