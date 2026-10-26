"use client";

import type { HeaderGroup, Table } from "@tanstack/react-table";
import type { DataGridColumnMeta } from "../types";

export type FloatingFilterRowProps<TData> = {
  headerGroup: HeaderGroup<TData>;
  table: Table<TData>;
};

export function FloatingFilterRow<TData>({ headerGroup }: FloatingFilterRowProps<TData>) {
  return (
    <tr className="lms-floating-filter-row">
      {headerGroup.headers.map((header) => {
        const { column } = header;
        const meta = column.columnDef.meta as DataGridColumnMeta<TData> | undefined;
        const filterValue = (column.getFilterValue() as string) ?? "";
        const canFilter = column.getCanFilter() && column.id !== "_selection";

        return (
          <th
            key={`floating_${header.id}`}
            className="lms-floating-filter-cell"
            style={{ width: header.getSize() }}
          >
            {canFilter ? (
              meta?.filterOptions && meta.filterOptions.length > 0 ? (
                <select
                  className="lms-floating-filter-input lms-floating-filter-select"
                  value={filterValue}
                  onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                  aria-label={`Quick filter for ${String(column.columnDef.header ?? column.id)}`}
                >
                  <option value="">All</option>
                  {meta.filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="lms-floating-filter-input-wrap">
                  <input
                    type="text"
                    className="lms-floating-filter-input"
                    placeholder={`Filter...`}
                    value={filterValue}
                    onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                    aria-label={`Quick filter for ${String(column.columnDef.header ?? column.id)}`}
                  />
                  {filterValue ? (
                    <button
                      type="button"
                      className="lms-floating-filter-clear-btn"
                      onClick={() => column.setFilterValue(undefined)}
                      title="Clear filter"
                    >
                      &times;
                    </button>
                  ) : null}
                </div>
              )
            ) : null}
          </th>
        );
      })}
    </tr>
  );
}
