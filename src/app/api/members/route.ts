import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Member from "@/models/Member";
import { MemberSchema } from "@/lib/validation";
import Activity from "@/models/Activity";
import { getDuplicateKeyMessage, jsonError } from "@/server/api";

export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find({}).sort({ name: 1 });
    return NextResponse.json(members, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/members error:", error);
    return jsonError("Failed to fetch members");
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validation
    const validatedData = MemberSchema.safeParse(body);
    if (!validatedData.success) {
      return jsonError("Validation failed", 400, validatedData.error.flatten());
    }

    // Check if email already taken
    const existing = await Member.findOne({ email: validatedData.data.email });
    if (existing) {
      return NextResponse.json(
        { error: "Email address already assigned to a member" },
        { status: 409 }
      );
    }

    const member = await Member.create(validatedData.data);
    void Activity.create({
      type: "member_updated",
      actorName: "System",
      targetName: member.name,
    }).catch((error) => console.error("Member activity error:", error));
    return NextResponse.json(member, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/members error:", error);
    const duplicateMessage = getDuplicateKeyMessage(
      error,
      "Email address already assigned to a member"
    );
    return jsonError(duplicateMessage ?? "Failed to create member", duplicateMessage ? 409 : 500);
  }
}
