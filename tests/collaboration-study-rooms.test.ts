import assert from "node:assert/strict";
import test from "node:test";
import { readBoardText, serializeBoard } from "../lib/study-room-utils";

test("collaboration-study-rooms: board state serializes for storage", () => {
  const serialized = serializeBoard({ text: "Shared notes" });
  assert.equal(serialized, JSON.stringify({ text: "Shared notes" }));
});

test("collaboration-study-rooms: board text parser handles valid and invalid content", () => {
  assert.equal(readBoardText(JSON.stringify({ text: "Shared notes" })), "Shared notes");
  assert.equal(readBoardText("{invalid"), "");
});
