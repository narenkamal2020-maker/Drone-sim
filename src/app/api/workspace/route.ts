import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { getWorkspaceSnapshot } from "@/server/workspace";
import { jsonError } from "@/server/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const snapshot = await getWorkspaceSnapshot({
      search: searchParams.get("search") ?? undefined,
      status: (searchParams.get("status") as "todo" | "inprogress" | "done" | "all" | null) ?? undefined,
      priority: (searchParams.get("priority") as "low" | "medium" | "high" | "all" | null) ?? undefined,
      projectId: searchParams.get("projectId") ?? undefined,
      assigneeId: searchParams.get("assigneeId") ?? undefined,
    });

    return NextResponse.json(snapshot, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/workspace error:", error);
    return jsonError("Failed to fetch workspace snapshot");
  }
}
