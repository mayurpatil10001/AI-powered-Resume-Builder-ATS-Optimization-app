import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { ResumeData, ResumeTemplateId } from "@/lib/types";
import { renderResumeHtml, wrapHtmlDocument } from "@/lib/templates";

export async function generatePdf(data: ResumeData, templateId: ResumeTemplateId): Promise<Uint8Array> {
  const inner = renderResumeHtml(templateId, data);
  const html = wrapHtmlDocument(inner, `${data.personal.name} Resume`);

  const isVercel = !!process.env.VERCEL;
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (isVercel ? await chromium.executablePath() : "");
  if (!executablePath) {
    throw new Error(
      "PDF generation requires Chrome. Set PUPPETEER_EXECUTABLE_PATH locally, or deploy on Vercel.",
    );
  }
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
    });
    return pdf;
  } finally {
    await browser.close();
  }
}
