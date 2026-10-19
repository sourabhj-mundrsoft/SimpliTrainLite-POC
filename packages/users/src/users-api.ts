import { z } from "zod";

export const userRoles = ["user", "manager", "admin"] as const;
export const userStatuses = ["active", "inactive", "suspended"] as const;

export type UserStatus = (typeof userStatuses)[number];

export type User = Readonly<{
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
  city?: string;
  country?: string;
  /** ISO timestamp as returned by the service. */
  dateOfJoining?: string;
  avatarUrl?: string;
  status: string;
}>;

export type NewUser = Readonly<{
  firstName: string;
  middleName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
  status: UserStatus;
}>;

const optionalText = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || undefined);

const apiUserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  middle_name: optionalText,
  last_name: optionalText,
  primary_email: z.string(),
  primary_phone: optionalText,
  role: optionalText,
  employee_code: optionalText,
  department: optionalText,
  designation: optionalText,
  city: optionalText,
  country: optionalText,
  date_of_joining: optionalText,
  profile_picture_url: optionalText,
  status: z.string(),
});

const listResponseSchema = z.object({ data: z.array(apiUserSchema) });
const createResponseSchema = z.object({ data: apiUserSchema });
const errorResponseSchema = z.object({ message: z.string() });

type ApiUser = z.infer<typeof apiUserSchema>;

function mapUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    fullName: [apiUser.first_name, apiUser.middle_name, apiUser.last_name]
      .filter(Boolean)
      .join(" "),
    email: apiUser.primary_email,
    phone: apiUser.primary_phone,
    role: apiUser.role ?? "user",
    employeeCode: apiUser.employee_code,
    department: apiUser.department,
    designation: apiUser.designation,
    city: apiUser.city,
    country: apiUser.country,
    dateOfJoining: apiUser.date_of_joining,
    avatarUrl: apiUser.profile_picture_url,
    status: apiUser.status,
  };
}

export function mapUsersResponse(payload: unknown): User[] {
  return listResponseSchema.parse(payload).data.map(mapUser);
}

export function mapCreatedUserResponse(payload: unknown): User {
  return mapUser(createResponseSchema.parse(payload).data);
}

export function toCreateUserPayload(user: NewUser): Record<string, string> {
  const payload: Record<string, string | undefined> = {
    first_name: user.firstName,
    middle_name: user.middleName,
    last_name: user.lastName,
    primary_email: user.email,
    password: user.password,
    primary_phone: user.phone,
    role: user.role,
    employee_code: user.employeeCode,
    department: user.department,
    designation: user.designation,
    status: user.status,
  };

  return Object.fromEntries(
    Object.entries(payload).filter((entry): entry is [string, string] =>
      Boolean(entry[1]?.trim()),
    ),
  );
}

export class UsersApiError extends Error {
  override name = "UsersApiError";
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function errorFrom(payload: unknown, fallback: string): UsersApiError {
  const parsed = errorResponseSchema.safeParse(payload);
  return new UsersApiError(parsed.success ? parsed.data.message : fallback);
}

function parseOrThrow<T>(map: (payload: unknown) => T, payload: unknown): T {
  try {
    return map(payload);
  } catch {
    throw new UsersApiError(
      "The users service returned an unexpected response.",
    );
  }
}

export type UsersClient = Readonly<{
  listUsers: () => Promise<User[]>;
  createUser: (user: NewUser) => Promise<User>;
}>;

export function createUsersClient(endpoint: string): UsersClient {
  return {
    async listUsers() {
      const response = await fetch(endpoint, { cache: "no-store" });
      const payload = await readJson(response);
      if (!response.ok) {
        throw errorFrom(payload, "We couldn't load users. Please try again.");
      }
      return parseOrThrow(mapUsersResponse, payload);
    },
    async createUser(user) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toCreateUserPayload(user)),
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw errorFrom(
          payload,
          "We couldn't create the user. Please try again.",
        );
      }
      return parseOrThrow(mapCreatedUserResponse, payload);
    },
  };
}
