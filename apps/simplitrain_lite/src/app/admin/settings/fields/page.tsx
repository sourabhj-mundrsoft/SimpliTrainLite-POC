"use client";

import Link from "next/link";
import { useState } from "react";

type CustomFieldDef = {
  id: string;
  entity: "Class" | "Course" | "User" | "Learning Plan";
  label: string;
  key: string;
  type: "Text" | "Textarea" | "Dropdown" | "Yes/No" | "Number" | "Date";
  required: boolean;
  displayGroup: string;
  options?: string[];
  sortOrder: number;
};

const initialCustomFields: CustomFieldDef[] = [
  {
    id: "cf-1",
    entity: "Class",
    label: "Physical Seating Configuration",
    key: "class_seating_config",
    type: "Dropdown",
    required: false,
    displayGroup: "Logistics",
    options: ["Classroom Pods", "U-Shape Seminar", "Theater Style", "Hands-on Lab"],
    sortOrder: 1,
  },
  {
    id: "cf-2",
    entity: "Class",
    label: "PPE Gear Provided on Arrival",
    key: "class_ppe_provided",
    type: "Yes/No",
    required: true,
    displayGroup: "Safety Requirements",
    sortOrder: 2,
  },
  {
    id: "cf-3",
    entity: "Course",
    label: "IACET CEU Accreditation Number",
    key: "course_iacet_number",
    type: "Text",
    required: false,
    displayGroup: "Compliance & Accreditations",
    sortOrder: 1,
  },
  {
    id: "cf-4",
    entity: "User",
    label: "Emergency Contact Phone",
    key: "user_emergency_phone",
    type: "Text",
    required: true,
    displayGroup: "Emergency Profile",
    sortOrder: 1,
  },
  {
    id: "cf-5",
    entity: "User",
    label: "Dietary Restrictions / Accessibility",
    key: "user_diet_access",
    type: "Dropdown",
    required: false,
    displayGroup: "Catering & Accessibility",
    options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Wheelchair Access Required"],
    sortOrder: 2,
  },
  {
    id: "cf-6",
    entity: "Learning Plan",
    label: "Target Completion Quarter",
    key: "lp_target_quarter",
    type: "Dropdown",
    required: true,
    displayGroup: "Plan Milestones",
    options: ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"],
    sortOrder: 1,
  },
];

type InterestDef = {
  id: string;
  name: string;
  group: string;
  activeLearners: number;
};

const initialInterests: InterestDef[] = [
  { id: "int-1", name: "OSHA & Workplace Safety", group: "Safety & Compliance", activeLearners: 184 },
  { id: "int-2", name: "Hazardous Materials (HAZWOPER)", group: "Safety & Compliance", activeLearners: 92 },
  { id: "int-3", name: "Industrial Forklift & Rigging", group: "Technical Equipment", activeLearners: 74 },
  { id: "int-4", name: "First Aid & CPR Certification", group: "Emergency Preparedness", activeLearners: 210 },
  { id: "int-5", name: "Leadership & Supervisor Training", group: "Professional Development", activeLearners: 65 },
];

const initialGroups = [
  { id: "grp-1", name: "Safety & Compliance", desc: "Core OSHA standards, regulatory hazard training, and workplace inspections." },
  { id: "grp-2", name: "Technical Equipment", desc: "Heavy machinery operations, machinery maintenance, and field certifications." },
  { id: "grp-3", name: "Emergency Preparedness", desc: "Life saving skills, CPR/AED protocols, and evacuation procedures." },
  { id: "grp-4", name: "Professional Development", desc: "Frontline management, team communications, and shift supervision." },
];

