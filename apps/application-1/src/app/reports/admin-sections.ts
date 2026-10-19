import type { CategoryCard, SidebarGroup } from "@lms/shared-ui";

export const categories: readonly CategoryCard[] = [
  {
    label: "User Management",
    description: "Profiles, roles, access permissions and groups",
    icon: "users",
    accent: "#1d4ed8",
    isActive: true,
  },
  {
    label: "Learning Management",
    description: "Courses, certifications, plans and content",
    icon: "book",
    accent: "#7c3aed",
  },
  {
    label: "Training Management",
    description: "Instructors, classrooms, classes and rosters",
    icon: "schedule",
    accent: "#c2410c",
  },
  {
    label: "Hybrid Learning",
    description: "Blended delivery, virtual meetings and labs",
    icon: "monitor",
    accent: "#0e7490",
  },
  {
    label: "Engagement & Comms",
    description: "Announcements, discussions and notifications",
    icon: "message",
    accent: "#be123c",
  },
  {
    label: "Organization Structure",
    description: "Companies, centers, sites and affiliations",
    icon: "building",
    accent: "#15803d",
  },
];

export const sidebarGroups: readonly SidebarGroup[] = [
  {
    title: "Users & Access",
    items: [
      { label: "Users", icon: "user", isActive: true },
      { label: "User Groups", icon: "users" },
      { label: "User Roles", icon: "lock" },
    ],
  },
  {
    title: "Permissions",
    items: [{ label: "Access Rights", icon: "key" }],
  },
];
