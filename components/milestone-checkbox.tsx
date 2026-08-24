"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleMilestoneDone } from "@/lib/actions";

export function MilestoneCheckbox({
  milestoneId,
  done,
}: {
  milestoneId: string;
  done: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Checkbox
      checked={done}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(() => {
          toggleMilestoneDone(milestoneId, checked === true);
        });
      }}
    />
  );
}
