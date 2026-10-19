"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { User } from "./users-api";

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-800 ring-green-200",
  inactive: "bg-slate-100 text-[var(--color-text-muted)] ring-slate-200",
  suspended: "bg-red-50 text-red-800 ring-red-200",
};

function initialsOf(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.length > 1 ? [parts[0], parts.at(-1)] : parts;
  return initials.map((part) => part!.charAt(0).toLocaleUpperCase()).join("");
}

function matchesSearch(user: User, search: string): boolean {
  return [
    user.fullName,
    user.email,
    user.phone,
    user.department,
    user.employeeCode,
    user.city,
    user.country,
  ]
    .filter(Boolean)
    .some((value) => value!.toLocaleLowerCase().includes(search));
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function formatDate(value: string | undefined): string | undefined {
  const date = value ? new Date(value) : undefined;
  return date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : undefined;
}

function Avatar({ user }: Readonly<{ user: User }>) {
  const [failedUrl, setFailedUrl] = useState<string>();

  if (user.avatarUrl && user.avatarUrl !== failedUrl) {
    return (
      <img
        alt=""
        className="size-9 shrink-0 rounded-full object-cover"
        loading="lazy"
        onError={() => setFailedUrl(user.avatarUrl)}
        src={user.avatarUrl}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface))] text-xs font-bold text-[var(--color-primary)]"
    >
      {initialsOf(user.fullName)}
    </span>
  );
}

export type UserColumn =
  | "user"
  | "email"
  | "phone"
  | "employeeCode"
  | "department"
  | "designation"
  | "city"
  | "country"
  | "dateOfJoining"
  | "role"
  | "status";

export const defaultUserColumns: readonly UserColumn[] = [
  "user",
  "employeeCode",
  "department",
  "designation",
  "role",
  "status",
];

const placeholder = "—";

const columnDefinitions: Record<
  UserColumn,
  Readonly<{
    header: string;
    render: (user: User, columns: readonly UserColumn[]) => ReactNode;
  }>
> = {
  user: {
    header: "User",
    render: (user, columns) => (
      <div className="flex items-center gap-3">
        <Avatar user={user} />
        <div className="min-w-0">
          <p className="font-semibold whitespace-nowrap text-[var(--color-text)]">
            {user.fullName}
          </p>
          {columns.includes("email") ? null : (
            <p className="truncate text-[var(--color-text-muted)]">
              {user.email}
            </p>
          )}
        </div>
      </div>
    ),
  },
  email: { header: "Email", render: (user) => user.email },
  phone: { header: "Phone", render: (user) => user.phone ?? placeholder },
  employeeCode: {
    header: "Employee code",
    render: (user) => user.employeeCode ?? placeholder,
  },
  department: {
    header: "Department",
    render: (user) => user.department ?? placeholder,
  },
  designation: {
    header: "Designation",
    render: (user) => user.designation ?? placeholder,
  },
  city: { header: "City", render: (user) => user.city ?? placeholder },
  country: { header: "Country", render: (user) => user.country ?? placeholder },
  dateOfJoining: {
    header: "Date of joining",
    render: (user) => formatDate(user.dateOfJoining) ?? placeholder,
  },
  role: {
    header: "Role",
    render: (user) => <span className="capitalize">{user.role}</span>,
  },
  status: {
    header: "Status",
    render: (user) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${
          statusStyles[user.status] ?? statusStyles.inactive
        }`}
      >
        {user.status}
      </span>
    ),
  },
};

export type UsersGridProps = Readonly<{
  users: readonly User[];
  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  pageSize?: number;
  /** Columns to show, in order. Defaults to `defaultUserColumns`. */
  columns?: readonly UserColumn[];
}>;

export function UsersGrid({
  users,
  isLoading = false,
  errorMessage,
  onRetry,
  pageSize = 10,
  columns = defaultUserColumns,
}: UsersGridProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return term ? users.filter((user) => matchesSearch(user, term)) : users;
  }, [users, search]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * pageSize;
  const visibleUsers = filteredUsers.slice(firstIndex, firstIndex + pageSize);

  if (isLoading) {
    return (
      <p
        className="rounded-xl bg-[var(--color-surface-muted)] p-6 text-[var(--color-text-muted)]"
        role="status"
      >
        Loading users…
      </p>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
        <p role="alert">{errorMessage}</p>
        {onRetry ? (
          <button
            className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            onClick={onRetry}
            type="button"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <label className="block max-w-sm">
        <span className="sr-only">Search users</span>
        <input
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, phone, department or code"
          type="search"
          value={search}
        />
      </label>

      {visibleUsers.length === 0 ? (
        <p
          className="mt-4 rounded-xl bg-[var(--color-surface-muted)] p-6 text-[var(--color-text-muted)]"
          role="status"
        >
          {users.length === 0 ? "No users yet." : "No users match your search."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <caption className="sr-only">Users</caption>
            <thead className="bg-[var(--color-surface-muted)] text-xs font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
              <tr>
                {columns.map((column) => (
                  <th
                    className="px-4 py-3 whitespace-nowrap"
                    key={column}
                    scope="col"
                  >
                    {columnDefinitions[column].header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  {columns.map((column) => (
                    <td
                      className={`px-4 py-3 text-[var(--color-text-muted)] ${
                        column === "user" ? "" : "whitespace-nowrap"
                      }`}
                      key={column}
                    >
                      {columnDefinitions[column].render(user, columns)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredUsers.length > 0 ? (
        <nav
          aria-label="Users pagination"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-text-muted)]"
        >
          <p>
            Showing {firstIndex + 1}–{firstIndex + visibleUsers.length} of{" "}
            {filteredUsers.length}
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === pageCount}
              onClick={() => setPage(currentPage + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
