import type { ResumeData } from "@/lib/types";

export function buildResumeText(data: ResumeData): string {
  const lines: string[] = [];

  lines.push(data.personal.name);
  const contact = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
    data.personal.github,
  ]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
  if (contact.length) lines.push(contact.join(" | "));
  lines.push("");

  if (data.education?.length) {
    lines.push("EDUCATION");
    for (const e of data.education) {
      const parts = [e.degree, e.institution, e.year]
        .map((s) => (s ?? "").trim())
        .filter(Boolean);
      if (parts.length) lines.push(parts.join(" — "));
      if (e.gpa?.trim()) lines.push(`GPA: ${e.gpa.trim()}`);
    }
    lines.push("");
  }

  if (data.skills?.length || data.certifications?.length) {
    lines.push("SKILLS");
    if (data.skills?.length) lines.push(data.skills.filter(Boolean).join(", "));
    if (data.certifications?.length)
      lines.push(`Certifications: ${data.certifications.filter(Boolean).join(", ")}`);
    lines.push("");
  }

  if (data.experience?.length) {
    lines.push("EXPERIENCE");
    for (const x of data.experience) {
      const header = [x.role, x.company]
        .map((s) => (s ?? "").trim())
        .filter(Boolean)
        .join(" — ");
      if (header) lines.push(header);
      if (x.dates?.trim()) lines.push(x.dates.trim());
      for (const b of x.bullets ?? []) lines.push(`- ${b}`);
      lines.push("");
    }
  }

  if (data.projects?.length) {
    lines.push("PROJECTS");
    for (const p of data.projects) {
      const header = [p.name, p.tech]
        .map((s) => (s ?? "").trim())
        .filter(Boolean)
        .join(" — ");
      if (header) lines.push(header);
      for (const b of p.bullets ?? []) lines.push(`- ${b}`);
      lines.push("");
    }
  }

  if (data.achievements?.length) {
    lines.push("ACHIEVEMENTS");
    for (const a of data.achievements) lines.push(`- ${a}`);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

