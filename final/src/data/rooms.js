// Room catalog — fictional data only. Deep-frozen so no code path can mutate bookings (AC5).
export const NOW = "2026-11-10T09:00"; // fixed current time

export const EQUIPMENT = Object.freeze(["projector", "whiteboard", "video-conf", "computers"]);

const deepFreeze = (obj) => {
  Object.values(obj).forEach((v) => { if (v && typeof v === "object") deepFreeze(v); });
  return Object.freeze(obj);
};

export const ROOMS = deepFreeze([
  {
    id: "R301", name: "Room 301", capacity: 30, blocked: false,
    equipment: ["projector", "whiteboard"],
    bookings: [
      { start: "2026-11-10T10:00", end: "2026-11-10T11:00", title: "Algorithms lecture" },
      { start: "2026-11-10T13:00", end: "2026-11-10T14:30", title: "Club meeting" }
    ]
  },
  {
    id: "R105", name: "Seminar Room 105", capacity: 12, blocked: false,
    equipment: ["whiteboard", "video-conf"],
    bookings: [
      { start: "2026-11-10T11:00", end: "2026-11-10T12:00", title: "Thesis defense rehearsal" }
    ]
  },
  {
    id: "LAB2", name: "Computer Lab 2", capacity: 24, blocked: false,
    equipment: ["projector", "computers", "whiteboard"],
    bookings: [
      { start: "2026-11-10T09:00", end: "2026-11-10T10:30", title: "Programming practice" }
    ]
  },
  {
    id: "AUD1", name: "Main Auditorium", capacity: 120, blocked: true,
    equipment: ["projector", "video-conf"],
    bookings: []
  },
  {
    id: "R210", name: "Study Room 210", capacity: 6, blocked: false,
    equipment: ["whiteboard"],
    bookings: []
  }
]);

export const findRoom = (rooms, id) => rooms.find((r) => r.id === id) || null;
