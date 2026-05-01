import assert from "node:assert/strict";
import test from "node:test";
import { average, startOfDay, sum } from "../lib/progress-utils";

test("dashboard-progress-tracking: startOfDay normalizes date values", () => {
  const day = startOfDay(new Date("2026-05-01T22:30:00.000Z"));
  assert.equal(day.getHours(), 0);
  assert.equal(day.getMinutes(), 0);
});

test("dashboard-progress-tracking: aggregates handle values and empty inputs", () => {
  assert.equal(average([10, 20, 30]), 20);
  assert.equal(average([]), 0);
  assert.equal(sum([15, 30, 45]), 90);
});
