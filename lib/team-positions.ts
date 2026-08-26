export const TEAM_POSITIONS = [
  "manager",
  "accountant",
  "developer",
  "designer",
  "marketing",
  "sales",
  "hr",
  "support",
  "member",
] as const;

export type TeamPosition = (typeof TEAM_POSITIONS)[number];
