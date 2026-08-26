"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MessageCircle, Send } from "lucide-react";
import { createProjectMessage } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const locale = useLocale();
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
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="relative" />}
      >
        <MessageCircle className="h-4 w-4" />
        {t("chat")}
        {messages.length > 0 && (
          <span className="ms-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {messages.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side={locale === "ar" ? "left" : "right"} className="w-full sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{t("chat")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4">
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto py-2">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">—</p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm shadow-sm ${
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
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-border p-4"
        >
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
      </SheetContent>
    </Sheet>
  );
}
