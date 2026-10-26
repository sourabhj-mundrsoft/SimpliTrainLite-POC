# `@lms/data-grid`

An enterprise-grade, high-performance AG Grid alternative built natively with React 19, `@tanstack/react-table` (headless data engine), and `@tanstack/react-virtual` (virtualized DOM rendering).

## Features

- **Column Pinning / Freezing:** Freeze columns to the Left (e.g. selection checkboxes, user identity) or Right (e.g. action menus) with smooth drop-shadow elevation while the rest scrolls horizontally.
- **Interactive Column Resizing:** Drag handles on column borders with live resizing and double-click to reset width.
- **Column Menu & Filtering:** AG Grid-style popovers per column offering:
  - Freeze Left / Freeze Right / Unfreeze
  - Text filtering (live search)
  - Set / Categorical filtering (distinct values list)
  - Clear filter & active filter badge in header
- **Floating Filters Row:** Quick 1-click filter row directly under column headers.
- **In-Place Cell Editing:** Double-click or press Enter to edit cells inline. Supports text, number, and select/dropdown editors with Enter/Escape/Blur lifecycle and optimistic callbacks.
- **Column Visibility Chooser:** Popover to toggle columns on or off on the fly.
- **Density Selector:** Switch between Compact (34px), Comfortable (44px), and Spacious (54px) views.
- **CSV Export:** 1-click export of filtered or selected rows to RFC 4180 CSV with client-side browser download.
- **DOM Virtualization:** Only visible rows are rendered in DOM using `@tanstack/react-virtual`, comfortably handling 100,000+ rows.
- **Client & Server Modes:** Local fast in-memory execution or controlled server-side queries.
- **SimpliTrain Theme Integration:** Styled completely in Vanilla CSS (`styles.css`), adopting `--color-primary`, `--color-surface`, `--color-border`, and dark/light modes.

## Quick Start

```tsx
"use client";

import { DataGrid, type DataGridColumn } from "@lms/data-grid";

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
};

const columns: DataGridColumn<Employee>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    meta: {
      editable: true,
      editorKind: "text",
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    size: 160,
    meta: {
      filterOptions: [
        { label: "Engineering", value: "Engineering" },
        { label: "Design", value: "Design" },
        { label: "Sales", value: "Sales" },
      ],
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 160,
  },
];

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  return (
    <DataGrid
      columns={columns}
      data={employees}
      enableRowSelection
      enableColumnResizing
      enableColumnPinning
      enableColumnFilters
      enableCellEditing
      enableExport
      exportFileName="employees.csv"
      onCellValueChanged={(event) => {
        console.log("Updated cell:", event);
      }}
      getRowId={(row) => row.id}
    />
  );
}
```
