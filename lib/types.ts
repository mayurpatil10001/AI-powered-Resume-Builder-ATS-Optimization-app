import { z } from "zod";

export const resumeDataSchema = z.object({
  personal: z.object({
    name: z.string().min(1),
    email: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    linkedin: z.string().optional().default(""),
    github: z.string().optional().default(""),
    location: z.string().optional().default(""),
  }),
  education: z
    .array(
      z.object({
        degree: z.string().optional().default(""),
        institution: z.string().optional().default(""),
        year: z.string().optional().default(""),
        gpa: z.string().optional().default(""),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        company: z.string().optional().default(""),
        role: z.string().optional().default(""),
        dates: z.string().optional().default(""),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string().optional().default(""),
        tech: z.string().optional().default(""),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  achievements: z.array(z.string()).default([]),
});

export type ResumeDataForm = z.input<typeof resumeDataSchema>;
export type ResumeData = z.output<typeof resumeDataSchema>;

export type ResumeTemplateId = "classic" | "modern" | "minimal";

export type AtsScoreResult = {
  score: number;
  breakdown: {
    keywordMatch: number;
    formatting: number;
    readability: number;
    sectionCompleteness: number;
  };
  missingKeywords: string[];
  missingSections: string[];
};
