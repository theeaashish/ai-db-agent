// Formats a date into a readable string like: "10 Feb 2026, 10:30 PM"
export function formatDate(
  date: Date | string | number,
  locale: string = "en-IN"
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

