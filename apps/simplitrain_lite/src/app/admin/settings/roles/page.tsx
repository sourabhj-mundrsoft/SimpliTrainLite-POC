"use client";

import Link from "next/link";
import { useState } from "react";

type RolePermissionCategory = {
  category: string;
  permissions: {
    key: string;
    label: string;
    desc: string;
  }[];
};

const permissionCategories: RolePermissionCategory[] = [
  {
    category: "Courses & Content",
    permissions: [
      { key: "courses.view", label: "View course catalog", desc: "Browse published and draft courses." },
      { key: "courses.edit", label: "Create and edit courses", desc: "Build lessons, update pricing, and modify curriculum." },
      { key: "courses.publish", label: "Publish and archive courses", desc: "Change visibility and catalog listing status." },
      { key: "courses.delete", label: "Delete courses", desc: "Permanently delete courses and associated modules." },
    ],
  },
  {
    category: "Classes & Scheduling",
    permissions: [
      { key: "classes.view", label: "View class runs", desc: "See upcoming sessions and venue allocations." },
      { key: "classes.edit", label: "Schedule and edit classes", desc: "Set dates, seating caps, and assign instructors." },
      { key: "classes.roster", label: "Manage rosters and enrollments", desc: "Add students, approve requests, and process cancellations." },
      { key: "classes.attendance", label: "Mark attendance and completion", desc: "Update student completion status and sign off grades." },
    ],
  },
  {
    category: "Learners & People",
    permissions: [
      { key: "users.view", label: "View user directory", desc: "Access user profiles and contact records." },
      { key: "users.manage", label: "Create and manage users", desc: "Invite new learners, instructors, and managers." },
      { key: "users.roles", label: "Assign roles and permissions", desc: "Grant or revoke administrative permissions." },
    ],
  },
  {
    category: "Reports & Auditing",
    permissions: [
      { key: "reports.view", label: "View reports dashboard", desc: "Analyze sign-in history and attendance summaries." },
      { key: "reports.export", label: "Export CSV and raw analytics", desc: "Download full spreadsheets of learner progress." },
      { key: "reports.financial", label: "View financial orders and revenue", desc: "Access purchase history and billing transactions." },
    ],
  },
  {
    category: "Center Settings & System",
    permissions: [
      { key: "settings.center", label: "Manage Center and Branding", desc: "Change organization name, theme colors, and logo." },
      { key: "settings.integrations", label: "Manage Integrations and API", desc: "Configure Zoom, Teams, Stripe, and SMTP email." },
      { key: "settings.system", label: "System maintenance and cache", desc: "Super-user controls, licensing, and system defaults." },
    ],
  },
];

type RoleDef = {
  id: string;
  name: string;
  desc: string;
  builtin: boolean;
  admin: boolean;
  userCount: number;
  permissions: string[];
};

const initialRoles: RoleDef[] = [
  {
    id: "admin",
    name: "Administrator",
    desc: "Full administrative access across courses, classes, reports, and organization settings.",
    builtin: true,
    admin: true,
    userCount: 4,
    permissions: [
      "courses.view", "courses.edit", "courses.publish", "courses.delete",
      "classes.view", "classes.edit", "classes.roster", "classes.attendance",
      "users.view", "users.manage", "users.roles",
      "reports.view", "reports.export", "reports.financial",
      "settings.center", "settings.integrations", "settings.system",
    ],
  },
  {
    id: "instructor",
    name: "Instructor",
    desc: "Delivers assigned classes, reviews student submissions, and records attendance.",
    builtin: true,
    admin: false,
    userCount: 12,
    permissions: [
      "courses.view",
      "classes.view", "classes.roster", "classes.attendance",
      "users.view",
      "reports.view",
    ],
  },
  {
    id: "manager",
    name: "Team Manager",
    desc: "Oversees learner cohorts, approves enrollment requests, and tracks company team metrics.",
    builtin: true,
    admin: true,
    userCount: 18,
    permissions: [
      "courses.view",
      "classes.view", "classes.roster",
      "users.view",
      "reports.view", "reports.export",
    ],
  },
  {
    id: "learner",
    name: "Learner (Default User)",
    desc: "Self-enrolls in allowed courses, attends class sessions, and downloads certificates.",
    builtin: true,
    admin: false,
    userCount: 420,
    permissions: ["courses.view"],
  },
  {
    id: "coordinator",
    name: "Training Coordinator",
    desc: "Schedules venue rooms, assigns teaching staff, and oversees physical class logistics.",
    builtin: false,
    admin: true,
    userCount: 3,
    permissions: [
      "courses.view", "courses.edit",
      "classes.view", "classes.edit", "classes.roster",
      "users.view",
      "reports.view",
    ],
  },
  {
    id: "auditor",
    name: "Compliance Auditor",
    desc: "Read-only access to verify certificates issued, student rosters, and sign-in logs.",
    builtin: false,
    admin: false,
    userCount: 2,
    permissions: [
      "courses.view",
      "classes.view",
      "reports.view", "reports.export",
    ],
  },
];

