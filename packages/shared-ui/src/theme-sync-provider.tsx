"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SharedTheme = {
  preset: string;
  themeMode: "light" | "dark" | "system";
  primaryAccent: string;
  sidebarBg: string;
  sidebarText: string;
  topbarBg: string;
  pageBg: string;
  titleTint: string;
  siteTitle?: string;
  logoUrl?: string;
  updatedAt?: string;
};

export const defaultSharedTheme: SharedTheme = {
  preset: "slate-indigo",
  themeMode: "light",
  primaryAccent: "#4F46E5",
  sidebarBg: "#1E293B",
  sidebarText: "#E2E8F0",
  topbarBg: "#FFFFFF",
  pageBg: "#F8FAFC",
  titleTint: "#E8ECF7",
  siteTitle: "SimpliTrain Lite",
  logoUrl: "acme-logo.png",
};

import {
  deriveCssVars,
  buildBrandCss,
  type BrandingColors,
} from "./branding-engine";

/**
 * Dynamically injects CSS custom properties and the generated <style id="lite-brand">
 * into the DOM to update both:
 * 1. SimpliTrain Lite styling (--accent, --bg, --sb-bg, sidebar/topbar overrides, etc.)
 * 2. Application 2 and Application 3 Tailwind styling (--color-primary, --color-background, etc.)
 */
export function applyThemeToDocument(theme: SharedTheme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isDark =
    theme.themeMode === "dark" ||
    (theme.themeMode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Mode attributes
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  root.style.colorScheme = isDark ? "dark" : "light";

  const brandColors: BrandingColors = {
    primary: theme.primaryAccent,
    sidebar: theme.sidebarBg,
    sidebarText: theme.sidebarText,
    topbar: theme.topbarBg,
    pageBg: theme.pageBg,
    titleTint: theme.titleTint,
    link: "",
  };

  const css = buildBrandCss(brandColors);
  let styleEl = document.getElementById("lite-brand") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "lite-brand";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;

  const vars = deriveCssVars(brandColors);
  const activeVars = isDark ? vars.dark : vars.light;

  // Set all calculated variables on :root
  for (const [key, val] of Object.entries(activeVars)) {
    root.style.setProperty(key, val);
  }

  // SimpliTrain Lite Tokens
  root.style.setProperty("--accent", theme.primaryAccent);
  root.style.setProperty("--accent-text", activeVars["--accent-text"] || theme.primaryAccent);
  root.style.setProperty("--accent-soft", activeVars["--accent-soft"] || theme.titleTint);
  root.style.setProperty("--sb-bg", activeVars["--sb-bg"] || theme.sidebarBg);
  root.style.setProperty("--sb-text", activeVars["--sb-text"] || theme.sidebarText);
  root.style.setProperty("--bg", activeVars["--bg"] || (isDark ? "#0B1120" : theme.pageBg));
  root.style.setProperty("--surface", activeVars["--surface"] || (isDark ? "#111827" : "#FFFFFF"));
  root.style.setProperty("--surface-2", activeVars["--surface-2"] || (isDark ? "#1F2937" : theme.titleTint));
  root.style.setProperty("--tb-bg", activeVars["--tb-bg"] || (isDark ? "#111827" : theme.topbarBg));
  root.style.setProperty("--head-bg", activeVars["--head-bg"] || theme.titleTint);
  root.style.setProperty("--ts-bg", activeVars["--ts-bg"] || theme.titleTint);

  // Application 2 & Application 3 Tokens
  root.style.setProperty("--color-primary", theme.primaryAccent);
  root.style.setProperty("--color-brand-accent", activeVars["--accent-hover"] || theme.primaryAccent);
  root.style.setProperty("--color-background", activeVars["--bg"] || (isDark ? "#0f0a1f" : theme.pageBg));
  root.style.setProperty("--color-surface", activeVars["--surface"] || (isDark ? "#1a1433" : "#ffffff"));
  root.style.setProperty("--color-surface-muted", activeVars["--surface-2"] || (isDark ? "#221a40" : theme.titleTint));
  root.style.setProperty("--color-text", activeVars["--text"] || (isDark ? "#f3e8ff" : "#0f172a"));
  root.style.setProperty("--color-text-muted", activeVars["--muted"] || (isDark ? "#c4b5e0" : "#4a5f52"));
  root.style.setProperty("--color-border", activeVars["--border"] || (isDark ? "#342a5c" : "#d3e6d9"));

  // Persist locally so next page load or session immediately displays it
  try {
    const brandingRec = {
      preset: theme.preset,
      colors: brandColors,
      mode: isDark ? "dark" : "light",
      css,
      saved: new Date().toISOString(),
    };
    localStorage.setItem("lite.v2.branding", JSON.stringify(brandingRec));
    localStorage.setItem("lite-theme", isDark ? "dark" : "light");
    sessionStorage.setItem("lite.v2.branding.draft", JSON.stringify(brandingRec));
  } catch {}
}

type ThemeContextType = {
  theme: SharedTheme;
  updateTheme: (newTheme: Partial<SharedTheme>) => Promise<void>;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultSharedTheme,
  updateTheme: async () => {},
  isLoading: false,
});

