"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import "./courses.css";

type CourseItem = {
  id: string;
  name: string;
  code: string;
  status: "Published" | "Draft" | "Archived";
  delivery: "Live (class-based)" | "Self-paced" | "Live and self-paced";
  enrolled: number;
  created: string;
  modified: string;
  category: string;
  hours: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBookmarked?: boolean;
  description: string;
};

type ClassItem = {
  id: string;
  courseId: string;
  name: string;
  code: string;
  sessionsCount: number;
  status: "Scheduled" | "Tentative" | "Confirmed" | "Completed" | "Cancelled";
  start: string;
  enrolled: number;
  max: number;
  instructor: string;
  location: string;
};

type EnrollmentItem = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  courseName: string;
  status: "Completed" | "In Progress" | "Not Started";
  progressPercent: number;
  enrolledDate: string;
  completionDate?: string;
  score?: number;
};

type LearningPlanItem = {
  id: string;
  title: string;
  coursesCount: number;
  audience: string;
  assignedUsers: number;
  completionRate: number;
  status: "Active" | "Draft";
};

const INITIAL_COURSES: CourseItem[] = [
  {
    id: "safe101",
    name: "Workplace Safety Essentials",
    code: "SAFE-101",
    status: "Published",
    delivery: "Live (class-based)",
    enrolled: 126,
    created: "12 Sep 2026",
    modified: "05 Oct 2026",
    category: "Health & Safety",
    hours: 8,
    isNew: true,
    isBookmarked: true,
    description: "Core OSHA safety protocols and emergency drills for warehouse and industrial facilities.",
  },
  {
    id: "lead200",
    name: "Leadership Foundations",
    code: "LEAD-200",
    status: "Published",
    delivery: "Live (class-based)",
    enrolled: 84,
    created: "03 Aug 2026",
    modified: "29 Sep 2026",
    category: "Management",
    hours: 16,
    isBookmarked: false,
    description: "Foundational supervisory and team empowerment frameworks for new department managers.",
  },
  {
    id: "priv110",
    name: "Data Privacy Basics",
    code: "PRIV-110",
    status: "Published",
    delivery: "Self-paced",
    enrolled: 312,
    created: "14 Jun 2026",
    modified: "01 Oct 2026",
    category: "Compliance",
    hours: 4,
    isFeatured: true,
    isBookmarked: true,
    description: "GDPR, CCPA and internal data governance guidelines for corporate personnel.",
  },
  {
    id: "cs120",
    name: "Customer Service Skills",
    code: "CS-120",
    status: "Draft",
    delivery: "Self-paced",
    enrolled: 0,
    created: "08 Oct 2026",
    modified: "08 Oct 2026",
    category: "Customer Relations",
    hours: 6,
    description: "De-escalation tactics, active listening and CRM workflow efficiency.",
  },
  {
    id: "fa050",
    name: "First Aid Refresher",
    code: "FA-050",
    status: "Published",
    delivery: "Live (class-based)",
    enrolled: 57,
    created: "22 Mar 2026",
    modified: "18 Sep 2026",
    category: "Health & Safety",
    hours: 4,
    isBookmarked: false,
    description: "Hands-on CPR and AED practical re-certification.",
  },
  {
    id: "onb001",
    name: "Onboarding Orientation",
    code: "ONB-001",
    status: "Published",
    delivery: "Self-paced",
    enrolled: 201,
    created: "10 Jan 2026",
    modified: "30 Aug 2026",
    category: "Company Culture",
    hours: 2,
    description: "Company history, values, IT security checklist and benefits enrollment.",
  },
];

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "cls-101",
    courseId: "safe101",
    name: "Workplace Safety Essentials - Cohort A",
    code: "SAFE-101-A",
    sessionsCount: 2,
    status: "Scheduled",
    start: "18 Oct 2026, 09:00",
    enrolled: 12,
    max: 20,
    instructor: "Rahul Mehta",
    location: "Classroom A",
  },
  {
    id: "cls-102",
    courseId: "lead200",
    name: "Leadership Foundations - Autumn Intensive",
    code: "LEAD-200-F",
    sessionsCount: 4,
    status: "Confirmed",
    start: "25 Oct 2026, 09:30",
    enrolled: 15,
    max: 16,
    instructor: "Arjun Nair",
    location: "Executive Suite",
  },
  {
    id: "cls-103",
    courseId: "fa050",
    name: "First Aid Refresher Hands-on Lab",
    code: "FA-050-L2",
    sessionsCount: 3,
    status: "Scheduled",
    start: "22 Oct 2026, 14:00",
    enrolled: 21,
    max: 25,
    instructor: "Sana Khan",
    location: "Lab 204",
  },
  {
    id: "cls-104",
    courseId: "safe101",
    name: "Workplace Safety Evening Workshop",
    code: "SAFE-101-EV",
    sessionsCount: 1,
    status: "Tentative",
    start: "28 Oct 2026, 13:00",
    enrolled: 10,
    max: 18,
    instructor: "Rahul Mehta",
    location: "Classroom B",
  },
];

