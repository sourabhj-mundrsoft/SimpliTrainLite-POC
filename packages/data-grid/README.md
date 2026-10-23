# `@lms/data-grid`

A reusable, AG Grid-inspired React data grid package for this workspace. This is
an original implementation, not an AG Grid fork or copy.

## Features

- Client mode: local sorting and global filtering of the provided rows.
- Server mode: manual sorting, filtering, and pagination; callbacks let the
  application fetch the requested page from its API.
- Virtualized rows: only the visible rows and overscan are rendered, including
  when a client dataset contains 100,000 records.
- Optional row selection with stable row IDs.
- Loading and error messages, accessible table markup, and theme CSS-variable
  integration.

Virtualization limits rendered DOM nodes, not the data held in browser memory.
Client mode still stores the full dataset and performs filtering/sorting in the
browser. Use server mode when records should not all be downloaded to a client,
or when the server should own query performance and authorization.

## Install in a workspace app

Add the workspace dependency to an application:

```sh
pnpm --filter @lms/application-1 add @lms/data-grid@workspace:*
pnpm --filter @lms/application-1 add @tanstack/react-table@^8.21.3 @tanstack/react-virtual@^3.14.22
```

In a Next.js app, add the package to `transpilePackages` in `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ["@lms/data-grid"],
};
```

Import its stylesheet from the app's global stylesheet:

```css
@import "@lms/data-grid/styles.css";
```

## Client-side example

```tsx
"use client";

import { DataGrid, type DataGridColumn } from "@lms/data-grid";

type Employee = { id: string; name: string; department: string };

const columns: DataGridColumn<Employee>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "department", header: "Department" },
];

export function EmployeeGrid({ employees }: { employees: Employee[] }) {
  return (
    <DataGrid
      columns={columns}
      data={employees}
      getRowId={(employee) => employee.id}
      label="Employees"
      viewportHeight={560}
    />
  );
}
```

Client mode is the default. Sorting and global text filtering run in the
browser. Set `enablePagination` to `true` to page through the client-side row
model; otherwise the grid scrolls and virtualizes the complete filtered result.

## Server-side example

The application owns fetching, cancellation, caching, and error handling.
Pass the rows for the current page, the total filtered row count, and controlled
query state:

```tsx
"use client";

import { useState } from "react";
import {
  DataGrid,
  type PaginationState,
  type SortingState,
} from "@lms/data-grid";

function EmployeeGrid() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");

  // Fetch rows when pagination, sorting, or filter changes.
  // The endpoint should return the current page and total matching row count.
  const { rows, total, isLoading, error } = useEmployeePage({
    pagination,
    sorting,
    filter,
  });

  return (
    <DataGrid
      columns={columns}
      data={rows}
      mode="server"
      rowCount={total}
      paginationState={pagination}
      onPaginationStateChange={setPagination}
      sortingState={sorting}
      onSortingStateChange={setSorting}
      globalFilter={filter}
      onGlobalFilterChange={setFilter}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      errorMessage={error}
    />
  );
}
```

In server mode, callbacks report query state; the grid does not make network
requests. Apply filtering, sorting, pagination, and authorization on the server.
Supply a stable `getRowId` when selection is enabled, particularly across
server pages.

## Limits and non-goals

This initial package is not full AG Grid parity. It does not include column
resizing/reordering, column filters, grouping, pivoting, editing, aggregation,
export, or the AG Grid server-side row model protocol. The server mode here is
an explicit controlled page-query contract. Add features individually with
tests and documented API compatibility.
