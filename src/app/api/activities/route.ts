import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { getActivities } from "@/server/workspace";
import { jsonError } from "@/server/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const activities = await getActivities();
    return NextResponse.json(activities, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/activities error:", error);
    return jsonError("Failed to fetch activities feed");
  }
}
