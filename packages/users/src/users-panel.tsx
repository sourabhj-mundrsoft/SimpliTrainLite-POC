"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CreateUserModal } from "./create-user-modal";
import { createUsersClient, type User } from "./users-api";
import { UsersGrid, type UserColumn } from "./users-grid";

export type UsersPanelProps = Readonly<{
  /** Same-origin endpoint owned by the app, e.g. "/api/users". */
  endpoint: string;
  pageSize?: number;
  /** Grid columns to show, in order. Defaults to `defaultUserColumns`. */
  columns?: readonly UserColumn[];
}>;

export function UsersPanel({ endpoint, pageSize, columns }: UsersPanelProps) {
  const client = useMemo(() => createUsersClient(endpoint), [endpoint]);
  const queryClient = useQueryClient();
  const queryKey = ["users", endpoint];
  const usersQuery = useQuery({ queryKey, queryFn: client.listUsers });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  function handleCreated(user: User) {
    setIsCreateOpen(false);
    setCreatedUser(user);
    void queryClient.invalidateQueries({ queryKey });
  }

  return (
    <section aria-labelledby="users-heading">
      <h2
        className="text-xl font-semibold text-[var(--color-text)]"
        id="users-heading"
      >
        Users
      </h2>
      <p className="mt-1 text-[var(--color-text-muted)]">
        Create and manage individual learner and admin accounts.
      </p>

      <div className="mt-6 inline-flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)]"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </span>
          <p className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
            User accounts
            {usersQuery.data ? (
              <span className="ml-2 font-normal normal-case">
                ({usersQuery.data.length})
              </span>
            ) : null}
          </p>
        </div>
        <button
          className="self-start rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold text-[var(--color-on-primary)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          onClick={() => setIsCreateOpen(true)}
          type="button"
        >
          + Create User
        </button>
      </div>

      {createdUser ? (
        <p
          className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-900"
          role="status"
        >
          {createdUser.fullName} was created.
        </p>
      ) : null}

      <div className="mt-6">
        <UsersGrid
          errorMessage={usersQuery.error?.message}
          isLoading={usersQuery.isPending}
          onRetry={() => {
            void usersQuery.refetch();
          }}
          columns={columns}
          pageSize={pageSize}
          users={usersQuery.data ?? []}
        />
      </div>

      {isCreateOpen ? (
        <CreateUserModal
          client={client}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleCreated}
        />
      ) : null}
    </section>
  );
}
