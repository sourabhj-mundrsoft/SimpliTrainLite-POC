"use client";

import type { Table } from "@tanstack/react-table";

function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = String(val);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    str = `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

export function exportTableToCsv<TData>(
  table: Table<TData>,
  fileName: string = "export.csv",
  onlySelected: boolean = false,
) {
  const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== "_selection");
  const headers = visibleColumns.map((col) => {
    const headerDef = col.columnDef.header;
    if (typeof headerDef === "string") return headerDef;
    return col.id;
  });

  const rows = onlySelected
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCsvValue).join(","));

  for (const row of rows) {
    const rowValues = visibleColumns.map((col) => {
      const cellValue = row.getValue(col.id);
      return escapeCsvValue(cellValue);
    });
    csvRows.push(rowValues.join(","));
  }

  const csvString = csvRows.join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName.endsWith(".csv") ? fileName : `${fileName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
