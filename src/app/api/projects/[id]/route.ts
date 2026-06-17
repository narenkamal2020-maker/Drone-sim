import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Project from "@/models/Project";
import Task from "@/models/Task";
import Activity from "@/models/Activity";
import { ProjectSchema } from "@/lib/validation";
import { getDuplicateKeyMessage, jsonError } from "@/server/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();

    const validated = ProjectSchema.safeParse(body);
    if (!validated.success) {
      return jsonError("Validation failed", 400, validated.error.flatten());
    }

    const project = await Project.findByIdAndUpdate(id, validated.data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return jsonError("Project not found", 404);
    }

    void Activity.create({
      type: "project_updated",
      actorName: "System",
      targetName: project.name,
      meta: { projectId: project._id.toString() },
    }).catch((error) => console.error("Project update activity error:", error));

    return NextResponse.json(project, { status: 200 });
  } catch (error: unknown) {
    console.error("PATCH /api/projects/[id] error:", error);
    const duplicateMessage = getDuplicateKeyMessage(error, "Project name already exists");
    return jsonError(duplicateMessage ?? "Failed to update project", duplicateMessage ? 409 : 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await dbConnect();

    const project = await Project.findById(id);
    if (!project) {
      return jsonError("Project not found", 404);
    }

    await Task.deleteMany({ projectId: id });
    await Project.findByIdAndDelete(id);

    void Activity.create({
      type: "project_deleted",
      actorName: "System",
      targetName: project.name,
      meta: { projectId: project._id.toString() },
    }).catch((error) => console.error("Project delete activity error:", error));

    return NextResponse.json(
      { message: "Project and its tasks deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/projects/[id] error:", error);
    return jsonError("Failed to delete project");
  }
}
