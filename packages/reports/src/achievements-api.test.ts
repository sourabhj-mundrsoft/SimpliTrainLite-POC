import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchAchievementsFromApi,
  mapRawItemToAchievement,
  setStoredAuthToken,
  getStoredAuthToken,
  clearStoredAuthToken,
  FALLBACK_SAMPLE_ACHIEVEMENTS,
} from "./achievements-api";

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(typeof body === "string" ? body : JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("mapRawItemToAchievement", () => {
  it("correctly maps raw backend fields into an AchievementRecord", () => {
    const raw = {
      achievementId: "rec-888",
      userName: "Elena Rostova",
      userEmail: "elena@example.com",
      achievementName: "Safety Lead",
      courseName: "Health & Safety 2026",
      issueDate: "2026-10-18T10:00:00Z",
      expirationDate: "2028-10-18T10:00:00Z",
      score: 95,
      certificateNumber: "CRT-SAF-001",
      status: "Active",
      organizationName: "Global Org",
    };

    const mapped = mapRawItemToAchievement(raw, 0);

    expect(mapped.id).toBe("rec-888");
    expect(mapped.userName).toBe("Elena Rostova");
    expect(mapped.userEmail).toBe("elena@example.com");
    expect(mapped.achievementName).toBe("Safety Lead");
    expect(mapped.courseName).toBe("Health & Safety 2026");
    expect(mapped.issueDate).toBe("2026-10-18");
    expect(mapped.expirationDate).toBe("2028-10-18");
    expect(mapped.score).toBe(95);
    expect(mapped.credentialId).toBe("CRT-SAF-001");
    expect(mapped.status).toBe("Active");
  });

  it("handles empty or missing fields with safe fallbacks", () => {
    const mapped = mapRawItemToAchievement({}, 2);
    expect(mapped.id).toBe("ach-3");
    expect(mapped.credentialId).toContain("CRT-");
    expect(mapped.status).toBe("Active");
  });
});

describe("fetchAchievementsFromApi", () => {
  it("fetches and parses successful response with items array", async () => {
    mockFetch(200, {
      items: [
        {
          id: 101,
          userName: "Marcus Vance",
          userEmail: "marcus@example.com",
          achievementName: "SOC 2 Lead",
          courseName: "SOC 2 Type II",
          score: 94,
          certificateNumber: "CRT-SOC2",
        },
      ],
      totalCount: 1,
    });

    const result = await fetchAchievementsFromApi({ page: 1, pageSize: 10 });

    expect(result.success).toBe(true);
    expect(result.data.length).toBe(1);
    expect(result.data[0].userName).toBe("Marcus Vance");
    expect(result.total).toBe(1);
    expect(result.error).toBeUndefined();
  });

  it("handles 401 Unauthorized with descriptive error info", async () => {
    mockFetch(401, "Unauthorized");

    const result = await fetchAchievementsFromApi({ page: 1, pageSize: 10 });

    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(401);
    expect(result.error?.type).toBe("UNAUTHORIZED");
    expect(result.error?.message).toContain("Authentication required");
  });

  it("handles 403 Forbidden with proper classification", async () => {
    mockFetch(403, { error: "Forbidden" });

    const result = await fetchAchievementsFromApi();

    expect(result.success).toBe(false);
    expect(result.error?.status).toBe(403);
    expect(result.error?.type).toBe("FORBIDDEN");
  });

  it("handles 500 server error gracefully", async () => {
    mockFetch(500, "Internal Server Error");

    const result = await fetchAchievementsFromApi();

    expect(result.success).toBe(false);
    expect(result.error?.status).toBe(500);
    expect(result.error?.type).toBe("SERVER_ERROR");
  });

  it("handles network failure gracefully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Failed to fetch"))
    );

    const result = await fetchAchievementsFromApi();

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("NETWORK_ERROR");
    expect(result.error?.message).toContain("Network connection failed");
  });

  it("includes Bearer header when token is provided", async () => {
    const fetchMock = mockFetch(200, { items: [] });

    await fetchAchievementsFromApi({ token: "test-secret-token" });

    expect(fetchMock).toHaveBeenCalled();
    const calls = fetchMock.mock.calls;
    const requestHeaders = calls[0][1]?.headers;
    expect(requestHeaders?.["Authorization"]).toBe("Bearer test-secret-token");
  });

  it("provides rich fallback sample achievements list", () => {
    expect(FALLBACK_SAMPLE_ACHIEVEMENTS.length).toBeGreaterThan(0);
    expect(FALLBACK_SAMPLE_ACHIEVEMENTS[0]).toHaveProperty("credentialId");
    expect(FALLBACK_SAMPLE_ACHIEVEMENTS[0]).toHaveProperty("userName");
  });
});
