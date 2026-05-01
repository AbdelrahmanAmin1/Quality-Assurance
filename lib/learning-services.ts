const materialTypeLabels: Record<string, string> = {
  pdf: "PDF",
  slides: "slide deck",
  video: "video",
  note: "note",
  pset: "problem set",
  link: "link",
  code: "code file"
};

function cleanTitle(value: string) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160) || "Untitled material";
}

export function generateTutorReply(prompt: string) {
  const topic = prompt.trim().replace(/\s+/g, " ").slice(0, 120) || "this concept";
  const question = topic.endsWith("?") ? topic : `${topic}?`;

  return {
    provider: process.env.NOESIS_AI_PROVIDER || "local",
    message: [
      `Let's work from your prompt: ${question}`,
      "State the rule in one sentence, test it with a small example, then look for the case that breaks your first intuition."
    ].join(" "),
    nextPrompts: ["Show a worked example", "Ask a harder follow-up", "Save the key idea to notes"]
  };
}

export function extractMaterialMetadata(filename: string, type = "pdf") {
  const title = cleanTitle(filename);
  const label = materialTypeLabels[type] || "material";

  return {
    status: "processed" as const,
    title,
    concepts: [title, "key terms", "practice questions"],
    summary: `Processed ${label} "${title}". Add notes, flashcards, and quizzes from this material as you study it.`
  };
}
