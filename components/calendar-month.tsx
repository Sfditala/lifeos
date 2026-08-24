"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarX } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { CalendarItem } from "@/app/[locale]/(app)/calendar/page";

const TYPE_DOT_LIMIT = 4;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Week starts Saturday (0) through Friday (6) to match the app's Arabic-first default.
function toGridWeekday(jsDay: number) {
  return (jsDay + 1) % 7;
}

export function CalendarMonth({
  year,
  month,
  itemsByDate,
  labels,
}: {
  year: number;
  month: number;
  itemsByDate: Record<string, CalendarItem[]>;
  labels: { task: string; goal: string; content: string; empty: string };
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en", {
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en", {
        weekday: "short",
      }),
    [locale],
  );

  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = toGridWeekday(firstOfMonth.getDay());

  const weekdayLabels = useMemo(() => {
    // 2026-08-22 is a Saturday; use it as a stable anchor for weekday names.
    const anchor = new Date(2026, 7, 22);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() + i);
      return weekdayFormatter.format(d);
    });
  }, [weekdayFormatter]);

  const cells: { date: string | null; day: number | null }[] = [
    ...Array.from({ length: leadingBlanks }, () => ({
      date: null,
      day: null,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { date: `${year}-${pad(month)}-${pad(day)}`, day };
    }),
  ];

  const todayIso = new Date().toISOString().slice(0, 10);

  function goToMonth(offset: number) {
    const d = new Date(year, month - 1 + offset, 1);
    const next = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    setSelectedDate(null);
    router.push(`${pathname}?month=${next}`);
  }

  const selectedItems = selectedDate ? itemsByDate[selectedDate] ?? [] : [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          aria-label="prev"
        >
          <ChevronRight className="h-4 w-4 rtl:hidden" />
          <ChevronLeft className="hidden h-4 w-4 rtl:block" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {monthFormatter.format(firstOfMonth)}
        </span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          aria-label="next"
        >
          <ChevronLeft className="h-4 w-4 rtl:hidden" />
          <ChevronRight className="hidden h-4 w-4 rtl:block" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-center text-xs text-muted-foreground">
        {weekdayLabels.map((label) => (
          <div key={label} className="bg-card py-2">
            {label}
          </div>
        ))}
        {cells.map((cell, idx) => {
          if (!cell.date) {
            return <div key={idx} className="bg-card/40" />;
          }
          const items = itemsByDate[cell.date] ?? [];
          const isToday = cell.date === todayIso;
          const isSelected = cell.date === selectedDate;
          return (
            <button
              key={cell.date}
              type="button"
              onClick={() =>
                setSelectedDate(cell.date === selectedDate ? null : cell.date)
              }
              className={`flex min-h-16 flex-col items-center gap-1 bg-card px-1 py-2 text-start transition-colors hover:bg-accent ${
                isSelected ? "bg-accent" : ""
              }`}
            >
              <span
                className={`text-xs ${
                  isToday
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {cell.day}
              </span>
              {items.length > 0 && (
                <div className="flex flex-wrap justify-center gap-0.5">
                  {items.slice(0, TYPE_DOT_LIMIT).map((item, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  ))}
                  {items.length > TYPE_DOT_LIMIT && (
                    <span className="text-[10px] text-muted-foreground">
                      +{items.length - TYPE_DOT_LIMIT}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="rounded-lg border border-border p-4">
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            {selectedDate}
          </h2>
          {selectedItems.length > 0 ? (
            <ul className="space-y-2">
              {selectedItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">
                    {labels[item.type]}:
                  </span>
                  <span className="text-foreground">{item.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarX className="h-4 w-4" />
              {labels.empty}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
