"use client";

import type { Table } from "@tanstack/react-table";

export type GridFooterProps<TData> = {
  table: Table<TData>;
  totalRows: number;
  pageSizeOptions?: number[];
  enablePagination?: boolean;
  isServerMode?: boolean;
};

export function GridFooter<TData>({
  table,
  totalRows,
  pageSizeOptions = [10, 25, 50, 100],
  enablePagination = true,
  isServerMode = false,
}: GridFooterProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const selectedCount = Object.keys(table.getState().rowSelection || {}).length;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="lms-grid-footer">
      <div className="lms-grid-footer__status">
        <span>
          Showing <strong>{startRow}</strong>–<strong>{endRow}</strong> of <strong>{totalRows}</strong> rows
        </span>
        {selectedCount > 0 ? (
          <span className="lms-grid-footer__selected">
            ({selectedCount} selected)
          </span>
        ) : null}
      </div>

      {(enablePagination || isServerMode) && totalRows > 0 ? (
        <div className="lms-grid-footer__pagination">
          <label className="lms-grid-footer__page-size">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="lms-grid-footer__nav-buttons">
            <button
              type="button"
              className="lms-grid-footer__btn"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
              title="First page"
            >
              &laquo;
            </button>
            <button
              type="button"
              className="lms-grid-footer__btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
              title="Previous page"
            >
              &lsaquo;
            </button>

            <span className="lms-grid-footer__page-info">
              Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount || 1}</strong>
            </span>

            <button
              type="button"
              className="lms-grid-footer__btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
              title="Next page"
            >
              &rsaquo;
            </button>
            <button
              type="button"
              className="lms-grid-footer__btn"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
              title="Last page"
            >
              &raquo;
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
