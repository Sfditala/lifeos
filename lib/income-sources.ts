export const INCOME_SOURCES = [
  "salary",
  "freelance",
  "business",
  "investment",
  "gift",
  "refund",
  "other",
] as const;

export type IncomeSource = (typeof INCOME_SOURCES)[number];
