"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateMemberPosition } from "@/lib/actions";
import { TEAM_POSITIONS } from "@/lib/team-positions";

export function MemberPositionSelect({
  memberId,
  position,
}: {
  memberId: string;
  position: string;
}) {
  const t = useTranslations("team");
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={position}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => {
          updateMemberPosition(memberId, e.target.value);
        })
      }
      className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
    >
      {TEAM_POSITIONS.map((p) => (
        <option key={p} value={p}>
          {t(`position_${p}`)}
        </option>
      ))}
    </select>
  );
}