function getInitialTheme(): SharedTheme {
  if (typeof window === "undefined") return defaultSharedTheme;
  try {
    const cached =
      localStorage.getItem("simplitrain.shared_theme") ||
      localStorage.getItem("lite.v2.branding");
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.colors
        ? {
            preset: parsed.preset || "slate-indigo",
            themeMode: parsed.mode || "light",
            primaryAccent: parsed.colors.primary || "#4F46E5",
            sidebarBg: parsed.colors.sidebar || "#1E293B",
            sidebarText: parsed.colors.sidebarText || "#E2E8F0",
            topbarBg: parsed.colors.topbar || "#FFFFFF",
            pageBg: parsed.colors.pageBg || "#F8FAFC",
            titleTint: parsed.colors.titleTint || "#E8ECF7",
            updatedAt: parsed.saved,
          }
        : parsed;
    }
  } catch {}
  return defaultSharedTheme;
}

export function ThemeSyncProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SharedTheme>(getInitialTheme);
  const [isLoading, setIsLoading] = useState(false);

  // Apply whenever theme state changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Setup cross-window listeners
  useEffect(() => {
    // Listen to storage events across tabs/windows in same origin
    function onStorage(e: StorageEvent) {
      if (e.key === "simplitrain.shared_theme" || e.key === "lite.v2.branding") {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            const resolved: SharedTheme = parsed.colors
              ? {
                  preset: parsed.preset || "slate-indigo",
                  themeMode: parsed.mode || "light",
                  primaryAccent: parsed.colors.primary || "#4F46E5",
                  sidebarBg: parsed.colors.sidebar || "#1E293B",
                  sidebarText: parsed.colors.sidebarText || "#E2E8F0",
                  topbarBg: parsed.colors.topbar || "#FFFFFF",
                  pageBg: parsed.colors.pageBg || "#F8FAFC",
                  titleTint: parsed.colors.titleTint || "#E8ECF7",
                  updatedAt: parsed.saved,
                }
              : parsed;
            setTheme(resolved);
            applyThemeToDocument(resolved);
          }
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);

    // Listen to BroadcastChannel for real-time cross-tab updates
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("simplitrain_theme_sync");
        channel.onmessage = (event) => {
          if (event.data && typeof event.data === "object") {
            setTheme(event.data);
            applyThemeToDocument(event.data);
          }
        };
      }
    } catch {}

    return () => {
      window.removeEventListener("storage", onStorage);
      if (channel) channel.close();
    };
  }, []);

  // Update theme and persist in localStorage (no API dependency)
  async function updateTheme(partial: Partial<SharedTheme>) {
    setIsLoading(true);
    const updated: SharedTheme = {
      ...theme,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    // 1. Update React state
    setTheme(updated);

    // 2. Apply directly to document style and :root CSS variables
    applyThemeToDocument(updated);

    // 3. Persist to localStorage
    try {
      localStorage.setItem("simplitrain.shared_theme", JSON.stringify(updated));
      localStorage.setItem("lite-theme", updated.themeMode);
    } catch {}

    // 4. Broadcast to other tabs
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("simplitrain_theme_sync");
        bc.postMessage(updated);
        bc.close();
      }
    } catch {}

    setIsLoading(false);
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSync() {
  return useContext(ThemeContext);
}
