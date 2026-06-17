import mongoose, { Schema, Document, Model } from "mongoose";
import { ACTIVITY_TYPES, ActivityRecord } from "@/types/domain";

export interface IActivity extends Omit<ActivityRecord, "_id"> {}

export interface IActivityDocument extends IActivity, Document {
  _id: mongoose.Types.ObjectId;
}

const ActivitySchema = new Schema<IActivityDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: ACTIVITY_TYPES,
    },
    actorName: {
      type: String,
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    meta: {
      fromStatus: { type: String },
      toStatus: { type: String },
      projectId: { type: String },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Activity: Model<IActivityDocument> =
  mongoose.models.Activity || mongoose.model<IActivityDocument>("Activity", ActivitySchema);

export default Activity;
