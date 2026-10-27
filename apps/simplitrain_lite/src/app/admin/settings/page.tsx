"use client";

import Link from "next/link";
import { useState } from "react";

type SectionDef = {
  id: string;
  catId: string;
  catName: string;
  name: string;
  description: string;
  icon: string;
};

const allSections: SectionDef[] = [
  // Identity
  {
    id: "identity",
    catId: "identity",
    catName: "Identity",
    name: "Identity details",
    description: "Owner, description, franchise and external IDs, admin notes.",
    icon: "users",
  },
  // Region / Look
  {
    id: "regional",
    catId: "look",
    catName: "Region",
    name: "Culture and time zone",
    description: "Regional culture presets, date format, and primary timezone.",
    icon: "pin",
  },
  {
    id: "logintext",
    catId: "look",
    catName: "Region",
    name: "Login page text",
    description: "Custom heading and external registration button URL.",
    icon: "user",
  },
  // Access
  {
    id: "status",
    catId: "access",
    catName: "Access",
    name: "Status and access",
    description: "Assignable to users, anonymous self-signup, and terms URL.",
    icon: "gear",
  },
  // Catalog
  {
    id: "catalog",
    catId: "catalog",
    catName: "Catalog",
    name: "Course catalog",
    description: "Catalog discovery, course pricing visibility, and catalog title.",
    icon: "book",
  },
  {
    id: "publicsched",
    catId: "catalog",
    catName: "Catalog",
    name: "Public schedule",
    description: "Anonymous access to upcoming course calendar runs.",
    icon: "cal",
  },
  // Classes
  {
    id: "size",
    catId: "classes",
    catName: "Classes",
    name: "Class size and schedule",
    description: "Minimum and maximum seating capacities and recording mode.",
    icon: "clock",
  },
  {
    id: "cancel",
    catId: "classes",
    catName: "Classes",
    name: "Late cancellation",
    description: "Cancellation window days threshold and penalty warning notice.",
    icon: "x",
  },
  {
    id: "hours",
    catId: "classes",
    catName: "Classes",
    name: "Business hours",
    description: "Weekly operation schedule and daily open/close hours.",
    icon: "clock",
  },
  // Contact
  {
    id: "contact",
    catId: "contact",
    catName: "Contact",
    name: "Contact details",
    description: "Support email, telephone, street address, and postal details.",
    icon: "chat",
  },
];

const railCategories = [
  { id: "identity", name: "Identity", short: "Identity", icon: "users" },
  { id: "look", name: "Look and region", short: "Region", icon: "pin" },
  { id: "access", name: "Access", short: "Access", icon: "gear" },
  { id: "catalog", name: "Catalog", short: "Catalog", icon: "book" },
  { id: "classes", name: "Classes", short: "Classes", icon: "cal" },
  { id: "surveys", name: "Surveys and pay", short: "Surveys", icon: "quiz" },
  { id: "contact", name: "Contact and text", short: "Contact", icon: "chat" },
];

