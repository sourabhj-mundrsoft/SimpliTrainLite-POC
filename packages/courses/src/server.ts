/**
 * Route handlers that forward an app's same-origin `/api/courses` route to the
 * external course authoring API at https://simpliauthorapidev.ourdemoapps.com.
 * Browsers avoid direct cross-origin and CORS errors through this handler.
 */
export function createCoursesRouteHandlers(options?: {
  upstreamUrl?: string;
  defaultToken?: string;
}) {
  const upstreamBase = (
    options?.upstreamUrl ||
    process.env.COURSE_API_BASE_URL ||
    "https://simpliauthorapidev.ourdemoapps.com"
  ).replace(/\/+$/, "");

  async function forward(request: Request, pathSuffix = ""): Promise<Response> {
    const incomingAuth = request.headers.get("Authorization");
    const token =
      incomingAuth ||
      (options?.defaultToken ? `Bearer ${options.defaultToken}` : null) ||
      (process.env.COURSE_API_TOKEN ? `Bearer ${process.env.COURSE_API_TOKEN}` : null);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const targetUrl = `${upstreamBase}/api/courses${pathSuffix}`;

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
          "Content-Type":
            upstream.headers.get("Content-Type") ?? "application/json",
        },
      });
    } catch {
      return Response.json(
        {
          success: false,
          status: 502,
          message: "The course authoring service is unavailable.",
        },
        { status: 502 },
      );
    }
  }

  return {
    GET: (request: Request) => {
      const url = new URL(request.url);
      const query = url.search;
      return forward(request, query);
    },
    POST: (request: Request) => forward(request),
  };
}
