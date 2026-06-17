import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

const parsedEnv = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
});

if (!parsedEnv.success) {
  throw new Error(parsedEnv.error.issues.map((issue) => issue.message).join(", "));
}

export const env = parsedEnv.data;
