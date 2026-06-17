import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { getWorkspaceSnapshot } from "@/server/workspace";
import { jsonError } from "@/server/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const workspace = await getWorkspaceSnapshot();
    return NextResponse.json(workspace.analytics, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/analytics error:", error);
    return jsonError("Failed to fetch analytics");
  }
}
