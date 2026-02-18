import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { resumeDataSchema, type ResumeData } from "@/lib/types";

export async function parseResumeFile(file: File): Promise<{ text: string; resumeData?: ResumeData }> {
  const arrayBuffer = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf") || file.type === "application/pdf";
  const isDocx =
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  let text = "";
  if (isPdf) {
    const parser = new PDFParse({ data: buf });
    try {
      const out = await parser.getText();
      text = out.text ?? "";
    } finally {
      await parser.destroy();
    }
  } else if (isDocx) {
    const out = await mammoth.extractRawText({ buffer: buf });
    text = out.value ?? "";
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
  }

  text = normalizeText(text);
  const resumeData = tryHeuristicExtract(text);
  return resumeData ? { text, resumeData } : { text };
}

export function normalizeText(text: string) {
  return (text ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function tryHeuristicExtract(text: string): ResumeData | null {
  // Lightweight heuristic: best-effort extraction for preview/export.
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines[0] ?? "";
  if (!name) return null;

  const lower = text.toLowerCase();
  const personal = {
    name,
    email: extractEmail(text) ?? "",
    phone: extractPhone(text) ?? "",
    linkedin: extractUrl(lower, "linkedin.com") ?? "",
    github: extractUrl(lower, "github.com") ?? "",
    location: "",
  };

  const skills = extractSectionList(text, ["skills", "technical skills"]) ?? [];
  const certifications = extractSectionList(text, ["certifications", "certification"]) ?? [];

  const parsed = resumeDataSchema.safeParse({
    personal,
    education: [],
    skills,
    certifications,
    experience: [],
    projects: [],
    achievements: [],
  });
  return parsed.success ? parsed.data : null;
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
}

function extractPhone(text: string) {
  return text.match(/(\+?\d{1,2}\s*)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)?.[0] ?? null;
}

function extractUrl(lowerText: string, host: string) {
  const re = new RegExp(`https?:\\/\\/(?:www\\.)?${host.replace(".", "\\.")}\\/[^\\s]+`, "i");
  return lowerText.match(re)?.[0] ?? null;
}

function extractSectionList(text: string, headings: string[]): string[] | null {
  const re = new RegExp(`(^|\\n)\\s*(${headings.map(escapeRe).join("|")})\\s*\\n`, "i");
  const m = text.match(re);
  if (!m || m.index === undefined) return null;
  const start = m.index + m[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.match(/\n\s*[A-Z][A-Z \t&/]{2,}\s*\n/);
  const chunk = (nextHeading && nextHeading.index !== undefined) ? rest.slice(0, nextHeading.index) : rest;
  const items = chunk
    .split(/\n|,|•|- /)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2 && s.length <= 40);
  return items.length ? [...new Set(items)].slice(0, 40) : null;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
