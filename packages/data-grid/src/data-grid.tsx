"use client";

import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export type { PaginationState, RowSelectionState, SortingState };
export type GridMode = "client" | "server";
// TanStack columns use different value types, so its heterogeneous column array requires `any`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataGridColumn<TData> = ColumnDef<TData, any>;

export type DataGridProps<TData> = Readonly<{
  columns: DataGridColumn<TData>[];
  data: TData[];
  mode?: GridMode;
  /** Required total matching row count in server mode. */
  rowCount?: number;
  /** Enable client-side pagination. Server mode always paginates. */
  enablePagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  initialSorting?: SortingState;
  sortingState?: SortingState;
  onSortingStateChange?: (sorting: SortingState) => void;
  initialGlobalFilter?: string;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  paginationState?: PaginationState;
  onPaginationStateChange?: (pagination: PaginationState) => void;
  rowSelectionState?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableRowSelection?: boolean;
  getRowId?: (row: TData, index: number) => string;
  isLoading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  label?: string;
  viewportHeight?: number;
  rowHeight?: number;
  overscan?: number;
}>;

const defaultPageSizeOptions = [25, 50, 100];

function stateFromUpdater<T>(updater: Updater<T>, current: T): T {
  return functionalUpdate(updater, current);
}

function sortLabel(isSorted: false | "asc" | "desc"): string {
  if (isSorted === "asc") return " (ascending)";
  if (isSorted === "desc") return " (descending)";
  return "";
}

