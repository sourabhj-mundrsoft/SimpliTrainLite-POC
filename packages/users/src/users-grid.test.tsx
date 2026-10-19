import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { User } from "./users-api";
import { UsersGrid } from "./users-grid";

const users: User[] = [
  {
    id: 1,
    fullName: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9000007919",
    role: "user",
    employeeCode: "EMP0001",
    department: "Engineering",
    designation: "Software Engineer",
    city: "Pune",
    country: "India",
    dateOfJoining: "2015-01-15T00:00:00.000Z",
    status: "active",
  },
];

function headers() {
  return within(screen.getByRole("table"))
    .getAllByRole("columnheader")
    .map((header) => header.textContent);
}

describe("UsersGrid columns", () => {
  it("shows the default columns with the email under the name", () => {
    render(<UsersGrid users={users} />);

    expect(headers()).toEqual([
      "User",
      "Employee code",
      "Department",
      "Designation",
      "Role",
      "Status",
    ]);
    expect(screen.getByText("aarav@example.com")).toBeInTheDocument();
    expect(screen.queryByText("9000007919")).not.toBeInTheDocument();
  });

  it("shows the requested columns in order", () => {
    render(
      <UsersGrid
        columns={[
          "user",
          "email",
          "phone",
          "city",
          "country",
          "dateOfJoining",
          "status",
        ]}
        users={users}
      />,
    );

    expect(headers()).toEqual([
      "User",
      "Email",
      "Phone",
      "City",
      "Country",
      "Date of joining",
      "Status",
    ]);
    const cells = within(screen.getAllByRole("row")[1]!).getAllByRole("cell");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      "AS" + "Aarav Sharma",
      "aarav@example.com",
      "9000007919",
      "Pune",
      "India",
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date("2015-01-15T00:00:00.000Z"),
      ),
      "active",
    ]);
    // Email is its own column, so it isn't repeated under the name.
    expect(screen.getAllByText("aarav@example.com")).toHaveLength(1);
  });
});
