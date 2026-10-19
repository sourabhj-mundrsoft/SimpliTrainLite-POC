import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createUsersClient,
  mapUsersResponse,
  toCreateUserPayload,
  type NewUser,
} from "./users-api";

const apiUser = {
  id: 3,
  first_name: "Aarav",
  middle_name: null,
  last_name: "Sharma",
  primary_email: "aarav@example.com",
  primary_phone: "9000007919",
  role: "user",
  employee_code: "EMP0001",
  department: "Engineering",
  designation: "Software Engineer",
  profile_picture_url: null,
  status: "active",
  password: "should-be-ignored",
};

const newUser: NewUser = {
  firstName: "Meera",
  middleName: "",
  lastName: "Iyer",
  email: "meera@example.com",
  password: "secret-123",
  phone: "",
  role: "manager",
  employeeCode: "",
  department: "Sales",
  designation: "",
  status: "active",
};

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("mapUsersResponse", () => {
  it("maps the API user shape to the domain model", () => {
    expect(mapUsersResponse({ success: true, data: [apiUser] })).toEqual([
      {
        id: 3,
        fullName: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "9000007919",
        role: "user",
        employeeCode: "EMP0001",
        department: "Engineering",
        designation: "Software Engineer",
        avatarUrl: undefined,
        status: "active",
      },
    ]);
  });
});

describe("toCreateUserPayload", () => {
  it("uses API field names and drops empty optional fields", () => {
    expect(toCreateUserPayload(newUser)).toEqual({
      first_name: "Meera",
      last_name: "Iyer",
      primary_email: "meera@example.com",
      password: "secret-123",
      role: "manager",
      department: "Sales",
      status: "active",
    });
  });
});

describe("createUsersClient", () => {
  it("lists users from the app-owned endpoint", async () => {
    const fetchMock = mockFetch(200, { success: true, data: [apiUser] });

    const users = await createUsersClient("/api/users").listUsers();

    expect(fetchMock).toHaveBeenCalledWith("/api/users", { cache: "no-store" });
    expect(users[0]?.fullName).toBe("Aarav Sharma");
  });

  it("turns an unexpected payload into a readable error", async () => {
    mockFetch(200, { rows: [] });

    await expect(createUsersClient("/api/users").listUsers()).rejects.toThrow(
      "The users service returned an unexpected response.",
    );
  });

  it("posts a new user and returns the created user", async () => {
    const fetchMock = mockFetch(201, {
      success: true,
      data: { ...apiUser, id: 200, first_name: "Meera", last_name: "Iyer" },
    });

    const created = await createUsersClient("/api/users").createUser(newUser);

    expect(created.fullName).toBe("Meera Iyer");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toMatchObject({
      first_name: "Meera",
      primary_email: "meera@example.com",
    });
  });

  it("surfaces the service's error message", async () => {
    mockFetch(409, {
      success: false,
      message:
        "Duplicate value: Key (primary_email)=(meera@example.com) already exists.",
    });

    await expect(
      createUsersClient("/api/users").createUser(newUser),
    ).rejects.toThrow(/Duplicate value/);
  });
});
