/**
 * Returns a human-readable relative time string.
 * e.g. "3m ago", "2h ago", "5d ago"
 */
export function relativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type DeadlineStatus = "overdue" | "today" | "upcoming" | "future" | null;

/**
 * Classifies a dueDate into overdue / today / upcoming (≤7d) / future / null.
 */
export function getDeadlineStatus(dueDate?: Date | string | null): DeadlineStatus {
  if (!dueDate) return null;

  const now = new Date();
  const due = new Date(dueDate);

  // Normalise to midnight for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.floor(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 7) return "upcoming";
  return "future";
}

/**
 * Formats a date for display (e.g. "Jun 20").
 */
export function formatDisplayDate(date?: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
