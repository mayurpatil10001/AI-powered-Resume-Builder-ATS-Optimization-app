"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeData, ResumeTemplateId } from "@/lib/types";
import { renderResumeHtml } from "@/lib/templates";
import { buildResumeText } from "@/lib/resumeText";

export default function ResumePreview(props: {
  templateId: ResumeTemplateId;
  resumeData: ResumeData | null;
  fallbackText: string;
}) {
  const html = useMemo(() => {
    if (props.resumeData) return renderResumeHtml(props.templateId, props.resumeData);
    if (props.fallbackText) {
      return `<div style="font-family: ui-sans-serif, system-ui; white-space: pre-wrap; padding: 16px;">${escapeHtml(
        props.fallbackText,
      )}</div>`;
    }
    return `<div style="color:#71717a;font-family:ui-sans-serif,system-ui;padding:16px;">Add a resume to preview it.</div>`;
  }, [props.resumeData, props.fallbackText, props.templateId]);

  const label = useMemo(() => {
    if (!props.resumeData) return "Preview";
    return `Preview (${Math.max(1, Math.round(buildResumeText(props.resumeData).length / 1500))} page est.)`;
  }, [props.resumeData]);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>{label}</CardTitle>
        <div className="text-sm text-zinc-500">Live HTML preview of the selected template.</div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-white">
          <div className="h-[700px] overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </CardContent>
    </Card>
  );
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

