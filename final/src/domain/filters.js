// Room filtering rules F1–F3. Pure functions.

/** F1: capacity >= attendees. Empty/invalid attendees means "no capacity requirement". */
export const meetsCapacity = (room, attendees) => {
  const n = Number(attendees);
  return !Number.isFinite(n) || n <= 0 || room.capacity >= n;
};

/** F2: room must contain ALL required items. */
export const hasAllEquipment = (room, required = []) => required.every((item) => room.equipment.includes(item));

/**
 * Rooms matching the user's requirements. Blocked rooms stay in the list but are
 * flagged (F3: they can never be reported as available — see checkAvailability).
 */
export function filterRooms(rooms, { attendees, equipment = [] } = {}) {
  return rooms.filter((r) => meetsCapacity(r, attendees) && hasAllEquipment(r, equipment));
}
