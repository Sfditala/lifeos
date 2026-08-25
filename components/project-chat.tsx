"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { createProjectMessage } from "@/lib/actions";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  authorLabel: string;
};

export function ProjectChat({
  projectId,
  messages,
  currentUserId,
}: {
  projectId: string;
  messages: Message[];
  currentUserId: string;
}) {
  const t = useTranslations("team");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    startTransition(() => {
      createProjectMessage(projectId, value);
      setValue("");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">{t("chat")}</h2>
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">—</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              m.user_id === currentUserId
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-foreground"
            }`}
          >
            <p className="mb-0.5 text-[10px] opacity-70">{m.authorLabel}</p>
            {m.content}
          </div>
        ))}
      </div>
      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("sendMessage")}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        />
        <Button type="submit" size="icon" disabled={pending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
