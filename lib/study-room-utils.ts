export function serializeBoard(board?: Record<string, unknown> | null) {
  const safeBoard = board && typeof board === "object" && !Array.isArray(board) ? board : {};
  return JSON.stringify(safeBoard);
}

export function readBoardText(board: unknown) {
  if (typeof board !== "string") return "";
  try {
    const parsed = JSON.parse(board);
    return typeof parsed?.text === "string" ? parsed.text : "";
  } catch {
    return "";
  }
}
