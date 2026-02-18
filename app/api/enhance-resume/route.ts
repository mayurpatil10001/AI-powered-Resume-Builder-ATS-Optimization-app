import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import { getGeminiClient } from "@/lib/gemini";
import { resumeDataSchema, type ResumeData } from "@/lib/types";
import { buildResumeText } from "@/lib/resumeText";
import { normalizeText, tryHeuristicExtract } from "@/lib/resumeParser";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  targetRole: z.string().min(1).default("Software Engineer"),
  resumeText: z.string().optional(),
  resumeData: resumeDataSchema.optional(),
});

const geminiEditsSchema = z.object({
  bulletsEdits: z
    .array(
      z.object({
        path: z.string(),
        bullets: z.array(z.string()),
      }),
    )
    .optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const baseData: ResumeData | null = body.resumeData
      ? body.resumeData
      : body.resumeText
        ? tryHeuristicExtract(normalizeText(body.resumeText))
        : null;

    if (!baseData) {
      return NextResponse.json({ error: "Provide resumeData or resumeText." }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const system = [
      "You are an expert resume writer and ATS optimizer.",
      "Improve bullet points using strong action verbs, metrics, and clarity.",
      "Optimize keywords for ATS for the target role while staying truthful.",
      "Summarize verbose content concisely.",
      "Maintain professional tone and consistent tense.",
      "Return ONLY valid JSON matching this schema:",
      "{ personal:{name,email,phone,linkedin,github,location}, education:[{degree,institution,year,gpa}], skills:[string], certifications:[string], experience:[{company,role,dates,bullets:[string]}], projects:[{name,tech,bullets:[string]}], achievements:[string] }",
    ].join("\n");

    const user = JSON.stringify({ targetRole: body.targetRole, resumeData: baseData });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    });

    const gptJson = completion.choices[0]?.message?.content ?? "{}";
    const gptParsed = resumeDataSchema.safeParse(JSON.parse(gptJson));
    if (!gptParsed.success) {
      return NextResponse.json({ error: "OpenAI returned invalid JSON." }, { status: 502 });
    }

    // Gemini pass: grammar + keyword suggestions. We apply as light edits to bullets only.
    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
    const gemPrompt = [
      "You are a resume editor.",
      "Fix grammar/fluency and suggest alternative keywords for ATS.",
      "Return ONLY JSON with shape: { bulletsEdits: { path: string, bullets: string[] }[] }",
      "Paths use: experience[i].bullets or projects[i].bullets",
      "Keep meaning truthful; do not invent employers, dates, or degrees.",
      "Resume text:",
      buildResumeText(gptParsed.data).slice(0, 12000),
    ].join("\n");
    const gemRes = await model.generateContent(gemPrompt);
    const gemText = gemRes.response.text().trim();
    const gemJson = safeJson(gemText);
    const gemParsed = gemJson ? geminiEditsSchema.safeParse(gemJson) : null;

    const merged = applyBulletEdits(gptParsed.data, gemParsed?.success ? gemParsed.data.bulletsEdits : undefined);
    return NextResponse.json({ enhancedData: merged }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Enhancement failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function safeJson(text: string): unknown | null {
  try {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1) return null;
    return JSON.parse(text.slice(first, last + 1));
  } catch {
    return null;
  }
}

function applyBulletEdits(
  data: ResumeData,
  edits: Array<{ path: string; bullets: string[] }> | undefined,
): ResumeData {
  if (!edits?.length) return data;
  const next: ResumeData = JSON.parse(JSON.stringify(data));
  for (const e of edits) {
    const mExp = e.path.match(/^experience\[(\d+)\]\.bullets$/);
    const mProj = e.path.match(/^projects\[(\d+)\]\.bullets$/);
    if (mExp) {
      const i = Number(mExp[1]);
      if (next.experience?.[i]) next.experience[i].bullets = e.bullets.map(String).filter(Boolean).slice(0, 12);
    } else if (mProj) {
      const i = Number(mProj[1]);
      if (next.projects?.[i]) next.projects[i].bullets = e.bullets.map(String).filter(Boolean).slice(0, 10);
    }
  }
  return next;
}
