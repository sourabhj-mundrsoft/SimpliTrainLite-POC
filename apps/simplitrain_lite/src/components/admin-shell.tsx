"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
};

const mainNavItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: "home" },
  { key: "courses", label: "Courses", href: "/admin/courses", icon: "book" },
  { key: "authoring", label: "Authoring", href: "/admin/authoring", icon: "edit" },
  { key: "quizzes", label: "Assessments & Surveys", href: "/admin/quizzes", icon: "quiz" },
  { key: "comms", label: "Communications", href: "/admin/comms", icon: "chat" },
  { key: "people", label: "People", href: "/admin/users", icon: "users" },
  { key: "payments", label: "Payments", href: "/admin/payments", icon: "card" },
  { key: "reports", label: "Reports", href: "/reports", icon: "chart" },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: "gear" },
  { key: "subscription", label: "Subscription", href: "/admin/subscription", icon: "award" },
];

const settingsSubNav = [
  { label: "Center", href: "/admin/settings", key: "org" },
  { label: "Branding", href: "/admin/settings/branding", key: "branding" },
  { label: "Site builder", href: "/admin/settings/site-builder", key: "site" },
  { label: "Locations", href: "/admin/settings/locations", key: "locations" },
  { label: "Roles & permissions", href: "/admin/settings/roles", key: "roles" },
  { label: "Custom fields", href: "/admin/settings/fields", key: "fields" },
  { label: "Integrations", href: "/admin/settings/integrations", key: "integrations" },
  { label: "System", href: "/admin/settings/system", key: "system" },
];

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "book":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
          <path d="M4 19V5" />
        </svg>
      );
    case "edit":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M4 20h4L19 9l-4-4L4 16z" />
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
    case "users":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
        </svg>
      );
    case "card":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case "chart":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
        </svg>
      );
    case "gear":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4.4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
        </svg>
      );
    case "award":
      return (
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="12" cy="9" r="6" />
          <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
        </svg>
      );
    default:
      return null;
  }
}

export function SimpliTrainLiteAdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lite-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDark(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    const mode = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("lite-theme", mode);
  }

  const isSettings = pathname.startsWith("/admin/settings");

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="logo">S</span>
          <span>SimpliTrain Lite</span>
        </div>

        <nav className="nav" aria-label="Main Navigation">
          {mainNavItems.map((item) => {
            const isActive =
              item.key === "settings"
                ? isSettings
                : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <div className="small muted">
            <strong>Acme Training</strong> · Lite V2
          </div>
        </div>
      </aside>

      {/* Mobile sidebar backdrop overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            zIndex: 49,
            backdropFilter: "blur(2px)",
            border: 0,
            padding: 0,
            margin: 0,
            cursor: "default",
          }}
        />
      ) : null}

      {/* Main column */}
      <div className="main-col">
        {/* Topbar */}
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="i" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="search">
            <div className="input-icon">
              <svg className="i" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search courses, classes, people..."
                aria-label="Global search"
              />
            </div>
          </div>

          <div className="spacer" />

          {/* Theme switcher */}
          <button
            type="button"
            className="btn sm"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <svg className="i" viewBox="0 0 24 24" style={{ width: 15, height: 15 }}>
              {isDark ? (
                <circle cx="12" cy="12" r="5" />
              ) : (
                <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
              )}
            </svg>
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>

          {/* Notifications */}
          <button type="button" className="icon-btn" aria-label="Notifications">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" />
            </svg>
            <span className="dot" />
          </button>

          {/* User Avatar */}
          <div className="avatar" title="Acme Administrator">
            AD
          </div>
        </header>

        {/* Secondary horizontal subbar for Settings matching wireframe: pale teal background with side tick and 15px font */}
        {isSettings ? (
          <nav
            className="topsub"
            style={{
              background: "var(--ts-bg, #D1E6EB)",
              borderBottom: "1px solid var(--ts-line, #A6CBD4)",
              borderLeft: "6px solid var(--accent, #4F46E5)",
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflowX: "auto",
              minHeight: "54px",
            }}
            aria-label="Settings sub navigation"
          >
            {settingsSubNav.map((sub) => {
              const isActive =
                sub.href === "/admin/settings"
                  ? pathname === "/admin/settings"
                  : pathname === sub.href;

              return (
                <Link
                  key={sub.key}
                  href={sub.href}
                  className={`ts-item ${isActive ? "active" : ""}`}
                  style={
                    isActive
                      ? {
                          background: "var(--accent, #4F46E5)",
                          color: "var(--on-accent, #ffffff)",
                          borderRadius: "8px",
                          padding: "8px 18px",
                          fontWeight: 600,
                          fontSize: "15px",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                        }
                      : {
                          color: "var(--ts-text, #133239)",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          fontWeight: 500,
                          fontSize: "15px",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }
                  }
                >
                  {sub.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        {/* Content */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
