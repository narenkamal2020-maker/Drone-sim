import { z } from "zod";
import {
  MEMBER_ROLES,
  PROJECT_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/types/domain";

// MongoDB ObjectId Regex validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const objectIdSchema = z.string().regex(objectIdRegex, "Invalid MongoDB ObjectId");

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  category: z.enum(PROJECT_CATEGORIES),
});

export const MemberSchema = z.object({
  name: z.string().min(1, "Member name is required"),
  role: z.enum(MEMBER_ROLES),
  email: z.string().email("Invalid email address"),
  avatarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color code (e.g. #0EA5E9)"),
});

export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().default(""),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  status: z.enum(TASK_STATUSES).default("todo"),
  projectId: objectIdSchema,
  assignedTo: z.union([objectIdSchema, z.null()]).optional(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() === "") return undefined;
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date().optional()),
});

export const TaskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  projectId: objectIdSchema.optional(),
  assignedTo: z.union([objectIdSchema, z.null()]).optional(),
  dueDate: z.preprocess((arg) => {
    if (arg === null || (typeof arg === "string" && arg.trim() === "")) return null;
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.union([z.date(), z.null()]).optional()),
});
