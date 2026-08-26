"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { FileBox, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UploadFileDialog } from "@/components/upload-file-dialog";
import { deleteDocument, getDocumentDownloadUrl } from "@/lib/actions";

type DocumentRow = {
  id: string;
  file_name: string;
  file_type: string | null;
  size_bytes: number | null;
  storage_path: string;
  uploaded_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilesList({
  documents,
  lifeAreaId,
  projectId,
}: {
  documents: DocumentRow[];
  lifeAreaId?: string;
  projectId?: string;
}) {
  const t = useTranslations("files");
  const tCommon = useTranslations("common");
  const [deleteTarget, setDeleteTarget] = useState<DocumentRow | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleDownload(doc: DocumentRow) {
    const url = await getDocumentDownloadUrl(doc.storage_path);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <UploadFileDialog lifeAreaId={lifeAreaId} projectId={projectId} />
      </div>
      {documents.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 truncate text-sm text-foreground">
                {doc.file_name}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatSize(doc.size_bytes)}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("download")}
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={tCommon("delete")}
                onClick={() => setDeleteTarget(doc)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={FileBox} message={t("empty")} />
      )}
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={tCommon("confirmDeleteTitle")}
        impactMessage={tCommon("deleteSimpleImpact")}
        onConfirm={async () => {
          if (deleteTarget) {
            startTransition(() => {
              deleteDocument(deleteTarget.id);
            });
          }
        }}
      />
    </div>
  );
}
