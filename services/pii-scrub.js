const patterns = [
  /api[_-]?key\s*=\s*["'][A-Za-z0-9_\-]{16,}["']/gi,
  /\b[A-F0-9]{32,64}\b/gi,
  /\b\d{3}-\d{2}-\d{4}\b/g,
  /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,
];

export function scrubPII(input) {
  return patterns.reduce((out, p) => out.replace(p, "[REDACTED]"), input);
}

