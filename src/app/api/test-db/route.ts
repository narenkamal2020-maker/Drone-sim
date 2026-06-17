import { NextResponse } from "next/server";
import dbConnect from "@/config/db";

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ success: true, message: "Connected to MongoDB" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}