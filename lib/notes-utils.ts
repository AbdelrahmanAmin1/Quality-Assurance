export function serializeTags(tags?: unknown[]) {
  const inputTags = Array.isArray(tags) ? tags : [];
  const uniqueTags = Array.from(
    new Set(inputTags.map((tag) => typeof tag === "string" ? tag.trim() : "").filter(Boolean))
  );
  return JSON.stringify(uniqueTags);
}
