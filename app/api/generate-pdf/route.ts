import { NextResponse } from "next/server";
import { z } from "zod";
import { resumeDataSchema } from "@/lib/types";
import type { ResumeTemplateId } from "@/lib/types";
import { generatePdf } from "@/lib/pdfGenerator";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  resumeData: resumeDataSchema,
  templateId: z.enum(["classic", "modern", "minimal"]).default("classic"),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const pdf = await generatePdf(body.resumeData, body.templateId as ResumeTemplateId);
    const buf = Buffer.from(pdf);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"resume.pdf\"",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "PDF generation failed";
    return new NextResponse(message, { status: 500 });
  }
}
