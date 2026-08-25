"use client";

import { useTransition } from "react";
import { UserMinus } from "lucide-react";
import { removeMember } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function RemoveMemberButton({
  memberId,
  label,
}: {
  memberId: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      disabled={isPending}
      onClick={() => startTransition(() => removeMember(memberId))}
    >
      <UserMinus className="h-4 w-4 text-destructive" />
    </Button>
  );
}
