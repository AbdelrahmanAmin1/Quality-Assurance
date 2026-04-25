export function stubTutorReply(prompt: string) {
  const topic = prompt.trim().slice(0, 80) || "this concept";
  return {
    provider: "stub",
    message: `Let's reason through ${topic}. Start by defining the key idea, then test it with one small example.`,
    nextPrompts: ["Show me a worked example", "Quiz me on this", "Summarize the misconception"]
  };
}

export function stubMaterialExtraction(filename: string) {
  return {
    status: "processed",
    title: filename.replace(/\.[^.]+$/, ""),
    concepts: ["core idea", "worked example", "common mistake"],
    summary: "Stub extraction created deterministic study metadata until a document processor is configured."
  };
}
