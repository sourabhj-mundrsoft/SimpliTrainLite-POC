"use client";

import Link from "next/link";
import { useState } from "react";

type PageComponent = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  btnText?: string;
  btnUrl?: string;
  badge?: string;
  items?: string[];
};

const defaultComponents: PageComponent[] = [
  {
    id: "hero-1",
    type: "hero",
    title: "Master New Skills with Acme Training",
    subtitle: "Accredited workplace safety, industrial compliance, and leadership certifications tailored for forward-thinking teams.",
    btnText: "Explore Courses",
    btnUrl: "/catalog",
    badge: "Industry Certified LMS",
  },
  {
    id: "stats-1",
    type: "stats",
    title: "Proven Results for Over a Decade",
    subtitle: "Over 45,000 learners empowered across 250 enterprise organizations.",
    items: ["45,000+ Certified Learners", "98.7% Pass Rate", "140+ Industry Courses"],
  },
  {
    id: "courses-1",
    type: "courses",
    title: "Popular & Upcoming Classes",
    subtitle: "Guaranteed-to-run sessions available in-person and via live virtual classroom.",
    items: ["OSHA 30-Hour General Industry", "Hazardous Materials Operations", "Forklift & Heavy Equipment Safety"],
  },
  {
    id: "testimonials-1",
    type: "testimonials",
    title: "What Training Directors Say",
    subtitle: "“Acme Training transformed our compliance audit readiness from day one.” — Sarah Jenkins, Safety VP",
  },
  {
    id: "cta-1",
    type: "cta",
    title: "Ready to Upgrade Your Workforce Safety?",
    subtitle: "Talk with our curriculum advisors to schedule customized on-site or virtual classes.",
    btnText: "Contact Advisory Team",
    btnUrl: "/contact",
  },
];

const availablePalette = [
  {
    type: "hero",
    title: "Hero Banner",
    desc: "Eye-catching introduction with prominent title, subtitle, and primary call to action.",
    icon: "🌟",
  },
  {
    type: "courses",
    title: "Course Grid",
    desc: "Interactive catalog showcases top courses with seat availability and dates.",
    icon: "📚",
  },
  {
    type: "stats",
    title: "Key Metrics / Stats",
    desc: "Highlight completion rates, total graduates, and credential achievements.",
    icon: "📊",
  },
  {
    type: "features",
    title: "Feature Columns",
    desc: "Three-column grid showcasing benefits, accreditation, and flexible delivery.",
    icon: "✨",
  },
  {
    type: "testimonials",
    title: "Testimonials",
    desc: "Social proof quotes from student reviews and corporate client feedback.",
    icon: "💬",
  },
  {
    type: "faq",
    title: "FAQ Accordion",
    desc: "Collapsible questions regarding prerequisites, CEUs, and cancellation rules.",
    icon: "❓",
  },
  {
    type: "cta",
    title: "Call to Action",
    desc: "High-conversion banner driving enrollment inquiries and registration.",
    icon: "🎯",
  },
];

