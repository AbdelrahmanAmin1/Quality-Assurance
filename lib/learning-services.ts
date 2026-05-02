const materialTypeLabels: Record<string, string> = {
  pdf: "PDF",
  slides: "slide deck",
  video: "video",
  note: "note",
  pset: "problem set",
  link: "link",
  code: "code file"
};

function cleanTitle(value: unknown) {
  const rawValue = typeof value === "string" ? value : "";
  return rawValue
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160) || "Untitled material";
}

export function generateTutorReply(prompt: unknown) {
  const rawPrompt = typeof prompt === "string" ? prompt : "";
  const topic = rawPrompt.trim().replace(/\s+/g, " ").slice(0, 120) || "this concept";
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

export function extractMaterialMetadata(filename: unknown, type: unknown = "pdf") {
  const title = cleanTitle(filename);
  const materialType = typeof type === "string" ? type : "pdf";
  const label = materialTypeLabels[materialType] || "material";

  return {
    status: "processed" as const,
    title,
    concepts: [title, "key terms", "practice questions"],
    summary: `Processed ${label} "${title}". Add notes, flashcards, and quizzes from this material as you study it.`
  };
}