export function DataGrid<TData>({
  columns,
  data,
  mode = "client",
  rowCount,
  enablePagination = false,
  initialPageSize = 25,
  pageSizeOptions = defaultPageSizeOptions,
  initialSorting = [],
  sortingState,
  onSortingStateChange,
  initialGlobalFilter = "",
  globalFilter,
  onGlobalFilterChange,
  paginationState,
  onPaginationStateChange,
  rowSelectionState,
  onRowSelectionChange,
  enableRowSelection = false,
  getRowId,
  isLoading = false,
  errorMessage,
  emptyMessage = "No rows to display.",
  searchPlaceholder = "Search rows",
  label = "Data grid",
  viewportHeight = 480,
  rowHeight = 44,
  overscan = 8,
}: DataGridProps<TData>) {
  const isServerMode = mode === "server";
  if (isServerMode && rowCount === undefined) {
    throw new Error("DataGrid requires rowCount when mode is 'server'.");
  }

  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [internalPagination, setInternalPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialPageSize,
    });
  const [internalSorting, setInternalSorting] =
    useState<SortingState>(initialSorting);
  const [internalGlobalFilter, setInternalGlobalFilter] =
    useState(initialGlobalFilter);
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});

  const activePagination = paginationState ?? internalPagination;
  const activeSorting = sortingState ?? internalSorting;
  const activeGlobalFilter = globalFilter ?? internalGlobalFilter;
  const activeRowSelection = rowSelectionState ?? internalRowSelection;

  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: isServerMode ? undefined : getSortedRowModel(),
    getFilteredRowModel: isServerMode ? undefined : getFilteredRowModel(),
    getPaginationRowModel:
      isServerMode || enablePagination ? getPaginationRowModel() : undefined,
    manualSorting: isServerMode,
    manualFiltering: isServerMode,
    manualPagination: isServerMode,
    rowCount: isServerMode ? rowCount : undefined,
    enableRowSelection,
    state: {
      globalFilter: activeGlobalFilter,
      pagination: activePagination,
      sorting: activeSorting,
      rowSelection: activeRowSelection,
    },
    onGlobalFilterChange: (updater) => {
      const next = stateFromUpdater(updater, activeGlobalFilter);
      setInternalGlobalFilter(next);
      onGlobalFilterChange?.(next);
      updatePagination({ ...activePagination, pageIndex: 0 });
    },
    onPaginationChange: updatePagination,
    onSortingChange: (updater) => {
      const next = stateFromUpdater(updater, activeSorting);
      setInternalSorting(next);
      onSortingStateChange?.(next);
      updatePagination({ ...activePagination, pageIndex: 0 });
    },
    onRowSelectionChange: (updater) => {
      const next = stateFromUpdater(updater, activeRowSelection);
      setInternalRowSelection(next);
      onRowSelectionChange?.(next);
    },
  });

  function updatePagination(updater: Updater<PaginationState>) {
    const next = stateFromUpdater(updater, activePagination);
    setInternalPagination(next);
    onPaginationStateChange?.(next);
  }

  const visibleRows = table.getRowModel().rows;
  const totalRows = isServerMode
    ? rowCount!
    : table.getPrePaginationRowModel().rows.length;
  const pageCount = Math.max(
    1,
    Math.ceil(totalRows / activePagination.pageSize),
  );
  const viewportStyle: CSSProperties & { "--grid-row-height": string } = {
    height: viewportHeight,
    "--grid-row-height": `${rowHeight}px`,
  };
  const virtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => rowHeight,
    overscan,
    initialRect: { width: 1024, height: viewportHeight },
  });
  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]!.start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows.at(-1)!.end
      : 0;
  const columnCount = columns.length + (enableRowSelection ? 1 : 0);
  const pageLabel = useMemo(() => {
    if (totalRows === 0) return "0 rows";
    if (isServerMode || enablePagination) {
      const start = activePagination.pageIndex * activePagination.pageSize + 1;
      const end = Math.min(
        start + visibleRows.length - 1,
        totalRows,
      );
      return `Showing ${start}–${end} of ${totalRows}`;
    }
    return `${totalRows} rows`;
  }, [
    activePagination.pageIndex,
    activePagination.pageSize,
    enablePagination,
    isServerMode,
    totalRows,
    visibleRows.length,
  ]);

  return (
    <section aria-label={label} className="lms-data-grid">
      <div className="lms-data-grid__toolbar">
        <label className="lms-data-grid__search">
          <span className="lms-data-grid__visually-hidden">
            {searchPlaceholder}
          </span>
          <input
            aria-label={searchPlaceholder}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={activeGlobalFilter}
          />
        </label>
        {isLoading ? (
          <span className="lms-data-grid__status" role="status">
            Loading rows…
          </span>
        ) : null}
        {errorMessage ? (
          <span className="lms-data-grid__error" role="alert">
            {errorMessage}
          </span>
        ) : null}
      </div>

      <div
        aria-busy={isLoading}
        className="lms-data-grid__viewport"
        ref={scrollElementRef}
        style={viewportStyle}
      >
        <table aria-label={label} className="lms-data-grid__table">
          <thead className="lms-data-grid__head">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {enableRowSelection ? (
                  <th className="lms-data-grid__selection-cell" scope="col">
                    <input
                      aria-label="Select all rows on this page"
                      checked={table.getIsAllPageRowsSelected()}
                      onChange={table.getToggleAllPageRowsSelectedHandler()}
                      type="checkbox"
                    />
                  </th>
                ) : null}
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : "none"
                      }
                      key={header.id}
                      scope="col"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          aria-label={`${String(header.column.columnDef.header ?? header.id)}${sortLabel(sorted)}`}
                          className="lms-data-grid__sort"
                          disabled={!header.column.getCanSort()}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === "asc" ? (
                            <span aria-hidden="true"> ▲</span>
                          ) : sorted === "desc" ? (
                            <span aria-hidden="true"> ▼</span>
                          ) : null}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 ? (
              <tr aria-hidden="true">
                <td
                  colSpan={columnCount}
                  style={{ height: paddingTop, padding: 0 }}
                />
              </tr>
            ) : null}
            {virtualRows.map((virtualRow) => {
              const row = visibleRows[virtualRow.index]!;
              return (
                <tr
                  aria-selected={
                    enableRowSelection ? row.getIsSelected() : undefined
                  }
                  data-index={virtualRow.index}
                  key={row.id}
                >
                  {enableRowSelection ? (
                    <td className="lms-data-grid__selection-cell">
                      <input
                        aria-label={`Select row ${virtualRow.index + 1}`}
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        type="checkbox"
                      />
                    </td>
                  ) : null}
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 ? (
              <tr aria-hidden="true">
                <td
                  colSpan={columnCount}
                  style={{ height: paddingBottom, padding: 0 }}
                />
              </tr>
            ) : null}
          </tbody>
        </table>
        {!isLoading && visibleRows.length === 0 ? (
          <p className="lms-data-grid__empty" role="status">
            {activeGlobalFilter ? "No matching rows." : emptyMessage}
          </p>
        ) : null}
      </div>

      <footer className="lms-data-grid__footer">
        <span aria-live="polite">{pageLabel}</span>
        {isServerMode || enablePagination ? (
          <div className="lms-data-grid__pagination">
            <label>
              Rows per page
              <select
                aria-label="Rows per page"
                onChange={(event) =>
                  table.setPageSize(Number(event.target.value))
                }
                value={activePagination.pageSize}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <span>
              Page {Math.min(activePagination.pageIndex + 1, pageCount)} of{" "}
              {pageCount}
            </span>
            <button
              disabled={activePagination.pageIndex <= 0}
              onClick={() => table.previousPage()}
              type="button"
            >
              Previous
            </button>
            <button
              disabled={activePagination.pageIndex + 1 >= pageCount}
              onClick={() => table.nextPage()}
              type="button"
            >
              Next
            </button>
          </div>
        ) : null}
      </footer>
    </section>
  );
}
