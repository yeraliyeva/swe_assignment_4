// UI presentation only: turns state into DOM. One renderResult() replaces the two copies in the baseline.

export function renderRoomList(listEl, rooms, selectedId) {
  listEl.replaceChildren();
  for (const room of rooms) {
    const li = listEl.ownerDocument.createElement("li");
    const label = listEl.ownerDocument.createElement("label");
    label.className = "room" + (room.blocked ? " blocked" : "");
    const radio = listEl.ownerDocument.createElement("input");
    radio.type = "radio";
    radio.name = "room";
    radio.value = room.id;
    radio.checked = room.id === selectedId;
    const info = listEl.ownerDocument.createElement("span");
    info.innerHTML = `<strong></strong> <small></small>`;
    info.querySelector("strong").textContent = room.name;
    info.querySelector("small").textContent =
      `${room.capacity} seats · ${room.equipment.join(", ")}${room.blocked ? " · BLOCKED" : ""}`;
    label.append(radio, info);
    li.append(label);
    listEl.append(li);
  }
}

export function renderEmptyState(emptyEl, isEmpty) {
  emptyEl.hidden = !isEmpty;
}

export function renderResult(resultEl, result) {
  if (!result) {
    resultEl.className = "result";
    resultEl.textContent = "";
    return;
  }
  resultEl.className = `result ${result.ok ? "ok" : "error"}`;
  resultEl.dataset.reason = result.reason;
  resultEl.textContent = result.message;
}
