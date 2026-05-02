export type QuizQuestionForScoring = {
  id: string;
  answer: string;
};

export type QuizAnswerInput = {
  questionId: string;
  answer: string;
};

export function normalizeAnswer(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function scoreQuizAttempt(questions: QuizQuestionForScoring[] = [], answers: QuizAnswerInput[] = []) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const answerMap = new Map(
    safeAnswers
      .filter((entry) => entry && typeof entry.questionId === "string")
      .map((entry) => [entry.questionId, normalizeAnswer(entry.answer)])
  );
  const correct = safeQuestions.filter((question) => (
    question && typeof question.id === "string" && answerMap.get(question.id) === normalizeAnswer(question.answer)
  )).length;
  const total = safeQuestions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  const feedback = score >= 80
    ? "Strong attempt. Review only missed concepts."
    : "Review the explanations and retry after a short spaced-repetition pass.";

  return { correct, total, score, feedback };
}
