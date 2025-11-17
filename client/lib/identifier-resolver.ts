/**
 * Identifier Resolver
 *
 * Utilities to resolve usernames or UUIDs to user data.
 * Enables username-first lookup with UUID fallback across the app.
 */

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

/**
 * Check if a string is a valid UUID
 */
export function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Resolve an identifier (username or UUID) to a user/creator object
 * Tries username first, then UUID fallback
 */
export async function resolveIdentifierToCreator(
  identifier: string,
): Promise<{ id: string; username: string; [key: string]: any } | null> {
  if (!identifier) return null;

  try {
    // Try username first (most common case)
    const usernameResponse = await fetch(
      `${API_BASE}/api/creators/${identifier}`,
    );
    if (usernameResponse.ok) {
      return await usernameResponse.json();
    }

    // If username lookup failed and identifier is a UUID, try UUID lookup
    if (isUUID(identifier)) {
      const uuidResponse = await fetch(
        `${API_BASE}/api/creators/user/${identifier}`,
      );
      if (uuidResponse.ok) {
        return await uuidResponse.json();
      }
    }

    return null;
  } catch (error) {
    console.error("[Identifier Resolver] Error resolving identifier:", error);
    return null;
  }
}

/**
 * Resolve an identifier to a user by ID
 */
export async function resolveIdentifierToUserId(
  identifier: string,
): Promise<string | null> {
  if (!identifier) return null;

  if (isUUID(identifier)) {
    // If it's already a UUID, return it
    return identifier;
  }

  // Try to resolve username to user ID
  try {
    const creator = await resolveIdentifierToCreator(identifier);
    return creator?.id || null;
  } catch {
    return null;
  }
}

/**
 * Resolve an identifier to a username
 */
export async function resolveIdentifierToUsername(
  identifier: string,
): Promise<string | null> {
  if (!identifier) return null;

  if (!isUUID(identifier)) {
    // If it's not a UUID, assume it's already a username
    return identifier;
  }

  // Try to resolve UUID to username
  try {
    const creator = await resolveIdentifierToCreator(identifier);
    return creator?.username || null;
  } catch {
    return null;
  }
}
