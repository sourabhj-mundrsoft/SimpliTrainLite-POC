"use client";

import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnFiltersState,
  type ColumnPinningState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { CellEditor } from "./components/cell-editor";
import { ColumnHeader } from "./components/column-header";
import { FloatingFilterRow } from "./components/floating-filter-row";
import { GridFooter } from "./components/grid-footer";
import { GridToolbar } from "./components/grid-toolbar";
import type {
  CellChangeDetails,
  DataGridColumn,
  DataGridColumnMeta,
  DataGridProps,
  GridDensity,
} from "./types";

function stateFromUpdater<T>(updater: Updater<T>, current: T): T {
  return functionalUpdate(updater, current);
}

function getDensityRowHeight(density: GridDensity, customHeight?: number): number {
  if (customHeight) return customHeight;
  switch (density) {
    case "compact":
      return 34;
    case "spacious":
      return 54;
    case "comfortable":
    default:
      return 44;
  }
}

function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeft = isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRight = isPinned === "right" && column.getIsFirstColumn("right");

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : undefined,
    zIndex: isPinned ? 2 : undefined,
    boxShadow: isLastLeft
      ? "3px 0 6px -2px rgba(0, 0, 0, 0.12)"
      : isFirstRight
      ? "-3px 0 6px -2px rgba(0, 0, 0, 0.12)"
      : undefined,
  };
}

