export const HABIT_FREQUENCIES = ["daily", "custom_days", "weekly"] as const;
export type HabitFrequency = (typeof HABIT_FREQUENCIES)[number];

export const HABIT_CATEGORIES = [
  "health",
  "learning",
  "spiritual",
  "productivity",
  "social",
  "personal",
  "other",
] as const;
export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

// 0=Sunday..6=Saturday, matching JS Date#getDay().
export const WEEKDAY_INDEXES = [0, 1, 2, 3, 4, 5, 6] as const;

export function isApplicableDay(
  jsDay: number,
  frequency: string,
  customDays: number[] | null,
): boolean {
  if (frequency === "custom_days") {
    return (customDays ?? []).includes(jsDay);
  }
  return true;
}
