"use client";

import Link from "next/link";
import { useState } from "react";

type Classroom = {
  id: string;
  name: string;
  center: string;
  capacity: number;
  type: "Physical" | "Virtual";
  address: string;
  city: string;
  state: string;
  zip: string;
  enabled: boolean;
  notes?: string;
  usedInClasses?: number;
};

const initialClassrooms: Classroom[] = [
  {
    id: "loc-101",
    name: "Room 101 · General Industry Lab",
    center: "Acme Training",
    capacity: 24,
    type: "Physical",
    address: "42 Market Street, Suite 200",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    enabled: true,
    usedInClasses: 8,
  },
  {
    id: "loc-102",
    name: "Room 102 · Executive Seminar Suite",
    center: "Acme Training",
    capacity: 18,
    type: "Physical",
    address: "42 Market Street, Suite 210",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    enabled: true,
    usedInClasses: 5,
  },
  {
    id: "loc-v01",
    name: "Virtual Classroom 1 (Zoom High Capacity)",
    center: "Acme Training",
    capacity: 100,
    type: "Virtual",
    address: "https://zoom.us/j/8429104820",
    city: "Online",
    state: "--",
    zip: "--",
    enabled: true,
    usedInClasses: 14,
  },
  {
    id: "loc-204",
    name: "West Annex Heavy Equipment Simulator",
    center: "Acme Training",
    capacity: 12,
    type: "Physical",
    address: "880 Industrial Pkwy",
    city: "Peoria",
    state: "IL",
    zip: "61602",
    enabled: true,
    usedInClasses: 3,
  },
  {
    id: "loc-305",
    name: "Hazmat Practical Containment Bay",
    center: "Acme Training",
    capacity: 16,
    type: "Physical",
    address: "1200 Logistics Way, Bay 4",
    city: "Decatur",
    state: "IL",
    zip: "62521",
    enabled: false,
    usedInClasses: 0,
  },
];

