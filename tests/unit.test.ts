import assert from "node:assert/strict";
import test from "node:test";
import { scoreQuizAttempt } from "../lib/assessment";
import { generateTutorReply, extractMaterialMetadata } from "../lib/learning-services";
import { serializeTags } from "../lib/notes-utils";
import { average, startOfDay, sum } from "../lib/progress-utils";
import { readBoardText, serializeBoard } from "../lib/study-room-utils";
import { emailSchema, passwordSchema } from "../lib/validators";

test("auth validators normalize email and reject short passwords", () => {
  assert.equal(emailSchema.parse("  USER@Example.COM "), "user@example.com");
  assert.throws(() => passwordSchema.parse("short"));
});

test("learning content service extracts metadata from user-provided filenames", () => {
  const result = extractMaterialMetadata("Hash_Table_Notes.pdf", "pdf");
  assert.equal(result.status, "processed");
  assert.equal(result.title, "Hash Table Notes");
  assert.match(result.summary, /Hash Table Notes/);
});

test("tutor service creates a reply from the incoming prompt", () => {
  const reply = generateTutorReply("Explain load factor");
  assert.equal(reply.provider.length > 0, true);
  assert.match(reply.message, /Explain load factor/);
  assert.equal(reply.nextPrompts.length, 3);
});

test("notes serialize clean unique tags", () => {
  assert.equal(serializeTags([" concept ", "concept", "", "exam"]), JSON.stringify(["concept", "exam"]));
});

test("assessment scoring covers correct, missing, and wrong answers", () => {
  const questions = [
    { id: "q1", answer: "Alpha" },
    { id: "q2", answer: "Beta" },
    { id: "q3", answer: "Gamma" }
  ];
  const result = scoreQuizAttempt(questions, [
    { questionId: "q1", answer: " alpha " },
    { questionId: "q2", answer: "wrong" }
  ]);
  assert.deepEqual({ correct: result.correct, total: result.total, score: result.score }, { correct: 1, total: 3, score: 33 });
});

test("progress utilities normalize days and aggregate safely", () => {
  assert.equal(startOfDay(new Date("2026-05-01T22:30:00.000Z")).getHours(), 0);
  assert.equal(average([10, 20, 30]), 20);
  assert.equal(average([]), 0);
  assert.equal(sum([15, 30, 45]), 90);
});

test("study room board serialization handles valid and invalid content", () => {
  const serialized = serializeBoard({ text: "Shared notes" });
  assert.equal(readBoardText(serialized), "Shared notes");
  assert.equal(readBoardText("{invalid"), "");
});