export function DataGrid<TData>({
  columns: userColumns,
  data,
  mode = "client",
  rowCount,
  enablePagination = true,
  initialPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  initialSorting = [],
  sortingState,
  onSortingStateChange,
  enableMultiSort = true,
  initialGlobalFilter = "",
  globalFilter,
  onGlobalFilterChange,
  enableGlobalFilter = true,
  enableColumnFilters = true,
  enableFloatingFilters = false,
  columnFiltersState,
  onColumnFiltersChange,
  paginationState,
  onPaginationStateChange,
  rowSelectionState,
  onRowSelectionChange,
  enableRowSelection = false,
  getRowId,
  enableColumnPinning = true,
  columnPinningState,
  onColumnPinningChange,
  enableColumnResizing = true,
  columnResizeMode = "onChange",
  enableColumnVisibility = true,
  columnVisibilityState,
  onColumnVisibilityChange,
  enableCellEditing = true,
  onCellValueChanged,
  density: propDensity,
  onDensityChange,
  enableDensityToggle = true,
  enableExport = true,
  exportFileName = "export.csv",
  viewportHeight = 520,
  rowHeight: customRowHeight,
  overscan = 8,
  isLoading = false,
  errorMessage,
  emptyMessage = "No rows to display.",
  searchPlaceholder = "Search all columns...",
  label = "Data grid",
  toolbarActions,
}: DataGridProps<TData>) {
  const isServerMode = mode === "server";
  if (isServerMode && rowCount === undefined) {
    throw new Error("DataGrid requires rowCount when mode is 'server'.");
  }

  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Density state
  const [internalDensity, setInternalDensity] = useState<GridDensity>("comfortable");
  const density = propDensity ?? internalDensity;
  const activeRowHeight = getDensityRowHeight(density, customRowHeight);

  // Floating filter row visibility
  const [isFloatingFiltersOpen, setIsFloatingFiltersOpen] = useState(enableFloatingFilters);

  // Active editing cell coordinate
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);

  // Internal states when un-controlled
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [internalSorting, setInternalSorting] = useState<SortingState>(initialSorting);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState(initialGlobalFilter);
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const [internalPinning, setInternalPinning] = useState<ColumnPinningState>({
    left: enableRowSelection ? ["_selection"] : [],
    right: [],
  });
  const [internalVisibility, setInternalVisibility] = useState<VisibilityState>({});

  const activePagination = paginationState ?? internalPagination;
  const activeSorting = sortingState ?? internalSorting;
  const activeGlobalFilter = globalFilter ?? internalGlobalFilter;
  const activeColumnFilters = columnFiltersState ?? internalColumnFilters;
  const activeRowSelection = rowSelectionState ?? internalRowSelection;
  const activePinning = columnPinningState ?? internalPinning;
  const activeVisibility = columnVisibilityState ?? internalVisibility;

  // Build columns with selection checkbox column if enabled
  const allColumns = useMemo<DataGridColumn<TData>[]>(() => {
    if (!enableRowSelection) return userColumns;

    const selectionCol: DataGridColumn<TData> = {
      id: "_selection",
      size: 46,
      minSize: 46,
      maxSize: 46,
      enableResizing: false,
      enableSorting: false,
      enableColumnFilter: false,
      enablePinning: true,
      header: ({ table }) => (
        <input
          type="checkbox"
          className="lms-checkbox"
          aria-label="Select all rows on this page"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="lms-checkbox"
          aria-label={`Select row ${row.id}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    };

    return [selectionCol, ...userColumns];
  }, [enableRowSelection, userColumns]);

  const updatePagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = stateFromUpdater(updater, activePagination);
      setInternalPagination(next);
      onPaginationStateChange?.(next);
    },
    [activePagination, onPaginationStateChange],
  );

  const table = useReactTable({
    data,
    columns: allColumns,
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
    enableMultiSort,
    enableColumnResizing,
    columnResizeMode,
    enablePinning: enableColumnPinning,
    state: {
      globalFilter: activeGlobalFilter,
      pagination: activePagination,
      sorting: activeSorting,
      rowSelection: activeRowSelection,
      columnPinning: activePinning,
      columnFilters: activeColumnFilters,
      columnVisibility: activeVisibility,
    },
    onGlobalFilterChange: (updater) => {
      const next = stateFromUpdater(updater, activeGlobalFilter);
      setInternalGlobalFilter(next);
      onGlobalFilterChange?.(next);
      updatePagination({ ...activePagination, pageIndex: 0 });
    },
    onColumnFiltersChange: (updater) => {
      const next = stateFromUpdater(updater, activeColumnFilters);
      setInternalColumnFilters(next);
      onColumnFiltersChange?.(next);
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
    onColumnPinningChange: (updater) => {
      const next = stateFromUpdater(updater, activePinning);
      setInternalPinning(next);
      onColumnPinningChange?.(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = stateFromUpdater(updater, activeVisibility);
      setInternalVisibility(next);
      onColumnVisibilityChange?.(next);
    },
  });

  const visibleRows = table.getRowModel().rows;
  const totalRows = isServerMode
    ? rowCount!
    : table.getPrePaginationRowModel().rows.length;

  // Row virtualization
  const virtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => activeRowHeight,
    overscan,
    initialRect: { width: 1024, height: viewportHeight },
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]!.start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows.at(-1)!.end
      : 0;

  const handleCellCommit = useCallback(
    (details: CellChangeDetails<TData>) => {
      setEditingCell(null);
      onCellValueChanged?.(details);
      const col = table.getColumn(details.columnId);
      const meta = col?.columnDef.meta as DataGridColumnMeta<TData> | undefined;
      meta?.onCellChange?.(details);
    },
    [onCellValueChanged, table],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableSectionElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        // Copy focused cell or selection
        const target = e.target as HTMLElement;
        const cell = target.closest("td");
        if (cell?.textContent) {
          navigator.clipboard?.writeText(cell.textContent.trim());
        }
      }
    },
    [],
  );

  const viewportStyle: CSSProperties & {
    "--grid-row-height": string;
    "--grid-header-height": string;
  } = {
    height: viewportHeight,
    "--grid-row-height": `${activeRowHeight}px`,
    "--grid-header-height": `${activeRowHeight + 6}px`,
  };

  return (
    <section
      aria-label={label}
      className={`lms-data-grid lms-data-grid--${density}`}
    >
      {/* Top Toolbar with Global Search, Columns, Density, Export */}
      <GridToolbar
        table={table}
        globalFilter={activeGlobalFilter}
        onGlobalFilterChange={(val) => table.setGlobalFilter(val)}
        searchPlaceholder={searchPlaceholder}
        enableGlobalFilter={enableGlobalFilter}
        enableFloatingFilters={enableColumnFilters}
        isFloatingFiltersOpen={isFloatingFiltersOpen}
        onToggleFloatingFilters={() => setIsFloatingFiltersOpen((prev) => !prev)}
        enableColumnVisibility={enableColumnVisibility}
        enableDensityToggle={enableDensityToggle}
        density={density}
        onDensityChange={(d) => {
          setInternalDensity(d);
          onDensityChange?.(d);
        }}
        enableExport={enableExport}
        exportFileName={exportFileName}
        selectedCount={Object.keys(activeRowSelection).length}
        isLoading={isLoading}
        errorMessage={errorMessage}
        customActions={toolbarActions}
      />

      {/* Viewport container with virtualization */}
      <div
        aria-busy={isLoading}
        className="lms-data-grid__viewport"
        ref={scrollElementRef}
        style={viewportStyle}
      >
        <table
          aria-label={label}
          className="lms-data-grid__table"
          style={{ width: table.getTotalSize() || "100%" }}
        >
          {/* Header & Floating Filter rows */}
          <thead className="lms-data-grid__head">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const pinningStyles = getPinningStyles(header.column);
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                        ...pinningStyles,
                      }}
                      className={`lms-data-grid__th ${
                        header.column.getIsPinned() ? "lms-data-grid__cell--pinned" : ""
                      }`}
                      scope="col"
                    >
                      {header.isPlaceholder ? null : (
                        <ColumnHeader
                          header={header}
                          table={table}
                          enableColumnResizing={enableColumnResizing}
                          enableColumnMenu={enableColumnFilters}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}

            {isFloatingFiltersOpen ? (
              <FloatingFilterRow
                headerGroup={table.getHeaderGroups()[0]!}
                table={table}
              />
            ) : null}
          </thead>

          {/* Table Body with virtualized rows and inline editing */}
          <tbody className="lms-data-grid__body" onKeyDown={handleKeyDown}>
            {paddingTop > 0 ? (
              <tr style={{ height: `${paddingTop}px` }} aria-hidden="true">
                <td colSpan={table.getVisibleLeafColumns().length} />
              </tr>
            ) : null}

            {visibleRows.length === 0 ? (
              <tr>
                <td
                  className="lms-data-grid__empty-cell"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  {isLoading ? "Loading rows..." : emptyMessage}
                </td>
              </tr>
            ) : (
              virtualRows.map((virtualRow) => {
                const row = visibleRows[virtualRow.index]!;
                const isSelected = row.getIsSelected();

                return (
                  <tr
                    key={row.id}
                    className={`lms-data-grid__row ${
                      isSelected ? "lms-data-grid__row--selected" : ""
                    }`}
                    style={{ height: `${activeRowHeight}px` }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | DataGridColumnMeta<TData>
                        | undefined;
                      const isEditable = enableCellEditing && meta?.editable;
                      const isEditing =
                        editingCell?.rowId === row.id &&
                        editingCell?.columnId === cell.column.id;
                      const pinningStyles = getPinningStyles(cell.column);

                      return (
                        <td
                          key={cell.id}
                          tabIndex={0}
                          style={{
                            width: cell.column.getSize(),
                            ...pinningStyles,
                          }}
                          className={`lms-data-grid__td ${
                            cell.column.getIsPinned()
                              ? "lms-data-grid__cell--pinned"
                              : ""
                          } ${isEditable ? "lms-data-grid__cell--editable" : ""}`}
                          onDoubleClick={() => {
                            if (isEditable) {
                              setEditingCell({
                                rowId: row.id,
                                columnId: cell.column.id,
                              });
                            }
                          }}
                        >
                          {isEditing ? (
                            <CellEditor
                              cell={cell}
                              onCommit={handleCellCommit}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}

            {paddingBottom > 0 ? (
              <tr style={{ height: `${paddingBottom}px` }} aria-hidden="true">
                <td colSpan={table.getVisibleLeafColumns().length} />
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Bottom Footer with Status, Rows Per Page, Pagination */}
      <GridFooter
        table={table}
        totalRows={totalRows}
        pageSizeOptions={pageSizeOptions}
        enablePagination={enablePagination}
        isServerMode={isServerMode}
      />
    </section>
  );
}
