import { NextResponse } from "next/server";
import { z } from "zod";
import { resumeDataSchema } from "@/lib/types";
import { generateDocx } from "@/lib/docxGenerator";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  resumeData: resumeDataSchema,
  templateId: z.enum(["classic", "modern", "minimal"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const bytes = await generateDocx(body.resumeData);
    const buf = Buffer.from(bytes);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=\"resume.docx\"",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "DOCX generation failed";
    return new NextResponse(message, { status: 500 });
  }
}
