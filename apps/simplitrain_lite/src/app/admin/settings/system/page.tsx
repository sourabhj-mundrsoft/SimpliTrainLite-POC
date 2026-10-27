"use client";

import Link from "next/link";
import { useState } from "react";

type SystemSection = {
  id: string;
  name: string;
  catId: string;
  description: string;
  icon: string;
};

const allSections: SystemSection[] = [
  {
    id: "site",
    name: "Site and branding status",
    catId: "site",
    description: "Site title, maintenance message, custom CSS overrides.",
    icon: "pin",
  },
  {
    id: "general",
    name: "General preferences",
    catId: "general",
    description: "Default currency, time format, language culture presets.",
    icon: "gear",
  },
  {
    id: "signin",
    name: "Password and sign-in policy",
    catId: "signin",
    description: "Minimum password length, failed login lockout threshold, session timeout.",
    icon: "user",
  },
  {
    id: "classes",
    name: "Class and SCORM defaults",
    catId: "classes",
    description: "Default minimum/maximum capacity, SCORM tracking standards, upload limits.",
    icon: "cal",
  },
  {
    id: "labels",
    name: "Custom slot labels",
    catId: "labels",
    description: "Class Custom 1-5, Company Custom 1-2, and external reference labels.",
    icon: "file",
  },
  {
    id: "licensing",
    name: "Product licensing and seats",
    catId: "licensing",
    description: "Subscription tier, active seats consumed, and license renewal status.",
    icon: "award",
  },
  {
    id: "notifications",
    name: "Notification plans",
    catId: "notif",
    description: "Automated event triggers for enrollment approvals, reminders, and completions.",
    icon: "bell",
  },
  {
    id: "tools",
    name: "System cache and maintenance",
    catId: "tools",
    description: "Clear application cache, reload tenant configurations, API logs.",
    icon: "trash",
  },
];

const railCategories = [
  { id: "site", name: "Site", short: "Site", icon: "pin" },
  { id: "general", name: "General", short: "General", icon: "gear" },
  { id: "signin", name: "Sign-in", short: "Sign-in", icon: "user" },
  { id: "classes", name: "Classes", short: "Classes", icon: "cal" },
  { id: "labels", name: "Labels", short: "Labels", icon: "file" },
  { id: "licensing", name: "Licensing", short: "License", icon: "award" },
  { id: "notif", name: "Notifications", short: "Notify", icon: "bell" },
  { id: "tools", name: "Tools", short: "Tools", icon: "trash" },
];