export default function LocationsSettingsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
  const [viewMode, setViewMode] = useState<"list" | "edit" | "details">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "enabled" | "disabled">("all");
  const [filterType, setFilterType] = useState<"all" | "Physical" | "Virtual">("all");

  // Edit / Form state
  const [form, setForm] = useState<Partial<Classroom>>({
    name: "",
    center: "Acme Training",
    capacity: 20,
    type: "Physical",
    address: "",
    city: "",
    state: "IL",
    zip: "",
    enabled: true,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = classrooms.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || (filterStatus === "enabled" ? c.enabled : !c.enabled);
    const matchesType = filterType === "all" || c.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const selectedLoc = classrooms.find((c) => c.id === selectedId);

  function handleStartNew() {
    setForm({
      name: "",
      center: "Acme Training",
      capacity: 20,
      type: "Physical",
      address: "",
      city: "Springfield",
      state: "IL",
      zip: "62701",
      enabled: true,
    });
    setSelectedId(null);
    setViewMode("edit");
  }

  function handleStartEdit(loc: Classroom) {
    setForm({ ...loc });
    setSelectedId(loc.id);
    setViewMode("edit");
  }

  function handleViewDetails(loc: Classroom) {
    setSelectedId(loc.id);
    setViewMode("details");
  }

  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;

    if (selectedId) {
      setClassrooms((prev) =>
        prev.map((c) => (c.id === selectedId ? ({ ...c, ...form } as Classroom) : c))
      );
      setToast(`Updated classroom "${form.name}".`);
    } else {
      const newLoc: Classroom = {
        ...(form as Classroom),
        id: `loc-${Date.now().toString().slice(-4)}`,
        usedInClasses: 0,
      };
      setClassrooms((prev) => [newLoc, ...prev]);
      setToast(`Created new classroom "${newLoc.name}".`);
    }

    setTimeout(() => setToast(null), 3500);
    setViewMode("list");
  }

  function handleDeleteLoc(id: string) {
    const target = classrooms.find((c) => c.id === id);
    setClassrooms((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    if (viewMode !== "list") setViewMode("list");
    setToast(`Deleted classroom "${target?.name || id}".`);
    setTimeout(() => setToast(null), 3000);
  }

  function exportCSV() {
    const headers = ["Name,Center,Capacity,Type,Address,City,State,Zip,Status,Classes"];
    const rows = classrooms.map(
      (c) =>
        `"${c.name}","${c.center}",${c.capacity},"${c.type}","${c.address}","${c.city}","${c.state}","${c.zip}","${c.enabled ? "Enabled" : "Disabled"}",${c.usedInClasses || 0}`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Classrooms.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Exported Classrooms.csv");
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="locations-page" style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
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
              Locations
            </button>
            <span>{viewMode === "edit" ? (selectedId ? "Edit classroom" : "New classroom") : (selectedLoc?.name || "Classroom details")}</span>
          </>
        ) : (
          <span>Locations</span>
        )}
      </nav>

      {/* ===================== LIST VIEW ===================== */}
      {viewMode === "list" && (
        <>
          <div className="page-head">
            <div>
              <div className="head-row">
                <h1>Locations</h1>
                <span className="badge info" style={{ marginLeft: 8 }}>
                  {classrooms.length} venues
                </span>
              </div>
              <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
                The physical classrooms, labs, and virtual meeting rooms where scheduled classes run.
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
                + New classroom
              </button>
            </div>
          </div>

          {/* Filter Bar */}
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
                placeholder="Search by name, room code, or city..."
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
              <span className="small muted">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  background: "var(--surface)",
                }}
              >
                <option value="all">All statuses</option>
                <option value="enabled">Enabled only</option>
                <option value="disabled">Disabled only</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="small muted">Type:</span>
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
                <option value="all">Physical & Virtual</option>
                <option value="Physical">Physical venue</option>
                <option value="Virtual">Virtual room</option>
              </select>
            </div>

            {(searchQuery || filterStatus !== "all" || filterType !== "all") && (
              <button
                type="button"
                className="btn sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterType("all");
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Locations Table */}
          <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Name</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Center</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Type</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Capacity</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Address / Link</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Status</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                        No locations match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((loc) => (
                      <tr
                        key={loc.id}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          transition: "background 0.15s",
                        }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            type="button"
                            onClick={() => handleViewDetails(loc)}
                            style={{
                              background: "none",
                              border: "none",
                              fontWeight: 600,
                              color: "var(--accent-text)",
                              cursor: "pointer",
                              textAlign: "left",
                              padding: 0,
                            }}
                          >
                            {loc.name}
                          </button>
                          <div className="small muted" style={{ fontSize: 11 }}>
                            Active in {loc.usedInClasses} scheduled classes
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{loc.center}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            className="badge"
                            style={{
                              background: loc.type === "Virtual" ? "#e0f2fe" : "#f1f5f9",
                              color: loc.type === "Virtual" ? "#0369a1" : "#475569",
                              fontSize: 11,
                            }}
                          >
                            {loc.type}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>
                          {loc.capacity} seats
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {loc.type === "Virtual" ? (
                            <a href={loc.address} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)" }}>
                              {loc.address}
                            </a>
                          ) : (
                            `${loc.address}, ${loc.city}`
                          )}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            className={`badge ${loc.enabled ? "success" : "warn"}`}
                            style={{ fontSize: 11 }}
                          >
                            {loc.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 6 }}>
                            <button
                              type="button"
                              className="btn sm"
                              onClick={() => handleViewDetails(loc)}
                              title="Details"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              className="btn sm"
                              onClick={() => handleStartEdit(loc)}
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn sm danger"
                              onClick={() => setDeleteConfirmId(loc.id)}
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ===================== DETAILS VIEW ===================== */}
      {viewMode === "details" && selectedLoc && (
        <div>
          <div className="page-head">
            <div>
              <div className="head-row">
                <h1>{selectedLoc.name}</h1>
                <span className={`badge ${selectedLoc.enabled ? "success" : "warn"}`} style={{ marginLeft: 8 }}>
                  {selectedLoc.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="sub" style={{ color: "var(--muted)" }}>Classroom Profile</p>
            </div>
            <div className="actions" style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn primary" onClick={() => handleStartEdit(selectedLoc)}>
                Edit classroom
              </button>
              <button type="button" className="btn" onClick={() => setViewMode("list")}>
                ← All classrooms
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
            <section className="card" style={{ padding: 20, borderRadius: 10 }}>
              <h2 style={{ fontSize: 16, marginBottom: 14 }}>Profile Overview</h2>
              <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 12, margin: 0 }}>
                <dt style={{ color: "var(--muted)", fontWeight: 500 }}>Center</dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>{selectedLoc.center}</dd>

                <dt style={{ color: "var(--muted)", fontWeight: 500 }}>Seating Capacity</dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>{selectedLoc.capacity} seats</dd>

                <dt style={{ color: "var(--muted)", fontWeight: 500 }}>Location Type</dt>
                <dd style={{ margin: 0 }}>{selectedLoc.type}</dd>

                <dt style={{ color: "var(--muted)", fontWeight: 500 }}>Location / Address</dt>
                <dd style={{ margin: 0 }}>
                  {selectedLoc.address}
                  {selectedLoc.city && `, ${selectedLoc.city}, ${selectedLoc.state} ${selectedLoc.zip}`}
                </dd>

                <dt style={{ color: "var(--muted)", fontWeight: 500 }}>Status</dt>
                <dd style={{ margin: 0 }}>{selectedLoc.enabled ? "Available for scheduling" : "Disabled from scheduling"}</dd>
              </dl>
            </section>

            <section className="card" style={{ padding: 20, borderRadius: 10 }}>
              <h2 style={{ fontSize: 16, marginBottom: 14 }}>Where this classroom is used</h2>
              <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <li>
                  <strong>Class schedule:</strong> Currently assigned to <strong>{selectedLoc.usedInClasses}</strong> upcoming class runs.
                </li>
                <li>
                  <strong>Course enrollments:</strong> Set as primary venue for OSHA 30-Hour General Industry.
                </li>
                <li>
                  <strong>Equipment:</strong> A/V Projector, 12 PC Terminals, Emergency eyewash station.
                </li>
              </ul>
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
                <h1>{selectedId ? "Edit classroom" : "New classroom"}</h1>
              </div>
              <p className="sub" style={{ color: "var(--muted)" }}>
                Start with the required fields. Add additional location specifications as needed.
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
                Save classroom
              </button>
            </div>
          </div>

          <section className="card" style={{ padding: 20, borderRadius: 10, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Classroom details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <div className="field">
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  Classroom Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 101 · Industrial Safety Lab"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  Center
                </label>
                <input
                  type="text"
                  disabled
                  value={form.center || "Acme Training"}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  Location Type
                </label>
                <select
                  value={form.type || "Physical"}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  <option value="Physical">Physical Venue / Room</option>
                  <option value="Virtual">Virtual Classroom Link</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  Max Seating Capacity *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={500}
                  value={form.capacity || 20}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value, 10) || 1 })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
                  {form.type === "Virtual" ? "Meeting URL / Join Link *" : "Street Address *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={form.type === "Virtual" ? "https://zoom.us/j/..." : "42 Market Street, Suite 200"}
                  value={form.address || ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              {form.type === "Physical" && (
                <>
                  <div className="field">
                    <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>City</label>
                    <input
                      type="text"
                      value={form.city || ""}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>State / Province</label>
                    <input
                      type="text"
                      value={form.state || ""}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ display: "block", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>Postal / Zip Code</label>
                    <input
                      type="text"
                      value={form.zip || ""}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>
                </>
              )}

              <div className="field" style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={form.enabled !== false}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  />
                  <span>Classroom is enabled for scheduling</span>
                </label>
              </div>
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
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>Confirm classroom deletion</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>
              Are you sure you want to delete this classroom? Any historical class records will retain the archived name.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="btn" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDeleteLoc(deleteConfirmId)}
              >
                Delete permanently
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
