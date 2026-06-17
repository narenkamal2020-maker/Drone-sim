import mongoose, { Schema, Document, Model } from "mongoose";
import { PROJECT_CATEGORIES, ProjectRecord } from "@/types/domain";

export interface IProject extends ProjectRecord {}

export type IProjectDocument = Document & Omit<IProject, "_id">;

const ProjectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Project category is required"],
      enum: PROJECT_CATEGORIES,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;
