import type { NavigationItem } from "@lms/shared-ui";

export const navigation: readonly NavigationItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/admin", label: "Admin", icon: "admin" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/reports", label: "Reports", icon: "reports" },
];
