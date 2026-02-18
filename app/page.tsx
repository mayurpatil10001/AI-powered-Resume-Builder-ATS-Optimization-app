"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ResumeForm from "@/components/ResumeForm";
import ATSScoreCard from "@/components/ATSScoreCard";
import TemplateSelector from "@/components/TemplateSelector";
import ResumePreview from "@/components/ResumePreview";
import ComparisonView from "@/components/ComparisonView";
import ChatWidget from "@/components/ChatWidget";
import type { AtsScoreResult, ResumeData, ResumeTemplateId } from "@/lib/types";
import { buildResumeText } from "@/lib/resumeText";

export default function Home() {
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [originalText, setOriginalText] = useState<string>("");
  const [enhancedData, setEnhancedData] = useState<ResumeData | null>(null);
  const [enhancedText, setEnhancedText] = useState<string>("");
  const [score, setScore] = useState<AtsScoreResult | null>(null);
  const [enhancedScore, setEnhancedScore] = useState<AtsScoreResult | null>(null);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>("classic");
  const [loading, setLoading] = useState<{
    parsing?: boolean;
    scoring?: boolean;
    enhancing?: boolean;
    generatingDocx?: boolean;
    generatingPdf?: boolean;
  }>({});

  const currentText = useMemo(() => {
    if (enhancedData) return buildResumeText(enhancedData);
    if (resumeData) return buildResumeText(resumeData);
    return originalText;
  }, [enhancedData, resumeData, originalText]);

  async function runATS(text: string, next: "score" | "enhancedScore") {
    setLoading((s) => ({ ...s, scoring: true }));
    try {
      const res = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, targetRole }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "ATS scoring failed");
      if (next === "score") setScore(json);
      else setEnhancedScore(json);
    } finally {
      setLoading((s) => ({ ...s, scoring: false }));
    }
  }

  async function enhance() {
    if (!resumeData && !originalText) {
      toast.error("Add a resume (upload or manual entry) first.");
      return;
    }
    setLoading((s) => ({ ...s, enhancing: true }));
    try {
      const payload = resumeData
        ? { resumeData, targetRole }
        : { resumeText: originalText, targetRole };
      const res = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Enhancement failed");
      setEnhancedData(json.enhancedData);
      setEnhancedText(buildResumeText(json.enhancedData));
      toast.success("Enhanced resume created.");
      await runATS(buildResumeText(json.enhancedData), "enhancedScore");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Enhancement failed");
    } finally {
      setLoading((s) => ({ ...s, enhancing: false }));
    }
  }

  async function generate(kind: "docx" | "pdf") {
    const data = enhancedData ?? resumeData;
    if (!data) {
      toast.error("Nothing to generate yet.");
      return;
    }
    const key = kind === "docx" ? "generatingDocx" : "generatingPdf";
    setLoading((s) => ({ ...s, [key]: true }));
    try {
      const endpoint = kind === "docx" ? "/api/generate-docx" : "/api/generate-pdf";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: data, templateId }),
      });
      const blob = await res.blob();
      if (!res.ok) {
        const text = await blob.text().catch(() => "");
        throw new Error(text || "File generation failed");
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${kind.toUpperCase()}.`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "File generation failed");
    } finally {
      setLoading((s) => ({ ...s, [key]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-8 sm:px-6">
        <div className="space-y-1">
          <div className="text-sm font-medium text-zinc-500">AI Resume Builder</div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Resume Builder & ATS Optimization
          </h1>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="secondary"
            onClick={() =>
              resumeData ? runATS(buildResumeText(resumeData), "score") : runATS(originalText, "score")
            }
            disabled={loading.scoring || (!resumeData && !originalText)}
          >
            {loading.scoring ? "Scoring..." : "Run ATS Score"}
          </Button>
          <Button onClick={enhance} disabled={loading.enhancing || (!resumeData && !originalText)}>
            {loading.enhancing ? "Enhancing..." : "Enhance with AI"}
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Input</CardTitle>
              <div className="text-sm text-zinc-500">
                Upload a resume or enter details manually. Then score, enhance, and export.
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">File Upload</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-4">
                  <FileUpload
                    targetRole={targetRole}
                    setTargetRole={setTargetRole}
                    onParsed={(p) => {
                      setResumeData(p.resumeData ?? null);
                      setOriginalText(p.text ?? "");
                      setEnhancedData(null);
                      setEnhancedText("");
                      setScore(null);
                      setEnhancedScore(null);
                    }}
                    onScored={(s) => setScore(s)}
                    loading={!!loading.parsing || !!loading.scoring}
                    setLoading={(next) => setLoading((s) => ({ ...s, ...next }))}
                  />
                </TabsContent>
                <TabsContent value="manual" className="pt-4">
                  <ResumeForm
                    targetRole={targetRole}
                    setTargetRole={setTargetRole}
                    onSubmit={(data) => {
                      setResumeData(data);
                      setOriginalText(buildResumeText(data));
                      setEnhancedData(null);
                      setEnhancedText("");
                      setScore(null);
                      setEnhancedScore(null);
                      toast.success("Resume saved.");
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <ATSScoreCard score={score} enhancedScore={enhancedScore} />

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Export</CardTitle>
              <div className="text-sm text-zinc-500">Choose a template and download Word or PDF.</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <TemplateSelector value={templateId} onChange={setTemplateId} />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => generate("docx")}
                  disabled={loading.generatingDocx || (!resumeData && !enhancedData)}
                >
                  {loading.generatingDocx ? "Generating..." : "Download .DOCX"}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => generate("pdf")}
                  disabled={loading.generatingPdf || (!resumeData && !enhancedData)}
                >
                  {loading.generatingPdf ? "Generating..." : "Download PDF"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ResumePreview templateId={templateId} resumeData={enhancedData ?? resumeData} fallbackText={currentText} />
          <ComparisonView original={originalText} enhanced={enhancedText} />
        </div>
      </main>

      <ChatWidget resumeText={currentText} targetRole={targetRole} />
    </div>
  );
}
