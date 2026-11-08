// Regression tests AC1–AC5 against the REFACTORED domain module.
import test from "node:test";
import assert from "node:assert/strict";
import { checkAvailability } from "../src/domain/availability.js";
import { ROOMS, NOW, findRoom } from "../src/data/rooms.js";

const R301 = findRoom(ROOMS, "R301"); // bookings 10:00–11:00, 13:00–14:30
const slot = (start, end) => ({ date: "2026-11-10", start, end });

test("AC1: rejects malformed time", () => {
  assert.equal(checkAvailability(R301, slot("9am", "10:00"), NOW).reason, "invalid");
});
test("AC1: rejects end before start", () => {
  assert.equal(checkAvailability(R301, slot("12:00", "11:00"), NOW).reason, "order");
});
test("AC1: rejects start before fixed current time (09:00)", () => {
  assert.equal(checkAvailability(R301, slot("08:00", "08:30"), NOW).reason, "past");
});
test("AC1 boundary: start exactly at current time (09:00) is rejected", () => {
  assert.equal(checkAvailability(R301, slot("09:00", "09:30"), NOW).reason, "past");
});
test("AC1 boundary: start one minute after now (09:01) is accepted", () => {
  assert.equal(checkAvailability(R301, slot("09:01", "09:30"), NOW).ok, true);
});
test("AC2 boundary: exactly 120 minutes is allowed", () => {
  assert.equal(checkAvailability(R301, slot("15:00", "17:00"), NOW).ok, true);
});
test("AC2 boundary: 121 minutes is rejected", () => {
  assert.equal(checkAvailability(R301, slot("15:00", "17:01"), NOW).reason, "duration");
});
test("AC3/F3: blocked room is never reported available, even with a free slot", () => {
  const r = checkAvailability(findRoom(ROOMS, "AUD1"), slot("15:00", "16:00"), NOW);
  assert.equal(r.ok, false);
  assert.equal(r.reason, "blocked");
});
test("AC4 boundary: touching interval 11:00–12:00 after 10:00–11:00 is allowed", () => {
  assert.equal(checkAvailability(R301, slot("11:00", "12:00"), NOW).ok, true);
});
test("AC4 boundary: overlapping interval 10:59–11:30 is rejected", () => {
  assert.equal(checkAvailability(R301, slot("10:59", "11:30"), NOW).reason, "conflict");
});
test("AC4: interval fully containing a booking is rejected", () => {
  assert.equal(checkAvailability(R301, slot("12:45", "14:45"), NOW).reason, "conflict");
});
test("AC5: booking data is immutable (frozen) and unchanged after checks", () => {
  const before = JSON.stringify(ROOMS);
  checkAvailability(R301, slot("10:30", "11:30"), NOW);
  checkAvailability(R301, slot("15:00", "16:00"), NOW);
  assert.equal(JSON.stringify(ROOMS), before);
  assert.throws(() => { "use strict"; R301.bookings.push({}); }, TypeError);
});
test("Room-specific data: same slot is busy in R301 but free in R210", () => {
  const s = slot("10:00", "11:00");
  assert.equal(checkAvailability(R301, s, NOW).ok, false);
  assert.equal(checkAvailability(findRoom(ROOMS, "R210"), s, NOW).ok, true);
});
test("No room selected gives a clear message instead of a crash", () => {
  assert.equal(checkAvailability(null, slot("15:00", "16:00"), NOW).reason, "no-room");
});
