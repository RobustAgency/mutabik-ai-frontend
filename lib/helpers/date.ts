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

// Backward-compatible default common formatter
export const formatDate = formatDateShort;

export default {
  formatDate,
  formatDateISO,
  formatDateShort,
  formatDateLong,
  formatDateLongTime,
  formatDateWithTime24h,
};


