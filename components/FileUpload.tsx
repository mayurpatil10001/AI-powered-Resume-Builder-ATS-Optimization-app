"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AtsScoreResult, ResumeData } from "@/lib/types";

export default function FileUpload(props: {
  targetRole: string;
  setTargetRole: (v: string) => void;
  loading: boolean;
  setLoading: (next: { parsing?: boolean; scoring?: boolean }) => void;
  onParsed: (p: { text: string; resumeData?: ResumeData }) => void;
  onScored: (s: AtsScoreResult) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  async function parseAndScore() {
    if (!file) return;
    props.setLoading({ parsing: true });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Parse failed");
      props.onParsed({ text: json.text, resumeData: json.resumeData });
      toast.success("Resume parsed.");

      props.setLoading({ parsing: false, scoring: true });
      const scoreRes = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: json.text, targetRole: props.targetRole }),
      });
      const scoreJson = await scoreRes.json();
      if (!scoreRes.ok) throw new Error(scoreJson?.error ?? "ATS scoring failed");
      props.onScored(scoreJson);
      toast.success("ATS score calculated.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      props.setLoading({ parsing: false, scoring: false });
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="targetRole">Target role</Label>
        <Input
          id="targetRole"
          value={props.targetRole}
          onChange={(e) => props.setTargetRole(e.target.value)}
          placeholder="e.g., Data Analyst"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="resumeFile">Resume file</Label>
        <Input
          id="resumeFile"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div className="text-xs text-zinc-500">Supported: PDF, DOCX.</div>
      </div>

      <Button className="w-full" onClick={parseAndScore} disabled={!file || props.loading}>
        {props.loading ? "Working..." : "Parse + Score"}
      </Button>
    </div>
  );
}

