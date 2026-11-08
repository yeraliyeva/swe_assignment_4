// Single source of truth for time parsing (previously duplicated in 3 places).
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isValidHHMM = (value) => typeof value === "string" && HHMM.test(value);

/** Returns epoch ms for "YYYY-MM-DD" + "HH:MM", or NaN. */
export const toMillis = (date, hhmm) => new Date(`${date}T${hhmm}`).getTime();

export const minutesBetween = (startMs, endMs) => (endMs - startMs) / 60000;

/** Half-open intervals [aStart,aEnd) and [bStart,bEnd): touching is NOT overlap. */
export const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;