export default function CustomFieldsSettingsPage() {
  const [activeTab, setActiveTab] = useState<"fields" | "interests" | "groups">("fields");
  const [entityFilter, setEntityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [fields, setFields] = useState<CustomFieldDef[]>(initialCustomFields);
  const [interests, setInterests] = useState<InterestDef[]>(initialInterests);
  const [groups, setGroups] = useState(initialGroups);

  // Field Drawer / Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState<Partial<CustomFieldDef>>({
    entity: "Class",
    label: "",
    key: "",
    type: "Text",
    required: false,
    displayGroup: "General Information",
    sortOrder: 1,
    options: [],
  });
  const [optionInput, setOptionInput] = useState("");

  // Interest Modal
  const [intModalOpen, setIntModalOpen] = useState(false);
  const [intName, setIntName] = useState("");
  const [intGroup, setIntGroup] = useState(groups[0]?.name || "Safety & Compliance");

  const [toast, setToast] = useState<string | null>(null);

  const filteredFields = fields.filter((f) => {
    const matchesEntity = entityFilter === "All" || f.entity === entityFilter;
    const matchesSearch = f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.displayGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  function openCreateField() {
    setFieldForm({
      entity: entityFilter === "All" ? "Class" : (entityFilter as any),
      label: "",
      key: "",
      type: "Text",
      required: false,
      displayGroup: "General Information",
      sortOrder: fields.length + 1,
      options: [],
    });
    setEditingFieldId(null);
    setModalOpen(true);
  }

  function openEditField(f: CustomFieldDef) {
    setFieldForm({ ...f, options: f.options ? [...f.options] : [] });
    setEditingFieldId(f.id);
    setModalOpen(true);
  }

  function handleSaveField(e: React.FormEvent) {
    e.preventDefault();
    if (!fieldForm.label) return;

    if (editingFieldId) {
      setFields((prev) =>
        prev.map((f) => (f.id === editingFieldId ? ({ ...f, ...fieldForm } as CustomFieldDef) : f))
      );
      setToast(`Updated custom field "${fieldForm.label}".`);
    } else {
      const newField: CustomFieldDef = {
        ...(fieldForm as CustomFieldDef),
        id: `cf-${Date.now().toString().slice(-4)}`,
        key: fieldForm.key || fieldForm.label.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      };
      setFields((prev) => [...prev, newField]);
      setToast(`Created custom field "${newField.label}".`);
    }

    setModalOpen(false);
    setTimeout(() => setToast(null), 3000);
  }

  function handleDeleteField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setToast("Deleted custom field.");
    setTimeout(() => setToast(null), 3000);
  }

  function handleAddOption() {
    if (!optionInput.trim()) return;
    const opts = fieldForm.options || [];
    setFieldForm({ ...fieldForm, options: [...opts, optionInput.trim()] });
    setOptionInput("");
  }

  function handleRemoveOption(idx: number) {
    const opts = fieldForm.options || [];
    setFieldForm({ ...fieldForm, options: opts.filter((_, i) => i !== idx) });
  }

  function handleSaveInterest(e: React.FormEvent) {
    e.preventDefault();
    if (!intName) return;
    const newInt: InterestDef = {
      id: `int-${Date.now().toString().slice(-4)}`,
      name: intName,
      group: intGroup,
      activeLearners: 0,
    };
    setInterests([...interests, newInt]);
    setIntName("");
    setIntModalOpen(false);
    setToast(`Added interest "${newInt.name}".`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="custom-fields-page" style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/settings" style={{ marginLeft: 6 }}>
          Settings
        </Link>
        <span>Custom fields & interests</span>
      </nav>

      {/* Page Head */}
      <div className="page-head">
        <div>
          <div className="head-row">
            <h1>Custom fields</h1>
            <span className="badge info" style={{ marginLeft: 8 }}>
              {fields.length} active fields
            </span>
          </div>
          <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
            Extend classes, users, courses, and learning plans with bespoke data slots and learner interest tags.
          </p>
        </div>
        <div className="actions">
          {activeTab === "fields" && (
            <button
              type="button"
              className="btn primary"
              onClick={openCreateField}
              style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
            >
              + Create custom field
            </button>
          )}
          {activeTab === "interests" && (
            <button
              type="button"
              className="btn primary"
              onClick={() => setIntModalOpen(true)}
              style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
            >
              + Add interest
            </button>
          )}
        </div>
      </div>

      {/* Tabs Header matching Wireframe (Custom fields, Interests, Interest groups) */}
      <div
        className="tabs"
        role="tablist"
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginBottom: 20,
          gap: 6,
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "fields"}
          onClick={() => setActiveTab("fields")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: activeTab === "fields" ? "2px solid var(--accent, #4F46E5)" : "2px solid transparent",
            background: "none",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            color: activeTab === "fields" ? "var(--accent-text)" : "var(--muted)",
          }}
        >
          Custom fields
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "interests"}
          onClick={() => setActiveTab("interests")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: activeTab === "interests" ? "2px solid var(--accent, #4F46E5)" : "2px solid transparent",
            background: "none",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            color: activeTab === "interests" ? "var(--accent-text)" : "var(--muted)",
          }}
        >
          Interests ({interests.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "groups"}
          onClick={() => setActiveTab("groups")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: activeTab === "groups" ? "2px solid var(--accent, #4F46E5)" : "2px solid transparent",
            background: "none",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            color: activeTab === "groups" ? "var(--accent-text)" : "var(--muted)",
          }}
        >
          Interest groups ({groups.length})
        </button>
      </div>

      {/* ===================== TAB 1: CUSTOM FIELDS ===================== */}
      {activeTab === "fields" && (
        <div>
          {/* Entity Filter Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["All", "Class", "Course", "User", "Learning Plan"].map((ent) => {
                const isSelected = entityFilter === ent;
                return (
                  <button
                    key={ent}
                    type="button"
                    onClick={() => setEntityFilter(ent)}
                    style={{
                      borderRadius: 99,
                      padding: "5px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isSelected ? "1px solid var(--accent, #4F46E5)" : "1px solid var(--border)",
                      background: isSelected ? "var(--accent-soft)" : "var(--surface)",
                      color: isSelected ? "var(--accent-text)" : "var(--muted)",
                    }}
                  >
                    {ent} Fields
                  </button>
                );
              })}
            </div>

            <div style={{ minWidth: 240 }}>
              <input
                type="search"
                placeholder="Filter by label or display group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* Table */}
          <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Field Label</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Entity</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Type</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Display Group</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Validation</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFields.map((f) => (
                    <tr key={f.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{f.label}</div>
                        <code style={{ fontSize: 11, color: "var(--muted)" }}>{f.key}</code>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className="badge" style={{ fontSize: 11 }}>
                          {f.entity}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: "var(--surface-2)",
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {f.type}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{f.displayGroup}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {f.required ? (
                          <span className="badge warn" style={{ fontSize: 11 }}>Required</span>
                        ) : (
                          <span className="small muted">Optional</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => openEditField(f)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn sm danger"
                            onClick={() => handleDeleteField(f.id)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ===================== TAB 2: INTERESTS ===================== */}
      {activeTab === "interests" && (
        <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <p className="small muted" style={{ margin: 0 }}>
              Interests appear on learner profiles and course tags to drive tailored learning plan recommendations.
            </p>
          </div>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Interest Title</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Group Category</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Followers</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interests.map((it) => (
                <tr key={it.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>{it.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="badge" style={{ fontSize: 11 }}>{it.group}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{it.activeLearners} learners</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn sm danger"
                      onClick={() => setInterests(interests.filter((i) => i.id !== it.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ===================== TAB 3: INTEREST GROUPS ===================== */}
      {activeTab === "groups" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="card"
              style={{ padding: 18, borderRadius: 10, display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{grp.name}</h3>
                <span className="badge info" style={{ fontSize: 11 }}>
                  {interests.filter((i) => i.group === grp.name).length} interests
                </span>
              </div>
              <p className="small muted" style={{ margin: 0 }}>{grp.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Field Create/Edit Modal */}
      {modalOpen && (
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
          <div className="card" style={{ padding: 24, maxWidth: 520, width: "92%", borderRadius: 12, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>
              {editingFieldId ? "Edit Custom Field" : "Create New Custom Field"}
            </h3>

            <form onSubmit={handleSaveField} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Associated Entity *
                </label>
                <select
                  value={fieldForm.entity || "Class"}
                  onChange={(e) => setFieldForm({ ...fieldForm, entity: e.target.value as any })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  <option value="Class">Class</option>
                  <option value="Course">Course</option>
                  <option value="User">User</option>
                  <option value="Learning Plan">Learning Plan</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Field Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physical Seating Configuration"
                  value={fieldForm.label || ""}
                  onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Field Data Type *
                </label>
                <select
                  value={fieldForm.type || "Text"}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as any })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  <option value="Text">Single-line Text</option>
                  <option value="Textarea">Multi-line Textarea</option>
                  <option value="Dropdown">Dropdown Selection</option>
                  <option value="Yes/No">Yes/No Checkbox</option>
                  <option value="Number">Numeric Value</option>
                  <option value="Date">Date Picker</option>
                </select>
              </div>

              {/* Options for Dropdown type */}
              {fieldForm.type === "Dropdown" && (
                <div className="field" style={{ border: "1px solid var(--border)", borderRadius: 6, padding: 10 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                    Dropdown Choices
                  </label>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <input
                      type="text"
                      placeholder="Add an option..."
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: "1px solid var(--border)", fontSize: 12 }}
                    />
                    <button type="button" className="btn sm" onClick={handleAddOption}>
                      Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(fieldForm.options || []).map((opt, i) => (
                      <span
                        key={i}
                        style={{
                          background: "var(--surface-2)",
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: 11,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(i)}
                          style={{ border: "none", background: "none", cursor: "pointer", color: "var(--danger)" }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Display Group / Section Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Logistics or Compliance & Accreditations"
                  value={fieldForm.displayGroup || "General Information"}
                  onChange={(e) => setFieldForm({ ...fieldForm, displayGroup: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={fieldForm.required || false}
                    onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
                  />
                  <span>Mark as required field on forms</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" className="btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
                >
                  Save field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Interest Modal */}
      {intModalOpen && (
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
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>Add Learner Interest</h3>
            <form onSubmit={handleSaveInterest} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Interest Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaffolding & Fall Protection"
                  value={intName}
                  onChange={(e) => setIntName(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>
              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Group Category *
                </label>
                <select
                  value={intGroup}
                  onChange={(e) => setIntGroup(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => setIntModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
                >
                  Add interest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
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
