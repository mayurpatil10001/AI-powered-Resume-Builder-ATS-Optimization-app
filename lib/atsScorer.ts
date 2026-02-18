import type { AtsScoreResult } from "@/lib/types";

const SECTION_HINTS = [
  "education",
  "skills",
  "experience",
  "work experience",
  "projects",
  "certifications",
  "achievements",
  "summary",
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  "software engineer": [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node",
    "api",
    "sql",
    "testing",
    "aws",
    "docker",
  ],
  "data analyst": ["sql", "excel", "python", "tableau", "power bi", "dashboards", "statistics"],
  "product manager": ["roadmap", "stakeholders", "requirements", "user research", "metrics", "experiments"],
};

export function scoreResume(resumeText: string, targetRole: string): AtsScoreResult {
  const text = (resumeText ?? "").toLowerCase();
  const roleKey = (targetRole ?? "").toLowerCase().trim();

  const keywords = pickKeywords(roleKey);
  const hits = keywords.filter((k) => text.includes(k.toLowerCase()));
  const keywordMatch = keywords.length ? (hits.length / keywords.length) * 100 : 50;
  const missingKeywords = keywords.filter((k) => !hits.includes(k));

  const missingSections = SECTION_HINTS.filter((s) => !text.includes(s));
  const sectionCompleteness = clamp01((SECTION_HINTS.length - missingSections.length) / SECTION_HINTS.length) * 100;

  const formatting = formattingScore(resumeText);
  const readability = readabilityScore(resumeText);

  const score = weightedAverage([
    { v: keywordMatch, w: 0.45 },
    { v: sectionCompleteness, w: 0.25 },
    { v: readability, w: 0.15 },
    { v: formatting, w: 0.15 },
  ]);

  return {
    score: clamp(score, 0, 100),
    breakdown: {
      keywordMatch: clamp(keywordMatch, 0, 100),
      formatting: clamp(formatting, 0, 100),
      readability: clamp(readability, 0, 100),
      sectionCompleteness: clamp(sectionCompleteness, 0, 100),
    },
    missingKeywords: missingKeywords.slice(0, 30),
    missingSections,
  };
}

function pickKeywords(roleKey: string): string[] {
  if (!roleKey) return [];
  const exact = ROLE_KEYWORDS[roleKey];
  if (exact) return exact;
  const byContains = Object.entries(ROLE_KEYWORDS).find(([k]) => roleKey.includes(k));
  return byContains ? byContains[1] : defaultKeywords(roleKey);
}

function defaultKeywords(roleKey: string): string[] {
  // Minimal fallback: use a few generic terms + role tokens.
  const tokens = roleKey.split(/[^a-z0-9]+/).filter(Boolean).slice(0, 6);
  return [...new Set(["impact", "metrics", "collaboration", "ownership", ...tokens])];
}

function formattingScore(resumeText: string): number {
  const lines = (resumeText ?? "").split(/\r?\n/);
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (!nonEmpty.length) return 0;

  const bulletLines = nonEmpty.filter((l) => /^\s*[-•*]\s+/.test(l));
  const hasBullets = bulletLines.length >= 3;

  const avgLineLen =
    nonEmpty.reduce((sum, l) => sum + l.trim().length, 0) / Math.max(1, nonEmpty.length);
  const lineLenScore = 100 - clamp(Math.abs(avgLineLen - 55) * 1.4, 0, 60);

  const spacingScore = clamp((countBlankLines(lines) / Math.max(1, lines.length)) * 220, 0, 20);
  const bulletScore = hasBullets ? 25 : clamp((bulletLines.length / 6) * 25, 0, 25);

  return clamp(55 + bulletScore + spacingScore + (lineLenScore - 60) * 0.6, 0, 100);
}

function readabilityScore(resumeText: string): number {
  const text = (resumeText ?? "").replace(/\s+/g, " ").trim();
  if (!text) return 0;

  const sentences = Math.max(1, text.split(/[.!?]+/).filter(Boolean).length);
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = Math.max(1, words.length);
  const syllables = words.reduce((sum, w) => sum + estimateSyllables(w), 0);

  // Flesch Reading Ease: higher is easier. Resumes should be clear; we clamp to 0..100.
  const flesch = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);
  return clamp(flesch, 0, 100);
}

function estimateSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 1;
  const groups = w.match(/[aeiouy]+/g);
  const count = groups ? groups.length : 1;
  return Math.max(1, count - (w.endsWith("e") ? 1 : 0));
}

function weightedAverage(items: { v: number; w: number }[]) {
  const sumW = items.reduce((s, i) => s + i.w, 0) || 1;
  return items.reduce((s, i) => s + i.v * i.w, 0) / sumW;
}

function countBlankLines(lines: string[]) {
  return lines.filter((l) => l.trim().length === 0).length;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

