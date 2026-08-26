export function formatDurationMinutes(
  minutes: number,
  labels: { hour: string; minute: string },
): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}${labels.minute}`;
  if (mins === 0) return `${hours}${labels.hour}`;
  return `${hours}${labels.hour} ${mins}${labels.minute}`;
}
