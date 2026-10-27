"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import "./users.css";

type UserRole = "Learner" | "Instructor" | "Manager" | "Administrator" | "Super User";

type UserItem = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  center: string;
  status: "Active" | "Disabled";
  lastLogin: string;
  created: string;
  timeZone: string;
};

type UserGroupItem = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  created: string;
  type: "Standard" | "Dynamic Smart Cohort";
};

const INITIAL_USERS: UserItem[] = [
  {
    id: "usr-1",
    name: "Priya Shah",
    firstName: "Priya",
    lastName: "Shah",
    username: "pshah",
    email: "priya.shah@acmetraining.com",
    phone: "+1 (555) 234-8891",
    roles: ["Administrator", "Super User"],
    center: "Acme Training Center",
    status: "Active",
    lastLogin: "Today, 10:14 AM",
    created: "10 Jan 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-2",
    name: "Rahul Mehta",
    firstName: "Rahul",
    lastName: "Mehta",
    username: "rmehta",
    email: "rahul.m@acmetraining.com",
    phone: "+1 (555) 345-7712",
    roles: ["Instructor"],
    center: "Acme Training Center",
    status: "Active",
    lastLogin: "Yesterday, 04:30 PM",
    created: "14 Feb 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-3",
    name: "Meera Iyer",
    firstName: "Meera",
    lastName: "Iyer",
    username: "miyer",
    email: "meera.i@acmetraining.com",
    phone: "+1 (555) 456-9923",
    roles: ["Instructor"],
    center: "Boston Campus",
    status: "Active",
    lastLogin: "24 Oct 2026",
    created: "01 Mar 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-4",
    name: "Sana Khan",
    firstName: "Sana",
    lastName: "Khan",
    username: "skhan",
    email: "sana.k@acmetraining.com",
    phone: "+1 (555) 567-1144",
    roles: ["Instructor", "Manager"],
    center: "Acme Training Center",
    status: "Active",
    lastLogin: "23 Oct 2026",
    created: "18 Mar 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-5",
    name: "Arjun Nair",
    firstName: "Arjun",
    lastName: "Nair",
    username: "anair",
    email: "arjun.n@acmetraining.com",
    phone: "+1 (555) 678-2255",
    roles: ["Instructor"],
    center: "Pune Campus",
    status: "Active",
    lastLogin: "21 Oct 2026",
    created: "12 Apr 2025",
    timeZone: "Asia/Kolkata (IST)",
  },
  {
    id: "usr-6",
    name: "Aarav Patel",
    firstName: "Aarav",
    lastName: "Patel",
    username: "apatel",
    email: "aarav.patel@clientcorp.com",
    roles: ["Learner"],
    center: "Acme Training Center",
    status: "Active",
    lastLogin: "Today, 08:45 AM",
    created: "05 May 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-7",
    name: "Ananya Deshmukh",
    firstName: "Ananya",
    lastName: "Deshmukh",
    username: "adeshmukh",
    email: "ananya.d@clientcorp.com",
    roles: ["Learner"],
    center: "Acme Training Center",
    status: "Active",
    lastLogin: "19 Oct 2026",
    created: "12 May 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-8",
    name: "Kabir Verma",
    firstName: "Kabir",
    lastName: "Verma",
    username: "kverma",
    email: "kabir.v@partnertech.com",
    roles: ["Learner", "Manager"],
    center: "Boston Campus",
    status: "Active",
    lastLogin: "15 Oct 2026",
    created: "22 Jun 2025",
    timeZone: "America/New_York (EST)",
  },
  {
    id: "usr-9",
    name: "Diya Roy",
    firstName: "Diya",
    lastName: "Roy",
    username: "droy",
    email: "diya.roy@logistics.net",
    roles: ["Learner"],
    center: "Acme Training Center",
    status: "Disabled",
    lastLogin: "01 Sep 2026",
    created: "10 Jul 2025",
    timeZone: "America/Chicago (CST)",
  },
];

