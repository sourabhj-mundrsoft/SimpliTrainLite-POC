import { afterEach, describe, expect, it, vi } from "vitest";
import { createUsersRouteHandlers } from "./server";

const upstreamUrl = "http://users.test/api/users";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createUsersRouteHandlers", () => {
  it("forwards GET to the upstream service and keeps its status", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true, data: [] }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await createUsersRouteHandlers({ upstreamUrl }).GET();

    expect(fetchMock).toHaveBeenCalledWith(upstreamUrl, {
      method: "GET",
      cache: "no-store",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, data: [] });
  });

  it("forwards the POST body and error status", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { success: false, message: "Required: password" },
          { status: 400 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await createUsersRouteHandlers({ upstreamUrl }).POST(
      new Request("http://app.test/api/users", {
        method: "POST",
        body: JSON.stringify({ first_name: "Meera" }),
      }),
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe(JSON.stringify({ first_name: "Meera" }));
    expect(response.status).toBe(400);
  });

  it("returns 502 when the service is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );

    const response = await createUsersRouteHandlers({ upstreamUrl }).GET();

    expect(response.status).toBe(502);
  });
});
