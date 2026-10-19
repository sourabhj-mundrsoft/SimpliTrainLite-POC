import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UsersPanel } from "./users-panel";

function apiUser(id: number, firstName: string, department = "Engineering") {
  return {
    id,
    first_name: firstName,
    middle_name: null,
    last_name: "Test",
    primary_email: `${firstName.toLowerCase()}@example.com`,
    primary_phone: null,
    role: "user",
    employee_code: `EMP${id}`,
    department,
    designation: null,
    profile_picture_url: null,
    status: "active",
  };
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function renderPanel() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <UsersPanel endpoint="/api/users" pageSize={2} />
    </QueryClientProvider>,
  );
}

beforeAll(() => {
  // jsdom does not implement modal dialogs.
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UsersPanel", () => {
  it("shows users in a paginated, searchable grid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(200, {
          data: [
            apiUser(1, "Aarav"),
            apiUser(2, "Vivaan"),
            apiUser(3, "Diya", "Finance"),
          ],
        }),
      ),
    );
    const user = userEvent.setup();
    renderPanel();

    expect(screen.getByRole("status")).toHaveTextContent("Loading users");
    expect(await screen.findByText("Aarav Test")).toBeInTheDocument();
    expect(screen.queryByText("Diya Test")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1–2 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Diya Test")).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox"), "finance");
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Showing 1–1 of 1")).toBeInTheDocument();
  });

  it("shows a retryable error when users can't load", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse(502, { message: "The users service is unavailable." }),
        ),
    );
    renderPanel();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The users service is unavailable.",
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("creates a user from the modal and refreshes the grid", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { data: [apiUser(1, "Aarav")] }))
      .mockResolvedValueOnce(jsonResponse(201, { data: apiUser(9, "Meera") }))
      .mockResolvedValueOnce(
        jsonResponse(200, { data: [apiUser(1, "Aarav"), apiUser(9, "Meera")] }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderPanel();
    await screen.findByText("Aarav Test");

    await user.click(screen.getByRole("button", { name: "+ Create User" }));
    const dialog = screen.getByRole("dialog", { name: "Create user" });
    await user.type(within(dialog).getByLabelText(/First name/), "Meera");
    await user.type(
      within(dialog).getByLabelText(/Email/),
      "meera@example.com",
    );
    await user.type(within(dialog).getByLabelText(/Password/), "secret-123");
    await user.click(
      within(dialog).getByRole("button", { name: "Create user" }),
    );

    expect(
      await screen.findByText("Meera Test was created."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(await screen.findByText("meera@example.com")).toBeInTheDocument();

    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toBe("/api/users");
    expect(JSON.parse(String(init.body))).toEqual({
      first_name: "Meera",
      primary_email: "meera@example.com",
      password: "secret-123",
      role: "user",
      status: "active",
    });
  });

  it("keeps the modal open and shows the service error", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(200, { data: [] }))
        .mockResolvedValueOnce(
          jsonResponse(409, { message: "Duplicate value: email exists." }),
        ),
    );
    const user = userEvent.setup();
    renderPanel();
    expect(await screen.findByText("No users yet.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "+ Create User" }));
    const dialog = screen.getByRole("dialog", { name: "Create user" });
    await user.type(within(dialog).getByLabelText(/First name/), "Meera");
    await user.type(
      within(dialog).getByLabelText(/Email/),
      "meera@example.com",
    );
    await user.type(within(dialog).getByLabelText(/Password/), "secret-123");
    await user.click(
      within(dialog).getByRole("button", { name: "Create user" }),
    );

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Duplicate value: email exists.",
    );
  });
});
