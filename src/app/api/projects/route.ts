import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import { ProjectSchema } from "@/lib/validation";
import { getDuplicateKeyMessage, jsonError } from "@/server/api";

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/projects error:", error);
    return jsonError("Failed to fetch projects");
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validation
    const validatedData = ProjectSchema.safeParse(body);
    if (!validatedData.success) {
      return jsonError("Validation failed", 400, validatedData.error.flatten());
    }

    // Check if name is already taken
    const existing = await Project.findOne({ name: validatedData.data.name });
    if (existing) {
      return NextResponse.json(
        { error: "Project name already exists" },
        { status: 409 }
      );
    }

    const project = await Project.create(validatedData.data);

    // Audit Log Project Creation
    try {
      await Activity.create({
        type: "project_created",
        actorName: "System",
        targetName: project.name,
        meta: { projectId: project._id.toString() },
      });
    } catch (logError) {
      console.error("Failed to write project_created activity log:", logError);
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/projects error:", error);
    const duplicateMessage = getDuplicateKeyMessage(error, "Project name already exists");
    return jsonError(duplicateMessage ?? "Failed to create project", duplicateMessage ? 409 : 500);
  }
}
