"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import "./reports.css";
import {
  type AchievementRecord,
  type AchievementSearchResult,
  fetchAchievementsFromApi,
  getStoredAuthToken,
  setStoredAuthToken,
  clearStoredAuthToken,
  FALLBACK_SAMPLE_ACHIEVEMENTS,
} from "./achievements-api";

interface AttendanceRecord {
  id: string;
  className: string;
  sessionDate: string;
  instructor: string;
  totalRoster: number;
  present: number;
  absent: number;
  attendanceRate: number;
}

interface SigninRecord {
  id: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  location: string;
  deviceBrowser: string;
  timestamp: string;
  mfaVerified: boolean;
}

interface UserActivityRecord {
  id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  modulesCompleted: number;
  totalModules: number;
  timeSpentHours: number;
  lastActive: string;
}

interface VirtualMeetingRecord {
  id: string;
  topic: string;
  platform: "Zoom" | "Microsoft Teams" | "Google Meet";
  host: string;
  durationMins: number;
  participantsCount: number;
  date: string;
}

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-01",
    className: "Workplace Health & Safety - Cohort Oct A",
    sessionDate: "2026-10-24 10:00",
    instructor: "Elena Rostova",
    totalRoster: 24,
    present: 23,
    absent: 1,
    attendanceRate: 96,
  },
  {
    id: "att-02",
    className: "SOC 2 Type II Deep Dive - Engineering Cohort",
    sessionDate: "2026-10-22 14:00",
    instructor: "Marcus Vance",
    totalRoster: 18,
    present: 17,
    absent: 1,
    attendanceRate: 94,
  },
  {
    id: "att-03",
    className: "Customer Service Escalations & Roleplay",
    sessionDate: "2026-10-18 11:30",
    instructor: "Sarah Lin",
    totalRoster: 15,
    present: 12,
    absent: 3,
    attendanceRate: 80,
  },
  {
    id: "att-04",
    className: "GDPR & Data Subject Rights Lab",
    sessionDate: "2026-10-15 09:30",
    instructor: "David Kim",
    totalRoster: 20,
    present: 19,
    absent: 1,
    attendanceRate: 95,
  },
];

const INITIAL_SIGNINS: SigninRecord[] = [
  {
    id: "sn-01",
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@example.com",
    ipAddress: "142.250.190.46",
    location: "Mumbai, India",
    deviceBrowser: "Chrome 129 / macOS",
    timestamp: "2026-10-27 10:45:12",
    mfaVerified: true,
  },
  {
    id: "sn-02",
    userName: "Priya Patel",
    userEmail: "priya.patel@example.com",
    ipAddress: "103.21.244.0",
    location: "Bengaluru, India",
    deviceBrowser: "Firefox 131 / Windows 11",
    timestamp: "2026-10-27 09:15:30",
    mfaVerified: true,
  },
  {
    id: "sn-03",
    userName: "Jordan Hayes",
    userEmail: "jordan.hayes@example.com",
    ipAddress: "54.239.28.85",
    location: "Seattle, USA",
    deviceBrowser: "Safari 18 / iOS",
    timestamp: "2026-10-26 21:04:18",
    mfaVerified: true,
  },
  {
    id: "sn-04",
    userName: "Elena Rostova",
    userEmail: "elena.rostova@example.com",
    ipAddress: "198.51.100.22",
    location: "Berlin, Germany",
    deviceBrowser: "Chrome 129 / Ubuntu",
    timestamp: "2026-10-26 18:22:45",
    mfaVerified: true,
  },
  {
    id: "sn-05",
    userName: "Contractor Temp",
    userEmail: "contractor@partner.net",
    ipAddress: "203.0.113.19",
    location: "Singapore",
    deviceBrowser: "Edge 128 / Windows 10",
    timestamp: "2026-10-25 11:10:02",
    mfaVerified: false,
  },
];

