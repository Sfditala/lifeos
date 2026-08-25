"use client";

import { useTranslations, useLocale } from "next-intl";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { RowMenu } from "@/components/row-menu";
import { AddMeetingDialog } from "@/components/add-meeting-dialog";
import { deleteMeeting } from "@/lib/actions";

type Meeting = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  notes: string | null;
};

export function MeetingsList({
  meetings,
  lifeAreaId,
  projectId,
}: {
  meetings: Meeting[];
  lifeAreaId?: string;
  projectId?: string;
}) {
  const t = useTranslations("meetings");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateTimeFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
  );
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <AddMeetingDialog lifeAreaId={lifeAreaId} projectId={projectId} />
      </div>
      {meetings.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {meetings.map((meeting) => {
            const isToday = meeting.starts_at.slice(0, 10) === todayIso;
            return (
              <li key={meeting.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 text-sm text-foreground">
                  {meeting.title}
                  {meeting.location && (
                    <span className="text-muted-foreground"> · {meeting.location}</span>
                  )}
                </span>
                <span
                  className={`text-xs ${isToday ? "font-medium text-primary" : "text-muted-foreground"}`}
                >
                  {isToday ? t("today") + " · " : ""}
                  {dateTimeFormatter.format(new Date(meeting.starts_at))}
                </span>
                <RowMenu
                  deleteTitle={tCommon("confirmDeleteTitle")}
                  deleteImpact={tCommon("deleteSimpleImpact")}
                  onDelete={() => deleteMeeting(meeting.id)}
                  renderEdit={(open, onOpenChange) => (
                    <AddMeetingDialog
                      lifeAreaId={lifeAreaId}
                      projectId={projectId}
                      initial={meeting}
                      open={open}
                      onOpenChange={onOpenChange}
                    />
                  )}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon={Users} message={t("empty")} />
      )}
    </div>
  );
}
