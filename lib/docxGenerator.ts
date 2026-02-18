import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import type { ResumeData } from "@/lib/types";

export async function generateDocx(data: ResumeData): Promise<Uint8Array> {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: data.personal.name, bold: true })],
    }),
  );

  const contact = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
    data.personal.github,
  ]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(" | ");
  if (contact) children.push(new Paragraph({ children: [new TextRun({ text: contact })] }));
  children.push(new Paragraph(""));

  addSection(children, "Education");
  for (const e of data.education ?? []) {
    const line = [e.degree, e.institution, e.year].map((s) => (s ?? "").trim()).filter(Boolean).join(" — ");
    if (line) children.push(new Paragraph({ children: [new TextRun({ text: line, bold: true })] }));
    if (e.gpa?.trim()) children.push(new Paragraph(`GPA: ${e.gpa.trim()}`));
  }

  addSection(children, "Skills");
  if (data.skills?.length) children.push(new Paragraph(data.skills.filter(Boolean).join(", ")));
  if (data.certifications?.length)
    children.push(new Paragraph(`Certifications: ${data.certifications.filter(Boolean).join(", ")}`));

  addSection(children, "Experience");
  for (const x of data.experience ?? []) {
    const header = [x.role, x.company].map((s) => (s ?? "").trim()).filter(Boolean).join(" — ");
    if (header) children.push(new Paragraph({ children: [new TextRun({ text: header, bold: true })] }));
    if (x.dates?.trim()) children.push(new Paragraph({ children: [new TextRun({ text: x.dates.trim(), italics: true })] }));
    for (const b of x.bullets ?? []) {
      children.push(new Paragraph({ text: b, bullet: { level: 0 } }));
    }
  }

  addSection(children, "Projects");
  for (const p of data.projects ?? []) {
    const header = [p.name, p.tech].map((s) => (s ?? "").trim()).filter(Boolean).join(" — ");
    if (header) children.push(new Paragraph({ children: [new TextRun({ text: header, bold: true })] }));
    for (const b of p.bullets ?? []) children.push(new Paragraph({ text: b, bullet: { level: 0 } }));
  }

  if (data.achievements?.length) {
    addSection(children, "Achievements");
    for (const a of data.achievements ?? []) children.push(new Paragraph({ text: a, bullet: { level: 0 } }));
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc);
}

function addSection(children: Paragraph[], title: string) {
  children.push(new Paragraph(""));
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, text: title }));
}

