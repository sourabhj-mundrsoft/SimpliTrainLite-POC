"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
};

export type GridMode = "client" | "server";

export type GridDensity = "compact" | "comfortable" | "spacious";

export type ColumnFilterKind = "text" | "number" | "select" | "date";

export type CellEditorKind = "text" | "number" | "select" | "date" | "boolean";

export type SelectOption = {
  label: string;
  value: string;
};

export type CellChangeDetails<TData, TValue = unknown> = {
  row: TData;
  rowIndex: number;
  rowId: string;
  columnId: string;
  oldValue: TValue;
  newValue: TValue;
};

/**
 * Extended metadata for custom column behavior in DataGrid.
 */
export type DataGridColumnMeta<TData, TValue = unknown> = {
  filterKind?: ColumnFilterKind;
  filterOptions?: SelectOption[];
  editable?: boolean;
  editorKind?: CellEditorKind;
  editorOptions?: SelectOption[];
  pin?: "left" | "right" | false;
  minWidth?: number;
  maxWidth?: number;
  headerTooltip?: string;
  onCellChange?: (event: CellChangeDetails<TData, TValue>) => void;
};

// tanstack heterogeneous column def
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataGridColumn<TData> = ColumnDef<TData, any> & {
  meta?: DataGridColumnMeta<TData>;
};

export type DataGridProps<TData> = Readonly<{
  columns: DataGridColumn<TData>[];
  data: TData[];
  mode?: GridMode;

  /** Total matching count in server mode */
  rowCount?: number;

  /** Client pagination toggle. Server mode always paginates */
  enablePagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];

  /** Sorting */
  initialSorting?: SortingState;
  sortingState?: SortingState;
  onSortingStateChange?: (sorting: SortingState) => void;
  enableMultiSort?: boolean;

  /** Global Filtering */
  initialGlobalFilter?: string;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  enableGlobalFilter?: boolean;

  /** Column-level filtering */
  enableColumnFilters?: boolean;
  enableFloatingFilters?: boolean;
  columnFiltersState?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

  /** Pagination */
  paginationState?: PaginationState;
  onPaginationStateChange?: (pagination: PaginationState) => void;

  /** Selection */
  enableRowSelection?: boolean;
  rowSelectionState?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: TData, index: number) => string;

  /** Column Pinning (Freeze Left / Right) */
  enableColumnPinning?: boolean;
  columnPinningState?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;

  /** Column Resizing */
  enableColumnResizing?: boolean;
  columnResizeMode?: "onChange" | "onEnd";

  /** Column Visibility */
  enableColumnVisibility?: boolean;
  columnVisibilityState?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;

  /** Cell Editing */
  enableCellEditing?: boolean;
  onCellValueChanged?: (event: CellChangeDetails<TData>) => void;

  /** Density & Display */
  density?: GridDensity;
  onDensityChange?: (density: GridDensity) => void;
  enableDensityToggle?: boolean;

  /** Export */
  enableExport?: boolean;
  exportFileName?: string;

  /** Layout dimensions */
  viewportHeight?: number;
  rowHeight?: number;
  overscan?: number;

  /** Messages & Labels */
  isLoading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  label?: string;

  /** Custom Toolbar actions */
  toolbarActions?: ReactNode;
}>;
