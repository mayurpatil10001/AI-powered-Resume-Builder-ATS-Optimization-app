"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AtsScoreResult } from "@/lib/types";

function ScoreRow(props: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-zinc-600">{props.label}</div>
      <div className="font-medium text-zinc-900">{Math.round(props.value)}</div>
    </div>
  );
}

export default function ATSScoreCard(props: { score: AtsScoreResult | null; enhancedScore: AtsScoreResult | null }) {
  const base = props.score;
  const enhanced = props.enhancedScore;
  const delta = base && enhanced ? Math.round(enhanced.score - base.score) : null;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>ATS Score</CardTitle>
        <div className="text-sm text-zinc-500">
          {base ? (
            <span className="inline-flex items-center gap-2">
              <span>
                Current score: <span className="font-semibold text-zinc-900">{Math.round(base.score)}</span>/100
              </span>
              {delta !== null ? (
                <Badge variant={delta >= 0 ? "secondary" : "destructive"}>{delta >= 0 ? `+${delta}` : `${delta}`}</Badge>
              ) : null}
            </span>
          ) : (
            "Run scoring to see breakdown."
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {base ? (
          <>
            <div className="space-y-2">
              <ScoreRow label="Keyword match %" value={base.breakdown.keywordMatch} />
              <ScoreRow label="Formatting" value={base.breakdown.formatting} />
              <ScoreRow label="Readability" value={base.breakdown.readability} />
              <ScoreRow label="Section completeness" value={base.breakdown.sectionCompleteness} />
            </div>
            {enhanced ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-900">Post-enhancement</div>
                  <ScoreRow label="Score" value={enhanced.score} />
                  <ScoreRow label="Keyword match %" value={enhanced.breakdown.keywordMatch} />
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

