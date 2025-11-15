import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a UUID v4 using the Web Crypto API.
 * Works in both browser and Node.js environments.
 */
export function generateUUID(): string {
  // Use crypto.randomUUID() if available (modern browsers and Node.js 15.7+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  // Set version to 4 (random)
  array[6] = (array[6] & 0x0f) | 0x40;
  // Set variant to RFC 4122
  array[8] = (array[8] & 0x3f) | 0x80;

  const hex = Array.from(array).map((b) => b.toString(16).padStart(2, "0"));

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}
