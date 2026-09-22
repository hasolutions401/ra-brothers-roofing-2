/** Matches BUSINESS_TIMEZONE on the server; replaced by the value from /stats once loaded. */
export const DEFAULT_TIME_ZONE = "America/New_York";

export function formatDateTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "Today, 2:15 PM", "Yesterday, 9:02 AM", or "Sep 18, 4:40 PM". */
export function formatWhen(iso: string, timeZone: string, now = new Date()) {
  const date = new Date(iso);
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(date);
  if (day(date) === day(now)) return `Today, ${time}`;
  if (day(date) === day(new Date(now.getTime() - 86_400_000))) return `Yesterday, ${time}`;
  const sameYear = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric" });
  const options: Intl.DateTimeFormatOptions = { timeZone, month: "short", day: "numeric" };
  if (sameYear.format(date) !== sameYear.format(now)) options.year = "numeric";
  return `${new Intl.DateTimeFormat("en-US", options).format(date)}, ${time}`;
}

export function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
