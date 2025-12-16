export type DateInput = string | number | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (!value && value !== 0) return null;
  const d = value instanceof Date ? value : new Date(value as any);
  return isNaN(d.getTime()) ? null : d;
}

export const formatDateISO = (value: DateInput): string => {
  const d = toDate(value);
  if (!d) return "-";
  return d.toISOString().split("T")[0];
};

export const formatDateShort = (value: DateInput): string => {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
};

export const formatDateLong = (value: DateInput): string => {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export const formatDateLongTime = (value: DateInput): string => {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateWithTime24h = (value: DateInput): string => {
  const d = toDate(value);
  if (!d) return "-";
  return (
    d.toLocaleDateString("en-CA") +
    " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
};

/**
 * Converts ISO datetime string or any date string to YYYY-MM-DD format for HTML date inputs.
 * Handles various input formats:
 * - ISO datetime strings (e.g., "2025-12-11T00:00:00.000000Z")
 * - Space-separated datetime strings
 * - Already formatted YYYY-MM-DD strings
 * - Null/undefined values
 */
export const formatDateForInput = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Extract date part from ISO string (YYYY-MM-DDTHH:mm:ss...)
  if (dateStr.includes("T")) return dateStr.split("T")[0];
  // Extract date part from space-separated format
  if (dateStr.includes(" ")) return dateStr.split(" ")[0];
  return dateStr;
};

// Backward-compatible default common formatter
export const formatDate = formatDateShort;

const dateHelpers = {
  formatDate,
  formatDateISO,
  formatDateShort,
  formatDateLong,
  formatDateLongTime,
  formatDateWithTime24h,
  formatDateForInput,
};

export default dateHelpers;


