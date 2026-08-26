import { ClipboardList } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, type, period_start, period_end, summary")
    .order("period_start", { ascending: false });

  const t = await getTranslations("reviews");

  const newReviewButtons = (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        render={<Link href="/reviews/new?type=daily" />}
      >
        {t("newDaily")}
      </Button>
      <Button size="sm" render={<Link href="/reviews/new?type=weekly" />}>
        {t("newWeekly")}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        {newReviewButtons}
      </div>

      {reviews && reviews.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
          {reviews.map((review) => (
            <li key={review.id} className="flex items-center gap-3 px-4 py-3">
              <Badge variant="outline">
                {review.type === "daily" ? t("daily") : t("weekly")}
              </Badge>
              <span className="flex-1 text-sm text-foreground">
                {review.period_start} → {review.period_end}
              </span>
              {review.summary && (
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {review.summary}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={ClipboardList}
          message={t("empty")}
          action={newReviewButtons}
        />
      )}
    </div>
  );
}
