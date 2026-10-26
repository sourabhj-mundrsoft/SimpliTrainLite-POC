import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createColumnHelper } from "@tanstack/react-table";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DataGrid } from "./data-grid";
import type { DataGridColumn } from "./types";

type Person = { id: string; name: string; department: string };

const column = createColumnHelper<Person>();
const columns: DataGridColumn<Person>[] = [
  column.accessor("name", {
    header: "Name",
    meta: {
      editable: true,
      editorKind: "text",
    },
  }),
  column.accessor("department", {
    header: "Department",
    meta: {
      filterOptions: [
        { label: "Engineering", value: "Engineering" },
        { label: "Sales", value: "Sales" },
      ],
    },
  }),
];

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("lms-data-grid__viewport") ? 440 : 44;
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1024);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const height = this.classList.contains("lms-data-grid__viewport")
        ? 440
        : 44;
      return {
        bottom: height,
        height,
        left: 0,
        right: 1024,
        top: 0,
        width: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

const people: Person[] = [
  { id: "1", name: "Zara", department: "Sales" },
  { id: "2", name: "Amit", department: "Engineering" },
  { id: "3", name: "Mina", department: "Sales" },
];

describe("DataGrid client mode", () => {
  it("sorts and globally filters client-side data", async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        data={people}
        getRowId={(person) => person.id}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Name/i }));
    expect(
      within(screen.getByRole("table")).getAllByRole("row")[1],
    ).toHaveTextContent("Amit");

    await user.type(screen.getByRole("searchbox"), "Sales");
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent("Mina");
    expect(rows[2]).toHaveTextContent("Zara");
  });

  it("virtualizes a 100,000-row client dataset", () => {
    const largeDataset = Array.from({ length: 100_000 }, (_, index) => ({
      id: String(index),
      name: `Person ${index}`,
      department: "Engineering",
    }));

    render(
      <DataGrid
        columns={columns}
        data={largeDataset}
        getRowId={(person) => person.id}
        label="Large dataset"
        viewportHeight={440}
      />,
    );

    const renderedRows = within(screen.getByRole("table")).getAllByRole("row");
    expect(renderedRows.length).toBeGreaterThan(1);
    expect(renderedRows.length).toBeLessThan(35);
    expect(screen.getByText(/100000/)).toBeInTheDocument();
  });

  it("supports row selection", async () => {
    const onRowSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        data={people}
        enableRowSelection
        getRowId={(person) => person.id}
        onRowSelectionChange={onRowSelectionChange}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }));
    expect(onRowSelectionChange).toHaveBeenLastCalledWith({ "1": true });
  });

  it("supports in-place cell editing", async () => {
    const onCellValueChanged = vi.fn();
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        data={people}
        enableCellEditing
        getRowId={(person) => person.id}
        onCellValueChanged={onCellValueChanged}
      />,
    );

    const zaraCell = screen.getByText("Zara");
    await user.dblClick(zaraCell);

    const input = screen.getByDisplayValue("Zara");
    await user.clear(input);
    await user.type(input, "Zara Phillips{Enter}");

    expect(onCellValueChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        rowId: "1",
        columnId: "name",
        oldValue: "Zara",
        newValue: "Zara Phillips",
      }),
    );
  });

  it("supports density switching", async () => {
    const onDensityChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        data={people}
        getRowId={(person) => person.id}
        onDensityChange={onDensityChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Compact density (34px)" }));
    expect(onDensityChange).toHaveBeenCalledWith("compact");
  });
});

describe("DataGrid server mode", () => {
  it("emits filter, sort and pagination changes for server fetching", async () => {
    const onGlobalFilterChange = vi.fn();
    const onSortingStateChange = vi.fn();
    const onPaginationStateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DataGrid
        columns={columns}
        data={people.slice(0, 2)}
        getRowId={(person) => person.id}
        mode="server"
        onGlobalFilterChange={onGlobalFilterChange}
        onPaginationStateChange={onPaginationStateChange}
        onSortingStateChange={onSortingStateChange}
        paginationState={{ pageIndex: 0, pageSize: 2 }}
        rowCount={10}
      />,
    );

    await user.type(screen.getByRole("searchbox"), "Engineering");
    expect(onGlobalFilterChange).toHaveBeenLastCalledWith("Engineering");
    expect(onPaginationStateChange).toHaveBeenLastCalledWith({
      pageIndex: 0,
      pageSize: 2,
    });

    await user.click(screen.getByRole("button", { name: /^Name/i }));
    expect(onSortingStateChange).toHaveBeenCalledWith([
      { id: "name", desc: false },
    ]);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPaginationStateChange).toHaveBeenLastCalledWith({
      pageIndex: 1,
      pageSize: 2,
    });
    expect(screen.getByText(/Page/)).toBeInTheDocument();
  });

  it("requires a total row count", () => {
    expect(() =>
      render(<DataGrid columns={columns} data={people} mode="server" />),
    ).toThrow("DataGrid requires rowCount when mode is 'server'.");
  });
});