const INITIAL_ENROLLMENTS: EnrollmentItem[] = [
  {
    id: "enr-1",
    learnerName: "Aarav Patel",
    learnerEmail: "aarav.patel@company.com",
    courseName: "Workplace Safety Essentials",
    status: "Completed",
    progressPercent: 100,
    enrolledDate: "15 Sep 2026",
    completionDate: "28 Sep 2026",
    score: 95,
  },
  {
    id: "enr-2",
    learnerName: "Ananya Deshmukh",
    learnerEmail: "ananya.d@company.com",
    courseName: "Data Privacy Basics",
    status: "In Progress",
    progressPercent: 65,
    enrolledDate: "20 Sep 2026",
  },
  {
    id: "enr-3",
    learnerName: "Kabir Verma",
    learnerEmail: "kabir.v@company.com",
    courseName: "Leadership Foundations",
    status: "In Progress",
    progressPercent: 40,
    enrolledDate: "02 Oct 2026",
  },
  {
    id: "enr-4",
    learnerName: "Diya Roy",
    learnerEmail: "diya.roy@company.com",
    courseName: "Customer Service Skills",
    status: "Not Started",
    progressPercent: 0,
    enrolledDate: "06 Oct 2026",
  },
];

const INITIAL_PLANS: LearningPlanItem[] = [
  {
    id: "lp-1",
    title: "New Hire Safety & Compliance Curriculum",
    coursesCount: 3,
    audience: "All Operations Personnel",
    assignedUsers: 142,
    completionRate: 88,
    status: "Active",
  },
  {
    id: "lp-2",
    title: "Executive Leadership Fast-Track",
    coursesCount: 4,
    audience: "Senior Managers & Team Leads",
    assignedUsers: 28,
    completionRate: 64,
    status: "Active",
  },
  {
    id: "lp-3",
    title: "Annual Regulatory Certification Program",
    coursesCount: 2,
    audience: "Entire Organization",
    assignedUsers: 512,
    completionRate: 94,
    status: "Active",
  },
];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "classes" | "enrollments" | "plans">("courses");

  // Courses state
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [showAdvSearch, setShowAdvSearch] = useState(false);

  // Modals
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOption, setExportOption] = useState<"std" | "ext" | "fb">("std");
  const [showScheduleModal, setShowScheduleModal] = useState<CourseItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<CourseItem | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // New course form
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("Health & Safety");
  const [newCourseDelivery, setNewCourseDelivery] = useState<CourseItem["delivery"]>("Live (class-based)");
  const [newCourseHours, setNewCourseHours] = useState(8);
  const [newCourseDesc, setNewCourseDesc] = useState("");

  // Schedule class form
  const [scheduleClassName, setScheduleClassName] = useState("");
  const [scheduleDate, setScheduleDate] = useState("2026-11-05");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleInstructor, setScheduleInstructor] = useState("Rahul Mehta");
  const [scheduleLocation, setScheduleLocation] = useState("Classroom A");
  const [scheduleMaxCap, setScheduleMaxCap] = useState(20);

  // Classes & Enrollments state
  const [classesList, setClassesList] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [enrollmentsList] = useState<EnrollmentItem[]>(INITIAL_ENROLLMENTS);
  const [plansList] = useState<LearningPlanItem[]>(INITIAL_PLANS);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesBookmark = !bookmarkedOnly || !!c.isBookmarked;
      const matchesDelivery = !deliveryFilter || c.delivery === deliveryFilter;

      return matchesQ && matchesStatus && matchesBookmark && matchesDelivery;
    });
  }, [courses, searchQuery, statusFilter, bookmarkedOnly, deliveryFilter]);

  // Actions
  function toggleBookmark(id: string) {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c))
    );
    showToast("Bookmark updated");
  }

  function cloneCourse(c: CourseItem) {
    const cloned: CourseItem = {
      ...c,
      id: "clone-" + Date.now(),
      name: c.name + " (Copy)",
      code: c.code + "-COPY",
      status: "Draft",
      enrolled: 0,
      isNew: true,
      created: "Today",
      modified: "Today",
    };
    setCourses([cloned, ...courses]);
    showToast(`Course cloned as draft: ${cloned.name}`);
    setOpenActionMenuId(null);
  }

  function toggleArchiveCourse(id: string) {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === "Archived" ? "Published" : "Archived";
          return { ...c, status: next };
        }
        return c;
      })
    );
    showToast("Course archive status updated");
    setOpenActionMenuId(null);
  }

  function deleteCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setShowDeleteModal(null);
    showToast("Course deleted successfully.");
  }

  function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const newCourse: CourseItem = {
      id: "course-" + Date.now(),
      name: newCourseName,
      code: newCourseCode || "CRS-" + Math.floor(100 + Math.random() * 900),
      status: "Published",
      delivery: newCourseDelivery,
      enrolled: 0,
      created: "Today",
      modified: "Today",
      category: newCourseCategory,
      hours: newCourseHours,
      description: newCourseDesc,
      isNew: true,
    };

    setCourses([newCourse, ...courses]);
    setShowNewCourseModal(false);
    setNewCourseName("");
    setNewCourseCode("");
    setNewCourseDesc("");
    showToast(`New course "${newCourse.name}" created.`);
  }

  function handleScheduleClassSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!showScheduleModal) return;

    const newClass: ClassItem = {
      id: "cls-" + Date.now(),
      courseId: showScheduleModal.id,
      name: scheduleClassName || `${showScheduleModal.name} - Cohort`,
      code: `${showScheduleModal.code}-${Math.floor(10 + Math.random() * 89)}`,
      sessionsCount: 1,
      status: "Scheduled",
      start: `${scheduleDate}, ${scheduleTime}`,
      enrolled: 0,
      max: scheduleMaxCap,
      instructor: scheduleInstructor,
      location: scheduleLocation,
    };

    setClassesList([newClass, ...classesList]);
    setShowScheduleModal(null);
    setActiveTab("classes");
    showToast(`Scheduled class session for ${showScheduleModal.name}`);
  }

  function handleExportCsv() {
    let csvContent = "";
    if (exportOption === "std") {
      csvContent = "Name,Code,Status,Delivery,Enrolled,Created\n";
      filteredCourses.forEach((c) => {
        csvContent += `"${c.name}","${c.code}","${c.status}","${c.delivery}",${c.enrolled},"${c.created}"\n`;
      });
    } else {
      csvContent = "Name,Code,Status,Delivery,Category,Hours,Enrolled,Created,Description\n";
      filteredCourses.forEach((c) => {
        csvContent += `"${c.name}","${c.code}","${c.status}","${c.delivery}","${c.category}",${c.hours},${c.enrolled},"${c.created}","${c.description}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Courses-${exportOption}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
    showToast("Courses exported as CSV.");
  }

  return (
    <main id="main" style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <span>Courses</span>
      </nav>

      {/* Page Header */}
      <div className="page-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1>Courses &amp; Classes</h1>
            <span
              className="badge"
              style={{ background: "var(--accent-soft)", color: "var(--accent-text)", fontWeight: 700 }}
            >
              {courses.length} courses
            </span>
          </div>
          <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
            Create courses, schedule interactive classroom cohorts, and track enrollments.
          </p>
        </div>

        <div className="actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="btn" onClick={() => window.print()}>
            <svg className="i" viewBox="0 0 24 24">
              <path d="M6 3h8l5 5v13H6z" />
              <path d="M14 3v5h5" />
            </svg>
            Print
          </button>
          <button type="button" className="btn" onClick={() => setShowExportModal(true)}>
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
            </svg>
            Export
          </button>
          <div className="split">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setNewCourseName("");
                setNewCourseCode("");
                setShowNewCourseModal(true);
              }}
            >
              <svg className="i" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New course
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--border)",
          marginBottom: 16,
          overflowX: "auto",
        }}
      >
        {[
          { key: "courses", label: "All courses", count: courses.length },
          { key: "classes", label: "Classes & Schedules", count: classesList.length },
          { key: "enrollments", label: "Course Enrollments", count: enrollmentsList.length },
          { key: "plans", label: "Learning Plans", count: plansList.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as "courses" | "classes" | "enrollments" | "plans")}
              style={{
                padding: "10px 18px",
                border: "none",
                background: "transparent",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                color: isActive ? "var(--accent-text)" : "var(--muted)",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 99,
                  background: isActive ? "var(--accent)" : "var(--surface-2)",
                  color: isActive ? "var(--on-accent)" : "var(--muted)",
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: ALL COURSES */}
      {activeTab === "courses" && (
        <section className="card" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-box">
              <svg className="i" viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "var(--muted)" }}>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search by name, code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: 34, padding: "0 8px", borderRadius: 8, fontSize: 13 }}
              >
                <option value="">All</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </label>

            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              style={{ height: 34, padding: "0 8px", borderRadius: 8, fontSize: 13 }}
            >
              <option value="">All Delivery Types</option>
              <option value="Live (class-based)">Live (class-based)</option>
              <option value="Self-paced">Self-paced</option>
              <option value="Live and self-paced">Live &amp; Self-paced</option>
            </select>

            <button
              type="button"
              className={`chip ${bookmarkedOnly ? "active" : ""}`}
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            >
              Bookmarked only
            </button>

            {(searchQuery || statusFilter || bookmarkedOnly || deliveryFilter) && (
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setBookmarkedOnly(false);
                  setDeliveryFilter("");
                }}
              >
                Clear all
              </button>
            )}

            <button
              type="button"
              className="btn sm"
              style={{ marginLeft: "auto" }}
              onClick={() => setShowAdvSearch(!showAdvSearch)}
            >
              Advanced filters {showAdvSearch ? "▲" : "▼"}
            </button>
          </div>

          {/* Advanced Search Accordion */}
          {showAdvSearch && (
            <div
              style={{
                padding: "14px 16px",
                background: "var(--surface-2)",
                borderBottom: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              <div>
                <label className="label">Category</label>
                <select style={{ height: 34, width: "100%", marginTop: 4 }}>
                  <option value="">All Categories</option>
                  <option value="Health & Safety">Health &amp; Safety</option>
                  <option value="Management">Management</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <div>
                <label className="label">Minimum Enrolled</label>
                <input type="number" placeholder="e.g. 10" style={{ height: 34, width: "100%", marginTop: 4 }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <button type="button" className="btn sm primary" onClick={() => setShowAdvSearch(false)}>
                  Apply filters
                </button>
                <button type="button" className="btn sm ghost" onClick={() => setShowAdvSearch(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Delivery</th>
                  <th>Enrolled</th>
                  <th>Created</th>
                  <th>Last modified</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
                      No courses match these filters. Clear a filter or create a new course.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((c) => {
                    const isDraft = c.status === "Draft";
                    const isArchived = c.status === "Archived";
                    const isLive = c.delivery.includes("Live");

                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Link href="/admin/courses" className="cell-main">
                              {c.name}
                            </Link>
                            {c.isNew && (
                              <span
                                className="badge"
                                style={{ background: "var(--accent-soft)", color: "var(--accent-text)", fontSize: 10 }}
                              >
                                New
                              </span>
                            )}
                            {c.isFeatured && (
                              <span
                                className="badge"
                                style={{ background: "var(--warn-soft)", color: "var(--warn-text)", fontSize: 10 }}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="cell-sub">{c.code}</div>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              background:
                                c.status === "Published"
                                  ? "var(--success-soft)"
                                  : c.status === "Draft"
                                  ? "var(--surface-2)"
                                  : "var(--warn-soft)",
                              color:
                                c.status === "Published"
                                  ? "var(--success-text)"
                                  : c.status === "Draft"
                                  ? "var(--muted)"
                                  : "var(--warn-text)",
                            }}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td>{c.delivery}</td>
                        <td>{c.enrolled}</td>
                        <td className="muted">{c.created}</td>
                        <td className="muted">{c.modified}</td>

                        <td style={{ textAlign: "right" }}>
                          <div className="actions-cell">
                            {/* Primary context action */}
                            {isLive && !isArchived && !isDraft ? (
                              <button
                                type="button"
                                className="btn sm"
                                onClick={() => {
                                  setShowScheduleModal(c);
                                  setScheduleClassName(`${c.name} - Cohort 1`);
                                }}
                              >
                                Convert to Class
                              </button>
                            ) : !isLive && !isArchived && !isDraft ? (
                              <button
                                type="button"
                                className="btn sm"
                                onClick={() => showToast(`Enrolment wizard opened for ${c.name}`)}
                              >
                                Enrol learners
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn sm"
                                onClick={() => showToast(`Editing course ${c.name}`)}
                              >
                                Edit
                              </button>
                            )}

                            {/* Dropdown menu */}
                            <div style={{ position: "relative" }}>
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setOpenActionMenuId(openActionMenuId === c.id ? null : c.id)}
                                aria-label="More actions"
                              >
                                <svg className="i" viewBox="0 0 24 24">
                                  <circle cx="5" cy="12" r="1.2" />
                                  <circle cx="12" cy="12" r="1.2" />
                                  <circle cx="19" cy="12" r="1.2" />
                                </svg>
                              </button>

                              {openActionMenuId === c.id && (
                                <div className="menu-popover">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast(`Viewing details: ${c.name}`);
                                      setOpenActionMenuId(null);
                                    }}
                                  >
                                    View details
                                  </button>
                                  <button type="button" onClick={() => cloneCourse(c)}>
                                    Clone course
                                  </button>
                                  <button type="button" onClick={() => toggleBookmark(c.id)}>
                                    {c.isBookmarked ? "Remove bookmark" : "Bookmark"}
                                  </button>
                                  <button type="button" onClick={() => toggleArchiveCourse(c.id)}>
                                    {c.status === "Archived" ? "Unarchive" : "Archive"}
                                  </button>
                                  <hr />
                                  <button
                                    type="button"
                                    style={{ color: "var(--danger)" }}
                                    onClick={() => {
                                      setShowDeleteModal(c);
                                      setOpenActionMenuId(null);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span>
              Showing 1 to {filteredCourses.length} of {courses.length} courses
            </span>
            <div className="pages">
              <button type="button" className="on">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
            </div>
            <div>
              <span>Rows per page: 25</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: CLASSES & SCHEDULES */}
      {activeTab === "classes" && (
        <section className="card" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div className="toolbar">
            <span style={{ fontWeight: 600, fontSize: 14 }}>Scheduled Live Classes</span>
            <span className="spacer" />
            <button
              type="button"
              className="btn sm primary"
              onClick={() => {
                if (courses.length > 0) {
                  setShowScheduleModal(courses[0]);
                  setScheduleClassName(`${courses[0].name} - Cohort`);
                }
              }}
            >
              + Schedule a class
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Starts</th>
                  <th>Enrolled / Capacity</th>
                  <th>Instructor</th>
                  <th>Location</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classesList.map((cls) => (
                  <tr key={cls.id}>
                    <td>
                      <span className="cell-main">{cls.name}</span>
                      <div className="cell-sub">
                        {cls.code} &middot; {cls.sessionsCount} session(s)
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            cls.status === "Confirmed"
                              ? "var(--success-soft)"
                              : cls.status === "Scheduled"
                              ? "var(--info-soft)"
                              : "var(--warn-soft)",
                          color:
                            cls.status === "Confirmed"
                              ? "var(--success-text)"
                              : cls.status === "Scheduled"
                              ? "var(--info-text)"
                              : "var(--warn-text)",
                        }}
                      >
                        {cls.status}
                      </span>
                    </td>
                    <td>{cls.start}</td>
                    <td>
                      <strong>{cls.enrolled}</strong> / {cls.max}
                    </td>
                    <td>{cls.instructor}</td>
                    <td>{cls.location}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => showToast(`Class roster for ${cls.name}`)}
                        >
                          Roster
                        </button>
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => showToast(`Editing class ${cls.name}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 3: COURSE ENROLLMENTS */}
      {activeTab === "enrollments" && (
        <section className="card" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div className="toolbar">
            <span style={{ fontWeight: 600, fontSize: 14 }}>Learner Course Enrollments &amp; Progress</span>
            <span className="spacer" />
            <button
              type="button"
              className="btn sm"
              onClick={() => showToast("Exporting learner enrollment roster...")}
            >
              Export Roster
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Score</th>
                  <th>Enrolled</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentsList.map((enr) => (
                  <tr key={enr.id}>
                    <td>
                      <strong>{enr.learnerName}</strong>
                      <div className="cell-sub">{enr.learnerEmail}</div>
                    </td>
                    <td>{enr.courseName}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            enr.status === "Completed"
                              ? "var(--success-soft)"
                              : enr.status === "In Progress"
                              ? "var(--info-soft)"
                              : "var(--surface-2)",
                          color:
                            enr.status === "Completed"
                              ? "var(--success-text)"
                              : enr.status === "In Progress"
                              ? "var(--info-text)"
                              : "var(--muted)",
                        }}
                      >
                        {enr.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "var(--surface-2)",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${enr.progressPercent}%`,
                              height: "100%",
                              background: enr.progressPercent === 100 ? "var(--success)" : "var(--accent)",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12 }}>{enr.progressPercent}%</span>
                      </div>
                    </td>
                    <td>{enr.score ? `${enr.score}%` : "-"}</td>
                    <td className="muted">{enr.enrolledDate}</td>
                    <td className="muted">{enr.completionDate || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 4: LEARNING PLANS */}
      {activeTab === "plans" && (
        <section className="card" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div className="toolbar">
            <span style={{ fontWeight: 600, fontSize: 14 }}>Curriculum Learning Plans</span>
            <span className="spacer" />
            <button
              type="button"
              className="btn sm primary"
              onClick={() => showToast("Opening learning plan builder...")}
            >
              + Create Learning Plan
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan Title</th>
                  <th>Target Audience</th>
                  <th>Courses in Plan</th>
                  <th>Assigned Users</th>
                  <th>Avg Completion</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {plansList.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <span className="cell-main">{plan.title}</span>
                    </td>
                    <td>{plan.audience}</td>
                    <td>
                      <span className="badge" style={{ background: "var(--surface-2)" }}>
                        {plan.coursesCount} courses
                      </span>
                    </td>
                    <td>
                      <strong>{plan.assignedUsers}</strong> learners
                    </td>
                    <td>
                      <strong>{plan.completionRate}%</strong>
                    </td>
                    <td>
                      <span className="badge success">{plan.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal 1: New Course Dialog */}
      {showNewCourseModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 580,
              overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2)",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Create New Course</h2>
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => setShowNewCourseModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label className="label">
                  Course Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Fire Suppression Protocols"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SAFE-301"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                  >
                    <option value="Health & Safety">Health &amp; Safety</option>
                    <option value="Management">Management</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Customer Relations">Customer Relations</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">Delivery Format</label>
                  <select
                    value={newCourseDelivery}
                    onChange={(e) => setNewCourseDelivery(e.target.value as CourseItem["delivery"])}
                  >
                    <option value="Live (class-based)">Live (class-based)</option>
                    <option value="Self-paced">Self-paced</option>
                    <option value="Live and self-paced">Live &amp; Self-paced</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label">Estimated Hours</label>
                  <input
                    type="number"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Description &amp; Objectives</label>
                <textarea
                  placeholder="Summarize course outcomes and prerequisite training..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowNewCourseModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Save &amp; Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Convert to Class (Schedule) Dialog */}
      {showScheduleModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 540,
              overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-2)",
              }}
            >
              <div>
                <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Convert to Class Session</h2>
                <span className="small muted">Base Course: {showScheduleModal.name}</span>
              </div>
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => setShowScheduleModal(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleClassSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label className="label">Class / Cohort Title</label>
                <input
                  type="text"
                  required
                  value={scheduleClassName}
                  onChange={(e) => setScheduleClassName(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">Start Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="label">Assigned Instructor</label>
                  <select
                    value={scheduleInstructor}
                    onChange={(e) => setScheduleInstructor(e.target.value)}
                  >
                    <option value="Rahul Mehta">Rahul Mehta</option>
                    <option value="Meera Iyer">Meera Iyer</option>
                    <option value="Sana Khan">Sana Khan</option>
                    <option value="Arjun Nair">Arjun Nair</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label">Location / Classroom</label>
                  <select
                    value={scheduleLocation}
                    onChange={(e) => setScheduleLocation(e.target.value)}
                  >
                    <option value="Classroom A">Classroom A (Main Campus)</option>
                    <option value="Classroom B">Classroom B</option>
                    <option value="Lab 204">Lab 204</option>
                    <option value="Virtual Zoom Room">Virtual Zoom Room</option>
                    <option value="Executive Suite">Executive Suite</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Maximum Student Capacity</label>
                <input
                  type="number"
                  value={scheduleMaxCap}
                  onChange={(e) => setScheduleMaxCap(Number(e.target.value))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowScheduleModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Confirm &amp; Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Export Courses Dialog */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 480,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>Export Courses</h2>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                All courses matching current filters ({filteredCourses.length} items) will be generated as a CSV spreadsheet.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "6px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="radio"
                    name="export"
                    value="std"
                    checked={exportOption === "std"}
                    onChange={() => setExportOption("std")}
                  />
                  <span>Standard columns (name, code, status, delivery, enrolled, created)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="radio"
                    name="export"
                    value="ext"
                    checked={exportOption === "ext"}
                    onChange={() => setExportOption("ext")}
                  />
                  <span>Extended columns (adds category, hours, descriptions)</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn primary" onClick={handleExportCsv}>
                  Export CSV Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Course Dialog */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            >
              <h2 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>
                {showDeleteModal.enrolled > 0
                  ? "Cannot Delete Course"
                  : `Delete ${showDeleteModal.name}?`}
              </h2>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {showDeleteModal.enrolled > 0 ? (
                <div
                  style={{
                    background: "var(--warn-soft)",
                    color: "var(--warn-text)",
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  This course currently has <strong>{showDeleteModal.enrolled} active learner enrollments</strong>.
                  Please archive the course instead of deleting to preserve completion records and compliance audits.
                </div>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  Are you sure you want to permanently delete <strong>{showDeleteModal.name}</strong>? This action cannot be undone.
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => setShowDeleteModal(null)}>
                  Cancel
                </button>
                {showDeleteModal.enrolled > 0 ? (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      toggleArchiveCourse(showDeleteModal.id);
                      setShowDeleteModal(null);
                    }}
                  >
                    Archive instead
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => deleteCourse(showDeleteModal.id)}
                  >
                    Delete Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 999999,
            fontWeight: 500,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}
