import type { ResumeData, ResumeTemplateId } from "@/lib/types";

export function renderResumeHtml(templateId: ResumeTemplateId, data: ResumeData): string {
  switch (templateId) {
    case "modern":
      return renderModern(data);
    case "minimal":
      return renderMinimal(data);
    case "classic":
    default:
      return renderClassic(data);
  }
}

export function wrapHtmlDocument(innerHtml: string, title = "Resume") {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(
    title,
  )}</title></head><body>${innerHtml}</body></html>`;
}

function renderClassic(d: ResumeData) {
  const css = `
    :root{--ink:#0a0a0a;--muted:#52525b;--rule:#e4e4e7;}
    body{font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; color:var(--ink); margin:0; padding:28px;}
    h1{font-size:28px; margin:0;}
    .meta{color:var(--muted); font-size:12px; margin-top:6px;}
    h2{font-size:12px; letter-spacing:.12em; text-transform:uppercase; margin:18px 0 8px;}
    hr{border:none; border-top:1px solid var(--rule); margin:10px 0;}
    .item{margin:10px 0;}
    .row{display:flex; justify-content:space-between; gap:12px;}
    .role{font-weight:600;}
    ul{margin:6px 0 0 18px; padding:0;}
    li{margin:3px 0;}
  `;
  return `
    <style>${css}</style>
    <div>
      <h1>${escapeHtml(d.personal.name)}</h1>
      <div class="meta">${escapeHtml(joinMeta(d))}</div>
      <hr/>
      ${sectionEducation(d)}
      ${sectionSkills(d)}
      ${sectionExperience(d)}
      ${sectionProjects(d)}
      ${sectionAchievements(d)}
    </div>
  `;
}

function renderModern(d: ResumeData) {
  const css = `
    :root{--ink:#0a0a0a;--muted:#52525b;--bg:#ffffff;--accent:#0ea5e9;--rule:#e4e4e7;}
    body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color:var(--ink); margin:0; background:var(--bg);}
    .wrap{display:grid; grid-template-columns: 1fr 2.2fr; min-height: 100vh;}
    .side{padding:26px; border-right:1px solid var(--rule); background:linear-gradient(180deg,#f0f9ff, #fff);}
    .main{padding:26px;}
    h1{font-size:22px; margin:0;}
    .pill{display:inline-block; background:rgba(14,165,233,.12); color:#0369a1; padding:3px 8px; border-radius:999px; font-size:11px; margin-top:10px;}
    h2{font-size:11px; letter-spacing:.12em; text-transform:uppercase; margin:16px 0 8px;}
    .meta{color:var(--muted); font-size:12px; line-height:1.5; margin-top:10px;}
    .item{margin:10px 0;}
    .row{display:flex; justify-content:space-between; gap:12px;}
    .role{font-weight:650;}
    ul{margin:6px 0 0 18px; padding:0;}
    li{margin:3px 0;}
    .k{color:var(--muted); font-size:12px;}
  `;
  return `
    <style>${css}</style>
    <div class="wrap">
      <aside class="side">
        <h1>${escapeHtml(d.personal.name)}</h1>
        <div class="pill">ATS-Optimized</div>
        <div class="meta">${escapeHtml(joinMeta(d))}</div>
        ${miniList("Skills", d.skills)}
        ${miniList("Certifications", d.certifications)}
      </aside>
      <main class="main">
        ${sectionEducation(d)}
        ${sectionExperience(d)}
        ${sectionProjects(d)}
        ${sectionAchievements(d)}
      </main>
    </div>
  `;
}

function renderMinimal(d: ResumeData) {
  const css = `
    body{font-family: Arial, Helvetica, sans-serif; color:#111827; margin:0; padding:28px;}
    h1{font-size:20px; margin:0;}
    .meta{font-size:11px; margin-top:6px;}
    h2{font-size:12px; margin:16px 0 6px;}
    ul{margin:6px 0 0 18px; padding:0;}
    li{margin:3px 0;}
    .row{display:flex; justify-content:space-between; gap:12px;}
    .role{font-weight:700;}
  `;
  return `
    <style>${css}</style>
    <div>
      <h1>${escapeHtml(d.personal.name)}</h1>
      <div class="meta">${escapeHtml(joinMeta(d))}</div>
      ${sectionEducation(d)}
      ${sectionSkills(d)}
      ${sectionExperience(d)}
      ${sectionProjects(d)}
      ${sectionAchievements(d)}
    </div>
  `;
}

function sectionEducation(d: ResumeData) {
  if (!d.education?.length) return "";
  return `
    <h2>Education</h2>
    ${d.education
      .map((e) => {
        const left = [e.degree, e.institution].filter(Boolean).join(" — ");
        const right = [e.year, e.gpa ? `GPA ${e.gpa}` : ""].filter(Boolean).join(" | ");
        return `<div class="item"><div class="row"><div>${escapeHtml(left)}</div><div class="k">${escapeHtml(
          right,
        )}</div></div></div>`;
      })
      .join("")}
  `;
}

function sectionSkills(d: ResumeData) {
  const items = [...(d.skills ?? [])].filter(Boolean);
  const certs = [...(d.certifications ?? [])].filter(Boolean);
  if (!items.length && !certs.length) return "";
  return `
    <h2>Skills</h2>
    ${items.length ? `<div class="item">${escapeHtml(items.join(", "))}</div>` : ""}
    ${certs.length ? `<div class="item"><span class="k">Certifications:</span> ${escapeHtml(certs.join(", "))}</div>` : ""}
  `;
}

function sectionExperience(d: ResumeData) {
  if (!d.experience?.length) return "";
  return `
    <h2>Experience</h2>
    ${d.experience
      .map((x) => {
        const header = [x.role, x.company].filter(Boolean).join(" — ");
        const dates = x.dates ?? "";
        const bullets = (x.bullets ?? []).filter(Boolean);
        return `<div class="item">
          <div class="row"><div class="role">${escapeHtml(header)}</div><div class="k">${escapeHtml(dates)}</div></div>
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>`;
      })
      .join("")}
  `;
}

function sectionProjects(d: ResumeData) {
  if (!d.projects?.length) return "";
  return `
    <h2>Projects</h2>
    ${d.projects
      .map((p) => {
        const header = [p.name, p.tech].filter(Boolean).join(" — ");
        const bullets = (p.bullets ?? []).filter(Boolean);
        return `<div class="item">
          <div class="role">${escapeHtml(header)}</div>
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>`;
      })
      .join("")}
  `;
}

function sectionAchievements(d: ResumeData) {
  const a = (d.achievements ?? []).filter(Boolean);
  if (!a.length) return "";
  return `
    <h2>Achievements</h2>
    <ul>${a.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
  `;
}

function miniList(title: string, items?: string[]) {
  const list = (items ?? []).filter(Boolean);
  if (!list.length) return "";
  return `
    <h2>${escapeHtml(title)}</h2>
    <div class="meta">${escapeHtml(list.join(", "))}</div>
  `;
}

function joinMeta(d: ResumeData) {
  return [
    d.personal.email,
    d.personal.phone,
    d.personal.location,
    d.personal.linkedin,
    d.personal.github,
  ]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(" | ");
}

function escapeHtml(s: string) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

