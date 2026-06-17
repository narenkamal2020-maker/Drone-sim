import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Member from "@/models/Member";
import Activity from "@/models/Activity";
import { TaskUpdateSchema } from "@/lib/validation";
import { jsonError } from "@/server/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();

    const validatedData = TaskUpdateSchema.safeParse(body);
    if (!validatedData.success) {
      return jsonError("Validation failed", 400, validatedData.error.flatten());
    }

    if (validatedData.data.projectId) {
      const projectExists = await Project.findById(validatedData.data.projectId);
      if (!projectExists) {
        return jsonError("Referenced Project does not exist", 400);
      }
    }

    if (validatedData.data.assignedTo) {
      const memberExists = await Member.findById(validatedData.data.assignedTo);
      if (!memberExists) {
        return jsonError("Referenced Member does not exist", 400);
      }
    }

    const originalTask = await Task.findById(id);
    if (!originalTask) {
      return jsonError("Task not found", 404);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: validatedData.data },
      { new: true }
    )
      .populate("projectId")
      .populate("assignedTo");

    // Async audit log for status transitions
    if (
      validatedData.data.status &&
      validatedData.data.status !== originalTask.status
    ) {
      const newStatus = validatedData.data.status;
      const activityType =
        newStatus === "done" ? "task_completed" : "task_moved";

      Activity.create({
        type: activityType,
        actorName: "System",
        targetName: originalTask.title,
        meta: {
          fromStatus: originalTask.status,
          toStatus: newStatus,
        },
      }).catch((e) => console.error("Activity log error:", e));
    }

    // Async audit log for assignment updates
    if (
      validatedData.data.hasOwnProperty("assignedTo") &&
      String(validatedData.data.assignedTo || "") !== String(originalTask.assignedTo || "")
    ) {
      Activity.create({
        type: "task_assigned",
        actorName: "System",
        targetName: originalTask.title,
        meta: {
          projectId: originalTask.projectId.toString(),
          toStatus: updatedTask?.status ?? originalTask.status,
        },
      }).catch((e) => console.error("Activity log error (assignment):", e));
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error: unknown) {
    console.error(`PATCH /api/tasks/[id] error:`, error);
    return jsonError("Failed to update task");
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await dbConnect();

    const task = await Task.findById(id);
    if (!task) {
      return jsonError("Task not found", 404);
    }

    await Task.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return jsonError("Failed to delete task");
  }
}
