"use client";

import type { Column, Table } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import type { DataGridColumnMeta } from "../types";

export type ColumnMenuProps<TData> = {
  column: Column<TData, unknown>;
  table?: Table<TData>;
  onClose: () => void;
};

export function ColumnMenu<TData>({ column, onClose }: ColumnMenuProps<TData>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = column.columnDef.meta as DataGridColumnMeta<TData> | undefined;
  const currentFilter = (column.getFilterValue() as string) ?? "";
  const [filterText, setFilterText] = useState(currentFilter);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const isPinned = column.getIsPinned();

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    column.setFilterValue(filterText || undefined);
    onClose();
  }

  function handleClearFilter() {
    setFilterText("");
    column.setFilterValue(undefined);
    onClose();
  }

  return (
    <div className="lms-column-menu" ref={menuRef} role="dialog" aria-label={`Menu for ${column.id}`}>
      <div className="lms-column-menu__section">
        <span className="lms-column-menu__title">Pinning</span>
        <div className="lms-column-menu__btn-group">
          <button
            type="button"
            className={`lms-column-menu__btn ${isPinned === "left" ? "lms-column-menu__btn--active" : ""}`}
            onClick={() => {
              column.pin(isPinned === "left" ? false : "left");
              onClose();
            }}
          >
            Freeze Left
          </button>
          <button
            type="button"
            className={`lms-column-menu__btn ${isPinned === "right" ? "lms-column-menu__btn--active" : ""}`}
            onClick={() => {
              column.pin(isPinned === "right" ? false : "right");
              onClose();
            }}
          >
            Freeze Right
          </button>
          {isPinned ? (
            <button
              type="button"
              className="lms-column-menu__btn"
              onClick={() => {
                column.pin(false);
                onClose();
              }}
            >
              Unfreeze
            </button>
          ) : null}
        </div>
      </div>

      <div className="lms-column-menu__divider" />

      <div className="lms-column-menu__section">
        <span className="lms-column-menu__title">Column Filter</span>
        {meta?.filterOptions && meta.filterOptions.length > 0 ? (
          <div className="lms-column-menu__select-list">
            <button
              type="button"
              className={`lms-column-menu__option ${!currentFilter ? "lms-column-menu__option--selected" : ""}`}
              onClick={handleClearFilter}
            >
              (All)
            </button>
            {meta.filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`lms-column-menu__option ${currentFilter === opt.value ? "lms-column-menu__option--selected" : ""}`}
                onClick={() => {
                  column.setFilterValue(opt.value);
                  onClose();
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleFilterSubmit} className="lms-column-menu__form">
            <input
              type="text"
              className="lms-column-menu__input"
              placeholder={`Filter ${String(column.columnDef.header ?? column.id)}...`}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              autoFocus
            />
            <div className="lms-column-menu__actions">
              <button type="submit" className="lms-btn lms-btn--primary lms-btn--sm">
                Apply
              </button>
              {currentFilter ? (
                <button
                  type="button"
                  className="lms-btn lms-btn--ghost lms-btn--sm"
                  onClick={handleClearFilter}
                >
                  Clear
                </button>
              ) : null}
            </div>
          </form>
        )}
      </div>

      <div className="lms-column-menu__divider" />

      <div className="lms-column-menu__section">
        <button
          type="button"
          className="lms-column-menu__link-btn"
          onClick={() => {
            column.resetSize();
            onClose();
          }}
        >
          Reset column width
        </button>
      </div>
    </div>
  );
}
