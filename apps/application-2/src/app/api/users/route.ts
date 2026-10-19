import { createUsersRouteHandlers } from "@lms/users/server";

const handlers = createUsersRouteHandlers({
  upstreamUrl: process.env.USERS_API_URL ?? "http://localhost:9000/api/users",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
