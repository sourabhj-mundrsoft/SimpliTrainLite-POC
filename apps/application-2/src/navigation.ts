import type { NavigationItem } from "@lms/shared-ui";

export const navigation: readonly NavigationItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/reports", label: "Reports", icon: "reports" },
  { href: "/accounting", label: "Accounting", icon: "accounting" },
  { href: "/settings", label: "Settings", icon: "settings" },
];
