export { AppShell } from "./app-shell";
export type { AppShellProps, NavigationItem, ShellUser } from "./app-shell";
export { CategoryCards } from "./category-cards";
export type { CategoryCard } from "./category-cards";
export type { IconName } from "./icons";
export { PagePlaceholder } from "./page-placeholder";
export { SectionSidebar } from "./section-sidebar";
export type { SidebarGroup } from "./section-sidebar";
export {
  ThemeSyncProvider,
  useThemeSync,
  applyThemeToDocument,
  defaultSharedTheme,
  type SharedTheme,
} from "./theme-sync-provider";
export {
  BRANDING_PRESETS,
  DEFAULT_BRANDING_COLORS,
  deriveCssVars,
  runReadabilityChecks,
  buildBrandCss,
  cleanColors,
  calcContrastRatio,
  normHex,
  type BrandingColors,
  type ThemePreset,
  type ContrastCheckResult,
} from "./branding-engine";
