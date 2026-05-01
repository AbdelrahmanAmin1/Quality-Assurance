export function serializeBoard(board?: Record<string, unknown>) {
  return JSON.stringify(board ?? {});
}

export function readBoardText(board: string) {
  try {
    const parsed = JSON.parse(board);
    return typeof parsed?.text === "string" ? parsed.text : "";
  } catch {
    return "";
  }
}
