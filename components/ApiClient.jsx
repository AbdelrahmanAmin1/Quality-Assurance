const ApiClient = (() => {
  const jsonHeaders = { "Content-Type": "application/json" };

  async function request(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        ...(options.body ? jsonHeaders : {}),
        ...(options.headers || {}),
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Request failed with ${response.status}`);
    }
    return payload.data;
  }

  const withBody = (method, path, body) => request(path, { method, body: JSON.stringify(body) });

  function parseJsonArray(value) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "string") return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function parseJsonObject(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
    if (!value || typeof value !== "string") return {};
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function relativeDate(value) {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No date";
    const diff = Date.now() - date.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (Math.abs(diff) < minute) return "just now";
    if (diff < hour) return `${Math.max(1, Math.round(diff / minute))} min ago`;
    if (diff < day) return `${Math.round(diff / hour)}h ago`;
    if (diff < 2 * day) return "Yesterday";
    if (diff < 7 * day) return `${Math.round(diff / day)} days ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function dateLabel(value) {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  function clampPercent(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(100, Math.round(number)));
  }

  function materialTypeFromName(name = "") {
    const lower = name.toLowerCase();
    if (lower.endsWith(".pdf")) return "pdf";
    if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "slides";
    if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm")) return "video";
    if (lower.endsWith(".js") || lower.endsWith(".ts") || lower.endsWith(".py") || lower.endsWith(".java")) return "code";
    return "note";
  }

  function initials(name, email) {
    const source = (name || email || "User").trim();
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";
  }

  return {
    get: (path) => request(path),
    post: (path, body) => withBody("POST", path, body),
    put: (path, body) => withBody("PUT", path, body),
    patch: (path, body) => withBody("PATCH", path, body),
    delete: (path) => request(path, { method: "DELETE" }),
    parseJsonArray,
    parseJsonObject,
    relativeDate,
    dateLabel,
    clampPercent,
    materialTypeFromName,
    initials,
  };
})();

window.NoesisApi = ApiClient;
