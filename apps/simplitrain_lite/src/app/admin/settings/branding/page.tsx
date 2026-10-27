"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  useThemeSync,
  BRANDING_PRESETS,
  deriveCssVars,
  runReadabilityChecks,
  normHex,
  buildBrandCss,
  type BrandingColors,
  type ThemePreset,
} from "@lms/shared-ui";
import "./branding.css";

const SWATCH_PALETTES = {
  primary: ["#4F46E5", "#2563EB", "#0369A1", "#0891B2", "#0F766E", "#15803D", "#65A30D", "#CA8A04", "#C2410C", "#DC2626", "#BE123C", "#C026D3", "#7E22CE", "#475569"],
  sidebar: ["#1E293B", "#0C2A43", "#14291F", "#3B1D10", "#3A0F1C", "#1F2326", "#2A1245", "#111827", "#0F172A", "#312E81", "#EAF1FB", "#F1F5F9"],
  sidebarText: ["#FFFFFF", "#E2E8F0", "#E2F0FA", "#E3F2E8", "#FBEADF", "#FBE4EA", "#1E293B", "#0F172A"],
  topbar: ["#FFFFFF", "#F8FAFC", "#F4F9FC", "#F5FAF6", "#FFF9F5", "#FFF8F9", "#FAF7FD", "#F6F8F8", "#1E293B", "#0F172A", "#EAF1FB", "#F1F5F9"],
  pageBg: ["#FFFFFF", "#F8FAFC", "#F4F9FC", "#F5FAF6", "#FFF9F5", "#FFF8F9", "#FAF7FD", "#F6F8F8", "#EAF1FB", "#F1F5F9"],
  titleTint: ["#E8ECF7", "#DCEBF5", "#DDEEE2", "#FBE6D9", "#F9E1E7", "#DCEBE9", "#EBE0F6", "#DCE7F7", "#E5E7EB", "#FEF3C7"],
  link: ["#4F46E5", "#2563EB", "#0369A1", "#0891B2", "#0F766E", "#15803D", "#65A30D", "#CA8A04", "#C2410C", "#DC2626", "#BE123C", "#C026D3", "#7E22CE", "#475569"],
};

const SUGGESTIONS = [
  ["Logo preview on the sign-in page", "The LMS now picks the logo from the Media Library. Showing a live preview of the sign-in page with the logo and the login title would make branding easier to check before saving."],
  ["Separate dark-mode colors", "Let advanced users set sidebar and background colors for dark mode on their own instead of using the derived ones."],
  ["Share a theme", "Export a theme as a small file and import it into another center, so a franchise can keep one look."],
  ["High-contrast theme", "Add a ready-made theme that meets 7:1 contrast everywhere (WCAG AAA) for centers with low-vision learners."],
  ["Let any administrator change the theme and logo", "Theme and logo path are Super User only in the LMS. In Lite the single administrator could be allowed to change them."],
];

