"use client";

import type { RoleItem } from "../types";
import { SectionCard } from "./ui-fields";

export type RolesTabProps = {
  roles: RoleItem[];
};

export function RolesTab({ roles }: RolesTabProps) {
  return (
    <SectionCard
      title="User Roles & Access Permissions"
      description="System roles determine administrative privileges, catalog editing, and class visibility."
    >
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            <tr>
              <th scope="col" className="px-4 py-3">Role Name</th>
              <th scope="col" className="px-4 py-3">Type</th>
              <th scope="col" className="px-4 py-3">Assigned Users</th>
              <th scope="col" className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-[var(--color-surface-muted)]/50 transition">
                <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                  {role.name}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {role.isBuiltin ? (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        Built-in
                      </span>
                    ) : (
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Custom
                      </span>
                    )}
                    {role.isAdmin ? (
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        Admin Privileges
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                  {role.userCount} users
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                  {role.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
