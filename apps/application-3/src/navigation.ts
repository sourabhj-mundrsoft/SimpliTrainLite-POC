import type { NavigationItem } from "@lms/shared-ui";

export const navigation: readonly NavigationItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/course-catalog", label: "Course Catalog", icon: "catalog" },
  { href: "/event-schedule", label: "Event Schedule", icon: "schedule" },
];