const INITIAL_GROUPS: UserGroupItem[] = [
  {
    id: "grp-1",
    name: "Q4 2026 Warehouse Safety Cohort",
    description: "Operational personnel enrolled in mandatory industrial safety drills.",
    memberCount: 28,
    created: "01 Oct 2026",
    type: "Dynamic Smart Cohort",
  },
  {
    id: "grp-2",
    name: "Executive Management Track",
    description: "Senior leadership members participating in supervisory coaching.",
    memberCount: 14,
    created: "15 Sep 2026",
    type: "Standard",
  },
  {
    id: "grp-3",
    name: "All Instructors and Proctors",
    description: "Certified trainers authorized to record attendance and evaluate assessments.",
    memberCount: 8,
    created: "10 Jan 2025",
    type: "Standard",
  },
];

export default function UsersDirectoryPage() {
  const [activeTab, setActiveTab] = useState<"all" | "learners" | "instructors" | "managers" | "admins" | "groups">("all");

  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [groups, setGroups] = useState<UserGroupItem[]>(INITIAL_GROUPS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [centerFilter, setCenterFilter] = useState("");

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<UserItem | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // User Form fields
  const [formFirst, setFormFirst] = useState("");
  const [formLast, setFormLast] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCenter, setFormCenter] = useState("Acme Training Center");
  const [formStatus, setFormStatus] = useState<"Active" | "Disabled">("Active");
  const [formRoles, setFormRoles] = useState<UserRole[]>(["Learner"]);

  // Group Form fields
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Filtered users by tab and toolbar query
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role tab match
      if (activeTab === "learners" && !u.roles.includes("Learner")) return false;
      if (activeTab === "instructors" && !u.roles.includes("Instructor")) return false;
      if (activeTab === "managers" && !u.roles.includes("Manager")) return false;
      if (activeTab === "admins" && !u.roles.includes("Administrator") && !u.roles.includes("Super User")) return false;

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      // Status & Center match
      const matchesStatus = !statusFilter || u.status === statusFilter;
      const matchesCenter = !centerFilter || u.center === centerFilter;

      return matchesQ && matchesStatus && matchesCenter;
    });
  }, [users, activeTab, searchQuery, statusFilter, centerFilter]);

  function handleOpenUserModal(user?: UserItem) {
    if (user) {
      setEditingUser(user);
      setFormFirst(user.firstName);
      setFormLast(user.lastName);
      setFormUsername(user.username);
      setFormEmail(user.email);
      setFormPhone(user.phone || "");
      setFormCenter(user.center);
      setFormStatus(user.status);
      setFormRoles([...user.roles]);
    } else {
      setEditingUser(null);
      setFormFirst("");
      setFormLast("");
      setFormUsername("");
      setFormEmail("");
      setFormPhone("");
      setFormCenter("Acme Training Center");
      setFormStatus("Active");
      setFormRoles(["Learner"]);
    }
    setShowUserModal(true);
  }

  function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!formFirst.trim() || !formLast.trim() || !formEmail.trim()) return;

    if (editingUser) {
      // Update existing
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === editingUser.id) {
            return {
              ...u,
              firstName: formFirst,
              lastName: formLast,
              name: `${formFirst} ${formLast}`,
              username: formUsername || u.username,
              email: formEmail,
              phone: formPhone,
              center: formCenter,
              status: formStatus,
              roles: formRoles.length ? formRoles : ["Learner"],
            };
          }
          return u;
        })
      );
      showToast(`User ${formFirst} ${formLast} updated.`);
    } else {
      // Create new
      const newUser: UserItem = {
        id: "usr-" + Date.now(),
        firstName: formFirst,
        lastName: formLast,
        name: `${formFirst} ${formLast}`,
        username: formUsername || formEmail.split("@")[0],
        email: formEmail,
        phone: formPhone,
        roles: formRoles.length ? formRoles : ["Learner"],
        center: formCenter,
        status: formStatus,
        lastLogin: "Never",
        created: "Today",
        timeZone: "America/New_York (EST)",
      };
      setUsers([newUser, ...users]);
      showToast(`New user ${newUser.name} created.`);
    }

    setShowUserModal(false);
  }

  function toggleRoleInForm(role: UserRole) {
    if (formRoles.includes(role)) {
      setFormRoles(formRoles.filter((r) => r !== role));
    } else {
      setFormRoles([...formRoles, role]);
    }
  }

  function toggleUserStatus(u: UserItem) {
    const nextStatus = u.status === "Active" ? "Disabled" : "Active";
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`User ${u.name} is now ${nextStatus}`);
    setOpenActionId(null);
  }

  function handleDeleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setShowDeleteModal(null);
    showToast("User removed from center.");
  }

  function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup: UserGroupItem = {
      id: "grp-" + Date.now(),
      name: groupName,
      description: groupDesc || "No description provided.",
      memberCount: 0,
      created: "Today",
      type: "Standard",
    };

    setGroups([...groups, newGroup]);
    setShowGroupModal(false);
    setGroupName("");
    setGroupDesc("");
    showToast(`Cohort group "${newGroup.name}" created.`);
  }

  function handleExportCsv() {
    let csv = "Name,Username,Email,Roles,Center,Status,Last Login,Created\n";
    filteredUsers.forEach((u) => {
      csv += `"${u.name}","${u.username}","${u.email}","${u.roles.join("; ")}","${u.center}","${u.status}","${u.lastLogin}","${u.created}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
    showToast("Users exported to Users.csv");
  }

  function handleSimulateCsvImport() {
    const importedSample: UserItem = {
      id: "import-" + Date.now(),
      name: "Marcus Vance",
      firstName: "Marcus",
      lastName: "Vance",
      username: "mvance",
      email: "marcus.v@imported-staff.com",
      phone: "+1 (555) 789-0011",
      roles: ["Learner"],
      center: "Acme Training Center",
      status: "Active",
      lastLogin: "Never",
      created: "Today (CSV Import)",
      timeZone: "America/New_York (EST)",
    };
    setUsers([importedSample, ...users]);
    setShowImportModal(false);
    showToast("Successfully imported 1 new user from CSV roster.");
  }

  return (
    <main id="main" style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <span>People</span>
        <span>
          {activeTab === "all"
            ? "All users"
            : activeTab === "learners"
            ? "Learners"
            : activeTab === "instructors"
            ? "Instructors"
            : activeTab === "managers"
            ? "Managers"
            : activeTab === "admins"
            ? "Administrators"
            : "User Groups"}
        </span>
      </nav>

      {/* Page Header */}
      <div className="page-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1>People &amp; Users</h1>
            <span
              className="badge"
              style={{ background: "var(--accent-soft)", color: "var(--accent-text)", fontWeight: 700 }}
            >
              {users.length} total users
            </span>
          </div>
          <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
            Directory of all learners, instructors, managers, and administrators across centers.
          </p>
        </div>

        <div className="actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="btn" onClick={() => setShowImportModal(true)}>
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 16V5m0 0l-4 4m4-4l4 4M5 20h14" />
            </svg>
            Import users (CSV)
          </button>
          <button type="button" className="btn" onClick={() => setShowExportModal(true)}>
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
            </svg>
            Export
          </button>
          <button type="button" className="btn primary" onClick={() => handleOpenUserModal()}>
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New user
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--border)",
          marginBottom: 16,
          overflowX: "auto",
        }}
      >
        {[
          { key: "all", label: "All users", count: users.length },
          { key: "learners", label: "Learners", count: users.filter((u) => u.roles.includes("Learner")).length },
          { key: "instructors", label: "Instructors", count: users.filter((u) => u.roles.includes("Instructor")).length },
          { key: "managers", label: "Managers", count: users.filter((u) => u.roles.includes("Manager")).length },
          { key: "admins", label: "Administrators", count: users.filter((u) => u.roles.includes("Administrator") || u.roles.includes("Super User")).length },
          { key: "groups", label: "User Groups", count: groups.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as "all" | "learners" | "instructors" | "managers" | "admins" | "groups")}
              style={{
                padding: "10px 18px",
                border: "none",
                background: "transparent",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                color: isActive ? "var(--accent-text)" : "var(--muted)",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 99,
                  background: isActive ? "var(--accent)" : "var(--surface-2)",
                  color: isActive ? "var(--on-accent)" : "var(--muted)",
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Tab: USERS DIRECTORY */}
      {activeTab !== "groups" ? (
        <section className="card" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          {/* Toolbar */}
          <div className="tb2">
            <div className="search-field">
              <svg className="i" viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "var(--muted)" }}>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search name, e-mail or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: 34, padding: "0 8px", borderRadius: 8, fontSize: 13 }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </label>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <span>Center</span>
              <select
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
                style={{ height: 34, padding: "0 8px", borderRadius: 8, fontSize: 13 }}
              >
                <option value="">All Centers</option>
                <option value="Acme Training Center">Acme Training Center</option>
                <option value="Boston Campus">Boston Campus</option>
                <option value="Pune Campus">Pune Campus</option>
              </select>
            </label>

            {(searchQuery || statusFilter || centerFilter) && (
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setCenterFilter("");
                }}
              >
                Clear filters
              </button>
            )}

            <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>

          {/* Users Table */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Center</th>
                  <th>Status</th>
                  <th>Last login</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
                      No users match these filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const initials = (u.firstName[0] || "") + (u.lastName[0] || "");

                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="name-cell">
                            <span className="user-avatar">{initials}</span>
                            <div>
                              <button
                                type="button"
                                className="cell-main"
                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                                onClick={() => handleOpenUserModal(u)}
                              >
                                {u.name}
                              </button>
                              {u.phone && <div className="cell-sub">{u.phone}</div>}
                            </div>
                          </div>
                        </td>

                        <td>
                          <code style={{ fontSize: 12, background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>
                            {u.username}
                          </code>
                        </td>

                        <td>{u.email}</td>

                        <td>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {u.roles.map((r) => (
                              <span
                                key={r}
                                className={`role-pill ${
                                  r === "Administrator" || r === "Super User"
                                    ? "admin"
                                    : r === "Instructor"
                                    ? "instructor"
                                    : r === "Manager"
                                    ? "manager"
                                    : ""
                                }`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>{u.center}</td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              background: u.status === "Active" ? "var(--success-soft)" : "var(--danger-soft)",
                              color: u.status === "Active" ? "var(--success-text)" : "var(--danger-text)",
                            }}
                          >
                            {u.status}
                          </span>
                        </td>

                        <td className="muted" style={{ fontSize: 12 }}>
                          {u.lastLogin}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <div className="actions-cell">
                            <button type="button" className="btn sm" onClick={() => handleOpenUserModal(u)}>
                              Edit
                            </button>

                            <div style={{ position: "relative" }}>
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setOpenActionId(openActionId === u.id ? null : u.id)}
                                aria-label="More actions"
                              >
                                <svg className="i" viewBox="0 0 24 24">
                                  <circle cx="5" cy="12" r="1.2" />
                                  <circle cx="12" cy="12" r="1.2" />
                                  <circle cx="19" cy="12" r="1.2" />
                                </svg>
                              </button>

                              {openActionId === u.id && (
                                <div className="menu-popover">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast(`Password reset link emailed to ${u.email}`);
                                      setOpenActionId(null);
                                    }}
                                  >
                                    Reset password
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast(`Viewing transcript records for ${u.name}`);
                                      setOpenActionId(null);
                                    }}
                                  >
                                    View learning history
                                  </button>
                                  <button type="button" onClick={() => toggleUserStatus(u)}>
                                    {u.status === "Active" ? "Disable account" : "Activate account"}
                                  </button>
                                  <hr />
                                  <button
                                    type="button"
                                    style={{ color: "var(--danger)" }}
                                    onClick={() => {
                                      setShowDeleteModal(u);
                                      setOpenActionId(null);
                                    }}
                                  >
                                    Delete user
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* Tab 6: USER GROUPS */
        <section className="card" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div className="tb2">
            <span style={{ fontWeight: 600, fontSize: 14 }}>User Cohorts &amp; Smart Groups</span>
            <span className="spacer" />
            <button
              type="button"
              className="btn sm primary"
              onClick={() => setShowGroupModal(true)}
            >
              + Create User Group
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Members</th>
                  <th>Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((grp) => (
                  <tr key={grp.id}>
                    <td>
                      <span className="cell-main">{grp.name}</span>
                    </td>
                    <td className="muted">{grp.description}</td>
                    <td>
                      <span className="badge" style={{ background: "var(--surface-2)" }}>
                        {grp.type}
                      </span>
                    </td>
                    <td>
                      <strong>{grp.memberCount}</strong> users
                    </td>
                    <td className="muted">{grp.created}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => showToast(`Assigning training to ${grp.name}`)}
                        >
                          Assign courses
                        </button>
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => showToast(`Editing group ${grp.name}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal 1: New / Edit User Dialog */}
      {showUserModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 580,
              overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2)",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>
                {editingUser ? `Edit User: ${editingUser.name}` : "Create New User"}
              </h2>
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => setShowUserModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">
                    First Name <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formFirst}
                    onChange={(e) => setFormFirst(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Last Name <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formLast}
                    onChange={(e) => setFormLast(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">Username</label>
                  <input
                    type="text"
                    placeholder="e.g. jdoe"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Email Address <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jdoe@company.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">Center / Organization</label>
                  <select
                    value={formCenter}
                    onChange={(e) => setFormCenter(e.target.value)}
                  >
                    <option value="Acme Training Center">Acme Training Center</option>
                    <option value="Boston Campus">Boston Campus</option>
                    <option value="Pune Campus">Pune Campus</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Assigned Roles</label>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 4 }}>
                  {(["Learner", "Instructor", "Manager", "Administrator"] as UserRole[]).map((r) => (
                    <label key={r} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formRoles.includes(r)}
                        onChange={() => toggleRoleInForm(r)}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="label">Account Status</label>
                <div style={{ display: "flex", gap: 16 }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="uStatus"
                      value="Active"
                      checked={formStatus === "Active"}
                      onChange={() => setFormStatus("Active")}
                    />
                    <span>Active</span>
                  </label>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="uStatus"
                      value="Disabled"
                      checked={formStatus === "Disabled"}
                      onChange={() => setFormStatus("Disabled")}
                    />
                    <span>Disabled (prevent login)</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Bulk CSV Import Dialog */}
      {showImportModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 520,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Import Users from CSV</h2>
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => setShowImportModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Upload a comma-separated values file (.csv) containing columns for <code>First Name, Last Name, Email, Username, Role</code>.
              </p>

              <div
                className="upload-dropzone"
                onClick={handleSimulateCsvImport}
              >
                <svg
                  className="i"
                  viewBox="0 0 24 24"
                  style={{ width: 36, height: 36, color: "var(--accent)", margin: "0 auto 8px", display: "block" }}
                >
                  <path d="M12 16V5m0 0l-4 4m4-4l4 4M5 20h14" />
                </svg>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Click to upload user roster spreadsheet</div>
                <div className="small muted" style={{ marginTop: 4 }}>
                  or click here to test loading sample imported learner
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <button
                  type="button"
                  className="btn sm ghost"
                  onClick={() => showToast("Downloading sample CSV roster template...")}
                >
                  Download template.csv
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Export Dialog */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Export Users List</h2>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Generate a clean CSV spreadsheet with all {filteredUsers.length} filtered users.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn primary" onClick={handleExportCsv}>
                  Download Users.csv
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Delete User Confirmation */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>
                Delete User: {showDeleteModal.name}?
              </h2>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {showDeleteModal.roles.includes("Super User") ? (
                <div
                  style={{
                    background: "var(--danger-soft)",
                    color: "var(--danger-text)",
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  This account is a protected <strong>Super User / Center Administrator</strong> and cannot be deleted.
                </div>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  Are you sure you want to permanently delete <strong>{showDeleteModal.name}</strong> ({showDeleteModal.email})? If they have completed certifications, consider setting their status to <strong>Disabled</strong> instead.
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => setShowDeleteModal(null)}>
                  Cancel
                </button>
                {!showDeleteModal.roles.includes("Super User") && (
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => handleDeleteUser(showDeleteModal.id)}
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Create User Group */}
      {showGroupModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 500,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Create User Cohort Group</h2>
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => setShowGroupModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label className="label">
                  Cohort / Group Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 2026 Leadership Track"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">Cohort Description</label>
                <textarea
                  placeholder="Describe cohort purpose or membership criteria..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowGroupModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Create Group
                </button>
              </div>
            </form>
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
            zIndex: 999999,
            fontWeight: 500,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}
