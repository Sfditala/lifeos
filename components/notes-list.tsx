"use client";

import { useTranslations } from "next-intl";
import { StickyNote, SearchX } from "lucide-react";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { EmptyState } from "@/components/empty-state";
import { RowMenu } from "@/components/row-menu";
import { deleteNote } from "@/lib/actions";

type Note = { id: string; title: string; body: string };

export function NotesList({ notes, q }: { notes: Note[]; q: string }) {
  const t = useTranslations("notes");
  const tCommon = useTranslations("common");

  if (notes.length === 0) {
    return q ? (
      <EmptyState icon={SearchX} message={t("noResults")} />
    ) : (
      <EmptyState
        icon={StickyNote}
        message={t("empty")}
        action={<AddNoteDialog />}
      />
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {notes.map((note) => (
        <li
          key={note.id}
          className="relative rounded-lg border border-border bg-card p-4"
        >
          <div className="absolute top-2 end-2">
            <RowMenu
              deleteTitle={tCommon("confirmDeleteTitle")}
              deleteImpact={tCommon("deleteSimpleImpact")}
              onDelete={() => deleteNote(note.id)}
              renderEdit={(open, onOpenChange) => (
                <AddNoteDialog
                  initial={note}
                  open={open}
                  onOpenChange={onOpenChange}
                />
              )}
            />
          </div>
          <h3 className="mb-1 pe-6 text-sm font-semibold text-foreground">
            {note.title}
          </h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {note.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
