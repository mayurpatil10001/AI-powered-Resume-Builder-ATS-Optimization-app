import { NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/resumeParser";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    const { text, resumeData } = await parseResumeFile(file);
    return NextResponse.json({ text, resumeData }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Parse failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

