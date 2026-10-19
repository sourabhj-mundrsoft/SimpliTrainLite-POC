"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useId, type FormEvent } from "react";
import {
  userRoles,
  userStatuses,
  type NewUser,
  type User,
  type UserStatus,
  type UsersClient,
} from "./users-api";

const inputClassName =
  "mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]";

function readNewUser(form: FormData): NewUser {
  const text = (name: string) => String(form.get(name) ?? "").trim();
  return {
    firstName: text("firstName"),
    middleName: text("middleName"),
    lastName: text("lastName"),
    email: text("email"),
    password: String(form.get("password") ?? ""),
    phone: text("phone"),
    role: text("role"),
    employeeCode: text("employeeCode"),
    department: text("department"),
    designation: text("designation"),
    status: text("status") as UserStatus,
  };
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: Readonly<{
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}>) {
  return (
    <label className="block text-sm font-medium text-[var(--color-text-muted)]">
      {label}
      {required ? <span aria-hidden="true"> *</span> : null}
      <input
        autoComplete={autoComplete}
        className={inputClassName}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

export type CreateUserModalProps = Readonly<{
  client: UsersClient;
  onClose: () => void;
  onCreated: (user: User) => void;
}>;

export function CreateUserModal({
  client,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const titleId = useId();
  const openAsModal = useCallback((dialog: HTMLDialogElement | null) => {
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const createUser = useMutation({
    mutationFn: client.createUser,
    onSuccess: onCreated,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createUser.mutate(readNewUser(new FormData(event.currentTarget)));
  }

  return (
    <dialog
      aria-labelledby={titleId}
      className="m-auto w-[min(42rem,calc(100%-2rem))] rounded-2xl bg-[var(--color-surface)] p-0 text-[var(--color-text)] shadow-xl backdrop:bg-slate-900/50"
      onClose={onClose}
      ref={openAsModal}
    >
      <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
        <h2
          className="text-xl font-semibold text-[var(--color-text)]"
          id={titleId}
        >
          Create user
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Fields marked * are required.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            autoComplete="given-name"
            label="First name"
            name="firstName"
            required
          />
          <Field
            autoComplete="additional-name"
            label="Middle name"
            name="middleName"
          />
          <Field autoComplete="family-name" label="Last name" name="lastName" />
          <Field
            autoComplete="email"
            label="Email"
            name="email"
            required
            type="email"
          />
          <Field
            autoComplete="new-password"
            label="Password"
            name="password"
            required
            type="password"
          />
          <Field autoComplete="tel" label="Phone" name="phone" type="tel" />
          <Field label="Employee code" name="employeeCode" />
          <Field label="Department" name="department" />
          <Field label="Designation" name="designation" />
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">
            Role
            <select className={inputClassName} defaultValue="user" name="role">
              {userRoles.map((role) => (
                <option className="capitalize" key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">
            Status
            <select
              className={inputClassName}
              defaultValue="active"
              name="status"
            >
              {userStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {createUser.error ? (
          <p
            className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-900"
            role="alert"
          >
            {createUser.error.message}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-on-primary)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-60"
            disabled={createUser.isPending}
            type="submit"
          >
            {createUser.isPending ? "Creating…" : "Create user"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
