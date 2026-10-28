import { createAchievementsRouteHandlers } from "@lms/reports/server";

const handlers = createAchievementsRouteHandlers({
  upstreamUrl: process.env.ACHIEVEMENT_API_BASE_URL ?? "https://lmsapidev.simplitrain.net",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
