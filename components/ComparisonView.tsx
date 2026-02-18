"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ComparisonView(props: { original: string; enhanced: string }) {
  if (!props.original || !props.enhanced) return null;
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Comparison Mode</CardTitle>
        <div className="text-sm text-zinc-500">Original vs enhanced content.</div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-medium text-zinc-700">Original</div>
          <ScrollArea className="h-64 rounded-md border bg-white p-3 text-xs">
            <pre className="whitespace-pre-wrap font-mono">{props.original}</pre>
          </ScrollArea>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium text-zinc-700">Enhanced</div>
          <ScrollArea className="h-64 rounded-md border bg-white p-3 text-xs">
            <pre className="whitespace-pre-wrap font-mono">{props.enhanced}</pre>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

