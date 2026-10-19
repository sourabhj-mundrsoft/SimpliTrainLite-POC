/**
 * Route handlers that forward an app's same-origin `/api/users` route to the
 * users service. Browsers can't call the service directly because it sends no
 * CORS headers, and this keeps the service URL in server-side configuration.
 */
export function createUsersRouteHandlers({
  upstreamUrl,
}: Readonly<{ upstreamUrl: string }>) {
  async function forward(init: RequestInit): Promise<Response> {
    try {
      const upstream = await fetch(upstreamUrl, { ...init, cache: "no-store" });
      return new Response(await upstream.text(), {
        status: upstream.status,
        headers: {
          "Content-Type":
            upstream.headers.get("Content-Type") ?? "application/json",
        },
      });
    } catch {
      return Response.json(
        { success: false, message: "The users service is unavailable." },
        { status: 502 },
      );
    }
  }

  return {
    GET: () => forward({ method: "GET" }),
    POST: async (request: Request) =>
      forward({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await request.text(),
      }),
  };
}
