import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Member from "@/models/Member";
import Activity from "@/models/Activity";
import { TaskCreateSchema } from "@/lib/validation";
import { jsonError } from "@/server/api";

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({})
      .populate("projectId")
      .populate("assignedTo")
      .sort({ createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/tasks error:", error);
    return jsonError("Failed to fetch tasks");
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = TaskCreateSchema.safeParse(body);
    if (!validatedData.success) {
      return jsonError("Validation failed", 400, validatedData.error.flatten());
    }

    // Verify project exists
    const project = await Project.findById(validatedData.data.projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Referenced Project does not exist" },
        { status: 400 }
      );
    }

    // Verify member exists if assigned
    let assignedMember = null;
    if (validatedData.data.assignedTo) {
      assignedMember = await Member.findById(validatedData.data.assignedTo);
      if (!assignedMember) {
        return jsonError("Referenced Member does not exist", 400);
      }
    }

    const createdTask = await Task.create(validatedData.data);
    const populatedTask = await Task.findById(createdTask._id)
      .populate("projectId")
      .populate("assignedTo");

    // Async audit log — fire and forget
    Activity.create({
      type: assignedMember ? "task_assigned" : "task_created",
      actorName: assignedMember?.name ?? "System",
      targetName: validatedData.data.title,
      meta: { projectId: project._id.toString(), toStatus: "todo" },
    }).catch((e) => console.error("Activity log error:", e));

    return NextResponse.json(populatedTask, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/tasks error:", error);
    return jsonError("Failed to create task");
  }
}
