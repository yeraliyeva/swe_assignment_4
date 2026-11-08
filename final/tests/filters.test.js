// New feature tests F1–F3 (pure filtering logic).
import test from "node:test";
import assert from "node:assert/strict";
import { filterRooms } from "../src/domain/filters.js";
import { ROOMS } from "../src/data/rooms.js";

const ids = (rooms) => rooms.map((r) => r.id).sort();

test("Catalog has at least four rooms with id, name, capacity, equipment, blocked, bookings", () => {
  assert.ok(ROOMS.length >= 4);
  for (const r of ROOMS) {
    assert.equal(typeof r.id, "string");
    assert.equal(typeof r.name, "string");
    assert.equal(typeof r.capacity, "number");
    assert.ok(Array.isArray(r.equipment));
    assert.equal(typeof r.blocked, "boolean");
    assert.ok(Array.isArray(r.bookings));
  }
});
test("F1 boundary: exact capacity (12) keeps Seminar Room 105", () => {
  assert.ok(ids(filterRooms(ROOMS, { attendees: 12 })).includes("R105"));
});
test("F1 boundary: insufficient capacity (13) removes Seminar Room 105", () => {
  assert.ok(!ids(filterRooms(ROOMS, { attendees: 13 })).includes("R105"));
});
test("F1: empty attendees means no capacity restriction", () => {
  assert.equal(filterRooms(ROOMS, { attendees: "" }).length, ROOMS.length);
});
test("F2: room must contain ALL selected equipment (projector + computers -> LAB2 only)", () => {
  assert.deepEqual(ids(filterRooms(ROOMS, { equipment: ["projector", "computers"] })), ["LAB2"]);
});
test("F2: one missing item excludes the room (whiteboard + video-conf -> R105 only)", () => {
  assert.deepEqual(ids(filterRooms(ROOMS, { equipment: ["whiteboard", "video-conf"] })), ["R105"]);
});
test("F1+F2 combined: 25 attendees + projector -> R301, AUD1 (blocked shown, flagged)", () => {
  const out = filterRooms(ROOMS, { attendees: 25, equipment: ["projector"] });
  assert.deepEqual(ids(out), ["AUD1", "R301"]);
  assert.equal(out.find((r) => r.id === "AUD1").blocked, true);
});
test("F4 (logic): impossible requirements return an empty list", () => {
  assert.deepEqual(filterRooms(ROOMS, { attendees: 500 }), []);
});