const INITIAL_ACTIVITY: UserActivityRecord[] = [
  {
    id: "act-01",
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@example.com",
    courseTitle: "Workplace Health & Ergonomics",
    modulesCompleted: 8,
    totalModules: 8,
    timeSpentHours: 4.5,
    lastActive: "2026-10-26 15:40",
  },
  {
    id: "act-02",
    userName: "Priya Patel",
    userEmail: "priya.patel@example.com",
    courseTitle: "Data Privacy & GDPR Fundamentals",
    modulesCompleted: 5,
    totalModules: 6,
    timeSpentHours: 3.8,
    lastActive: "2026-10-27 08:30",
  },
  {
    id: "act-03",
    userName: "Jordan Hayes",
    userEmail: "jordan.hayes@example.com",
    courseTitle: "Customer Service Scenarios",
    modulesCompleted: 3,
    totalModules: 7,
    timeSpentHours: 2.1,
    lastActive: "2026-10-24 16:30",
  },
];

const INITIAL_MEETINGS: VirtualMeetingRecord[] = [
  {
    id: "mtg-01",
    topic: "Workplace Safety Cohort Live Simulation",
    platform: "Zoom",
    host: "Elena Rostova",
    durationMins: 90,
    participantsCount: 23,
    date: "2026-10-24",
  },
  {
    id: "mtg-02",
    topic: "SOC 2 Type II Architecture Q&A Office Hours",
    platform: "Microsoft Teams",
    host: "Marcus Vance",
    durationMins: 60,
    participantsCount: 17,
    date: "2026-10-22",
  },
];

