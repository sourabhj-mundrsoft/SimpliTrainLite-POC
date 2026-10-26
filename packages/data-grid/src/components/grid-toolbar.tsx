"use client";

import type { Table } from "@tanstack/react-table";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GridDensity } from "../types";
import { exportTableToCsv } from "../utils/export-csv";

export type GridToolbarProps<TData> = {
  table: Table<TData>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  searchPlaceholder?: string;
  enableGlobalFilter?: boolean;
  enableFloatingFilters?: boolean;
  isFloatingFiltersOpen: boolean;
  onToggleFloatingFilters: () => void;
  enableColumnVisibility?: boolean;
  enableDensityToggle?: boolean;
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  enableExport?: boolean;
  exportFileName?: string;
  selectedCount: number;
  isLoading?: boolean;
  errorMessage?: string;
  customActions?: ReactNode;
};

export function GridToolbar<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = "Search all columns...",
  enableGlobalFilter = true,
  enableFloatingFilters = true,
  isFloatingFiltersOpen,
  onToggleFloatingFilters,
  enableColumnVisibility = true,
  enableDensityToggle = true,
  density,
  onDensityChange,
  enableExport = true,
  exportFileName = "export.csv",
  selectedCount,
  isLoading,
  errorMessage,
  customActions,
}: GridToolbarProps<TData>) {
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const columnsModalRef = useRef<HTMLDivElement>(null);

  // Close columns popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (columnsModalRef.current && !columnsModalRef.current.contains(e.target as Node)) {
        setIsColumnsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allColumns = table.getAllLeafColumns().filter((c) => c.id !== "_selection");

  return (
    <div className="lms-grid-toolbar">
      <div className="lms-grid-toolbar__left">
        {enableGlobalFilter ? (
          <div className="lms-grid-toolbar__search-wrap">
            <svg
              className="lms-grid-toolbar__search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="lms-grid-toolbar__search-input"
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              aria-label={searchPlaceholder}
            />
            {globalFilter ? (
              <button
                type="button"
                className="lms-grid-toolbar__search-clear"
                onClick={() => onGlobalFilterChange("")}
                aria-label="Clear search"
              >
                &times;
              </button>
            ) : null}
          </div>
        ) : null}

        {selectedCount > 0 ? (
          <span className="lms-grid-toolbar__selection-badge">
            {selectedCount} selected
          </span>
        ) : null}

        {isLoading ? (
          <span className="lms-grid-toolbar__status" role="status">
            <span className="lms-spinner" /> Loading...
          </span>
        ) : null}

        {errorMessage ? (
          <span className="lms-grid-toolbar__error" role="alert">
            {errorMessage}
          </span>
        ) : null}
      </div>

      <div className="lms-grid-toolbar__right">
        {/* Floating filters toggle */}
        {enableFloatingFilters ? (
          <button
            type="button"
            className={`lms-toolbar-btn ${isFloatingFiltersOpen ? "lms-toolbar-btn--active" : ""}`}
            onClick={onToggleFloatingFilters}
            title="Toggle quick column filters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filters</span>
          </button>
        ) : null}

        {/* Column chooser */}
        {enableColumnVisibility ? (
          <div className="lms-grid-toolbar__popover-wrapper" ref={columnsModalRef}>
            <button
              type="button"
              className={`lms-toolbar-btn ${isColumnsModalOpen ? "lms-toolbar-btn--active" : ""}`}
              onClick={() => setIsColumnsModalOpen((prev) => !prev)}
              title="Show / hide columns"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span>Columns</span>
            </button>

            {isColumnsModalOpen ? (
              <div className="lms-columns-popover" role="dialog" aria-label="Columns visibility">
                <div className="lms-columns-popover__header">
                  <span className="lms-columns-popover__title">Toggle Columns</span>
                  <button
                    type="button"
                    className="lms-columns-popover__toggle-all"
                    onClick={table.getToggleAllColumnsVisibilityHandler()}
                  >
                    {table.getIsAllColumnsVisible() ? "Hide all" : "Show all"}
                  </button>
                </div>
                <div className="lms-columns-popover__list">
                  {allColumns.map((col) => (
                    <label key={col.id} className="lms-columns-popover__item">
                      <input
                        type="checkbox"
                        checked={col.getIsVisible()}
                        onChange={col.getToggleVisibilityHandler()}
                      />
                      <span>{String(col.columnDef.header ?? col.id)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Density Selector */}
        {enableDensityToggle ? (
          <div className="lms-density-toggle">
            <button
              type="button"
              className={`lms-density-btn ${density === "compact" ? "lms-density-btn--active" : ""}`}
              onClick={() => onDensityChange("compact")}
              title="Compact density (34px)"
              aria-label="Compact density (34px)"
            >
              S
            </button>
            <button
              type="button"
              className={`lms-density-btn ${density === "comfortable" ? "lms-density-btn--active" : ""}`}
              onClick={() => onDensityChange("comfortable")}
              title="Comfortable density (44px)"
              aria-label="Comfortable density (44px)"
            >
              M
            </button>
            <button
              type="button"
              className={`lms-density-btn ${density === "spacious" ? "lms-density-btn--active" : ""}`}
              onClick={() => onDensityChange("spacious")}
              title="Spacious density (54px)"
              aria-label="Spacious density (54px)"
            >
              L
            </button>
          </div>
        ) : null}

        {/* CSV Export */}
        {enableExport ? (
          <button
            type="button"
            className="lms-toolbar-btn"
            onClick={() => exportTableToCsv(table, exportFileName, selectedCount > 0)}
            title={selectedCount > 0 ? "Export selected rows to CSV" : "Export rows to CSV"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{selectedCount > 0 ? `Export (${selectedCount})` : "Export"}</span>
          </button>
        ) : null}

        {/* Any custom parent-provided toolbar buttons */}
        {customActions}
      </div>
    </div>
  );
}
