import { createCoursesRouteHandlers } from "@lms/courses/server";

const handlers = createCoursesRouteHandlers({
  upstreamUrl:
    process.env.COURSE_API_BASE_URL ??
    "https://simpliauthorapidev.ourdemoapps.com",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
