// Baseline regression suite: AC1–AC5 run against the ORIGINAL single-room prototype.
const test = require("node:test");
const assert = require("node:assert/strict");
const { checkAvailability, room } = require("../app.js");

const D = "2026-11-10";

test("AC1: rejects end before start", () => {
  assert.equal(checkAvailability(D, "12:00", "11:00").ok, false);
});

test("AC1: rejects start in the past (before fixed now 09:00)", () => {
  assert.equal(checkAvailability(D, "08:00", "08:30").ok, false);
});

test("AC2: exactly 120 minutes is allowed", () => {
  assert.equal(checkAvailability(D, "15:00", "17:00").ok, true);
});

test("AC2: 121 minutes is rejected", () => {
  assert.equal(checkAvailability(D, "15:00", "17:01").ok, false);
});

test("AC3: blocked room is never available", () => {
  const blocked = { ...room, blocked: true };
  assert.equal(checkAvailability(D, "15:00", "16:00", blocked).ok, false);
});

test("AC4: touching interval (11:00-12:00 after 10:00-11:00) is allowed", () => {
  assert.equal(checkAvailability(D, "11:00", "12:00").ok, true);
});

test("AC4: overlapping interval (10:30-11:30) is rejected", () => {
  assert.equal(checkAvailability(D, "10:30", "11:30").ok, false);
});

test("AC5: checking availability does not mutate booking data", () => {
  const before = JSON.stringify(room.bookings);
  checkAvailability(D, "10:30", "11:30");
  checkAvailability(D, "15:00", "16:00");
  assert.equal(JSON.stringify(room.bookings), before);
});