export default function SystemSettingsPage() {
  const [activeSections, setActiveSections] = useState<string[]>([
    "site",
    "signin",
    "labels",
    "licensing",
    "tools",
  ]);

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    site: true,
    signin: false,
    labels: false,
    licensing: true,
    tools: false,
  });

  // Settings values
  const [values, setValues] = useState({
    siteName: "Acme Training Portal",
    maintenanceMode: false,
    maintenanceMsg: "Scheduled maintenance will take place Sunday 2:00 AM CST.",
    minPasswordLen: 10,
    lockoutAttempts: 5,
    sessionTimeoutMins: 60,
    allowRegistration: true,
    defaultCurrency: "USD ($)",
    defaultClassCap: 25,
    maxUploadMb: 100,
    classCustom1: "Hazard Mitigation Level",
    classCustom2: "Safety Audit Compliance Code",
    companyCustom1: "Billing Cost Center",
    totalSeats: 500,
    usedSeats: 342,
  });

  const [dirty, setDirty] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activePanelCat, setActivePanelCat] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function toggleExpand(secId: string) {
    setExpandedCards((prev) => ({ ...prev, [secId]: !prev[secId] }));
  }

  function updateVal(key: keyof typeof values, val: any) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  function toggleSection(secId: string) {
    setDirty(true);
    if (activeSections.includes(secId)) {
      setActiveSections((prev) => prev.filter((id) => id !== secId));
    } else {
      setActiveSections((prev) => [...prev, secId]);
      setExpandedCards((prev) => ({ ...prev, [secId]: true }));
    }
  }

  function openCategoryPanel(catId: string) {
    setActivePanelCat(catId);
    setPanelOpen(true);
  }

  function handleSave() {
    setDirty(false);
    setToast("System settings saved successfully.");
    setTimeout(() => setToast(null), 3500);
  }

  function handleRevert() {
    setDirty(false);
    setToast("Changes reverted.");
    setTimeout(() => setToast(null), 2500);
  }

  function handleClearCache() {
    setToast("Application cache cleared. Configuration reloaded.");
    setTimeout(() => setToast(null), 3000);
  }

  const categoryItems = activePanelCat
    ? allSections.filter((sec) => sec.catId === activePanelCat)
    : [];

  const activeCategoryDef = railCategories.find((c) => c.id === activePanelCat);

  return (
    <div className="system-page" style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/settings" style={{ marginLeft: 6 }}>
          Settings
        </Link>
        <span>System</span>
      </nav>

      {/* Page Head */}
      <div className="page-head">
        <div>
          <div className="head-row">
            <h1>System</h1>
            <span className="badge" style={{ background: "#e0f2fe", color: "#0284c7", marginLeft: 8 }}>
              Super-User Configuration
            </span>
          </div>
          {dirty && <p className="dirty" style={{ color: "var(--warn)", fontWeight: 500, margin: "4px 0" }}>Unsaved changes</p>}
          <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
            Application-wide defaults, security password policies, seat licensing, and custom slot designations.
          </p>
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={handleRevert}>
            Cancel
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={handleSave}
            style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
          >
            Save settings
          </button>
        </div>
      </div>

      {/* Two-Column Side Rail Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, marginTop: 16 }}>
        {/* Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Card: Site Status */}
          {activeSections.includes("site") && (
            <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                onClick={() => toggleExpand("site")}
                style={{
                  padding: "14px 18px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedCards.site ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Site branding & maintenance mode</span>
                  {values.maintenanceMode && <span className="badge warn">Maintenance ON</span>}
                </div>
                <span>{expandedCards.site ? "▲" : "▼"}</span>
              </div>

              {expandedCards.site && (
                <div style={{ padding: 18, display: "grid", gap: 14 }}>
                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Public Site Title
                    </label>
                    <input
                      type="text"
                      value={values.siteName}
                      onChange={(e) => updateVal("siteName", e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>

                  <div className="field">
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={values.maintenanceMode}
                        onChange={(e) => updateVal("maintenanceMode", e.target.checked)}
                      />
                      <span>Enable Maintenance Mode (locks learner access to courses)</span>
                    </label>
                  </div>

                  {values.maintenanceMode && (
                    <div className="field">
                      <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                        Maintenance Message Displayed to Visitors
                      </label>
                      <input
                        type="text"
                        value={values.maintenanceMsg}
                        onChange={(e) => updateVal("maintenanceMsg", e.target.value)}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Card: Sign-in & Passwords */}
          {activeSections.includes("signin") && (
            <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                onClick={() => toggleExpand("signin")}
                style={{
                  padding: "14px 18px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedCards.signin ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15 }}>Password policy & registration</span>
                <span>{expandedCards.signin ? "▲" : "▼"}</span>
              </div>

              {expandedCards.signin && (
                <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      min={8}
                      max={32}
                      value={values.minPasswordLen}
                      onChange={(e) => updateVal("minPasswordLen", parseInt(e.target.value, 10))}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>

                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Failed Login Lockout Attempts
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={values.lockoutAttempts}
                      onChange={(e) => updateVal("lockoutAttempts", parseInt(e.target.value, 10))}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>

                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Session Idle Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={480}
                      value={values.sessionTimeoutMins}
                      onChange={(e) => updateVal("sessionTimeoutMins", parseInt(e.target.value, 10))}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>

                  <div className="field" style={{ display: "flex", alignItems: "center", paddingTop: 18 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={values.allowRegistration}
                        onChange={(e) => updateVal("allowRegistration", e.target.checked)}
                      />
                      <span>Allow public anonymous self-registration</span>
                    </label>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Card: Custom Slot Labels */}
          {activeSections.includes("labels") && (
            <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                onClick={() => toggleExpand("labels")}
                style={{
                  padding: "14px 18px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedCards.labels ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15 }}>Fixed custom slot labels</span>
                <span>{expandedCards.labels ? "▲" : "▼"}</span>
              </div>

              {expandedCards.labels && (
                <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Class Custom Text Slot 1
                    </label>
                    <input
                      type="text"
                      value={values.classCustom1}
                      onChange={(e) => updateVal("classCustom1", e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>

                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Class Custom Text Slot 2
                    </label>
                    <input
                      type="text"
                      value={values.classCustom2}
                      onChange={(e) => updateVal("classCustom2", e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>

                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Company Custom Slot 1
                    </label>
                    <input
                      type="text"
                      value={values.companyCustom1}
                      onChange={(e) => updateVal("companyCustom1", e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Card: Licensing & Seats */}
          {activeSections.includes("licensing") && (
            <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                onClick={() => toggleExpand("licensing")}
                style={{
                  padding: "14px 18px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedCards.licensing ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Product licensing & seat capacity</span>
                  <span className="badge success">Active License</span>
                </div>
                <span>{expandedCards.licensing ? "▲" : "▼"}</span>
              </div>

              {expandedCards.licensing && (
                <div style={{ padding: 18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
                    <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
                      <div className="small muted">Subscription Tier</div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Enterprise Plus</div>
                    </div>
                    <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
                      <div className="small muted">Seat Utilization</div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                        {values.usedSeats} / {values.totalSeats} seats
                      </div>
                    </div>
                    <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
                      <div className="small muted">License Renewal Date</div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Dec 31, 2026</div>
                    </div>
                  </div>

                  {/* Seat Progress Bar */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span>Capacity Used</span>
                      <span>{Math.round((values.usedSeats / values.totalSeats) * 100)}%</span>
                    </div>
                    <div style={{ width: "100%", height: 10, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${(values.usedSeats / values.totalSeats) * 100}%`,
                          height: "100%",
                          background: "var(--accent, #4F46E5)",
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Card: Tools & Cache */}
          {activeSections.includes("tools") && (
            <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                onClick={() => toggleExpand("tools")}
                style={{
                  padding: "14px 18px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedCards.tools ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15 }}>System cache & diagnostics</span>
                <span>{expandedCards.tools ? "▲" : "▼"}</span>
              </div>

              {expandedCards.tools && (
                <div style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: 14 }}>Clear Application Memory Cache</h3>
                    <p className="small muted" style={{ margin: "4px 0 0" }}>
                      Flushes cached course catalog queries, permissions maps, and tenant branding tokens.
                    </p>
                  </div>
                  <button type="button" className="btn sm danger" onClick={handleClearCache}>
                    Clear Cache Now
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Rail Navigation matching Wireframe */}
        <nav
          className="rail"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 12px",
            height: "fit-content",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: "var(--muted)" }}>
            Add section to page
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {railCategories.map((cat) => {
              const catSections = allSections.filter((s) => s.catId === cat.id);
              const isAdded = catSections.some((s) => activeSections.includes(s.id));

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => openCategoryPanel(cat.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: isAdded ? "var(--accent-soft)" : "transparent",
                    color: isAdded ? "var(--accent-text)" : "var(--text)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 13,
                    fontWeight: isAdded ? 600 : 500,
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>{isAdded ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Drawer Panel */}
      {panelOpen && activeCategoryDef && (
        <div
          role="dialog"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 999,
          }}
        >
          <div
            className="card"
            style={{
              width: 360,
              height: "100%",
              borderRadius: 0,
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16 }}>{activeCategoryDef.name} Sections</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPanelOpen(false)}
                style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
              {categoryItems.map((sec) => {
                const isActive = activeSections.includes(sec.id);
                return (
                  <div
                    key={sec.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 12,
                      background: isActive ? "var(--surface-2)" : "var(--surface)",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{sec.name}</div>
                    <p className="small muted" style={{ margin: "4px 0 8px" }}>{sec.description}</p>
                    <button
                      type="button"
                      className={`btn sm ${isActive ? "danger" : "primary"}`}
                      onClick={() => toggleSection(sec.id)}
                      style={{ fontSize: 11 }}
                    >
                      {isActive ? "Remove from page" : "+ Add to page"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <button
                type="button"
                className="btn primary"
                onClick={() => setPanelOpen(false)}
                style={{ width: "100%", backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
              >
                Done
              </button>
            </div>
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
