// UI controller: reads the form, calls domain functions, delegates drawing to render.js.
import { ROOMS, NOW, findRoom } from "../data/rooms.js";
import { filterRooms } from "../domain/filters.js";
import { checkAvailability } from "../domain/availability.js";
import { renderRoomList, renderEmptyState, renderResult } from "./render.js";

export function mountApp(doc, { rooms = ROOMS, now = NOW } = {}) {
  const $ = (id) => doc.getElementById(id);
  const form = $("form"), list = $("rooms"), empty = $("empty"), result = $("result");
  const state = { selectedId: null, checked: false };

  const readCriteria = () => ({
    attendees: $("attendees").value,
    equipment: [...doc.querySelectorAll('input[name="equipment"]:checked')].map((c) => c.value)
  });
  const readSlot = () => ({ date: $("date").value, start: $("start").value, end: $("end").value });

  function refresh() {
    const visible = filterRooms(rooms, readCriteria());
    // selected room filtered out -> drop selection so we never show a stale result
    if (!visible.some((r) => r.id === state.selectedId)) state.selectedId = null;
    renderRoomList(list, visible, state.selectedId);
    renderEmptyState(empty, visible.length === 0);
    // F5: result always reflects the currently selected room
    if (!state.checked) return renderResult(result, null);
    const room = findRoom(rooms, state.selectedId);
    renderResult(result, checkAvailability(room, readSlot(), now));
  }

  list.addEventListener("change", (ev) => {
    if (ev.target.name === "room") { state.selectedId = ev.target.value; refresh(); }
  });
  form.addEventListener("input", (ev) => {
    if (ev.target.name !== "room") refresh(); // filters/time edits re-render immediately
  });
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    state.checked = true;
    refresh();
  });

  refresh();
  return { state, refresh };
}
