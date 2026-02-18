import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreResume } from "@/lib/atsScorer";

export const runtime = "nodejs";

const schema = z.object({
  resumeText: z.string().min(1),
  targetRole: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const result = scoreResume(body.resumeText, body.targetRole);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Scoring failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

