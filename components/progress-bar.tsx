export function ProgressBar({
  percent,
  tone = "default",
}: {
  percent: number;
  tone?: "default" | "warn";
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${tone === "warn" ? "bg-destructive" : "bg-primary"}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
