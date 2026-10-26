"use client";

import { DataGrid, type DataGridColumn } from "@lms/data-grid";
import { useState } from "react";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  status: "Active" | "On Leave" | "Terminated";
  joinedDate: string;
};

const initialSampleData: StaffMember[] = [
  { id: "1", name: "Sarah Jenkins", role: "Principal Engineer", department: "Engineering", salary: 145000, status: "Active", joinedDate: "2021-03-15" },
  { id: "2", name: "David Kim", role: "Product Manager", department: "Product", salary: 130000, status: "Active", joinedDate: "2020-08-22" },
  { id: "3", name: "Elena Rostova", role: "UI/UX Designer", department: "Design", salary: 110000, status: "On Leave", joinedDate: "2022-01-10" },
  { id: "4", name: "Michael Chang", role: "DevOps Architect", department: "Engineering", salary: 150000, status: "Active", joinedDate: "2019-11-05" },
  { id: "5", name: "Priya Sharma", role: "HR Specialist", department: "People", salary: 85000, status: "Active", joinedDate: "2023-04-01" },
  { id: "6", name: "Marcus Vance", role: "Frontend Developer", department: "Engineering", salary: 105000, status: "Active", joinedDate: "2022-09-18" },
  { id: "7", name: "Rachel Adams", role: "Financial Analyst", department: "Finance", salary: 115000, status: "Active", joinedDate: "2021-06-30" },
  { id: "8", name: "Alexandre Moreau", role: "Security Engineer", department: "Engineering", salary: 140000, status: "Active", joinedDate: "2020-02-14" },
  { id: "9", name: "Grace O'Connor", role: "Content Strategist", department: "Marketing", salary: 92000, status: "On Leave", joinedDate: "2022-11-09" },
  { id: "10", name: "Tariq Mansoor", role: "Backend Developer", department: "Engineering", salary: 112000, status: "Active", joinedDate: "2021-10-12" },
  { id: "11", name: "Chloe Bennett", role: "Marketing Director", department: "Marketing", salary: 138000, status: "Active", joinedDate: "2018-05-20" },
  { id: "12", name: "Liam Nielsen", role: "QA Lead", department: "Engineering", salary: 102000, status: "Terminated", joinedDate: "2019-07-11" },
  { id: "13", name: "Amina Al-Mansoor", role: "Data Scientist", department: "Data", salary: 135000, status: "Active", joinedDate: "2023-02-01" },
  { id: "14", name: "Carlos Santana", role: "Sales Executive", department: "Sales", salary: 98000, status: "Active", joinedDate: "2022-04-15" },
  { id: "15", name: "Yuki Tanaka", role: "VP of Product", department: "Product", salary: 180000, status: "Active", joinedDate: "2017-09-01" },
];

