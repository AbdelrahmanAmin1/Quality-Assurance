import assert from "node:assert/strict";
import test from "node:test";
import { generateTutorReply } from "../lib/learning-services";

test("ai-learning-assistant: tutor reply includes the incoming prompt", () => {
  const reply = generateTutorReply("Explain load factor");
  assert.equal(reply.provider.length > 0, true);
  assert.match(reply.message, /Explain load factor/);
  assert.equal(reply.nextPrompts.length, 3);
});

test("ai-learning-assistant: empty prompt still returns a safe tutoring response", () => {
  const reply = generateTutorReply("   ");
  assert.match(reply.message, /this concept/);
});
