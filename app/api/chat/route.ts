import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  context: z.string().optional().default(""),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const openai = getOpenAIClient();
    const system = [
      "You are a concise, practical resume coach.",
      "Give ATS-aware improvements without hallucinating credentials.",
      "Prefer concrete rewrites and checklists.",
      body.context ? `Context:\n${body.context}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4,
      messages: [{ role: "system", content: system }, ...body.messages],
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