export default function RolesSettingsPage() {
  const [roles, setRoles] = useState<RoleDef[]>(initialRoles);
  const [viewMode, setViewMode] = useState<"list" | "edit" | "details">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "builtin" | "custom">("all");

  // Form State
  const [form, setForm] = useState<Partial<RoleDef>>({
    name: "",
    desc: "",
    admin: false,
    builtin: false,
    permissions: [],
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = roles.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || (filterType === "builtin" ? r.builtin : !r.builtin);
    return matchesSearch && matchesType;
  });

  const selectedRole = roles.find((r) => r.id === selectedId);

  function handleStartNew() {
    setForm({
      name: "",
      desc: "",
      admin: false,
      builtin: false,
      permissions: ["courses.view", "classes.view"],
    });
    setSelectedId(null);
    setViewMode("edit");
  }

  function handleStartEdit(r: RoleDef) {
    setForm({ ...r });
    setSelectedId(r.id);
    setViewMode("edit");
  }

  function handleViewDetails(r: RoleDef) {
    setSelectedId(r.id);
    setViewMode("details");
  }

  function togglePermission(key: string) {
    const cur = form.permissions || [];
    if (cur.includes(key)) {
      setForm({ ...form, permissions: cur.filter((k) => k !== key) });
    } else {
      setForm({ ...form, permissions: [...cur, key] });
    }
  }

  function toggleCategory(cat: RolePermissionCategory) {
    const cur = form.permissions || [];
    const catKeys = cat.permissions.map((p) => p.key);
    const allSelected = catKeys.every((k) => cur.includes(k));

    if (allSelected) {
      setForm({ ...form, permissions: cur.filter((k) => !catKeys.includes(k)) });
    } else {
      const merged = Array.from(new Set([...cur, ...catKeys]));
      setForm({ ...form, permissions: merged });
    }
  }

  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;

    if (selectedId) {
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedId ? ({ ...r, ...form } as RoleDef) : r))
      );
      setToast(`Updated role "${form.name}".`);
    } else {
      const newRole: RoleDef = {
        ...(form as RoleDef),
        id: `role-${Date.now().toString().slice(-4)}`,
        builtin: false,
        userCount: 0,
      };
      setRoles((prev) => [newRole, ...prev]);
      setToast(`Created new role "${newRole.name}".`);
    }

    setTimeout(() => setToast(null), 3500);
    setViewMode("list");
  }

  function handleDeleteRole(id: string) {
    const target = roles.find((r) => r.id === id);
    if (target?.builtin) {
      setToast("Built-in system roles cannot be deleted.");
      setTimeout(() => setToast(null), 3000);
      setDeleteConfirmId(null);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
    if (viewMode !== "list") setViewMode("list");
    setToast(`Deleted role "${target?.name || id}".`);
    setTimeout(() => setToast(null), 3000);
  }

  function exportCSV() {
    const headers = ["Name,Type,Administrative,AssignedUsers,Description,PermissionsCount"];
    const rows = roles.map(
      (r) =>
        `"${r.name}","${r.builtin ? "Built-in" : "Custom"}","${r.admin ? "Yes" : "No"}",${r.userCount},"${r.desc}",${r.permissions.length}`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "UserRoles.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Exported UserRoles.csv");
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="roles-page" style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/settings" style={{ marginLeft: 6 }}>
          Settings
        </Link>
        {viewMode !== "list" ? (
          <>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              style={{ background: "none", border: "none", color: "var(--accent-text)", cursor: "pointer", marginLeft: 6 }}
            >
              Roles & permissions
            </button>
            <span>{viewMode === "edit" ? (selectedId ? "Edit role" : "New role") : (selectedRole?.name || "Role details")}</span>
          </>
        ) : (
          <span>Roles and permissions</span>
        )}
      </nav>

      {/* ===================== LIST VIEW ===================== */}
      {viewMode === "list" && (
        <>
          <div className="page-head">
            <div>
              <div className="head-row">
                <h1>Roles and permissions</h1>
                <span className="badge info" style={{ marginLeft: 8 }}>
                  {roles.length} roles defined
                </span>
              </div>
              <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
                Determine what each user type can view and execute. Four roles come built-in; you can create custom ones.
              </p>
            </div>
            <div className="actions" style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn" onClick={exportCSV}>
                <svg className="i" viewBox="0 0 24 24" style={{ width: 15, height: 15 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={handleStartNew}
                style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
              >
                + New role
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div
            className="card"
            style={{
              padding: "12px 16px",
              marginBottom: 16,
              borderRadius: 10,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                type="search"
                placeholder="Search by role name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="small muted">Role Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  background: "var(--surface)",
                }}
              >
                <option value="all">All roles</option>
                <option value="builtin">Built-in only</option>
                <option value="custom">Custom only</option>
              </select>
            </div>
          </div>

          {/* Roles Table */}
          <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Role Name</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Privilege Badges</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Assigned Users</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Permissions</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          type="button"
                          onClick={() => handleViewDetails(r)}
                          style={{
                            background: "none",
                            border: "none",
                            fontWeight: 600,
                            color: "var(--accent-text)",
                            cursor: "pointer",
                            textAlign: "left",
                            padding: 0,
                            fontSize: 14,
                          }}
                        >
                          {r.name}
                        </button>
                        <p className="small muted" style={{ margin: "3px 0 0", maxWidth: 360, fontSize: 12 }}>
                          {r.desc}
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {r.builtin && (
                            <span className="badge" style={{ background: "#e2e8f0", color: "#334155", fontSize: 11 }}>
                              Built-in
                            </span>
                          )}
                          {r.admin && (
                            <span className="badge accent" style={{ fontSize: 11 }}>
                              Administrative
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>
                        {r.userCount} users
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--accent-text)" }}>
                          {r.permissions.length} capabilities
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => handleViewDetails(r)}
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => handleStartEdit(r)}
                          >
                            Edit
                          </button>
                          {!r.builtin && (
                            <button
                              type="button"
                              className="btn sm danger"
                              onClick={() => setDeleteConfirmId(r.id)}
                              title="Delete"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ===================== DETAILS VIEW ===================== */}
      {viewMode === "details" && selectedRole && (
        <div>
          <div className="page-head">
            <div>
              <div className="head-row">
                <h1>{selectedRole.name}</h1>
                {selectedRole.builtin && <span className="badge" style={{ marginLeft: 8 }}>Built-in</span>}
                {selectedRole.admin && <span className="badge accent" style={{ marginLeft: 6 }}>Administrative</span>}
              </div>
              <p className="sub" style={{ color: "var(--muted)" }}>User Role Profile</p>
            </div>
            <div className="actions" style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn primary" onClick={() => handleStartEdit(selectedRole)}>
                Edit role
              </button>
              <button type="button" className="btn" onClick={() => setViewMode("list")}>
                ← All roles
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <section className="card" style={{ padding: 20, borderRadius: 10 }}>
              <h2 style={{ fontSize: 16, marginBottom: 12 }}>Role Overview</h2>
              <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>{selectedRole.desc}</p>
              <div style={{ display: "flex", gap: 20, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <div>
                  <div className="small muted">Assigned Members</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{selectedRole.userCount} users</div>
                </div>
                <div>
                  <div className="small muted">Capability Access</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{selectedRole.permissions.length} granted</div>
                </div>
              </div>
            </section>

            <section className="card" style={{ padding: 20, borderRadius: 10 }}>
              <h2 style={{ fontSize: 16, marginBottom: 12 }}>Active Capability Matrix</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
                {permissionCategories.map((cat) => {
                  const activeInCat = cat.permissions.filter((p) => selectedRole.permissions.includes(p.key));
                  if (activeInCat.length === 0) return null;
                  return (
                    <div key={cat.category} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                      <strong style={{ fontSize: 13, color: "var(--text)" }}>{cat.category}</strong>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                        {activeInCat.map((p) => (
                          <span
                            key={p.key}
                            style={{
                              background: "var(--surface-2)",
                              borderRadius: 4,
                              padding: "2px 8px",
                              fontSize: 11,
                              color: "var(--text)",
                            }}
                          >
                            ✓ {p.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ===================== EDIT / CREATE VIEW ===================== */}
      {viewMode === "edit" && (
        <form onSubmit={handleSaveForm}>
          <div className="page-head">
            <div>
              <div className="head-row">
                <h1>{selectedId ? "Edit role" : "New custom role"}</h1>
              </div>
              <p className="sub" style={{ color: "var(--muted)" }}>
                Specify role credentials and toggle granular administrative capabilities.
              </p>
            </div>
            <div className="actions" style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn" onClick={() => setViewMode("list")}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn primary"
                style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
              >
                Save role
              </button>
            </div>
          </div>

          <section className="card" style={{ padding: 20, borderRadius: 10, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Basic role details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field">
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Safety Coordinator"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field" style={{ display: "flex", alignItems: "center", paddingTop: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={form.admin || false}
                    onChange={(e) => setForm({ ...form, admin: e.target.checked })}
                  />
                  <span>Has administrative functions and backend management access</span>
                </label>
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain who receives this role and their primary responsibilities..."
                  value={form.desc || ""}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>
            </div>
          </section>

          {/* Granular Permissions Matrix */}
          <section className="card" style={{ padding: 20, borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16 }}>Permissions & capability matrix</h2>
                <p className="small muted" style={{ marginTop: 2 }}>
                  Check capabilities to grant to users assigned this role.
                </p>
              </div>
              <span className="badge info">
                {(form.permissions || []).length} permissions selected
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {permissionCategories.map((cat) => {
                const catKeys = cat.permissions.map((p) => p.key);
                const cur = form.permissions || [];
                const allSelected = catKeys.every((k) => cur.includes(k));

                return (
                  <div
                    key={cat.category}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 16,
                      background: "var(--surface)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600 }}>{cat.category}</h3>
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => toggleCategory(cat)}
                        style={{ fontSize: 11 }}
                      >
                        {allSelected ? "Clear category" : "Select all in category"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                      {cat.permissions.map((p) => {
                        const isChecked = cur.includes(p.key);
                        return (
                          <label
                            key={p.key}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              cursor: "pointer",
                              padding: 10,
                              borderRadius: 6,
                              background: isChecked ? "var(--surface-2)" : "transparent",
                              border: isChecked ? "1px solid var(--border-strong)" : "1px solid transparent",
                              transition: "all 0.15s",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePermission(p.key)}
                              style={{ marginTop: 2 }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{p.label}</div>
                              <div className="small muted" style={{ fontSize: 11, marginTop: 2 }}>{p.desc}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
          }}
        >
          <div className="card" style={{ padding: 24, maxWidth: 420, width: "90%", borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>Confirm role deletion</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>
              Are you sure you want to delete this custom role? Any users currently assigned this role will revert to the Default User role.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDeleteRole(deleteConfirmId)}
              >
                Delete role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 9999,
            fontWeight: 500,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#22c55e" }}>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
