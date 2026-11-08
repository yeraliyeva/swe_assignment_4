# Smart Campus Room Availability Checker — Assignment #04

Author: Yeraliyeva Anel (24B031020) · Software Engineering, KBTU · Practice: Tuesday 18:00–19:00

AI-assisted evolution of the Assignment #03 single-room prototype into a multi-room checker with
capacity/equipment filtering, a refactored module structure and an automated test suite.
Fictional data only. No login, payments, live APIs or database. Fixed current time: **2026-11-10 09:00**.

## Layout

```
baseline/               original single-room prototype (initial version)
  index.html, app.js    data + rules + DOM in one file
  tests/baseline.test.js  AC1–AC5 regression checks on the original
final/                  refactored multi-room version (final version)
  index.html
  src/data/rooms.js        room catalog (5 rooms, deep-frozen) + fixed NOW
  src/domain/time.js       time parsing + overlap rule (single source of truth)
  src/domain/availability.js  AC1–AC4 rules for ONE room (pure)
  src/domain/filters.js    F1–F3 filtering (pure)
  src/ui/render.js         DOM rendering only
  src/ui/app.js            controller: wires form events to domain + render
  tests/                   availability, filters, ui (jsdom) suites
docs/evidence/          saved test outputs and mutation-check results
```

## Setup

Requires Node.js 18+ (tested with v22) and Python 3 (only for the static server).

```bash
npm install            # installs jsdom (dev dependency for the UI test)
```

## Run

ES modules need to be served over HTTP (not file://):

```bash
npm start              # python3 -m http.server 8080
# open http://localhost:8080/final/      (refactored version)
# open http://localhost:8080/baseline/   (original version)
```

## Test

```bash
npm run test:baseline  # 8 AC regression tests against the original prototype
npm test               # 25 tests against the final version (AC1–AC6, F1–F5, UI integration)
```

Results recorded on 2026-11-08: baseline **8/8 passed**, final **25/25 passed**
(full output in `docs/evidence/`).

## Git history

```bash
git log --oneline      # baseline commit first, final refactor after it
```

## Acceptance criteria

| ID | Rule |
|----|------|
| AC1 | Valid HH:MM times, end after start, start not before the fixed current time |
| AC2 | Maximum 120 minutes (120 allowed, 121 rejected) |
| AC3 | Blocked room cannot be booked |
| AC4 | Half-open intervals: touching bookings allowed, overlapping rejected |
| AC5 | Booking data is never mutated (catalog is deep-frozen) |
| AC6 | Clear, responsive feedback (status region, mobile viewport) |
| F1 | Capacity ≥ attendees |
| F2 | Room has ALL selected equipment |
| F3 | Blocked room never reported available (shown with BLOCKED label) |
| F4 | Clear empty state when no rooms match |
| F5 | Changing the selected room refreshes the result with that room's bookings |