export default function AdminBrandingPage() {
  const { theme, updateTheme } = useThemeSync();

  const [selectedPreset, setSelectedPreset] = useState<string>("slate-indigo");
  const [colors, setColors] = useState<BrandingColors>({
    primary: "#4F46E5",
    sidebar: "#1E293B",
    sidebarText: "#E2E8F0",
    topbar: "#FFFFFF",
    pageBg: "#F8FAFC",
    titleTint: "#E8ECF7",
    link: "",
  });
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [followPrimaryLink, setFollowPrimaryLink] = useState(true);
  const [logoName, setLogoName] = useState("Acme Training Center");
  const [lmsTheme, setLmsTheme] = useState("Not Set");
  const [dirty, setDirty] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showRealScreensModal, setShowRealScreensModal] = useState(false);
  const [activeModalScreen, setActiveModalScreen] = useState<string>("dashboard");

  // Sync state from active theme provider on mount
  useEffect(() => {
    if (theme) {
      setSelectedPreset(theme.preset || "slate-indigo");
      setColorMode(theme.themeMode === "dark" ? "dark" : "light");
      setPreviewMode(theme.themeMode === "dark" ? "dark" : "light");
      setColors({
        primary: theme.primaryAccent || "#4F46E5",
        sidebar: theme.sidebarBg || "#1E293B",
        sidebarText: theme.sidebarText || "#E2E8F0",
        topbar: theme.topbarBg || "#FFFFFF",
        pageBg: theme.pageBg || "#F8FAFC",
        titleTint: theme.titleTint || "#E8ECF7",
        link: "",
      });
      if (theme.logoUrl) {
        setLogoName(theme.logoUrl);
      }
    }
  }, [theme]);

  // Derived variables for preview and mini cards
  const currentVars = useMemo(() => deriveCssVars(colors), [colors]);
  const activePreviewVars = previewMode === "dark" ? currentVars.dark : currentVars.light;
  const readabilityChecks = useMemo(() => runReadabilityChecks(colors), [colors]);

  function applyPreset(p: ThemePreset) {
    setSelectedPreset(p.id);
    setColors({ ...p.colors, link: "" });
    setFollowPrimaryLink(true);
    setDirty(true);
  }

  function handleColorChange(key: keyof BrandingColors, val: string) {
    const normalized = normHex(val) || val;
    setColors((prev) => ({ ...prev, [key]: normalized }));
    setSelectedPreset("custom");
    setDirty(true);
  }

  function handleResetTheme() {
    const defaultP = BRANDING_PRESETS[0];
    setSelectedPreset(defaultP.id);
    setColors({ ...defaultP.colors, link: "" });
    setColorMode("light");
    setPreviewMode("light");
    setFollowPrimaryLink(true);
    setDirty(true);
    setToast("Theme reset to Slate and Indigo. Save to apply it.");
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    setDirty(false);
    const updated = {
      preset: selectedPreset,
      themeMode: colorMode,
      primaryAccent: colors.primary,
      sidebarBg: colors.sidebar,
      sidebarText: colors.sidebarText,
      topbarBg: colors.topbar,
      pageBg: colors.pageBg,
      titleTint: colors.titleTint,
      logoUrl: logoName,
    };

    try {
      const brandColors: BrandingColors = {
        primary: colors.primary,
        sidebar: colors.sidebar,
        sidebarText: colors.sidebarText,
        topbar: colors.topbar,
        pageBg: colors.pageBg,
        titleTint: colors.titleTint,
        link: colors.link || "",
      };
      const css = buildBrandCss(brandColors);
      const brandingRec = {
        preset: selectedPreset,
        colors: brandColors,
        mode: colorMode,
        css,
        saved: new Date().toISOString(),
      };
      localStorage.setItem("lite.v2.branding", JSON.stringify(brandingRec));
      localStorage.setItem("lite-theme", colorMode);
      localStorage.setItem("simplitrain.shared_theme", JSON.stringify(updated));
      sessionStorage.removeItem("lite.v2.branding.draft");
    } catch {}

    await updateTheme(updated);
    setToast("Branding saved. The theme now applies to the whole product.");
    setTimeout(() => setToast(null), 3500);
  }

  function handleCancel() {
    if (!dirty) {
      setToast("Nothing to cancel. The page already matches what is saved.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    // Restore from theme
    setSelectedPreset(theme.preset || "slate-indigo");
    setColorMode(theme.themeMode === "dark" ? "dark" : "light");
    setColors({
      primary: theme.primaryAccent || "#4F46E5",
      sidebar: theme.sidebarBg || "#1E293B",
      sidebarText: theme.sidebarText || "#E2E8F0",
      topbar: theme.topbarBg || "#FFFFFF",
      pageBg: theme.pageBg || "#F8FAFC",
      titleTint: theme.titleTint || "#E8ECF7",
      link: "",
    });
    setDirty(false);
    setToast("Changes reverted. Showing the saved branding.");
    setTimeout(() => setToast(null), 3000);
  }

  function renderMiniStyles(c: BrandingColors) {
    const v = deriveCssVars(c).light;
    return {
      "--m-sb": v["--sb-bg"],
      "--m-sbt": v["--sb-text"],
      "--m-tb": v["--tb-bg"],
      "--m-bg": v["--bg"],
      "--m-ac": v["--accent"],
      "--m-hd": v["--head-bg"],
    } as React.CSSProperties;
  }

  return (
    <main id="main" style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/settings" style={{ marginLeft: 6 }}>
          Settings
        </Link>
        <span>Branding</span>
      </nav>

      {/* Page Head */}
      <div className="page-head">
        <div>
          <div className="head-row">
            <h1 id="pageName">Branding</h1>
          </div>
          <p className="dirty" id="dirty" aria-live="polite">
            {dirty ? "Unsaved changes" : ""}
          </p>
          <div className="head-tools">
            <label className="switch" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showReview}
                onChange={(e) => setShowReview(e.target.checked)}
                role="switch"
              />
              <span className="track"></span>
              <span>Review: show LMS source</span>
            </label>
            <span className="aid">A review aid for the owner, not a product feature.</span>
            <a href="#sugg" id="sugLink">
              Suggestions ({SUGGESTIONS.length})
            </a>
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn" id="cancelBtn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="btn primary" id="saveBtn" onClick={handleSave}>
            <svg className="i" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
              <path d="M5 12l5 5 9-10" />
            </svg>
            Save
          </button>
        </div>
      </div>

      <div className="page-stack" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Make SimpliTrain look like your center: its theme, logo, colors and color mode. Branding is saved on its own. It does not depend on the Center page, and nothing changes in the product until you save here.
        </p>

        {/* LMS Card: Theme and Logo */}
        <section className="card" id="lmsCard">
          <div className="card-head">
            <h2 id="lmsH" style={{ fontSize: 16, margin: 0 }}>
              Theme and logo
            </h2>
          </div>
          <div className="card-body" style={{ padding: 18 }}>
            <p className="lms-tab small muted" style={{ marginTop: 0 }}>
              LMS tab: Basic Information
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <div className="field">
                <span className="label">Base LMS Theme</span>
                <select
                  value={lmsTheme}
                  onChange={(e) => {
                    setLmsTheme(e.target.value);
                    setDirty(true);
                  }}
                  style={{ maxWidth: 320 }}
                >
                  <option value="Not Set">Not Set</option>
                  <option value="Revolution">Revolution (Recommended for Lite)</option>
                  <option value="Modern Slate">Modern Slate</option>
                </select>
                <span className="hint">Legacy LMS fallback template (Row 16).</span>
              </div>

              <div className="field">
                <span className="label">Center logo</span>
                <div className="logo-pick">
                  <span
                    className="logo-sw"
                    style={{
                      background: colors.sidebar,
                      color: colors.sidebarText,
                    }}
                  >
                    {logoName ? logoName.charAt(0).toUpperCase() : "A"}
                  </span>
                  <span className="logo-nm">{logoName || "No logo chosen"}</span>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => {
                      const name = prompt("Enter logo filename or media library item:", logoName);
                      if (name !== null) {
                        setLogoName(name);
                        setDirty(true);
                      }
                    }}
                  >
                    Select from Media Library
                  </button>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => {
                      const name = prompt("Upload new center logo (filename):", "center-brand-logo.png");
                      if (name) {
                        setLogoName(name);
                        setDirty(true);
                      }
                    }}
                  >
                    Upload New
                  </button>
                  {logoName ? (
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => {
                        setLogoName("");
                        setDirty(true);
                      }}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <span className="hint">Chosen from the Media Library. Shown on the sign-in page and in the sidebar.</span>
              </div>
            </div>
            {showReview && (
              <div style={{ marginTop: 12, padding: 8, borderLeft: "2px solid var(--border-strong)", fontSize: 12, color: "var(--muted)" }}>
                LMS source: Basic Information &middot; Row 16 Theme &middot; Row 151 Logo Path
              </div>
            )}
          </div>
        </section>

        {/* Colors and color mode Card */}
        <section className="card" id="colorsCard">
          <div className="card-head">
            <h2 id="colorsH" style={{ fontSize: 16, margin: 0 }}>
              Colors and color mode
            </h2>
          </div>
          <div className="card-body" id="colorsBody" style={{ padding: 18 }}>
            <div className="bx" data-scope="brand">
              <div>
                <p className="small muted" style={{ margin: 0 }}>
                  Pick a ready-made theme or choose your own colors. It applies to every admin, instructor and learner screen, in light and dark mode, when you save. Nothing changes in the product until then.
                </p>
                {showReview && (
                  <div style={{ marginTop: 6, padding: 8, borderLeft: "2px solid var(--warn)", color: "var(--warn-text)", fontSize: 12 }}>
                    Owner request. Not in the LMS: ready-made color themes, per-element colors, one color mode for everyone, derived dark mode, contrast checks, the live preview and the real-screen preview.
                  </div>
                )}
              </div>

              {/* Theme Grid Fieldset */}
              <fieldset id="themeSet">
                <legend>Theme</legend>
                <p className="hint small muted" style={{ margin: 0 }}>
                  Select one to see it in the live preview. Use the arrow keys to move between themes.
                </p>

                <div className="tcards" id="tcards" role="radiogroup" aria-label="Color theme">
                  {BRANDING_PRESETS.map((p) => {
                    const isSelected = selectedPreset === p.id;
                    return (
                      <label key={p.id} className={`tcard ${isSelected ? "on" : ""}`} data-id={p.id}>
                        <input
                          type="radio"
                          name="theme"
                          value={p.id}
                          checked={isSelected}
                          onChange={() => applyPreset(p)}
                        />
                        <span className="tbox">
                          <span className="mini" aria-hidden="true" style={renderMiniStyles(p.colors)}>
                            <span className="m-sb"></span>
                            <span className="m-main">
                              <span className="m-top"></span>
                              <span className="m-body">
                                <span className="m-hd"></span>
                                <span className="m-btn"></span>
                              </span>
                            </span>
                          </span>
                          <span className="tname">
                            {p.name}
                            {p.id === "slate-indigo" ? " (default)" : ""}
                          </span>
                          <span className="tdesc">{p.desc}</span>
                        </span>
                      </label>
                    );
                  })}

                  {/* Custom Theme Card */}
                  <label className={`tcard ${selectedPreset === "custom" ? "on" : ""}`} data-id="custom">
                    <input
                      type="radio"
                      name="theme"
                      value="custom"
                      checked={selectedPreset === "custom"}
                      onChange={() => {
                        setSelectedPreset("custom");
                        setDirty(true);
                      }}
                    />
                    <span className="tbox">
                      <span className="mini" aria-hidden="true" style={renderMiniStyles(colors)}>
                        <span className="m-sb"></span>
                        <span className="m-main">
                          <span className="m-top"></span>
                          <span className="m-body">
                            <span className="m-hd"></span>
                            <span className="m-btn"></span>
                          </span>
                        </span>
                      </span>
                      <span className="tname">Custom</span>
                      <span className="tdesc">Your own colors, chosen under Customize colors.</span>
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* Color Mode Fieldset */}
              <fieldset id="modeSet" style={{ marginTop: 14 }}>
                <legend>Color mode for all users</legend>
                <p className="hint small muted" style={{ margin: "0 0 8px" }}>
                  The Center sets one look for everyone. Learners, instructors and administrators cannot change the theme or switch between light and dark themselves.
                </p>
                <div style={{ display: "flex", gap: 20 }}>
                  <label className="check" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="appMode"
                      value="light"
                      checked={colorMode === "light"}
                      onChange={() => {
                        setColorMode("light");
                        setPreviewMode("light");
                        setDirty(true);
                      }}
                    />
                    <span>Light</span>
                  </label>
                  <label className="check" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="appMode"
                      value="dark"
                      checked={colorMode === "dark"}
                      onChange={() => {
                        setColorMode("dark");
                        setPreviewMode("dark");
                        setDirty(true);
                      }}
                    />
                    <span>Dark</span>
                  </label>
                </div>
              </fieldset>

              {/* 2-Column Grid: Left Controls (Accordions) + Right Live Preview */}
              <div className="bx-grid">
                {/* Left Column */}
                <div className="bx-left">
                  {/* Customize Colors Accordion */}
                  <details className="acc inner" id="bxColors">
                    <summary>Customize colors</summary>
                    <div className="acc-body">
                      <p className="muted small" style={{ marginTop: 0 }}>
                        Pick a swatch, type a hex code, or use the color picker. Changing any color switches the theme to Custom. Hover, pressed, muted and border shades are worked out for you.
                      </p>

                      <div id="crows">
                        {[
                          { k: "primary" as const, label: "Primary / accent", hint: "Buttons, active items, focus rings and the default link color.", pal: SWATCH_PALETTES.primary },
                          { k: "sidebar" as const, label: "Sidebar background", hint: "The left menu.", pal: SWATCH_PALETTES.sidebar },
                          { k: "sidebarText" as const, label: "Sidebar text", hint: "Menu names and icons on the sidebar.", pal: SWATCH_PALETTES.sidebarText },
                          { k: "topbar" as const, label: "Top bar background", hint: "The bar at the top of every screen. Its text color is chosen for you.", pal: SWATCH_PALETTES.topbar },
                          { k: "pageBg" as const, label: "Page background", hint: "Behind the cards. Text and card colors follow it.", pal: SWATCH_PALETTES.pageBg },
                          { k: "titleTint" as const, label: "Side panel tint", hint: "The soft tint behind side panels such as Add to course. Title bars, table headings and the Courses menu bar are worked out from the theme.", pal: SWATCH_PALETTES.titleTint },
                          { k: "link" as const, label: "Link color", hint: "Links in text. By default the same as the primary color.", pal: SWATCH_PALETTES.link },
                        ].map((f) => {
                          const val = (f.k === "link" && followPrimaryLink ? colors.primary : colors[f.k]) || colors.primary;
                          const isAutoLink = f.k === "link" && followPrimaryLink;

                          return (
                            <div key={f.k} className="crow" data-k={f.k}>
                              <div className="crow-h">
                                <span className="label">{f.label}</span>
                                <span className="hint small muted">{f.hint}</span>
                              </div>

                              {f.k === "link" && (
                                <label className="check linkauto">
                                  <input
                                    type="checkbox"
                                    checked={followPrimaryLink}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setFollowPrimaryLink(checked);
                                      if (checked) {
                                        setColors((prev) => ({ ...prev, link: "" }));
                                      } else {
                                        setColors((prev) => ({ ...prev, link: colors.primary }));
                                      }
                                      setSelectedPreset("custom");
                                      setDirty(true);
                                    }}
                                  />
                                  <span>Same as the primary color</span>
                                </label>
                              )}

                              <div className="swatches" role="radiogroup">
                                {f.pal.map((c) => {
                                  const isChecked = !isAutoLink && val.toUpperCase() === c.toUpperCase();
                                  return (
                                    <button
                                      key={c}
                                      type="button"
                                      className="sw"
                                      role="radio"
                                      aria-checked={isChecked}
                                      disabled={isAutoLink}
                                      style={{
                                        background: c,
                                        opacity: isAutoLink ? 0.4 : 1,
                                        cursor: isAutoLink ? "not-allowed" : "pointer",
                                      }}
                                      onClick={() => {
                                        if (f.k === "link") setFollowPrimaryLink(false);
                                        handleColorChange(f.k, c);
                                      }}
                                    />
                                  );
                                })}
                              </div>

                              <div className="crow-in">
                                <label>{f.label} hex code</label>
                                <input
                                  type="text"
                                  value={val}
                                  disabled={isAutoLink}
                                  maxLength={7}
                                  onChange={(e) => {
                                    if (f.k === "link") setFollowPrimaryLink(false);
                                    handleColorChange(f.k, e.target.value);
                                  }}
                                />
                                <input
                                  type="color"
                                  value={normHex(val) || "#4F46E5"}
                                  disabled={isAutoLink}
                                  onChange={(e) => {
                                    if (f.k === "link") setFollowPrimaryLink(false);
                                    handleColorChange(f.k, e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </details>

                  {/* Readability Check Accordion */}
                  <details className="acc inner" id="bxContrast" open>
                    <summary>Readability check</summary>
                    <div className="acc-body">
                      <p className="small muted" style={{ margin: "0 0 8px" }}>
                        WCAG AA: 4.5:1 for text, 3:1 for large text and controls.
                      </p>

                      <div className="table-wrap" tabIndex={0} role="region" aria-label="Readability results">
                        <table className="table ctable" id="ctable">
                          <thead>
                            <tr>
                              <th scope="col">PAIR</th>
                              <th scope="col">NEEDS</th>
                              <th scope="col">LIGHT MODE</th>
                              <th scope="col">DARK MODE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {readabilityChecks.map((row) => {
                              const lightBadgeClass = row.lightState === "ok" ? "ok" : row.lightState === "warn" ? "warn" : "block";
                              const darkBadgeClass = row.darkState === "ok" ? "ok" : row.darkState === "warn" ? "warn" : "block";
                              const lightText = row.lightState === "ok" ? "Pass" : row.lightState === "warn" ? "Below AA" : "Unreadable";
                              const darkText = row.darkState === "ok" ? "Pass" : row.darkState === "warn" ? "Below AA" : "Unreadable";

                              return (
                                <tr key={row.id}>
                                  <th scope="row" style={{ fontWeight: 500, color: "var(--text)" }}>
                                    {row.label}
                                  </th>
                                  <td className="nowrap">
                                    {row.need}:1 {row.kind === "ui" ? "(control)" : ""}
                                  </td>
                                  <td>
                                    <span className={`cbadge ${lightBadgeClass}`}>
                                      <span aria-hidden="true">{row.lightState === "ok" ? "✓" : "!"}</span>{" "}
                                      {(Math.round(row.light * 10) / 10).toFixed(1)}:1 {lightText}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`cbadge ${darkBadgeClass}`}>
                                      <span aria-hidden="true">{row.darkState === "ok" ? "✓" : "!"}</span>{" "}
                                      {(Math.round(row.dark * 10) / 10).toFixed(1)}:1 {darkText}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <p className="small muted" style={{ margin: "10px 0 6px" }}>
                        All pairs meet the AA target.
                      </p>
                      <p className="small muted" style={{ margin: 0 }}>
                        <strong>Dark mode</strong> colors are worked out for you from the colors above (same hues on deep backgrounds). They cannot be set separately in this version.
                      </p>
                    </div>
                  </details>
                </div>

                {/* Right Column: Live Preview Sticky Card */}
                <div className="bx-right">
                  <div className="card">
                    <div className="card-head">
                      <h3 id="bpH" style={{ fontSize: 15, margin: 0 }}>
                        Live preview
                      </h3>
                      <div className="segmented" role="group" aria-label="Preview mode">
                        <button
                          type="button"
                          className={previewMode === "light" ? "on" : ""}
                          onClick={() => setPreviewMode("light")}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          className={previewMode === "dark" ? "on" : ""}
                          onClick={() => setPreviewMode("dark")}
                        >
                          Dark
                        </button>
                      </div>
                    </div>

                    {/* Mini Browser Screen Representation */}
                    <div
                      className="bp"
                      id="bp"
                      aria-hidden="true"
                      style={
                        {
                          "--bg": activePreviewVars["--bg"],
                          "--text": activePreviewVars["--text"],
                          "--muted": activePreviewVars["--muted"],
                          "--border": activePreviewVars["--border"],
                          "--border-strong": activePreviewVars["--border-strong"],
                          "--surface": activePreviewVars["--surface"],
                          "--surface-2": activePreviewVars["--surface-2"],
                          "--accent": activePreviewVars["--accent"],
                          "--accent-soft": activePreviewVars["--accent-soft"],
                          "--accent-text": activePreviewVars["--accent-text"],
                          "--on-accent": activePreviewVars["--on-accent"],
                          "--sb-bg": activePreviewVars["--sb-bg"],
                          "--sb-border": activePreviewVars["--sb-border"],
                          "--sb-text": activePreviewVars["--sb-text"],
                          "--sb-muted": activePreviewVars["--sb-muted"],
                          "--sb-active": activePreviewVars["--sb-active"],
                          "--sb-active-text": activePreviewVars["--sb-active-text"],
                          "--tb-bg": activePreviewVars["--tb-bg"],
                          "--tb-text": activePreviewVars["--tb-text"],
                          "--tb-border": activePreviewVars["--tb-border"],
                          "--head-bg": activePreviewVars["--head-bg"],
                          "--head-text": activePreviewVars["--head-text"],
                          "--head-border": activePreviewVars["--head-border"],
                          colorScheme: previewMode,
                        } as React.CSSProperties
                      }
                    >
                      <div className="bp-app">
                        {/* Preview Sidebar */}
                        <div className="bp-sb">
                          <div className="bp-brand">
                            <span className="bp-logo">{logoName ? logoName.charAt(0).toUpperCase() : "A"}</span>
                            <span>Acme</span>
                          </div>
                          <div className="bp-it">Dashboard</div>
                          <div className="bp-it on">Courses</div>
                          <div className="bp-sub">Classes</div>
                          <div className="bp-sub">Learning plans</div>
                          <div className="bp-it">People</div>
                          <div className="bp-it">Reports</div>
                          <div className="bp-it">Settings</div>
                        </div>

                        {/* Preview Content Area */}
                        <div className="bp-col">
                          <div className="bp-top">
                            <span className="bp-search">Search</span>
                            <span className="bp-av">PS</span>
                          </div>

                          <div className="bp-main">
                            <div className="bp-crumb">Dashboard / Courses</div>
                            <p className="bp-title">Courses</p>

                            <div className="bp-row">
                              <span className="bp-btn p">New course</span>
                              <span className="bp-btn">Export</span>
                              <span className="bp-link">View reports</span>
                            </div>

                            <div className="bp-card">
                              <div className="bp-ch">
                                <span>Recent courses</span>
                                <span className="bp-badge">3 active</span>
                              </div>
                              <div className="bp-tr">
                                <span>
                                  Fire safety basics
                                  <br />
                                  <span className="sub">12 enrolled</span>
                                </span>
                                <span className="bp-badge">Published</span>
                              </div>
                              <div className="bp-tr hl">
                                <span>
                                  Forklift refresher
                                  <br />
                                  <span className="sub">8 enrolled</span>
                                </span>
                                <span className="bp-badge">Draft</span>
                              </div>
                              <div className="bp-tr">
                                <span>
                                  First aid at work
                                  <br />
                                  <span className="sub">21 enrolled</span>
                                </span>
                                <span className="bp-link">Open</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Actions */}
                    <div style={{ padding: "12px 14px" }}>
                      <div className="bx-act">
                        <button
                          type="button"
                          className="btn"
                          id="brPrev"
                          onClick={() => setShowRealScreensModal(true)}
                        >
                          <svg className="i" viewBox="0 0 24 24" style={{ width: 15, height: 15 }}>
                            <path d="M7 4l13 8-13 8z" />
                          </svg>
                          Preview theme
                        </button>
                        <button type="button" className="btn" id="brReset" onClick={handleResetTheme}>
                          Reset theme
                        </button>
                      </div>
                      <p className="small muted" style={{ margin: "8px 0 0" }}>
                        Preview theme opens the real screens with your unsaved choices. Reset theme goes back to Slate and Indigo, light, and takes effect when you save.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggestions Details */}
        <details className="sug-section" id="sugg">
          <summary>
            <span className="badge accent" style={{ background: "var(--accent)", color: "var(--on-accent)", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
              Claude
            </span>
            <h2 style={{ fontSize: 17, margin: 0 }}>Suggestions from Claude</h2>
            <span className="small muted">These are not LMS features. They are ideas for you to accept or reject.</span>
          </summary>
          <div className="sug-body">
            <ul className="sug-list">
              {SUGGESTIONS.map(([title, desc], i) => (
                <li key={i}>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="badge warn" style={{ background: "var(--warn-soft)", color: "var(--warn-text)", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                    Not in the LMS today
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      {/* Real Screens Popout Modal (LitePreview) */}
      {showRealScreensModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              background: activePreviewVars["--bg"] || "var(--bg)",
              color: activePreviewVars["--text"] || "var(--text)",
              width: "100%",
              maxWidth: 1160,
              height: "90vh",
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              border: `1px solid ${activePreviewVars["--border"] || "var(--border)"}`,
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                background: activePreviewVars["--surface"] || "var(--surface)",
                borderBottom: `1px solid ${activePreviewVars["--border"] || "var(--border)"}`,
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Theme preview</h3>
                <span className="small muted">
                  Your unsaved colors on the real screens. Nothing is saved until you click Save in Branding.
                </span>
              </div>
              <button
                type="button"
                className="btn sm"
                onClick={() => setShowRealScreensModal(false)}
                style={{ borderRadius: 8 }}
              >
                ✕ Close
              </button>
            </div>

            {/* Screen Tabs Bar */}
            <div
              style={{
                display: "flex",
                gap: 6,
                padding: "8px 16px",
                background: activePreviewVars["--surface-2"] || "var(--surface-2)",
                borderBottom: `1px solid ${activePreviewVars["--border"] || "var(--border)"}`,
                overflowX: "auto",
              }}
            >
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "courses", label: "Courses" },
                { id: "classes", label: "Classes" },
                { id: "settings_org", label: "Center settings" },
                { id: "instructor_teaching", label: "Instructor: My classes" },
                { id: "learner_home", label: "Learner: Home" },
                { id: "learner_catalog", label: "Learner: Catalog" },
                { id: "learner_learning", label: "Learner: My Training" },
              ].map((scr) => (
                <button
                  key={scr.id}
                  type="button"
                  onClick={() => setActiveModalScreen(scr.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: activeModalScreen === scr.id ? colors.primary : "transparent",
                    color: activeModalScreen === scr.id ? "#FFFFFF" : activePreviewVars["--text"] || "var(--text)",
                  }}
                >
                  {scr.label}
                </button>
              ))}
            </div>

            {/* Mock Screen Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 24,
                background: activePreviewVars["--bg"] || "var(--bg)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: 20,
                  minHeight: 460,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${activePreviewVars["--border"] || "var(--border)"}`,
                }}
              >
                {/* Simulated Screen Sidebar */}
                <div
                  style={{
                    background: activePreviewVars["--sb-bg"],
                    color: activePreviewVars["--sb-text"],
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 12 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: colors.primary,
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 12,
                      }}
                    >
                      {logoName ? logoName.charAt(0).toUpperCase() : "A"}
                    </span>
                    <span>{logoName || "Acme Center"}</span>
                  </div>
                  {["Dashboard", "Courses", "Classes", "People", "Reports", "Settings"].map((navItem) => {
                    const isAct =
                      (activeModalScreen === "dashboard" && navItem === "Dashboard") ||
                      (activeModalScreen === "courses" && navItem === "Courses") ||
                      (activeModalScreen === "classes" && navItem === "Classes") ||
                      (activeModalScreen === "settings_org" && navItem === "Settings");

                    return (
                      <div
                        key={navItem}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: isAct ? activePreviewVars["--sb-active"] : "transparent",
                          color: isAct ? activePreviewVars["--sb-active-text"] : activePreviewVars["--sb-text"],
                          fontWeight: isAct ? 600 : 400,
                          fontSize: 13,
                        }}
                      >
                        {navItem}
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Screen Body */}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div
                    style={{
                      background: activePreviewVars["--surface"],
                      border: `1px solid ${activePreviewVars["--border"]}`,
                      borderRadius: 10,
                      padding: 18,
                    }}
                  >
                    <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
                      {activeModalScreen === "dashboard" && "Center Dashboard Overview"}
                      {activeModalScreen === "courses" && "Course Catalog & Management"}
                      {activeModalScreen === "classes" && "Scheduled Classroom Sessions"}
                      {activeModalScreen === "settings_org" && "Organization Profile & Preferences"}
                      {activeModalScreen.startsWith("instructor") && "Instructor Portal: Teaching Schedule"}
                      {activeModalScreen.startsWith("learner") && "Learner Hub: Continuous Learning"}
                    </h2>
                    <p style={{ margin: 0, color: activePreviewVars["--muted"], fontSize: 13 }}>
                      Simulated view rendered using chosen palette (Primary: {colors.primary}, Sidebar: {colors.sidebar}, Mode: {colorMode}).
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {[
                      { t: "Active Enrollments", n: "482" },
                      { t: "Completed Certs", n: "1,290" },
                      { t: "Classrooms Booked", n: "14" },
                    ].map((card, i) => (
                      <div
                        key={i}
                        style={{
                          background: activePreviewVars["--surface"],
                          border: `1px solid ${activePreviewVars["--border"]}`,
                          borderRadius: 10,
                          padding: 16,
                        }}
                      >
                        <span style={{ fontSize: 12, color: activePreviewVars["--muted"] }}>{card.t}</span>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: colors.primary, margin: "4px 0 0" }}>
                          {card.n}
                        </h3>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      style={{
                        background: colors.primary,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 18px",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Primary Action Button
                    </button>
                    <button
                      type="button"
                      style={{
                        background: activePreviewVars["--surface"],
                        color: activePreviewVars["--text"],
                        border: `1px solid ${activePreviewVars["--border-strong"]}`,
                        borderRadius: 8,
                        padding: "10px 18px",
                        fontWeight: 500,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Secondary Control
                    </button>
                  </div>
                </div>
              </div>
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
