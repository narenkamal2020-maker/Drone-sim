import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(
      {
        ok: true,
        service: "club-collaboration-platform",
        hasMongoUri: Boolean(env.MONGODB_URI),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/health error:", error);
    return NextResponse.json(
      {
        ok: false,
        service: "club-collaboration-platform",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