export default function SiteBuilderPage() {
  const [components, setComponents] = useState<PageComponent[]>(defaultComponents);
  const [selectedId, setSelectedId] = useState<string>("hero-1");
  const [device, setDevice] = useState<"desktop" | "tablet" | "phone">("desktop");
  const [activeTab, setActiveTab] = useState<"comp" | "page">("comp");
  const [paletteQuery, setPaletteQuery] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [history, setHistory] = useState<PageComponent[][]>([defaultComponents]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Page level settings
  const [pageSettings, setPageSettings] = useState({
    pageTitle: "Acme Training Center · Enterprise Learning Portal",
    slug: "home",
    metaDesc: "Official landing page for Acme Training compliance, OSHA, and workplace certification courses.",
    showNav: true,
    showFooter: true,
  });

  const selectedComp = components.find((c) => c.id === selectedId);

  function pushHistory(newComps: PageComponent[]) {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newComps);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setComponents(newComps);
  }

  function handleUndo() {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
    }
  }

  function addComponent(type: string) {
    const newId = `${type}-${components.length + 1}`;
    const template = availablePalette.find((p) => p.type === type);
    const newComp: PageComponent = {
      id: newId,
      type,
      title: template?.title || "New Section",
      subtitle: "Customize this section using the properties panel on the right.",
      btnText: type === "hero" || type === "cta" ? "Learn More" : undefined,
      btnUrl: "#",
    };
    const next = [...components, newComp];
    pushHistory(next);
    setSelectedId(newId);
    setToast(`Added ${template?.title || "section"} to page canvas.`);
    setTimeout(() => setToast(null), 2500);
  }

  function moveComponent(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= components.length) return;
    const copy = [...components];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    pushHistory(copy);
  }

  function deleteComponent(id: string) {
    if (components.length <= 1) {
      setToast("Page must have at least one component.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    const next = components.filter((c) => c.id !== id);
    pushHistory(next);
    setSelectedId(next[0].id);
  }

  function updateSelected(key: keyof PageComponent, val: string | string[] | undefined) {
    if (!selectedComp) return;
    const next = components.map((c) => (c.id === selectedId ? { ...c, [key]: val } : c));
    setComponents(next);
  }

  function handleSaveDraft() {
    setToast("Draft saved successfully.");
    setTimeout(() => setToast(null), 3000);
  }

  function handlePublish() {
    setIsPublished(true);
    setToast("Site published! Changes are now live on your center domain.");
    setTimeout(() => setToast(null), 3500);
  }

  const filteredPalette = availablePalette.filter((p) =>
    p.title.toLowerCase().includes(paletteQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  const canvasWidth = device === "desktop" ? "100%" : device === "tablet" ? "768px" : "375px";

  return (
    <div className="site-builder-page" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 4 }}>
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/settings" style={{ marginLeft: 6 }}>
              Settings
            </Link>
            <span>Site builder</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 20 }}>Site builder</h1>
            <span
              className={`badge ${isPublished ? "success" : "warn"}`}
              style={{ borderRadius: 99, padding: "2px 10px", fontSize: 11 }}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
            <span className="small muted">
              Public URL: <code>acmetraining.com/site/{pageSettings.slug}</code>
            </span>
          </div>
        </div>

        <div className="actions" style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn sm" onClick={handleSaveDraft}>
            Save draft
          </button>
          <button
            type="button"
            className="btn sm primary"
            onClick={handlePublish}
            style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
          >
            Publish Live
          </button>
        </div>
      </div>

      {/* Builder Toolbar */}
      <div
        className="sb-bar"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            className="btn sm"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo"
          >
            ↺ Undo
          </button>
          <button
            type="button"
            className="btn sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            ↻ Redo
          </button>
        </div>

        <span style={{ height: 20, width: 1, background: "var(--border)" }} />

        {/* Device Switcher */}
        <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: 6, padding: 2 }}>
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            style={{
              border: "none",
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              background: device === "desktop" ? "var(--surface)" : "transparent",
              color: device === "desktop" ? "var(--text)" : "var(--muted)",
              boxShadow: device === "desktop" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            🖥 Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            style={{
              border: "none",
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              background: device === "tablet" ? "var(--surface)" : "transparent",
              color: device === "tablet" ? "var(--text)" : "var(--muted)",
              boxShadow: device === "tablet" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            📱 Tablet
          </button>
          <button
            type="button"
            onClick={() => setDevice("phone")}
            style={{
              border: "none",
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              background: device === "phone" ? "var(--surface)" : "transparent",
              color: device === "phone" ? "var(--text)" : "var(--muted)",
              boxShadow: device === "phone" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            📱 Phone
          </button>
        </div>

        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
          {components.length} components on canvas
        </span>
      </div>

      {/* 3-Column Studio Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 310px",
          gap: 14,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left Palette: Add Components */}
        <section
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Add components</h2>
            <input
              type="search"
              placeholder="Filter blocks..."
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                fontSize: 12,
              }}
            />
          </div>

          <div style={{ overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {filteredPalette.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => addComponent(item.type)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{item.title}</div>
                  <div className="small muted" style={{ fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Center Live Canvas */}
        <section
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            padding: "20px 10px",
          }}
        >
          <div
            style={{
              width: canvasWidth,
              maxWidth: "100%",
              transition: "width 0.25s ease",
              background: "#ffffff",
              color: "#0F172A",
              borderRadius: 8,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Mock Site Navbar */}
            {pageSettings.showNav && (
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#ffffff",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      background: "var(--accent, #4F46E5)",
                      color: "#fff",
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                    }}
                  >
                    A
                  </span>
                  Acme Training
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 500, color: "#475569" }}>
                  <span>Courses</span>
                  <span>Schedule</span>
                  <span>Certifications</span>
                  <span>Contact</span>
                </div>
              </div>
            )}

            {/* Render Canvas Components */}
            {components.map((comp, idx) => {
              const isSelected = comp.id === selectedId;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedId(comp.id)}
                  style={{
                    position: "relative",
                    border: isSelected ? "2px solid var(--accent, #4F46E5)" : "2px solid transparent",
                    padding: comp.type === "hero" ? "40px 24px" : "32px 24px",
                    background: comp.type === "hero" ? "#f8fafc" : comp.type === "cta" ? "#1e293b" : "#ffffff",
                    color: comp.type === "cta" ? "#ffffff" : "#0F172A",
                    cursor: "pointer",
                    transition: "border 0.15s ease",
                  }}
                >
                  {/* Floating Action Ribbon on Selected */}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 8,
                        background: "var(--accent, #4F46E5)",
                        color: "#ffffff",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        zIndex: 10,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{comp.type.toUpperCase()}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveComponent(idx, "up");
                        }}
                        disabled={idx === 0}
                        style={{ border: "none", background: "none", color: "#fff", cursor: "pointer", padding: "0 2px" }}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveComponent(idx, "down");
                        }}
                        disabled={idx === components.length - 1}
                        style={{ border: "none", background: "none", color: "#fff", cursor: "pointer", padding: "0 2px" }}
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComponent(comp.id);
                        }}
                        style={{ border: "none", background: "none", color: "#fca5a5", cursor: "pointer", padding: "0 2px" }}
                        title="Delete Component"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Component Renderings */}
                  {comp.type === "hero" && (
                    <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
                      {comp.badge && (
                        <span
                          style={{
                            background: "#e0e7ff",
                            color: "#4338ca",
                            borderRadius: 99,
                            padding: "3px 12px",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "inline-block",
                            marginBottom: 12,
                          }}
                        >
                          {comp.badge}
                        </span>
                      )}
                      <h2 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.25, marginBottom: 12 }}>
                        {comp.title}
                      </h2>
                      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>{comp.subtitle}</p>
                      {comp.btnText && (
                        <button
                          type="button"
                          style={{
                            background: "var(--accent, #4F46E5)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 20px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {comp.btnText}
                        </button>
                      )}
                    </div>
                  )}

                  {comp.type === "stats" && (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>{comp.title}</h3>
                        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{comp.subtitle}</p>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                          gap: 12,
                          textAlign: "center",
                        }}
                      >
                        {(comp.items || ["Metric 1", "Metric 2", "Metric 3"]).map((stat, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "16px 12px",
                              background: "#f8fafc",
                              borderRadius: 8,
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent, #4F46E5)" }}>
                              {stat.split(" ")[0]}
                            </div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                              {stat.split(" ").slice(1).join(" ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.type === "courses" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{comp.title}</h3>
                          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{comp.subtitle}</p>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--accent, #4F46E5)", fontWeight: 600 }}>
                          View all 24 courses →
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                        {(comp.items || ["Course A", "Course B"]).map((c, i) => (
                          <div
                            key={i}
                            style={{
                              border: "1px solid #e2e8f0",
                              borderRadius: 8,
                              padding: 12,
                              background: "#ffffff",
                            }}
                          >
                            <span
                              style={{
                                background: "#f0fdf4",
                                color: "#166534",
                                borderRadius: 4,
                                padding: "2px 6px",
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              Classroom & Virtual
                            </span>
                            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8 }}>{c}</div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>2-Day Intensive · 16 CEUs</div>
                            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 700, fontSize: 13 }}>$595</span>
                              <span style={{ fontSize: 11, color: "var(--accent, #4F46E5)", fontWeight: 600 }}>Enroll</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.type === "testimonials" && (
                    <div style={{ textAlign: "center", padding: "10px 20px" }}>
                      <div style={{ fontSize: 24, color: "#cbd5e1", marginBottom: 6 }}>“</div>
                      <p style={{ fontSize: 15, fontStyle: "italic", color: "#334155", lineHeight: 1.5 }}>
                        {comp.subtitle}
                      </p>
                      <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8 }}>{comp.title}</div>
                    </div>
                  )}

                  {comp.type === "cta" && (
                    <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto" }}>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>
                        {comp.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>{comp.subtitle}</p>
                      {comp.btnText && (
                        <button
                          type="button"
                          style={{
                            background: "var(--accent, #4F46E5)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 8,
                            padding: "9px 18px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {comp.btnText}
                        </button>
                      )}
                    </div>
                  )}

                  {comp.type === "features" && (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>{comp.title}</h3>
                        <p style={{ fontSize: 12, color: "#64748b" }}>{comp.subtitle}</p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        <div style={{ padding: 10, background: "#f8fafc", borderRadius: 6, fontSize: 12 }}>
                          <strong>Accredited CEUs</strong>
                          <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>Certified by ANSI & IACET standards.</p>
                        </div>
                        <div style={{ padding: 10, background: "#f8fafc", borderRadius: 6, fontSize: 12 }}>
                          <strong>Flexible Formats</strong>
                          <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>In-person, hybrid, or 100% online.</p>
                        </div>
                        <div style={{ padding: 10, background: "#f8fafc", borderRadius: 6, fontSize: 12 }}>
                          <strong>Instant Badges</strong>
                          <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>Digital verification via Credly & PDF.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {comp.type === "faq" && (
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{comp.title}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}>
                          <strong>Do you provide group discounts for enterprise cohorts?</strong>
                        </div>
                        <div style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}>
                          <strong>How soon after class completion are certificates generated?</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mock Site Footer */}
            {pageSettings.showFooter && (
              <div
                style={{
                  padding: "20px",
                  background: "#0F172A",
                  color: "#94a3b8",
                  fontSize: 11,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>© 2026 Acme Training Center. All rights reserved.</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>Help Desk</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Settings Panel */}
        <section
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface-2)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("comp")}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                background: activeTab === "comp" ? "var(--surface)" : "transparent",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                borderBottom: activeTab === "comp" ? "2px solid var(--accent, #4F46E5)" : "none",
              }}
            >
              Component
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("page")}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                background: activeTab === "page" ? "var(--surface)" : "transparent",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                borderBottom: activeTab === "page" ? "2px solid var(--accent, #4F46E5)" : "none",
              }}
            >
              Page Settings
            </button>
          </div>

          <div style={{ padding: 14, overflowY: "auto", flex: 1 }}>
            {activeTab === "comp" ? (
              selectedComp ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <span className="badge" style={{ fontSize: 11 }}>
                      {selectedComp.type.toUpperCase()}
                    </span>
                    <span className="small muted" style={{ marginLeft: 6 }}>
                      ID: {selectedComp.id}
                    </span>
                  </div>

                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Headline text
                    </label>
                    <input
                      type="text"
                      value={selectedComp.title}
                      onChange={(e) => updateSelected("title", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        fontSize: 13,
                      }}
                    />
                  </div>

                  <div className="field">
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                      Subheading / Body text
                    </label>
                    <textarea
                      rows={3}
                      value={selectedComp.subtitle}
                      onChange={(e) => updateSelected("subtitle", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        fontSize: 13,
                      }}
                    />
                  </div>

                  {selectedComp.btnText !== undefined && (
                    <>
                      <div className="field">
                        <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                          Button label
                        </label>
                        <input
                          type="text"
                          value={selectedComp.btnText}
                          onChange={(e) => updateSelected("btnText", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <div className="field">
                        <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                          Button destination URL
                        </label>
                        <input
                          type="text"
                          value={selectedComp.btnUrl || "#"}
                          onChange={(e) => updateSelected("btnUrl", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </>
                  )}

                  {selectedComp.badge !== undefined && (
                    <div className="field">
                      <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                        Header badge label
                      </label>
                      <input
                        type="text"
                        value={selectedComp.badge}
                        onChange={(e) => updateSelected("badge", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          fontSize: 13,
                        }}
                      />
                    </div>
                  )}

                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                    <button
                      type="button"
                      className="btn sm danger"
                      onClick={() => deleteComponent(selectedComp.id)}
                      style={{ width: "100%" }}
                    >
                      Delete this block
                    </button>
                  </div>
                </div>
              ) : (
                <p className="small muted">Select a component on the canvas to edit its properties.</p>
              )
            ) : (
              /* Page Settings */
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="field">
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                    Page Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={pageSettings.pageTitle}
                    onChange={(e) => setPageSettings({ ...pageSettings, pageTitle: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      fontSize: 13,
                    }}
                  />
                </div>

                <div className="field">
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                    URL Path Slug
                  </label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "6px 8px",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRight: 0,
                        borderRadius: "6px 0 0 6px",
                        fontSize: 12,
                        color: "var(--muted)",
                      }}
                    >
                      /site/
                    </span>
                    <input
                      type="text"
                      value={pageSettings.slug}
                      onChange={(e) => setPageSettings({ ...pageSettings, slug: e.target.value })}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "0 6px 6px 0",
                        border: "1px solid var(--border)",
                        fontSize: 13,
                      }}
                    />
                  </div>
                </div>

                <div className="field">
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={pageSettings.metaDesc}
                    onChange={(e) => setPageSettings({ ...pageSettings, metaDesc: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      fontSize: 13,
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={pageSettings.showNav}
                      onChange={(e) => setPageSettings({ ...pageSettings, showNav: e.target.checked })}
                    />
                    <span>Show header navigation bar</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={pageSettings.showFooter}
                      onChange={(e) => setPageSettings({ ...pageSettings, showFooter: e.target.checked })}
                    />
                    <span>Show center footer links</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

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
