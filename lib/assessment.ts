export type QuizQuestionForScoring = {
  id: string;
  answer: string;
};

export type QuizAnswerInput = {
  questionId: string;
  answer: string;
};

export function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

export function scoreQuizAttempt(questions: QuizQuestionForScoring[], answers: QuizAnswerInput[]) {
  const answerMap = new Map(answers.map((entry) => [entry.questionId, normalizeAnswer(entry.answer)]));
  const correct = questions.filter((question) => answerMap.get(question.id) === normalizeAnswer(question.answer)).length;
  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  const feedback = score >= 80
    ? "Strong attempt. Review only missed concepts."
    : "Review the explanations and retry after a short spaced-repetition pass.";

  return { correct, total, score, feedback };
}
