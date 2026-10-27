import { createBrandingRouteHandlers } from "@lms/settings/server";

const handlers = createBrandingRouteHandlers();

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
