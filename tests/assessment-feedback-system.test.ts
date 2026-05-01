import assert from "node:assert/strict";
import test from "node:test";
import { normalizeAnswer, scoreQuizAttempt } from "../lib/assessment";

test("assessment-feedback-system: answers normalize before scoring", () => {
  assert.equal(normalizeAnswer("  Notes API  "), "notes api");
});

test("assessment-feedback-system: quiz scoring covers correct, missing, and wrong answers", () => {
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

test("assessment-feedback-system: empty quizzes score without crashing", () => {
  const result = scoreQuizAttempt([], []);
  assert.deepEqual({ correct: result.correct, total: result.total, score: result.score }, { correct: 0, total: 0, score: 0 });
});
