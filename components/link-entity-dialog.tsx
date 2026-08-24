"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link2, Plus } from "lucide-react";
import {
  createEntityLink,
  searchEntities,
  type EntitySearchResult,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LinkEntityDialog({
  fromType,
  fromId,
}: {
  fromType: string;
  fromId: string;
}) {
  const t = useTranslations("links");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EntitySearchResult[]>([]);
  const [selected, setSelected] = useState<EntitySearchResult | null>(null);
  const [relation, setRelation] = useState("");
  const [pending, startTransition] = useTransition();
  const [searching, startSearch] = useTransition();

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelected(null);
    startSearch(async () => {
      const r = await searchEntities(value, fromType, fromId);
      setResults(r);
    });
  }

  function handleSubmit() {
    if (!selected) return;
    startTransition(async () => {
      await createEntityLink(
        fromType,
        fromId,
        selected.type,
        selected.id,
        relation.trim() || null,
      );
      setOpen(false);
      setQuery("");
      setResults([]);
      setSelected(null);
      setRelation("");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Link2 className="h-4 w-4" />
        {t("addLink")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addLink")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            autoFocus
          />
          {query.trim().length >= 2 && (
            <ul className="max-h-40 overflow-y-auto rounded-md border border-border">
              {searching ? null : results.length > 0 ? (
                results.map((r) => (
                  <li key={`${r.type}-${r.id}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-start text-sm hover:bg-accent ${
                        selected?.id === r.id && selected?.type === r.type
                          ? "bg-accent"
                          : ""
                      }`}
                    >
                      <span className="truncate text-foreground">
                        {r.label}
                      </span>
                      <span className="ms-2 text-xs text-muted-foreground">
                        {r.type}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  {t("noResults")}
                </li>
              )}
            </ul>
          )}
          {selected && (
            <Input
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder={t("relationPlaceholder")}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={!selected || pending}
            onClick={handleSubmit}
          >
            <Plus className="h-4 w-4" />
            {tCommon("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