function SvgIcon({ name }: { name: string }) {
  switch (name) {
    case "users":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
        </svg>
      );
    case "pin":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "gear":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4.4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
        </svg>
      );
    case "book":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
          <path d="M4 19V5" />
        </svg>
      );
    case "cal":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "clock":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "quiz":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01" />
        </svg>
      );
    case "chat":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z" />
        </svg>
      );
    case "user":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "x":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "trash":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
        </svg>
      );
    case "chev":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M5 12l5 5 9-10" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CenterSettingsPage() {
  // Center basics
  const [centerName, setCenterName] = useState("Acme Training");
  const [centerAbbr, setCenterAbbr] = useState("ACME");

  // Active section cards on page (Matching demo defaults: Identity, Status, and Contact)
  const [activeSections, setActiveSections] = useState<string[]>([
    "identity",
    "status",
    "contact",
  ]);

  // Collapsed / expanded state per card (Matching Image 1: all collapsed by default!)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    identity: false,
    status: false,
    regional: false,
    logintext: false,
    catalog: false,
    size: false,
    cancel: false,
    hours: false,
    contact: false,
  });

  // Section fields state
  type GeneralSettingsValues = {
    owner: string;
    franchiseId: string;
    description: string;
    culture: string;
    timeZone: string;
    loginTitle: string;
    assignable: boolean;
    anonSignup: boolean;
    termsUrl: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    enableCatalog: boolean;
    showPrice: boolean;
    minCap: number;
    maxCap: number;
    recMode: string;
    cancelWindow: number;
    cancelWarning: string;
  };

  const [values, setValues] = useState<GeneralSettingsValues>({
    owner: "Priya Shah",
    franchiseId: "FRAN-042",
    description: "Acme Training delivers compliance and workplace-safety courses to teams in the Midwest.",
    culture: "en-US",
    timeZone: "America/Chicago (CST)",
    loginTitle: "Empowering People to Succeed through Learning",
    assignable: true,
    anonSignup: false,
    termsUrl: "https://www.acmetraining.example/terms",
    email: "hello@acmetraining.example",
    phone: "(555) 014-2200",
    address: "42 Market Street",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    country: "United States",
    enableCatalog: true,
    showPrice: true,
    minCap: 4,
    maxCap: 25,
    recMode: "Automatic",
    cancelWindow: 7,
    cancelWarning: "Are you sure you want to late cancel this enrollment?",
  });

  const [, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Side-panel drawer state
  const [panelOpen, setPanelOpen] = useState(false);
  const [activePanelCat, setActivePanelCat] = useState<string | null>(null);

  // Removal confirmation dialog
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  function toggleExpand(secId: string) {
    setExpandedCards((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  }

  function updateVal<K extends keyof GeneralSettingsValues>(key: K, val: GeneralSettingsValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  function toggleSection(secId: string) {
    setDirty(true);
    if (activeSections.includes(secId)) {
      setActiveSections((prev) => prev.filter((id) => id !== secId));
    } else {
      setActiveSections((prev) => [...prev, secId]);
      // Open panel's new card in collapsed mode
      setExpandedCards((prev) => ({ ...prev, [secId]: false }));
    }
  }

  function openCategoryPanel(catId: string) {
    setActivePanelCat(catId);
    setPanelOpen(true);
  }

  function handleSave() {
    setDirty(false);
    setToast("Center saved. Your sections are saved with the Center.");
    setTimeout(() => setToast(null), 3500);
  }

  function handleRevert() {
    setCenterName("Acme Training");
    setCenterAbbr("ACME");
    setActiveSections(["identity", "status", "contact"]);
    setExpandedCards({ identity: false, status: false, contact: false });
    setDirty(false);
    setToast("Changes reverted.");
    setTimeout(() => setToast(null), 3000);
  }

  const categoryItems = activePanelCat
    ? allSections.filter((sec) => sec.catId === activePanelCat)
    : [];

  const activeCategoryDef = railCategories.find((c) => c.id === activePanelCat);

  return (
    <div className="center-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin/settings">Settings</Link>
        <span id="bcName">Center</span>
      </nav>

      {/* Page Header matching Image 1: Center + Acme Training badge + Cancel + ✓ Save */}
      <div className="page-head">
        <div>
          <div className="head-row">
            <h1>Center</h1>
            <span
              className="badge"
              style={{
                backgroundColor: "#e0f2fe",
                color: "#0284c7",
                borderRadius: "999px",
                padding: "3px 12px",
                fontWeight: 600,
                fontSize: "12px",
                marginLeft: "8px",
              }}
            >
              {centerName || "Acme Training"}
            </span>
          </div>
        </div>

        <div className="actions">
          <button type="button" className="btn" onClick={handleRevert}>
            Cancel
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={handleSave}
            style={{
              backgroundColor: "var(--accent, #4F46E5)",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <SvgIcon name="check" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="cc-layout">
        {/* Left main content column */}
        <div className="cc-main">
          <h2>Center</h2>
          <p>
            Your organization is one Center. Start with its name and abbreviation, then add
            only the sections you need from the side rail. Your choices are saved with the
            Center. Fields are the ones in the LMS.{" "}
            <Link href="/admin/settings/branding">
              Theme, colors and logo are managed on the Branding page
            </Link>
            .
          </p>

          {/* Required Basics: Center Information with dark slate header */}
          <section className="card" id="basics" style={{ overflow: "hidden" }}>
            <div
              className="card-head"
              style={{
                backgroundColor: "var(--th-bg, #2b4360)",
                color: "#ffffff",
                padding: "12px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                Center information
              </h3>
            </div>
            <div className="card-body">
              <p className="muted-line" style={{ marginBottom: 12 }}>
                These are all the LMS requires. It pre-fills the rest.
              </p>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="c-name" className="label req">
                    Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    value={centerName}
                    onChange={(e) => {
                      setCenterName(e.target.value);
                      setDirty(true);
                    }}
                    required
                  />
                  <span className="hint">Up to 150 characters</span>
                </div>

                <div className="field">
                  <label htmlFor="c-abbr" className="label req">
                    Abbreviation
                  </label>
                  <input
                    id="c-abbr"
                    type="text"
                    value={centerAbbr}
                    onChange={(e) => {
                      setCenterAbbr(e.target.value);
                      setDirty(true);
                    }}
                    required
                  />
                  <span className="hint">Up to 50 characters</span>
                </div>
              </div>
            </div>
          </section>

          {/* Dynamic Section Cards (Accordion Collapsible pattern matching Image 1) */}
          <div className="stack" style={{ gap: 14 }}>
            {/* Identity details */}
            {activeSections.includes("identity") ? (
              <section
                className="card item-card"
                id="card-identity"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="card-head"
                  style={{
                    backgroundColor: "var(--th-bg, #2b4360)",
                    color: "#ffffff",
                    padding: "6px 12px 6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: expandedCards.identity ? "12px 12px 0 0" : "12px",
                    borderBottom: expandedCards.identity ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="ch-toggle"
                    aria-expanded={expandedCards.identity}
                    onClick={() => toggleExpand("identity")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: 0,
                      color: "#ffffff",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="ci"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <SvgIcon name="users" />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Identity details</span>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2b4360",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginLeft: "4px",
                      }}
                    >
                      Identity
                    </span>
                    <span
                      className="cv"
                      style={{
                        marginLeft: "auto",
                        transform: expandedCards.identity ? "rotate(90deg)" : "none",
                        transition: "transform 0.15s ease",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <SvgIcon name="chev" />
                    </span>
                  </button>

                  <button
                    type="button"
                    className="icon-btn"
                    title="Remove Identity details"
                    aria-label="Remove section"
                    onClick={() => setPendingRemove("identity")}
                    style={{ color: "#ffffff", opacity: 0.85 }}
                  >
                    <SvgIcon name="trash" />
                  </button>
                </div>

                {expandedCards.identity ? (
                  <div className="card-body">
                    <div className="form-grid">
                      <div className="field">
                        <label className="label">Owner Name</label>
                        <input
                          type="text"
                          value={values.owner}
                          onChange={(e) => updateVal("owner", e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label className="label">Franchise ID</label>
                        <input
                          type="text"
                          value={values.franchiseId}
                          onChange={(e) => updateVal("franchiseId", e.target.value)}
                        />
                      </div>
                      <div className="field full">
                        <label className="label">Description</label>
                        <textarea
                          rows={3}
                          value={values.description}
                          onChange={(e) => updateVal("description", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Status and access */}
            {activeSections.includes("status") ? (
              <section
                className="card item-card"
                id="card-status"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="card-head"
                  style={{
                    backgroundColor: "var(--th-bg, #2b4360)",
                    color: "#ffffff",
                    padding: "6px 12px 6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: expandedCards.status ? "12px 12px 0 0" : "12px",
                    borderBottom: expandedCards.status ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="ch-toggle"
                    aria-expanded={expandedCards.status}
                    onClick={() => toggleExpand("status")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: 0,
                      color: "#ffffff",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="ci"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <SvgIcon name="gear" />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Status and access</span>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2b4360",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginLeft: "4px",
                      }}
                    >
                      Access
                    </span>
                    <span
                      className="cv"
                      style={{
                        marginLeft: "auto",
                        transform: expandedCards.status ? "rotate(90deg)" : "none",
                        transition: "transform 0.15s ease",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <SvgIcon name="chev" />
                    </span>
                  </button>

                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove section"
                    onClick={() => setPendingRemove("status")}
                    style={{ color: "#ffffff", opacity: 0.85 }}
                  >
                    <SvgIcon name="trash" />
                  </button>
                </div>

                {expandedCards.status ? (
                  <div className="card-body">
                    <div className="stack" style={{ gap: 12 }}>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={values.assignable}
                          onChange={(e) => updateVal("assignable", e.target.checked)}
                        />
                        <span>Assignable To Users</span>
                      </label>

                      <label className="check">
                        <input
                          type="checkbox"
                          checked={values.anonSignup}
                          onChange={(e) => updateVal("anonSignup", e.target.checked)}
                        />
                        <span>Enable Anonymous User Registration</span>
                      </label>

                      <div className="field full" style={{ marginTop: 8 }}>
                        <label className="label">Center Terms and Conditions URL</label>
                        <input
                          type="url"
                          value={values.termsUrl}
                          onChange={(e) => updateVal("termsUrl", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Culture and timezone */}
            {activeSections.includes("regional") ? (
              <section
                className="card item-card"
                id="card-regional"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="card-head"
                  style={{
                    backgroundColor: "var(--th-bg, #2b4360)",
                    color: "#ffffff",
                    padding: "6px 12px 6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: expandedCards.regional ? "12px 12px 0 0" : "12px",
                    borderBottom: expandedCards.regional ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="ch-toggle"
                    aria-expanded={expandedCards.regional}
                    onClick={() => toggleExpand("regional")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: 0,
                      color: "#ffffff",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    <span
                      className="ci"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <SvgIcon name="pin" />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Culture and time zone</span>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2b4360",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginLeft: "4px",
                      }}
                    >
                      Region
                    </span>
                    <span
                      className="cv"
                      style={{
                        marginLeft: "auto",
                        transform: expandedCards.regional ? "rotate(90deg)" : "none",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <SvgIcon name="chev" />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Remove Culture and time zone"
                    aria-label="Remove section"
                    onClick={() => setPendingRemove("regional")}
                    style={{ color: "#ffffff", opacity: 0.85 }}
                  >
                    <SvgIcon name="trash" />
                  </button>
                </div>
                {expandedCards.regional ? (
                  <div className="card-body">
                    <div className="form-grid">
                      <div className="field">
                        <label className="label">Culture</label>
                        <select
                          value={values.culture}
                          onChange={(e) => updateVal("culture", e.target.value)}
                        >
                          <option value="en-US">English (United States) en-US</option>
                          <option value="en-GB">English (United Kingdom) en-GB</option>
                          <option value="es-ES">Spanish (Spain) es-ES</option>
                          <option value="de-DE">German (Germany) de-DE</option>
                          <option value="hi-IN">Hindi (India) hi-IN</option>
                        </select>
                      </div>
                      <div className="field">
                        <label className="label">Time Zone</label>
                        <select
                          value={values.timeZone}
                          onChange={(e) => updateVal("timeZone", e.target.value)}
                        >
                          <option value="America/Chicago (CST)">Central Standard Time</option>
                          <option value="America/New_York (EST)">Eastern Standard Time</option>
                          <option value="America/Los_Angeles (PST)">Pacific Standard Time</option>
                          <option value="Europe/London (GMT)">Greenwich Mean Time</option>
                          <option value="Asia/Kolkata (IST)">India Standard Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Course catalog */}
            {activeSections.includes("catalog") ? (
              <section
                className="card item-card"
                id="card-catalog"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <div
                  className="card-head"
                  style={{
                    backgroundColor: "var(--th-bg, #2b4360)",
                    color: "#ffffff",
                    padding: "6px 12px 6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: expandedCards.catalog ? "12px 12px 0 0" : "12px",
                    borderBottom: expandedCards.catalog ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="ch-toggle"
                    aria-expanded={expandedCards.catalog}
                    onClick={() => toggleExpand("catalog")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: 0,
                      color: "#ffffff",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    <span
                      className="ci"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <SvgIcon name="book" />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Course catalog</span>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2b4360",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginLeft: "4px",
                      }}
                    >
                      Catalog
                    </span>
                    <span
                      className="cv"
                      style={{
                        marginLeft: "auto",
                        transform: expandedCards.catalog ? "rotate(90deg)" : "none",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <SvgIcon name="chev" />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove section"
                    onClick={() => setPendingRemove("catalog")}
                    style={{ color: "#ffffff", opacity: 0.85 }}
                  >
                    <SvgIcon name="trash" />
                  </button>
                </div>
                {expandedCards.catalog ? (
                  <div className="card-body">
                    <div className="stack" style={{ gap: 12 }}>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={values.enableCatalog}
                          onChange={(e) => updateVal("enableCatalog", e.target.checked)}
                        />
                        <span>Enable Course Catalog</span>
                      </label>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={values.showPrice}
                          onChange={(e) => updateVal("showPrice", e.target.checked)}
                        />
                        <span>Show Price On Course Catalog</span>
                      </label>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Class size and schedule */}
            {activeSections.includes("size") ? (
              <section
                className="card item-card"
                id="card-size"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <div
                  className="card-head"
                  style={{
                    backgroundColor: "var(--th-bg, #2b4360)",
                    color: "#ffffff",
                    padding: "6px 12px 6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: expandedCards.size ? "12px 12px 0 0" : "12px",
                    borderBottom: expandedCards.size ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="ch-toggle"
                    aria-expanded={expandedCards.size}
                    onClick={() => toggleExpand("size")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: 0,
                      color: "#ffffff",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    <span
                      className="ci"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <SvgIcon name="clock" />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Class size and schedule</span>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2b4360",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginLeft: "4px",
                      }}
                    >
                      Classes
                    </span>
                    <span
                      className="cv"
                      style={{
                        marginLeft: "auto",
                        transform: expandedCards.size ? "rotate(90deg)" : "none",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <SvgIcon name="chev" />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove section"
                    onClick={() => setPendingRemove("size")}
                    style={{ color: "#ffffff", opacity: 0.85 }}
                  >
                    <SvgIcon name="trash" />
                  </button>
                </div>
                {expandedCards.size ? (
                  <div className="card-body">
                    <div className="form-grid">
                      <div className="field">
                        <label className="label">Default Class Minimum Capacity</label>
                        <input
                          type="number"
                          value={values.minCap}
                          min={0}
                          max={999}
                          onChange={(e) => updateVal("minCap", Number(e.target.value))}
                        />
                      </div>
                      <div className="field">
                        <label className="label">Default Class Maximum Capacity</label>
                        <input
                          type="number"
                          value={values.maxCap}
                          min={1}
                          max={999}
                          onChange={(e) => updateVal("maxCap", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Contact details */}
            {activeSections.includes("contact") ? (
              <section
                className="card item-card"
                id="card-contact"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <div
                  className="card-head"
                  style={{
                    backgroundColor: "var(--th-bg, #2b4360)",
                    color: "#ffffff",
                    padding: "6px 12px 6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: expandedCards.contact ? "12px 12px 0 0" : "12px",
                    borderBottom: expandedCards.contact ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="ch-toggle"
                    aria-expanded={expandedCards.contact}
                    onClick={() => toggleExpand("contact")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: 0,
                      color: "#ffffff",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="ci"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <SvgIcon name="chat" />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>Contact details</span>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2b4360",
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginLeft: "4px",
                      }}
                    >
                      Contact
                    </span>
                    <span
                      className="cv"
                      style={{
                        marginLeft: "auto",
                        transform: expandedCards.contact ? "rotate(90deg)" : "none",
                        transition: "transform 0.15s ease",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <SvgIcon name="chev" />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove section"
                    onClick={() => setPendingRemove("contact")}
                    style={{ color: "#ffffff", opacity: 0.85 }}
                  >
                    <SvgIcon name="trash" />
                  </button>
                </div>
                {expandedCards.contact ? (
                  <div className="card-body">
                    <div className="form-grid">
                      <div className="field">
                        <label className="label">E-mail</label>
                        <input
                          type="email"
                          value={values.email}
                          onChange={(e) => updateVal("email", e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label className="label">Phone</label>
                        <input
                          type="text"
                          value={values.phone}
                          onChange={(e) => updateVal("phone", e.target.value)}
                        />
                      </div>
                      <div className="field full">
                        <label className="label">Address</label>
                        <input
                          type="text"
                          value={values.address}
                          onChange={(e) => updateVal("address", e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label className="label">City</label>
                        <input
                          type="text"
                          value={values.city}
                          onChange={(e) => updateVal("city", e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label className="label">State / Province</label>
                        <input
                          type="text"
                          value={values.state}
                          onChange={(e) => updateVal("state", e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label className="label">ZIP Code</label>
                        <input
                          type="text"
                          value={values.zip}
                          onChange={(e) => updateVal("zip", e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label className="label">Country</label>
                        <input
                          type="text"
                          value={values.country}
                          onChange={(e) => updateVal("country", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Empty placeholder if all removed */}
            {activeSections.length === 0 ? (
              <div className="empty-main">
                <h3>No sections added yet</h3>
                <p>Use the side rail to add the sections you need.</p>
                <span className="arrow a-right" aria-hidden="true">
                  →
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Sticky Side Rail ("ADD TO PAGE") matching Image 1 */}
        <nav className="rail" id="rail" aria-labelledby="railH">
          <div className="rail-h" id="railH">
            ADD TO PAGE
          </div>
          {railCategories.map((cat) => {
            const count = allSections.filter(
              (s) => s.catId === cat.id && activeSections.includes(s.id)
            ).length;

            const isExpanded = panelOpen && activePanelCat === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                aria-expanded={isExpanded}
                onClick={() => openCategoryPanel(cat.id)}
              >
                <SvgIcon name={cat.icon} />
                <span className="long">{cat.name}</span>
                <span className="short">{cat.short}</span>
                {count > 0 ? (
                  <span
                    className="cnt"
                    style={{
                      background: "var(--accent, #4F46E5)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Slide-out Flyout Panel backdrop for outside click */}
      {panelOpen ? (
        <div
          className="panel-backdrop"
          onClick={() => setPanelOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            zIndex: 44,
            backdropFilter: "blur(2px)",
          }}
        />
      ) : null}

      {/* Slide-out Flyout Panel ("Add items") */}
      <div
        className={`panel ${panelOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Add items"
      >
        <div className="p-head">
          <div>
            <h2 id="pTitle" tabIndex={-1}>
              {activeCategoryDef ? activeCategoryDef.name : "Add items"}
            </h2>
            <p className="small muted">
              Turn switches on or off to add or remove sections.
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close panel"
            onClick={() => setPanelOpen(false)}
          >
            <SvgIcon name="x" />
          </button>
        </div>

        <ul className="p-list">
          {categoryItems.map((item) => {
            const isAdded = activeSections.includes(item.id);
            return (
              <li key={item.id} className="prow">
                <div className="ti">
                  <SvgIcon name={item.icon} />
                </div>
                <div className="tt">
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </div>
                <button
                  type="button"
                  className="tgl"
                  aria-pressed={isAdded}
                  onClick={() => toggleSection(item.id)}
                >
                  <SvgIcon name={isAdded ? "x" : "check"} />
                  <span>{isAdded ? "Remove" : "Add"}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="p-foot">
          <button
            type="button"
            className="btn primary"
            onClick={() => setPanelOpen(false)}
          >
            Done
          </button>
        </div>
      </div>

      {/* Removal Confirmation Dialog */}
      {pendingRemove ? (
        <div className="overlay open" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="m-head">
              <h2>Remove section?</h2>
            </div>
            <div className="m-body">
              <p className="muted">
                This section will be removed from your Center page view.
              </p>
            </div>
            <div className="m-foot">
              <button
                type="button"
                className="btn"
                onClick={() => setPendingRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => {
                  toggleSection(pendingRemove);
                  setPendingRemove(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Toast notification */}
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
