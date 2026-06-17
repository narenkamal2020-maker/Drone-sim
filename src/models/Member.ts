import mongoose, { Schema, Document, Model } from "mongoose";
import { MEMBER_ROLES, MemberRecord } from "@/types/domain";

export interface IMember extends MemberRecord {}

export type IMemberDocument = Document & Omit<IMember, "_id">;

const MemberSchema = new Schema<IMemberDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: MEMBER_ROLES,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatarColor: {
      type: String,
      required: [true, "Avatar color is required"],
      default: "#0EA5E9",
    },
  },
  {
    timestamps: true,
  }
);

export const Member: Model<IMemberDocument> =
  mongoose.models.Member || mongoose.model<IMemberDocument>("Member", MemberSchema);

export default Member;
