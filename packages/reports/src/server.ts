/**
 * Route handler that forwards an app's same-origin `/api/reports/achievements` route to
 * the external SimpliTrain LMS API at https://lmsapidev.simplitrain.net/api/v3/Achievement/Search.
 * This eliminates browser CORS issues in restricted corporate environments while forwarding
 * bearer tokens and query parameters.
 */
export function createAchievementsRouteHandlers(options?: {
  upstreamUrl?: string;
  defaultToken?: string;
}) {
  const upstreamBase = (
    options?.upstreamUrl ||
    process.env.ACHIEVEMENT_API_BASE_URL ||
    "https://lmsapidev.simplitrain.net"
  ).replace(/\/+$/, "");

  async function forward(request: Request): Promise<Response> {
    const incomingAuth = request.headers.get("Authorization");
    const token =
      incomingAuth ||
      (options?.defaultToken ? `Bearer ${options.defaultToken}` : null) ||
      (process.env.ACHIEVEMENT_API_TOKEN ? `Bearer ${process.env.ACHIEVEMENT_API_TOKEN}` : null) ||
      (process.env.LMS_API_TOKEN ? `Bearer ${process.env.LMS_API_TOKEN}` : null);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const url = new URL(request.url);
    const targetUrl = `${upstreamBase}/api/v3/Achievement/Search${url.search}`;

    try {
      const upstream = await fetch(targetUrl, {
        method: request.method,
        headers,
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? await request.text()
            : undefined,
        cache: "no-store",
      });

      const responseText = await upstream.text();
      return new Response(responseText, {
        status: upstream.status,
        headers: {
          "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        },
      });
    } catch {
      return Response.json(
        {
          success: false,
          status: 502,
          message: "The SimpliTrain Achievement reporting service is currently unavailable.",
        },
        { status: 502 }
      );
    }
  }

  return {
    GET: (request: Request) => forward(request),
    POST: (request: Request) => forward(request),
  };
}
