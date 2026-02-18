"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function ChatWidget(props: { resumeText: string; targetRole: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const context = useMemo(() => {
    const snippet = props.resumeText.slice(0, 9000);
    return `Target role: ${props.targetRole}\n\nResume:\n${snippet}`;
  }, [props.resumeText, props.targetRole]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const next = [...messages, { role: "user", content: text } as const];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Chat failed");
      setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 shadow-lg">Feedback Chat</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Ask for feedback</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[calc(100vh-10rem)] flex-col gap-3">
          <ScrollArea className="flex-1 rounded-md border p-3">
            <div className="space-y-3 text-sm">
              {messages.length === 0 ? (
                <div className="text-zinc-500">Ask: “How do I improve my skills section?”</div>
              ) : null}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      "inline-block max-w-[90%] rounded-md px-3 py-2 " +
                      (m.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900")
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading ? <div className="text-zinc-500">Thinking...</div> : null}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Type a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <Button onClick={send} disabled={loading}>
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

