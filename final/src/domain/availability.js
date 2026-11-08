// Booking / availability rules AC1–AC4. Pure functions: no DOM, no mutation (AC5).
import { isValidHHMM, toMillis, minutesBetween, overlaps } from "./time.js";

export const MAX_MINUTES = 120;

export const MESSAGES = Object.freeze({
  invalidTime: "Please enter a valid start and end time.",
  endBeforeStart: "End time must be after start time.",
  past: "Start time cannot be in the past.",
  tooLong: `Bookings cannot be longer than ${MAX_MINUTES} minutes.`,
  noRoom: "Please select a room first."
});

/** AC1 + AC2: validate the requested slot independently of any room. */
export function validateSlot({ date, start, end }, now) {
  if (!isValidHHMM(start) || !isValidHHMM(end)) return { ok: false, reason: "invalid", message: MESSAGES.invalidTime };
  const s = toMillis(date, start);
  const e = toMillis(date, end);
  if (Number.isNaN(s) || Number.isNaN(e)) return { ok: false, reason: "invalid", message: MESSAGES.invalidTime };
  if (e <= s) return { ok: false, reason: "order", message: MESSAGES.endBeforeStart };
  if (s < new Date(now).getTime()) return { ok: false, reason: "past", message: MESSAGES.past };
  if (minutesBetween(s, e) > MAX_MINUTES) return { ok: false, reason: "duration", message: MESSAGES.tooLong };
  return { ok: true, startMs: s, endMs: e };
}

/** AC1–AC4 for ONE room, using only that room's bookings. */
export function checkAvailability(room, slot, now) {
  if (!room) return { ok: false, reason: "no-room", message: MESSAGES.noRoom };
  const v = validateSlot(slot, now);
  if (!v.ok) return v;
  if (room.blocked) return { ok: false, reason: "blocked", message: `${room.name} is blocked and cannot be booked.` };
  const conflict = room.bookings.find((b) =>
    overlaps(v.startMs, v.endMs, new Date(b.start).getTime(), new Date(b.end).getTime()));
  if (conflict) return { ok: false, reason: "conflict", message: `${room.name} conflicts with "${conflict.title}" (${conflict.start.slice(11)}–${conflict.end.slice(11)}).` };
  return { ok: true, reason: "available", message: `${room.name} is available.` };
}
