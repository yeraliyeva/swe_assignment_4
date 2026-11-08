// Smart Campus Room Availability Checker — BASELINE (Assignment #03 / Practice #06 style)
// Single room, single file: data, rules and DOM code are mixed together.

var NOW = "2026-11-10T09:00"; // fixed "current time" for the prototype

var room = {
  name: "Room 301",
  blocked: false,
  bookings: [
    { start: "2026-11-10T10:00", end: "2026-11-10T11:00", title: "Algorithms lecture" },
    { start: "2026-11-10T13:00", end: "2026-11-10T14:30", title: "Club meeting" }
  ]
};

function checkAvailability(date, startTime, endTime, r) {
  r = r || room;
  // AC1: valid time
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    return { ok: false, message: "Please enter a valid start and end time." };
  }
  var s = new Date(date + "T" + startTime).getTime();
  var e = new Date(date + "T" + endTime).getTime();
  if (isNaN(s) || isNaN(e)) {
    return { ok: false, message: "Please enter a valid start and end time." };
  }
  if (e <= s) {
    return { ok: false, message: "End time must be after start time." };
  }
  if (s < new Date(NOW).getTime()) {
    return { ok: false, message: "Start time cannot be in the past." };
  }
  // AC2: 120 minute max
  if ((e - s) / 60000 > 120) {
    return { ok: false, message: "Bookings cannot be longer than 120 minutes." };
  }
  // AC3: blocked room
  if (r.blocked) {
    return { ok: false, message: r.name + " is blocked and cannot be booked." };
  }
  // AC4: overlap (touching intervals are allowed)
  for (var i = 0; i < r.bookings.length; i++) {
    var b = r.bookings[i];
    var bs = new Date(b.start).getTime();
    var be = new Date(b.end).getTime();
    if (s < be && bs < e) {
      return { ok: false, message: "Conflicts with \"" + b.title + "\"." };
    }
  }
  return { ok: true, message: r.name + " is available." };
}

// ---------- UI (duplicated validation + rendering in two handlers) ----------
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form");
    var out = document.getElementById("result");
    document.getElementById("roomName").textContent = room.name;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = document.getElementById("date").value;
      var st = document.getElementById("start").value;
      var en = document.getElementById("end").value;
      // duplicated quick validation (same as AC1 in checkAvailability)
      if (!/^\d{2}:\d{2}$/.test(st) || !/^\d{2}:\d{2}$/.test(en)) {
        out.className = "result error";
        out.textContent = "Please enter a valid start and end time.";
        return;
      }
      var res = checkAvailability(d, st, en);
      out.className = res.ok ? "result ok" : "result error";
      out.textContent = res.message;
    });

    form.addEventListener("change", function () {
      var d = document.getElementById("date").value;
      var st = document.getElementById("start").value;
      var en = document.getElementById("end").value;
      // duplicated quick validation again
      if (!/^\d{2}:\d{2}$/.test(st) || !/^\d{2}:\d{2}$/.test(en)) {
        out.className = "result";
        out.textContent = "";
        return;
      }
      var res = checkAvailability(d, st, en);
      out.className = res.ok ? "result ok" : "result error";
      out.textContent = res.message;
    });
  });
}

if (typeof module !== "undefined") {
  module.exports = { checkAvailability: checkAvailability, room: room, NOW: NOW };
}
