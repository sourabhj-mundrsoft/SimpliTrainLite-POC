import { CategoryCards, SectionSidebar } from "@lms/shared-ui";
import { UsersPanel, type UserColumn } from "@lms/users";
import { categories, sidebarGroups } from "./admin-sections";

const userColumns: readonly UserColumn[] = [
  "user",
  "email",
  "phone",
  "employeeCode",
  "department",
  "designation",
  "city",
  "country",
  "dateOfJoining",
  "role",
  "status",
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
      <CategoryCards categories={categories} label="Management areas" />
      <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-[16rem_1fr]">
        <SectionSidebar groups={sidebarGroups} label="User management" />
        <div className="min-w-0 p-6 sm:p-8">
          <UsersPanel columns={userColumns} endpoint="/api/users" />
        </div>
      </div>
    </div>
  );
}
