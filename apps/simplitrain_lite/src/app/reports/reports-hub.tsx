"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./reports.css";

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

export function ReportsHub() {
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "signins" | "activity" | "meetings">("overview");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");

  // Export CSV
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

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard</Link>
        <span>/</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Reports &amp; Analytics</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>{activeTab}</span>
      </nav>

      {/* Header */}
      <div className="rep-header">
        <div>
          <h1>Reports &amp; Analytics</h1>
          <p className="sub">
            Executive intelligence reports with granular auditing for attendance, sign-in security, course consumption, and virtual classrooms.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
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

      {/* Sub-nav Tabs */}
      <div className="rep-subnav">
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

      {/* TAB 1: EXECUTIVE OVERVIEW */}
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

      {/* TAB 2: CLASS ATTENDANCE */}
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

      {/* TAB 3: SIGN-IN HISTORY */}
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

      {/* TAB 4: USER ACTIVITY */}
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

      {/* TAB 5: VIRTUAL MEETINGS */}
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
    </div>
  );
}
