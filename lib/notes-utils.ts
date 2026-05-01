export function serializeTags(tags?: string[]) {
  const uniqueTags = Array.from(new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean)));
  return JSON.stringify(uniqueTags);
}
