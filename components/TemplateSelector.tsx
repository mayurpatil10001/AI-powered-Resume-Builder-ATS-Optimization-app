"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ResumeTemplateId } from "@/lib/types";

const templates: { id: ResumeTemplateId; name: string; desc: string }[] = [
  { id: "classic", name: "Classic", desc: "Single column, clean serif." },
  { id: "modern", name: "Modern", desc: "Two column with sidebar accent." },
  { id: "minimal", name: "Minimal", desc: "ATS-safe, plain formatting." },
];

export default function TemplateSelector(props: { value: ResumeTemplateId; onChange: (v: ResumeTemplateId) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {templates.map((t) => (
        <Card key={t.id} className={props.value === t.id ? "border-zinc-900" : ""}>
          <div className="space-y-1 p-3">
            <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
            <div className="text-xs text-zinc-500">{t.desc}</div>
            <Button
              type="button"
              variant={props.value === t.id ? "default" : "secondary"}
              className="mt-2 w-full"
              onClick={() => props.onChange(t.id)}
            >
              Select
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

