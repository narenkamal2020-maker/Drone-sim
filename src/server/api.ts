import { NextResponse } from "next/server";

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    details ? { error: message, details } : { error: message },
    { status }
  );
}

export function getDuplicateKeyMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return fallback;
  }

  return null;
}
