export function normalizeErrorMessage(err: any): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  const m = err?.message || err?.error_description || err?.error || err?.msg;
  if (typeof m === "string" && m.trim()) return m;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
