"use client";

import type { Cell } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import type { CellChangeDetails, DataGridColumnMeta } from "../types";

export type CellEditorProps<TData> = {
  cell: Cell<TData, unknown>;
  onCommit: (details: CellChangeDetails<TData>) => void;
  onCancel: () => void;
};

export function CellEditor<TData>({ cell, onCommit, onCancel }: CellEditorProps<TData>) {
  const meta = cell.column.columnDef.meta as DataGridColumnMeta<TData> | undefined;
  const initialValue = cell.getValue();
  const [value, setValue] = useState(initialValue !== null && initialValue !== undefined ? String(initialValue) : "");
  const inputRef = useRef<HTMLInputElement & HTMLSelectElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if ("select" in (inputRef.current || {})) {
      (inputRef.current as HTMLInputElement).select?.();
    }
  }, []);

  function handleCommit() {
    if (value === String(initialValue ?? "")) {
      onCancel();
      return;
    }

    let parsedValue: unknown = value;
    if (meta?.editorKind === "number") {
      parsedValue = value === "" ? null : Number(value);
    }

    onCommit({
      row: cell.row.original,
      rowIndex: cell.row.index,
      rowId: cell.row.id,
      columnId: cell.column.id,
      oldValue: initialValue,
      newValue: parsedValue,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }

  if (meta?.editorKind === "select" && meta.editorOptions && meta.editorOptions.length > 0) {
    return (
      <select
        ref={inputRef as React.RefObject<HTMLSelectElement>}
        className="lms-cell-editor lms-cell-editor--select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
      >
        {meta.editorOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={meta?.editorKind === "number" ? "number" : meta?.editorKind === "date" ? "date" : "text"}
      className="lms-cell-editor"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={handleKeyDown}
    />
  );
}