export function ReportsPanel() {
  // First Tab is now "achievements" as requested
  const [activeTab, setActiveTab] = useState<"achievements" | "overview" | "attendance" | "signins" | "activity" | "meetings">("achievements");

  // Achievements State
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [achievementResult, setAchievementResult] = useState<AchievementSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [endpointChoice, setEndpointChoice] = useState<"direct" | "proxy">("direct");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tokenInput, setTokenInput] = useState(() => (typeof window !== "undefined" ? getStoredAuthToken() || "" : ""));
  const [hasToken, setHasToken] = useState(() => (typeof window !== "undefined" ? Boolean(getStoredAuthToken()) : false));
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modals & Drawers
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementRecord | null>(null);

  // Trigger manual re-fetch
  const triggerRefresh = useCallback(() => {
    setIsLoadingAchievements(true);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Fetch Achievements from API (asynchronous effect without cascading renders)
  useEffect(() => {
    let ignore = false;
    if (activeTab !== "achievements") return;

    async function runFetch() {
      try {
        const res = await fetchAchievementsFromApi({
          page,
          pageSize,
          searchQuery: searchQuery.trim(),
          statusFilter,
          useProxy: endpointChoice === "proxy",
        });

        if (ignore) return;
        setAchievementResult(res);

        if (res.success && res.data.length > 0) {
          setAchievements(res.data);
          setIsDemoMode(false);
        } else if (!res.success) {
          if (isDemoMode) {
            setAchievements(FALLBACK_SAMPLE_ACHIEVEMENTS);
          } else {
            setAchievements([]);
          }
        } else {
          setAchievements([]);
        }
      } catch (err) {
        if (ignore) return;
        setAchievementResult({
          success: false,
          data: [],
          total: 0,
          page,
          pageSize,
          totalPages: 1,
          error: {
            type: "UNKNOWN",
            message: err instanceof Error ? err.message : "Failed to load achievements",
            timestamp: new Date().toISOString(),
          },
        });
      } finally {
        if (!ignore) {
          setIsLoadingAchievements(false);
        }
      }
    }

    void runFetch();

    return () => {
      ignore = true;
    };
  }, [activeTab, page, pageSize, searchQuery, statusFilter, endpointChoice, isDemoMode, refreshIndex]);

  // Handle Token Save
  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      setStoredAuthToken(tokenInput.trim());
      setHasToken(true);
    } else {
      clearStoredAuthToken();
      setHasToken(false);
    }
    setIsTokenModalOpen(false);
    setIsDemoMode(false);
    triggerRefresh();
  };

  const handleClearToken = () => {
    clearStoredAuthToken();
    setHasToken(false);
    setTokenInput("");
    setIsTokenModalOpen(false);
    triggerRefresh();
  };

  // Toggle demo fallback mode
  const handleToggleDemoMode = () => {
    if (!isDemoMode) {
      setIsDemoMode(true);
      setAchievements(FALLBACK_SAMPLE_ACHIEVEMENTS);
    } else {
      setIsDemoMode(false);
      triggerRefresh();
    }
  };

  // Filter achievements on client-side when in demo mode or when query exists
  const displayedAchievements = useMemo(() => {
    let list = isDemoMode && achievements.length === 0 ? FALLBACK_SAMPLE_ACHIEVEMENTS : achievements;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.userName.toLowerCase().includes(q) ||
          a.userEmail.toLowerCase().includes(q) ||
          a.achievementName.toLowerCase().includes(q) ||
          a.courseName.toLowerCase().includes(q) ||
          a.credentialId.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((a) => a.status.toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }, [achievements, isDemoMode, searchQuery, statusFilter]);

  // Export CSV for Achievements
  const handleExportAchievementsCsv = () => {
    const listToExport = displayedAchievements.length > 0 ? displayedAchievements : FALLBACK_SAMPLE_ACHIEVEMENTS;
    const headers = [
      "Credential ID",
      "Learner Name",
      "Learner Email",
      "Achievement Title",
      "Course Program",
      "Issue Date",
      "Expiration Date",
      "Score (%)",
      "Status",
      "Organization",
    ];

    const rows = listToExport.map((r) => [
      `"${r.credentialId}"`,
      `"${r.userName.replace(/"/g, '""')}"`,
      `"${r.userEmail}"`,
      `"${r.achievementName.replace(/"/g, '""')}"`,
      `"${r.courseName.replace(/"/g, '""')}"`,
      r.issueDate,
      r.expirationDate || "N/A",
      r.score !== null ? `${r.score}%` : "N/A",
      r.status,
      `"${(r.organizationName || "SimpliTrain LMS").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SimpliTrain_Achievements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV for Attendance
  const handleExportAttendanceCsv = () => {
    const headers = ["Class Name", "Session Date", "Instructor", "Total Roster", "Present", "Absent", "Attendance Rate"];
    const rows = INITIAL_ATTENDANCE.map((r) => [
      `"${r.className.replace(/"/g, '""')}"`,
      r.sessionDate,
      `"${r.instructor.replace(/"/g, '""')}"`,
      r.totalRoster,
      r.present,
      r.absent,
      `${r.attendanceRate}%`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Class_Attendance_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI calculations for achievements
  const kpiStats = useMemo(() => {
    const source = displayedAchievements.length > 0 ? displayedAchievements : FALLBACK_SAMPLE_ACHIEVEMENTS;
    const total = source.length;
    const active = source.filter((a) => a.status === "Active").length;
    const expiring = source.filter((a) => a.status === "Expiring Soon").length;
    const scores = source.map((a) => a.score).filter((s): s is number => typeof s === "number");
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 92;

    return { total, active, expiring, avgScore };
  }, [displayedAchievements]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard</Link>
        <span>/</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Reports &amp; Analytics</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>
          {activeTab === "achievements" ? "Learner Achievements" : activeTab}
        </span>
      </nav>

      {/* Header */}
      <div className="rep-header">
        <div>
          <h1>Reports &amp; Analytics</h1>
          <p className="sub">
            Enterprise intelligence reporting with direct integration to SimpliTrain LMS achievement search, credential verification, attendance, sign-in security, and virtual classrooms.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {activeTab === "achievements" && (
            <button
              type="button"
              className="btn"
              onClick={handleExportAchievementsCsv}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Achievements CSV
            </button>
          )}
          {activeTab === "attendance" && (
            <button
              type="button"
              className="btn"
              onClick={handleExportAttendanceCsv}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Attendance CSV
            </button>
          )}
          <button
            type="button"
            className="btn primary"
            onClick={() => window.print()}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Executive Summary
          </button>
        </div>
      </div>

      {/* Sub-nav Tabs: FIRST TAB is Learner Achievements */}
      <div className="rep-subnav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          <span>Learner Achievements</span>
          <span className="count-badge">
            {achievementResult?.total ?? displayedAchievements.length}
          </span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <span>Executive Overview</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          <span>Class Attendance</span>
          <span className="count-badge">{INITIAL_ATTENDANCE.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "signins" ? "active" : ""}`}
          onClick={() => setActiveTab("signins")}
        >
          <span>Sign-In Audit History</span>
          <span className="count-badge">{INITIAL_SIGNINS.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          <span>User Course Activity</span>
          <span className="count-badge">{INITIAL_ACTIVITY.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "meetings" ? "active" : ""}`}
          onClick={() => setActiveTab("meetings")}
        >
          <span>Virtual Meeting Logs</span>
          <span className="count-badge">{INITIAL_MEETINGS.length}</span>
        </button>
      </div>

      {/* TAB 1: LEARNER ACHIEVEMENTS (Direct Integration to https://lmsapidev.simplitrain.net/api/v3/Achievement/Search) */}
      {activeTab === "achievements" && (
        <div style={{ display: "grid", gap: 18 }}>
          {/* 4 Summary KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Total Achievements</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", margin: "4px 0" }}>
                {kpiStats.total}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Verified digital credentials issued</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Active &amp; Compliant</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--success-text)", margin: "4px 0" }}>
                {kpiStats.active}
              </div>
              <div style={{ fontSize: 12, color: "var(--success-text)" }}>
                {Math.round((kpiStats.active / Math.max(1, kpiStats.total)) * 100)}% compliance rate
              </div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Expiring Soon (&lt; 30d)</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--warn-text, #d97706)", margin: "4px 0" }}>
                {kpiStats.expiring}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Renewal reminder alerts active</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Avg Assessment Score</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", margin: "4px 0" }}>
                {kpiStats.avgScore}%
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Passing threshold: 80%</div>
            </div>
          </div>

          {/* API Status & Config Bar */}
          <div className="rep-api-bar">
            <div className="rep-api-info">
              <span style={{ fontWeight: 600, color: "var(--text)" }}>API Endpoint:</span>
              <code style={{ fontSize: 12, background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>
                {endpointChoice === "proxy"
                  ? "/api/reports/achievements"
                  : "https://lmsapidev.simplitrain.net/api/v3/Achievement/Search"}
              </code>

              {/* Status Pill */}
              {isLoadingAchievements ? (
                <span className="rep-pill neutral">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"></circle>
                  </svg>
                  Fetching...
                </span>
              ) : achievementResult?.success ? (
                <span className="rep-pill success">
                  ✓ 200 OK Live
                </span>
              ) : achievementResult?.error?.status === 401 ? (
                <span className="rep-pill warning">
                  ⚠ 401 Unauthorized
                </span>
              ) : achievementResult?.error?.status ? (
                <span className="rep-pill error">
                  ✕ {achievementResult.error.status} Error
                </span>
              ) : isDemoMode ? (
                <span className="rep-pill neutral">
                  Demo Sample Mode
                </span>
              ) : (
                <span className="rep-pill neutral">Ready</span>
              )}

              {/* Token Indicator */}
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                Auth: {hasToken ? "Bearer Token Configured" : "No Token"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <select
                className="rep-select"
                style={{ padding: "4px 8px", fontSize: 12 }}
                value={endpointChoice}
                onChange={(e) => setEndpointChoice(e.target.value as "direct" | "proxy")}
                title="Select direct external call or Next.js same-origin proxy"
              >
                <option value="direct">Direct API (lmsapidev)</option>
                <option value="proxy">Next.js Proxy Route</option>
              </select>

              <button
                type="button"
                className="btn sm"
                onClick={() => setIsTokenModalOpen(true)}
                style={{ fontSize: 12 }}
              >
                🔑 Configure Token
              </button>

              <button
                type="button"
                className="btn sm"
                onClick={triggerRefresh}
                disabled={isLoadingAchievements}
                style={{ fontSize: 12 }}
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* COMPREHENSIVE ERROR STATE DISPLAY */}
          {achievementResult?.error && (
            <div className={`rep-alert ${achievementResult.error.status === 401 ? "warn" : "error"}`}>
              <div className="rep-alert-icon">
                {achievementResult.error.status === 401 ? "🔐" : "⚠️"}
              </div>
              <div className="rep-alert-body">
                <div className="rep-alert-title">
                  {achievementResult.error.status === 401
                    ? "SimpliTrain LMS Authentication Required (HTTP 401)"
                    : `Achievement API Error (${achievementResult.error.status || "Connection Failed"})`}
                </div>
                <p style={{ margin: "4px 0 10px", fontSize: 13 }}>
                  {achievementResult.error.message}
                </p>

                {/* Quick actions for 401 */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn primary sm"
                    onClick={() => setIsTokenModalOpen(true)}
                  >
                    Enter API Bearer Token
                  </button>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={handleToggleDemoMode}
                  >
                    {isDemoMode ? "Exit Demo Mode" : "Explore Demo Sample Data"}
                  </button>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={triggerRefresh}
                    disabled={isLoadingAchievements}
                  >
                    Retry Live Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Card with Toolbar & Data Table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Toolbar */}
            <div className="rep-toolbar">
              <div className="rep-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search achievements by learner name, credential ID, course, or certificate title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="rep-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by certificate status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active &amp; Compliant</option>
                <option value="expiring soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>

              {/* Demo Mode Badge / Toggle */}
              {isDemoMode && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "var(--accent-soft)",
                    color: "var(--accent-text)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></span>
                  Previewing Demo Records
                </span>
              )}
            </div>

            {/* Table */}
            <div className="rep-table-wrap">
              <table className="rep-table">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Achievement / Credential</th>
                    <th>Course Program</th>
                    <th>Issue Date</th>
                    <th>Expiration</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingAchievements ? (
                    // Skeleton shimmer
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`skel-${i}`} className="rep-skeleton-row">
                        <td><div className="rep-skeleton-bar" style={{ width: "80%" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "90%" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "70%" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "50%" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "50%" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "40px" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "60px" }}></div></td>
                        <td><div className="rep-skeleton-bar" style={{ width: "50px", marginLeft: "auto" }}></div></td>
                      </tr>
                    ))
                  ) : displayedAchievements.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
                        <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text)" }}>
                          No Achievement Records Found
                        </div>
                        <p style={{ color: "var(--muted)", fontSize: 13, maxWidth: 440, margin: "6px auto 16px" }}>
                          {achievementResult?.error?.status === 401
                            ? "Authentication is required to query live achievement records from lmsapidev.simplitrain.net."
                            : searchQuery || statusFilter !== "all"
                            ? "Try adjusting your search criteria or clearing filters to locate certificates."
                            : "No achievements have been recorded in the current organization yet."}
                        </p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                          {achievementResult?.error?.status === 401 ? (
                            <>
                              <button
                                type="button"
                                className="btn primary sm"
                                onClick={() => setIsTokenModalOpen(true)}
                              >
                                Configure Bearer Token
                              </button>
                              <button
                                type="button"
                                className="btn sm"
                                onClick={handleToggleDemoMode}
                              >
                                Load Sample Data
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="btn sm"
                              onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("all");
                              }}
                            >
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedAchievements.map((item) => {
                      const statusClass =
                        item.status === "Active"
                          ? "active"
                          : item.status === "Expiring Soon"
                          ? "expiring"
                          : item.status === "Expired"
                          ? "expired"
                          : "revoked";

                      return (
                        <tr key={item.id}>
                          <td>
                            <strong style={{ display: "block", color: "var(--text)" }}>{item.userName}</strong>
                            <span style={{ fontSize: 12, color: "var(--muted)" }}>{item.userEmail}</span>
                          </td>
                          <td>
                            <strong style={{ display: "block" }}>{item.achievementName}</strong>
                            <code style={{ fontSize: 11.5, color: "var(--muted)" }}>ID: {item.credentialId}</code>
                          </td>
                          <td>
                            <span style={{ fontSize: 13 }}>{item.courseName}</span>
                            {item.organizationName && (
                              <span style={{ display: "block", fontSize: 11.5, color: "var(--muted)" }}>
                                {item.organizationName}
                              </span>
                            )}
                          </td>
                          <td style={{ whiteSpace: "nowrap", fontSize: 12.5 }}>{item.issueDate}</td>
                          <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: item.expirationDate ? "inherit" : "var(--muted)" }}>
                            {item.expirationDate || "Permanent / No Expiry"}
                          </td>
                          <td>
                            {item.score !== null ? (
                              <span style={{ fontWeight: 700, color: item.score >= 80 ? "var(--success-text)" : "var(--warn-text)" }}>
                                {item.score}%
                              </span>
                            ) : (
                              <span style={{ color: "var(--muted)" }}>N/A</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge-status ${statusClass}`}>
                              {item.status === "Active" && "✓ "}
                              {item.status === "Expiring Soon" && "⚠ "}
                              {item.status === "Expired" && "✕ "}
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            <button
                              type="button"
                              className="btn sm"
                              style={{ padding: "4px 10px", fontSize: 12 }}
                              onClick={() => setSelectedAchievement(item)}
                            >
                              View Credential
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="rep-pagination">
              <div>
                Showing <strong>{displayedAchievements.length}</strong> of{" "}
                <strong>{achievementResult?.total ?? displayedAchievements.length}</strong> achievements
                {isDemoMode && " (Demo dataset)"}
              </div>

              <div className="rep-pagination-actions">
                <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  Rows per page:
                  <select
                    className="rep-select"
                    style={{ padding: "4px 8px", fontSize: 12 }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </label>

                <button
                  type="button"
                  className="btn sm"
                  disabled={page <= 1 || isLoadingAchievements}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span style={{ fontSize: 12, fontWeight: 500 }}>
                  Page {page} of {achievementResult?.totalPages || 1}
                </span>
                <button
                  type="button"
                  className="btn sm"
                  disabled={page >= (achievementResult?.totalPages || 1) || isLoadingAchievements}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gap: 20 }}>
          {/* 4 Summary KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Avg Attendance</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", margin: "4px 0" }}>91.2%</div>
              <div style={{ fontSize: 12, color: "var(--success-text)" }}>↑ +2.4% vs last month</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Total Completions</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", margin: "4px 0" }}>1,482</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Across 28 published courses</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Assessment Pass Rate</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", margin: "4px 0" }}>86.5%</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>80% minimum threshold</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Security MFA Enforced</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--success-text)", margin: "4px 0" }}>98.2%</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Zero security breaches</div>
            </div>
          </div>

          {/* Quick Reports Directory */}
          <div className="card">
            <h2 style={{ margin: "0 0 6px", fontSize: 16 }}>Enterprise Quick Reports</h2>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
              Pre-filtered search reports designed for auditors, department heads, and compliance officers.
            </p>

            <div className="rep-grid">
              <div className="rep-tile" onClick={() => setActiveTab("achievements")}>
                <div className="rep-tile-icon">🏆</div>
                <div>
                  <div className="rep-tile-title">Learner Achievements &amp; Certs</div>
                  <div className="rep-tile-desc">Direct search from lmsapidev.simplitrain.net for accredited certificates.</div>
                </div>
              </div>

              <div className="rep-tile" onClick={() => setActiveTab("attendance")}>
                <div className="rep-tile-icon">📋</div>
                <div>
                  <div className="rep-tile-title">Class Attendance Audit</div>
                  <div className="rep-tile-desc">Roster tracking, session headcounts &amp; absence reasons.</div>
                </div>
              </div>

              <div className="rep-tile" onClick={() => setActiveTab("signins")}>
                <div className="rep-tile-icon">🔐</div>
                <div>
                  <div className="rep-tile-title">Security &amp; Sign-in Audit</div>
                  <div className="rep-tile-desc">IP addresses, MFA pass rates &amp; browser fingerprints.</div>
                </div>
              </div>

              <div className="rep-tile" onClick={() => setActiveTab("activity")}>
                <div className="rep-tile-icon">📊</div>
                <div>
                  <div className="rep-tile-title">Learner Time &amp; Activity</div>
                  <div className="rep-tile-desc">Hours spent per syllabus module and completion dates.</div>
                </div>
              </div>

              <div className="rep-tile" onClick={() => setActiveTab("meetings")}>
                <div className="rep-tile-icon">📹</div>
                <div>
                  <div className="rep-tile-title">Virtual Classrooms (Zoom)</div>
                  <div className="rep-tile-desc">Teleconference attendance duration and host stats.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLASS ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="rep-table-wrap">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Class / Cohort</th>
                  <th>Session Timestamp</th>
                  <th>Instructor</th>
                  <th>Enrolled Roster</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_ATTENDANCE.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ display: "block" }}>{r.className}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>ID: {r.id}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{r.sessionDate}</td>
                    <td>{r.instructor}</td>
                    <td>{r.totalRoster} learners</td>
                    <td style={{ color: "var(--success-text)", fontWeight: 600 }}>{r.present}</td>
                    <td style={{ color: r.absent > 0 ? "var(--danger-text)" : "var(--muted)" }}>{r.absent}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 700,
                          background: r.attendanceRate >= 90 ? "var(--success-soft)" : "var(--warn-soft)",
                          color: r.attendanceRate >= 90 ? "var(--success-text)" : "var(--warn-text)",
                        }}
                      >
                        {r.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SIGN-IN HISTORY */}
      {activeTab === "signins" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="rep-table-wrap">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Geographic Location</th>
                  <th>Device / Browser Client</th>
                  <th>Sign-in Timestamp</th>
                  <th>MFA Verified</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_SIGNINS.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ display: "block" }}>{s.userName}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{s.userEmail}</span>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 12.5 }}>{s.ipAddress}</td>
                    <td>{s.location}</td>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>{s.deviceBrowser}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5 }}>{s.timestamp}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 7px",
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: s.mfaVerified ? "var(--success-soft)" : "var(--warn-soft)",
                          color: s.mfaVerified ? "var(--success-text)" : "var(--warn-text)",
                        }}
                      >
                        {s.mfaVerified ? "✓ Verified" : "⚠ Not Verified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USER ACTIVITY */}
      {activeTab === "activity" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="rep-table-wrap">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Course Syllabus</th>
                  <th>Module Progress</th>
                  <th>Time in LMS</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_ACTIVITY.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong style={{ display: "block" }}>{a.userName}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{a.userEmail}</span>
                    </td>
                    <td>{a.courseTitle}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{a.modulesCompleted} / {a.totalModules}</span>
                        <div style={{ width: 60, height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${(a.modulesCompleted / a.totalModules) * 100}%`, height: "100%", background: "var(--accent)" }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{a.timeSpentHours} hrs</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{a.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: VIRTUAL MEETINGS */}
      {activeTab === "meetings" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="rep-table-wrap">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Meeting Topic</th>
                  <th>Provider</th>
                  <th>Meeting Host</th>
                  <th>Duration</th>
                  <th>Attendees</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_MEETINGS.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.topic}</strong>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>ID: {m.id}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          background: "var(--accent-soft)",
                          color: "var(--accent-text)",
                          fontWeight: 500,
                        }}
                      >
                        {m.platform}
                      </span>
                    </td>
                    <td>{m.host}</td>
                    <td>{m.durationMins} minutes</td>
                    <td style={{ fontWeight: 600 }}>{m.participantsCount} participants</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOKEN CONFIGURATION MODAL */}
      {isTokenModalOpen && (
        <div className="rep-modal-overlay" onClick={() => setIsTokenModalOpen(false)}>
          <div className="rep-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rep-modal-header">
              <h3>Configure SimpliTrain API Token</h3>
              <button
                type="button"
                className="btn sm"
                style={{ border: "none", background: "none", fontSize: 16 }}
                onClick={() => setIsTokenModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="rep-modal-body">
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.5 }}>
                The endpoint <code>https://lmsapidev.simplitrain.net/api/v3/Achievement/Search</code> requires an authenticated JWT Bearer token. Paste your token below to authenticate requests from your browser session.
              </p>

              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Bearer Token / API Key
              </label>
              <textarea
                rows={4}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                  fontFamily: "monospace",
                  fontSize: 12,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />

              <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
                💡 Token is stored safely in your browser session/localStorage and forwarded as <code>Authorization: Bearer &lt;token&gt;</code>.
              </div>
            </div>
            <div className="rep-modal-footer">
              {hasToken && (
                <button
                  type="button"
                  className="btn sm"
                  style={{ marginRight: "auto", color: "var(--danger-text, #b91c1c)" }}
                  onClick={handleClearToken}
                >
                  Clear Token
                </button>
              )}
              <button
                type="button"
                className="btn sm"
                onClick={() => setIsTokenModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn primary sm"
                onClick={handleSaveToken}
              >
                Save &amp; Fetch Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREDENTIAL DETAIL MODAL */}
      {selectedAchievement && (
        <div className="rep-modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="rep-modal-card" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="rep-modal-header">
              <h3>Certificate &amp; Credential Verification</h3>
              <button
                type="button"
                className="btn sm"
                style={{ border: "none", background: "none", fontSize: 16 }}
                onClick={() => setSelectedAchievement(null)}
              >
                ✕
              </button>
            </div>
            <div className="rep-modal-body">
              {/* Certificate Decorative Card */}
              <div
                style={{
                  border: "2px solid var(--accent)",
                  borderRadius: 12,
                  padding: 24,
                  background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)",
                  textAlign: "center",
                  marginBottom: 18,
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>🎖️</div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)" }}>
                  Certificate of Achievement
                </div>
                <h2 style={{ fontSize: 20, margin: "10px 0 6px", color: "var(--text)" }}>
                  {selectedAchievement.achievementName}
                </h2>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                  Awarded to <strong>{selectedAchievement.userName}</strong> ({selectedAchievement.userEmail})
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: "1px dashed var(--border)", paddingTop: 14, textAlign: "left", fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Curriculum / Program:</span>
                    <strong>{selectedAchievement.courseName}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Credential Verification ID:</span>
                    <code style={{ fontWeight: 700 }}>{selectedAchievement.credentialId}</code>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Date Issued:</span>
                    <strong>{selectedAchievement.issueDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Expiration Date:</span>
                    <strong>{selectedAchievement.expirationDate || "Permanent (No Expiry)"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Examination Score:</span>
                    <strong>{selectedAchievement.score !== null ? `${selectedAchievement.score}%` : "Passed"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Status:</span>
                    <strong style={{ color: selectedAchievement.status === "Active" ? "var(--success-text)" : "inherit" }}>
                      {selectedAchievement.status}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                Issuer: SimpliTrain Accreditation Authority • Verified against API v3 Achievement Registry
              </div>
            </div>
            <div className="rep-modal-footer">
              <button
                type="button"
                className="btn sm"
                onClick={() => window.print()}
              >
                Print Certificate
              </button>
              <button
                type="button"
                className="btn primary sm"
                onClick={() => setSelectedAchievement(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ReportsPanel as ReportsHub };
export default ReportsPanel;
