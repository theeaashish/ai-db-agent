// gitscribe-test: include: validate that currency formatting works for positive amounts
// gitscribe-test: include: validate that currency formatting works for zero
// gitscribe-test: include: validate that date formatting produces readable output
// gitscribe-test: include: validate that number formatting handles large values
// gitscribe-test: exclude: skip locale-dependent tests that may vary by environment

const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en-US";

// Formats a number as currency
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  if (!Number.isFinite(amount)) {
    throw new Error("Amount must be a finite number");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Formats a number with thousand separators
export function formatNumber(
  value: number,
  locale: string = DEFAULT_LOCALE,
): string {
  if (!Number.isFinite(value)) {
    throw new Error("Value must be a finite number");
  }

  return new Intl.NumberFormat(locale).format(value);
}

// Formats a date string to a readable format
export function formatDate(
  dateString: string,
  locale: string = DEFAULT_LOCALE,
): string {
  if (!dateString) {
    throw new Error("Date string cannot be empty");
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Formats a date to relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString: string): string {
  if (!dateString) {
    throw new Error("Date string cannot be empty");
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(dateString);
}

// Truncates text to a maximum length with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || typeof text !== "string") return "";
  if (maxLength <= 0) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

// Formats a percentage value
export function formatPercentage(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) {
    throw new Error("Value must be a finite number");
  }

  return `${(value * 100).toFixed(decimals)}%`;
}
