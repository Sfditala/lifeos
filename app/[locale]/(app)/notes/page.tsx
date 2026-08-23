import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NotesSearch } from "@/components/notes-search";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("knowledge_notes")
    .select("id, title, body")
    .order("updated_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`);
  }

  const { data: notes } = await query;
  const t = await getTranslations("notes");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <div className="flex items-center gap-2">
          <NotesSearch defaultValue={q ?? ""} />
          <AddNoteDialog />
        </div>
      </div>

      {notes && notes.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {note.title}
              </h3>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {note.body}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          {q ? t("noResults") : t("empty")}
        </p>
      )}
    </div>
  );
}
