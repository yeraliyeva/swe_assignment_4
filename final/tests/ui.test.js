// Integration / UI behaviour checks: real index.html + app.js in jsdom.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { mountApp } from "../src/ui/app.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
  .replace(/<script type="module">[\s\S]*?<\/script>/, ""); // mount manually below

function setup() {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  mountApp(doc);
  const fire = (el, type) => el.dispatchEvent(new dom.window.Event(type, { bubbles: true }));
  const set = (id, v) => { doc.getElementById(id).value = v; fire(doc.getElementById(id), "input"); };
  const pick = (roomId) => { const r = doc.querySelector(`input[name=room][value=${roomId}]`); r.checked = true; fire(r, "change"); };
  const submit = () => doc.getElementById("form").dispatchEvent(new dom.window.Event("submit", { cancelable: true }));
  const result = () => doc.getElementById("result");
  const roomIds = () => [...doc.querySelectorAll("input[name=room]")].map((r) => r.value);
  return { doc, set, pick, submit, result, roomIds, fire };
}

test("UI: successful availability check shows green 'available' feedback", () => {
  const ui = setup();
  ui.pick("R210"); ui.set("start", "11:00"); ui.set("end", "12:00"); ui.submit();
  assert.equal(ui.result().className, "result ok");
  assert.match(ui.result().textContent, /Study Room 210 is available/);
});

test("F5 (UI): switching room refreshes result using the new room's bookings", () => {
  const ui = setup();
  ui.pick("R210"); ui.set("start", "10:00"); ui.set("end", "11:00"); ui.submit();
  assert.equal(ui.result().dataset.reason, "available");
  ui.pick("R301"); // R301 has a 10:00–11:00 lecture
  assert.equal(ui.result().dataset.reason, "conflict");
  assert.match(ui.result().textContent, /Algorithms lecture/);
});

test("F4 (UI): clear empty state when no rooms match; selection and result cleared", () => {
  const ui = setup();
  ui.pick("R301"); ui.set("start", "15:00"); ui.set("end", "16:00"); ui.submit();
  assert.equal(ui.result().dataset.reason, "available");
  ui.set("attendees", "500");
  assert.equal(ui.roomIds().length, 0);
  assert.equal(ui.doc.getElementById("empty").hidden, false);
  assert.equal(ui.result().dataset.reason, "no-room");
});

test("F1/F2 (UI): filters update the visible room list", () => {
  const ui = setup();
  assert.equal(ui.roomIds().length, 5);
  const cb = ui.doc.querySelector('input[name=equipment][value=computers]');
  cb.checked = true; ui.fire(cb, "input");
  assert.deepEqual(ui.roomIds(), ["LAB2"]);
});

test("AC6 (UI): invalid slot gives clear error text; layout has responsive viewport", () => {
  const ui = setup();
  ui.pick("R301"); ui.set("start", "15:00"); ui.set("end", "17:30"); ui.submit();
  assert.equal(ui.result().className, "result error");
  assert.match(ui.result().textContent, /120 minutes/);
  assert.match(ui.doc.querySelector('meta[name=viewport]').content, /width=device-width/);
});
