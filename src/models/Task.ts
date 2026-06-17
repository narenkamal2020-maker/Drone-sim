import mongoose, { Schema, Document, Model } from "mongoose";
import { IProject } from "./Project";
import { IMember } from "./Member";
import { TASK_PRIORITIES, TASK_STATUSES, TaskRecord } from "@/types/domain";

export interface ITask extends Omit<TaskRecord, "projectId" | "assignedTo"> {
  projectId: mongoose.Types.ObjectId | IProject | string;
  assignedTo?: mongoose.Types.ObjectId | IMember | string | null;
}

export type ITaskDocument = Document & Omit<ITask, "_id">;

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      required: [true, "Priority is required"],
      default: "medium",
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      required: [true, "Status is required"],
      default: "todo",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Task: Model<ITaskDocument> =
  mongoose.models.Task || mongoose.model<ITaskDocument>("Task", TaskSchema);

export default Task;
