"use client";

import { flexRender, type Header, type Table } from "@tanstack/react-table";
import { useState } from "react";
import { ColumnMenu } from "./column-menu";

export type ColumnHeaderProps<TData> = {
  header: Header<TData, unknown>;
  table: Table<TData>;
  enableColumnResizing?: boolean;
  enableColumnMenu?: boolean;
};

export function ColumnHeader<TData>({
  header,
  table,
  enableColumnResizing = true,
  enableColumnMenu = true,
}: ColumnHeaderProps<TData>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { column } = header;
  const isSorted = column.getIsSorted();
  const isFilterActive = column.getFilterValue() !== undefined && column.getFilterValue() !== "";
  const canResize = enableColumnResizing && column.getCanResize();

  return (
    <div className="lms-column-header">
      <div className="lms-column-header__content">
        {/* Sort trigger button */}
        <button
          type="button"
          className="lms-column-header__sort-btn"
          onClick={column.getToggleSortingHandler()}
          aria-label={`${String(header.column.columnDef.header ?? column.id)} ${
            isSorted === "asc" ? "(sorted ascending)" : isSorted === "desc" ? "(sorted descending)" : ""
          }`}
        >
          <span className="lms-column-header__title">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>

          {/* Sort indicator icon */}
          <span className="lms-column-header__sort-icon" aria-hidden="true">
            {isSorted === "asc" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : isSorted === "desc" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            ) : null}
          </span>
        </button>

        {/* Filter badge if active */}
        {isFilterActive ? (
          <span className="lms-column-header__filter-badge" title="Filter active" aria-label="Filter active">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </span>
        ) : null}

        {/* Column menu trigger (3 dots / hamburger) */}
        {enableColumnMenu && column.id !== "_selection" ? (
          <div className="lms-column-header__menu-wrapper">
            <button
              type="button"
              className={`lms-column-header__menu-btn ${isMenuOpen ? "lms-column-header__menu-btn--active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              aria-label={`Open menu for ${String(header.column.columnDef.header ?? column.id)}`}
              title="Column options"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {isMenuOpen ? (
              <ColumnMenu
                column={column}
                table={table}
                onClose={() => setIsMenuOpen(false)}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Resize Drag Handle */}
      {canResize ? (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => column.resetSize()}
          className={`lms-column-resizer ${header.column.getIsResizing() ? "lms-column-resizer--is-resizing" : ""}`}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
