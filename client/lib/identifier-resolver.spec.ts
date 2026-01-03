import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isUUID,
  resolveIdentifierToCreator,
  resolveIdentifierToUserId,
  resolveIdentifierToUsername,
} from "./identifier-resolver";

describe("identifier-resolver", () => {
  describe("isUUID", () => {
    it("should return true for valid UUIDs", () => {
      expect(isUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
      expect(isUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479")).toBe(true);
      expect(isUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    });

    it("should return true for UUIDs in different cases", () => {
      expect(isUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
      expect(isUUID("550e8400-E29B-41d4-A716-446655440000")).toBe(true);
    });

    it("should return false for invalid UUIDs", () => {
      expect(isUUID("not-a-uuid")).toBe(false);
      expect(isUUID("550e8400-e29b-41d4-a716")).toBe(false); // too short
      expect(isUUID("550e8400-e29b-41d4-a716-446655440000-extra")).toBe(false); // too long
      expect(isUUID("550e8400e29b41d4a716446655440000")).toBe(false); // missing dashes
      expect(isUUID("550e8400-e29b-41d4-a716-44665544000g")).toBe(false); // invalid character 'g'
    });

    it("should return false for empty and invalid inputs", () => {
      expect(isUUID("")).toBe(false);
      expect(isUUID("   ")).toBe(false);
    });

    it("should return false for non-string-like UUIDs", () => {
      expect(isUUID("12345678-1234-1234-1234-12345678901")).toBe(false); // one char short
      expect(isUUID("12345678-1234-1234-1234-1234567890123")).toBe(false); // one char long
    });
  });

  describe("resolveIdentifierToCreator", () => {
    let fetchSpy: any;

    beforeEach(() => {
      // Mock the global fetch function
      fetchSpy = vi.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return null for empty identifier", async () => {
      const result = await resolveIdentifierToCreator("");
      expect(result).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should resolve username successfully", async () => {
      const mockCreator = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        username: "testuser",
        email: "test@example.com",
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreator,
      });

      const result = await resolveIdentifierToCreator("testuser");

      expect(result).toEqual(mockCreator);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith("/api/creators/testuser");
    });

    it("should try UUID lookup when username fails and identifier is UUID", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const mockCreator = {
        id: uuid,
        username: "testuser",
        email: "test@example.com",
      };

      // First call (username) fails
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Second call (UUID) succeeds
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreator,
      });

      const result = await resolveIdentifierToCreator(uuid);

      expect(result).toEqual(mockCreator);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy).toHaveBeenNthCalledWith(1, `/api/creators/${uuid}`);
      expect(fetchSpy).toHaveBeenNthCalledWith(2, `/api/creators/user/${uuid}`);
    });

    it("should return null when username lookup fails and identifier is not a UUID", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await resolveIdentifierToCreator("notauser");

      expect(result).toBeNull();
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith("/api/creators/notauser");
    });

    it("should return null when both username and UUID lookups fail", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await resolveIdentifierToCreator(uuid);

      expect(result).toBeNull();
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle fetch errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      fetchSpy.mockRejectedValueOnce(new Error("Network error"));

      const result = await resolveIdentifierToCreator("testuser");

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Identifier Resolver] Error resolving identifier:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle malformed JSON responses", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const result = await resolveIdentifierToCreator("testuser");

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("resolveIdentifierToUserId", () => {
    let fetchSpy: any;

    beforeEach(() => {
      fetchSpy = vi.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return null for empty identifier", async () => {
      const result = await resolveIdentifierToUserId("");
      expect(result).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should return the UUID directly if identifier is already a UUID", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const result = await resolveIdentifierToUserId(uuid);

      expect(result).toBe(uuid);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should resolve username to user ID", async () => {
      const mockCreator = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        username: "testuser",
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreator,
      });

      const result = await resolveIdentifierToUserId("testuser");

      expect(result).toBe(mockCreator.id);
      expect(fetchSpy).toHaveBeenCalledWith("/api/creators/testuser");
    });

    it("should return null when username resolution fails", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await resolveIdentifierToUserId("nonexistent");

      expect(result).toBeNull();
    });

    it("should return null when API returns creator without ID", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: "testuser" }), // no id field
      });

      const result = await resolveIdentifierToUserId("testuser");

      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      fetchSpy.mockRejectedValueOnce(new Error("Network error"));

      const result = await resolveIdentifierToUserId("testuser");

      expect(result).toBeNull();
    });
  });

  describe("resolveIdentifierToUsername", () => {
    let fetchSpy: any;

    beforeEach(() => {
      fetchSpy = vi.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return null for empty identifier", async () => {
      const result = await resolveIdentifierToUsername("");
      expect(result).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should return the username directly if identifier is not a UUID", async () => {
      const result = await resolveIdentifierToUsername("testuser");

      expect(result).toBe("testuser");
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should resolve UUID to username", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const mockCreator = {
        id: uuid,
        username: "testuser",
      };

      // First call (username endpoint with UUID) will fail
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Second call (UUID endpoint) will succeed
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreator,
      });

      const result = await resolveIdentifierToUsername(uuid);

      expect(result).toBe(mockCreator.username);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("should return null when UUID resolution fails", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await resolveIdentifierToUsername(uuid);

      expect(result).toBeNull();
    });

    it("should return null when API returns creator without username", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: uuid }), // no username field
      });

      const result = await resolveIdentifierToUsername(uuid);

      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      fetchSpy.mockRejectedValueOnce(new Error("Network error"));

      const result = await resolveIdentifierToUsername(uuid);

      expect(result).toBeNull();
    });
  });

  describe("integration scenarios", () => {
    let fetchSpy: any;

    beforeEach(() => {
      fetchSpy = vi.fn();
      global.fetch = fetchSpy;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should handle full workflow: username -> userId -> username", async () => {
      const mockCreator = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        username: "testuser",
      };

      // First call: resolve username to creator
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreator,
      });

      const userId = await resolveIdentifierToUserId("testuser");
      expect(userId).toBe(mockCreator.id);

      // Second call: resolve userId (UUID) back to username
      // This will make API calls since userId is a UUID
      fetchSpy.mockResolvedValueOnce({
        ok: false, // username endpoint will fail
        status: 404,
      });

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreator,
      });

      const username = await resolveIdentifierToUsername(userId);
      expect(username).toBe(mockCreator.username);
    });

    it("should handle mixed case UUIDs consistently", async () => {
      const lowerUUID = "550e8400-e29b-41d4-a716-446655440000";
      const upperUUID = "550E8400-E29B-41D4-A716-446655440000";
      const mixedUUID = "550e8400-E29B-41d4-A716-446655440000";

      expect(isUUID(lowerUUID)).toBe(true);
      expect(isUUID(upperUUID)).toBe(true);
      expect(isUUID(mixedUUID)).toBe(true);

      // All should be recognized as UUIDs and returned directly
      expect(await resolveIdentifierToUserId(lowerUUID)).toBe(lowerUUID);
      expect(await resolveIdentifierToUserId(upperUUID)).toBe(upperUUID);
      expect(await resolveIdentifierToUserId(mixedUUID)).toBe(mixedUUID);
    });
  });
});
