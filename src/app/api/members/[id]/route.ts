import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Member from "@/models/Member";
import Task from "@/models/Task";
import Activity from "@/models/Activity";
import { MemberSchema } from "@/lib/validation";
import { getDuplicateKeyMessage, jsonError } from "@/server/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();

    const validated = MemberSchema.safeParse(body);
    if (!validated.success) {
      return jsonError("Validation failed", 400, validated.error.flatten());
    }

    const member = await Member.findByIdAndUpdate(id, validated.data, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return jsonError("Member not found", 404);
    }

    void Activity.create({
      type: "member_updated",
      actorName: "System",
      targetName: member.name,
    }).catch((error) => console.error("Member update activity error:", error));

    return NextResponse.json(member, { status: 200 });
  } catch (error: unknown) {
    console.error("PATCH /api/members/[id] error:", error);
    const duplicateMessage = getDuplicateKeyMessage(
      error,
      "Email address already assigned to a member"
    );
    return jsonError(duplicateMessage ?? "Failed to update member", duplicateMessage ? 409 : 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    await dbConnect();

    const member = await Member.findById(id);
    if (!member) {
      return jsonError("Member not found", 404);
    }

    // Unassign this member from all tasks before deleting
    await Task.updateMany(
      { assignedTo: id },
      { $set: { assignedTo: null } }
    );

    await Member.findByIdAndDelete(id);
    void Activity.create({
      type: "member_removed",
      actorName: "System",
      targetName: member.name,
    }).catch((error) => console.error("Member remove activity error:", error));
    return NextResponse.json(
      { message: "Member removed successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/members/[id] error:", error);
    return jsonError("Failed to delete member");
  }
}