export default function AdminPage() {
  const [data, setData] = useState<StaffMember[]>(initialSampleData);
  const [lastEditedCell, setLastEditedCell] = useState<string | null>(null);

  const columns: DataGridColumn<StaffMember>[] = [
    {
      accessorKey: "name",
      header: "Employee Name",
      size: 210,
      meta: {
        editable: true,
        editorKind: "text",
        pin: "left",
      },
      cell: ({ row }: { row: { original: StaffMember } }) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Job Title",
      size: 190,
      meta: {
        editable: true,
        editorKind: "text",
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      size: 160,
      meta: {
        editable: true,
        editorKind: "select",
        filterOptions: [
          { label: "Engineering", value: "Engineering" },
          { label: "Product", value: "Product" },
          { label: "Design", value: "Design" },
          { label: "People", value: "People" },
          { label: "Finance", value: "Finance" },
          { label: "Marketing", value: "Marketing" },
          { label: "Data", value: "Data" },
          { label: "Sales", value: "Sales" },
        ],
        editorOptions: [
          { label: "Engineering", value: "Engineering" },
          { label: "Product", value: "Product" },
          { label: "Design", value: "Design" },
          { label: "People", value: "People" },
          { label: "Finance", value: "Finance" },
          { label: "Marketing", value: "Marketing" },
          { label: "Data", value: "Data" },
          { label: "Sales", value: "Sales" },
        ],
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      meta: {
        filterOptions: [
          { label: "Active", value: "Active" },
          { label: "On Leave", value: "On Leave" },
          { label: "Terminated", value: "Terminated" },
        ],
      },
      cell: ({ row }: { row: { original: StaffMember } }) => {
        const status = row.original.status;
        const colorClass =
          status === "Active"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
            : status === "On Leave"
            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
            : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "salary",
      header: "Salary ($)",
      size: 130,
      meta: {
        editable: true,
        editorKind: "number",
      },
      cell: ({ row }: { row: { original: StaffMember } }) => `$${row.original.salary.toLocaleString()}`,
    },
    {
      accessorKey: "joinedDate",
      header: "Joined Date",
      size: 140,
    },
  ];

  function handleCellValueChanged(event: {
    rowId: string;
    columnId: string;
    oldValue: unknown;
    newValue: unknown;
  }) {
    setData((prev) =>
      prev.map((item) =>
        item.id === event.rowId ? { ...item, [event.columnId]: event.newValue } : item,
      ),
    );
    setLastEditedCell(
      `Row ${event.rowId} [${event.columnId}]: "${String(event.oldValue)}" → "${String(event.newValue)}"`,
    );
  }

  function loadMassiveDataset() {
    const massive: StaffMember[] = Array.from({ length: 10_000 }, (_, i) => ({
      id: String(i + 1),
      name: `Employee ${i + 1}`,
      role: i % 3 === 0 ? "Staff Engineer" : i % 2 === 0 ? "Product Designer" : "Account Executive",
      department: i % 4 === 0 ? "Engineering" : i % 3 === 0 ? "Design" : i % 2 === 0 ? "Sales" : "Marketing",
      salary: 70000 + (i % 80) * 1200,
      status: i % 10 === 0 ? "Terminated" : i % 5 === 0 ? "On Leave" : "Active",
      joinedDate: "2022-01-15",
    }));
    setData(massive);
    setLastEditedCell(`Loaded 10,000 virtualized rows! Scroll smoothly.`);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            DataGrid Showcase (AG Grid Alternative)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Test column resizing, left/right pinning, inline editing, quick filters, density switching, and 10,000-row virtualization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMassiveDataset}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
          >
            ⚡ Load 10,000 Rows
          </button>
          <button
            type="button"
            onClick={() => {
              setData(initialSampleData);
              setLastEditedCell(null);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {lastEditedCell ? (
        <div className="px-4 py-2 text-xs rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center justify-between">
          <span>✨ In-Place Edit Saved: {lastEditedCell}</span>
          <button
            type="button"
            onClick={() => setLastEditedCell(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold"
          >
            &times;
          </button>
        </div>
      ) : null}

      {/* Main DataGrid */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <DataGrid
          columns={columns}
          data={data}
          enableRowSelection
          enableColumnResizing
          enableColumnPinning
          enableColumnFilters
          enableCellEditing
          enableExport
          exportFileName="staff-members.csv"
          onCellValueChanged={handleCellValueChanged}
          getRowId={(row: StaffMember) => row.id}
          viewportHeight={520}
        />
      </div>

      {/* Interactive Testing Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            1. Resizing & Pinning
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Drag the separator on any column header to resize. Double-click the separator to auto-reset. Click the <code>...</code> menu on any column to Freeze Left or Right.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            2. In-Place Editing
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Double-click on <strong>Employee Name</strong>, <strong>Job Title</strong>, <strong>Department</strong>, or <strong>Salary</strong>. Press <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px]">Enter</kbd> to save or <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px]">Esc</kbd> to cancel.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            3. Filters & Export
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Click <strong>Filters</strong> in the toolbar for the floating filter row, or use the <code>...</code> menu to filter by department. Click <strong>Export</strong> to download a CSV.
          </p>
        </div>
      </div>
    </div>
  );
}
