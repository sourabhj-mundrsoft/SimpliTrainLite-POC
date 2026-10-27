"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./comms.css";

interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: "All Learners" | "Engineering Cohort" | "Leadership Team" | "New Hires";
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: "Normal" | "High" | "Urgent";
}

interface DiscussionThread {
  id: string;
  title: string;
  course: string;
  author: string;
  authorRole: string;
  repliesCount: number;
  lastActivity: string;
  isPinned: boolean;
  isLocked: boolean;
}

interface NotificationTemplate {
  id: string;
  event: string;
  sentTo: string;
  subject: string;
  body: string;
  isEnabled: boolean;
  lastModified: string;
}

interface SentNotification {
  id: string;
  recipient: string;
  recipientEmail: string;
  event: string;
  subject: string;
  sentAt: string;
  status: "Delivered" | "Pending" | "Bounced";
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Annual SOC-2 Compliance Training Window Open",
    message: "All engineering and operations staff must complete the updated 2026 modules before November 15.",
    audience: "All Learners",
    startDate: "2026-10-01",
    endDate: "2026-11-15",
    isActive: true,
    priority: "High",
  },
  {
    id: "ann-02",
    title: "Scheduled Maintenance: Weekend Learning Portal Upgrade",
    message: "The platform will undergo scheduled infrastructure maintenance on Saturday from 02:00 to 04:00 UTC.",
    audience: "All Learners",
    startDate: "2026-10-25",
    endDate: "2026-10-31",
    isActive: true,
    priority: "Normal",
  },
  {
    id: "ann-03",
    title: "Q4 New Manager Orientation Cohort Welcome",
    message: "Welcome to our upcoming management batch! Please review the prerequisite reading ahead of Session 1.",
    audience: "Leadership Team",
    startDate: "2026-10-15",
    endDate: "2026-11-01",
    isActive: true,
    priority: "Normal",
  },
  {
    id: "ann-04",
    title: "Legacy Browser Support Retirement Notice",
    message: "Effective December 1, access via Internet Explorer and legacy Edge will be deprecated.",
    audience: "All Learners",
    startDate: "2026-08-01",
    endDate: "2026-10-20",
    isActive: false,
    priority: "Normal",
  },
];

const INITIAL_DISCUSSIONS: DiscussionThread[] = [
  {
    id: "th-01",
    title: "Best practices for setting up 2FA hardware keys with Okta",
    course: "Cybersecurity & Phishing Defense",
    author: "Jordan Hayes",
    authorRole: "Learner",
    repliesCount: 7,
    lastActivity: "2026-10-27 10:14",
    isPinned: true,
    isLocked: false,
  },
  {
    id: "th-02",
    title: "Question on Module 3: Calculating Ergonomic Screen Height",
    course: "Workplace Health & Ergonomics",
    author: "Elena Rostova",
    authorRole: "Instructor",
    repliesCount: 12,
    lastActivity: "2026-10-26 18:30",
    isPinned: false,
    isLocked: false,
  },
  {
    id: "th-03",
    title: "Clarification regarding GDPR Article 17 Data Erasure Deadlines",
    course: "Data Privacy & GDPR Fundamentals",
    author: "Marcus Vance",
    authorRole: "Learner",
    repliesCount: 3,
    lastActivity: "2026-10-25 14:02",
    isPinned: false,
    isLocked: false,
  },
  {
    id: "th-04",
    title: "De-escalation scenario roleplay recordings uploaded",
    course: "Customer Service Scenarios",
    author: "Sarah Lin",
    authorRole: "Instructor",
    repliesCount: 19,
    lastActivity: "2026-10-24 16:45",
    isPinned: true,
    isLocked: true,
  },
];

const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: "tpl-01",
    event: "Course Assigned",
    sentTo: "Learner",
    subject: "New course assigned: {course name}",
    body: "Hi {learner name},\n\nYou have been assigned the course {course name}. Sign in to start learning:\n{site URL}\n\nRegards,\nSimpliTrain Lite Admin",
    isEnabled: true,
    lastModified: "2026-10-12",
  },
  {
    id: "tpl-02",
    event: "Course Completed",
    sentTo: "Learner",
    subject: "Congratulations on completing {course name}!",
    body: "Hi {learner name},\n\nCongratulations! You have successfully completed {course name}. Your certificate of completion is now available in your profile.\n\nKeep up the great work!\nSimpliTrain Team",
    isEnabled: true,
    lastModified: "2026-10-15",
  },
  {
    id: "tpl-03",
    event: "Live Class Session Reminder",
    sentTo: "Enrolled Learners, Instructor",
    subject: "Reminder: {session name} starts tomorrow",
    body: "Hi {learner name},\n\nThis is a quick reminder that your scheduled session {session name} begins tomorrow at {session start}.\n\nMeeting link: {location or meeting link}\n\nSee you there!",
    isEnabled: true,
    lastModified: "2026-09-28",
  },
  {
    id: "tpl-04",
    event: "Certificate Expiration Notice",
    sentTo: "Learner",
    subject: "Action Required: Your certificate {certificate name} expires soon",
    body: "Hi {learner name},\n\nYour certificate {certificate name} is scheduled to expire in 30 days. Please retake the certification assessment to maintain compliance.\n\nSimpliTrain Compliance Portal",
    isEnabled: true,
    lastModified: "2026-10-19",
  },
  {
    id: "tpl-05",
    event: "New User Welcome",
    sentTo: "New User",
    subject: "Welcome to SimpliTrain Lite - Set your password",
    body: "Welcome to SimpliTrain Lite!\n\nAn account has been created for you. Click the link below to initialize your credentials:\n{password reset link}\n\nHappy Learning!",
    isEnabled: true,
    lastModified: "2026-08-10",
  },
];

const INITIAL_SENT_LOG: SentNotification[] = [
  {
    id: "log-1",
    recipient: "Aarav Sharma",
    recipientEmail: "aarav.sharma@example.com",
    event: "Course Completed",
    subject: "Congratulations on completing Workplace Health & Ergonomics",
    sentAt: "2026-10-27 11:20",
    status: "Delivered",
  },
  {
    id: "log-2",
    recipient: "Priya Patel",
    recipientEmail: "priya.patel@example.com",
    event: "Live Class Session Reminder",
    subject: "Reminder: Q4 Privacy Deep-Dive starts tomorrow",
    sentAt: "2026-10-27 09:00",
    status: "Delivered",
  },
  {
    id: "log-3",
    recipient: "David Kim",
    recipientEmail: "david.kim@example.com",
    event: "Course Assigned",
    subject: "New course assigned: Code Review Standards",
    sentAt: "2026-10-26 14:15",
    status: "Delivered",
  },
  {
    id: "log-4",
    recipient: "Invalid Address",
    recipientEmail: "temp.contractor@inactive-domain.net",
    event: "New User Welcome",
    subject: "Welcome to SimpliTrain Lite",
    sentAt: "2026-10-25 16:30",
    status: "Bounced",
  },
];

export default function CommsPage() {
  const [activeTab, setActiveTab] = useState<"announcements" | "discussions" | "templates" | "log">("announcements");

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [annSearch, setAnnSearch] = useState("");
  const [annStatusFilter, setAnnStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isNewAnnModalOpen, setIsNewAnnModalOpen] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnMessage, setNewAnnMessage] = useState("");
  const [newAnnAudience, setNewAnnAudience] = useState<"All Learners" | "Engineering Cohort" | "Leadership Team" | "New Hires">("All Learners");
  const [newAnnPriority, setNewAnnPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [newAnnEndDate, setNewAnnEndDate] = useState("2026-11-30");

  // Template editor modal state
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  // Discussions state
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(INITIAL_DISCUSSIONS);
  const [discSearch, setDiscSearch] = useState("");

  // Templates state
  const [templates, setTemplates] = useState<NotificationTemplate[]>(INITIAL_TEMPLATES);

  // Sent log state
  const [sentLog] = useState<SentNotification[]>(INITIAL_SENT_LOG);

  // Filter announcements
  const filteredAnnouncements = announcements.filter((a) => {
    if (annStatusFilter === "active" && !a.isActive) return false;
    if (annStatusFilter === "inactive" && a.isActive) return false;
    if (annSearch && !a.title.toLowerCase().includes(annSearch.toLowerCase()) && !a.message.toLowerCase().includes(annSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Filter discussions
  const filteredDiscussions = discussions.filter((d) => {
    if (discSearch && !d.title.toLowerCase().includes(discSearch.toLowerCase()) && !d.course.toLowerCase().includes(discSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Toggle announcement active
  const toggleAnnActive = (id: string) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  // Toggle template enabled
  const toggleTemplateEnabled = (id: string) => {
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  };

  // Create announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnMessage.trim()) return;

    const newA: Announcement = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title: newAnnTitle.trim(),
      message: newAnnMessage.trim(),
      audience: newAnnAudience,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: newAnnEndDate,
      isActive: true,
      priority: newAnnPriority,
    };

    setAnnouncements([newA, ...announcements]);
    setIsNewAnnModalOpen(false);
    setNewAnnTitle("");
    setNewAnnMessage("");
  };

  // Save template edit
  const handleSaveTemplateEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setTemplates(
      templates.map((t) => (t.id === editingTemplate.id ? { ...editingTemplate, lastModified: new Date().toISOString().slice(0, 10) } : t))
    );
    setEditingTemplate(null);
  };

  // Export CSV
  const handleExportAnnouncementsCsv = () => {
    const headers = ["ID", "Title", "Audience", "Priority", "Start Date", "End Date", "Active", "Message"];
    const rows = announcements.map((a) => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      a.audience,
      a.priority,
      a.startDate,
      a.endDate,
      a.isActive ? "Yes" : "No",
      `"${a.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Announcements_Export.csv");
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
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Communications</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>{activeTab}</span>
      </nav>

      {/* Header */}
      <div className="comms-header">
        <div>
          <h1>Communications Hub</h1>
          <p className="sub">
            Broadcast platform announcements, moderate course discussion forums, and configure automated notification email templates.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {activeTab === "announcements" && (
            <>
              <button
                type="button"
                className="btn"
                onClick={handleExportAnnouncementsCsv}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => setIsNewAnnModalOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Announcement
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="comms-subnav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          <span>Announcements</span>
          <span className="count-badge">{announcements.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "discussions" ? "active" : ""}`}
          onClick={() => setActiveTab("discussions")}
        >
          <span>Discussion Forums</span>
          <span className="count-badge">{discussions.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          <span>Notification Templates</span>
          <span className="count-badge">{templates.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "log" ? "active" : ""}`}
          onClick={() => setActiveTab("log")}
        >
          <span>Sent Log</span>
          <span className="count-badge">{sentLog.length}</span>
        </button>
      </div>

      {/* TAB 1: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="comms-toolbar">
            <div className="comms-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search announcements by title or content..."
                value={annSearch}
                onChange={(e) => setAnnSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Status:</span>
              <select
                value={annStatusFilter}
                onChange={(e) => setAnnStatusFilter(e.target.value as any)}
                style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              >
                <option value="all">All Announcements</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </div>

            {(annSearch || annStatusFilter !== "all") && (
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => {
                  setAnnSearch("");
                  setAnnStatusFilter("all");
                }}
              >
                Clear filters
              </button>
            )}

            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              Showing <strong>{filteredAnnouncements.length}</strong> of {announcements.length} announcements
            </div>
          </div>

          <div className="comms-table-wrap">
            <table className="comms-table">
              <thead>
                <tr>
                  <th>Announcement Title</th>
                  <th>Target Audience</th>
                  <th>Priority</th>
                  <th>Starts Date</th>
                  <th>Expires Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
                      No announcements match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAnnouncements.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <span className="comms-cell-title">{a.title}</span>
                        <div className="comms-cell-sub">{a.message}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 11.5,
                            background: "var(--surface-2)",
                            color: "var(--text)",
                            fontWeight: 500,
                          }}
                        >
                          {a.audience}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 7px",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            background: a.priority === "High" ? "var(--warn-soft)" : "var(--surface-2)",
                            color: a.priority === "High" ? "var(--warn-text)" : "var(--muted)",
                          }}
                        >
                          {a.priority}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{a.startDate}</td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{a.endDate}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleAnnActive(a.id)}
                          style={{
                            background: a.isActive ? "var(--success-soft)" : "var(--surface-2)",
                            color: a.isActive ? "var(--success-text)" : "var(--muted)",
                            border: "none",
                            borderRadius: 4,
                            padding: "3px 8px",
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {a.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm ghost"
                            style={{ color: "var(--danger-text)" }}
                            onClick={() => {
                              if (confirm(`Delete announcement "${a.title}"?`)) {
                                setAnnouncements(announcements.filter((item) => item.id !== a.id));
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISCUSSIONS */}
      {activeTab === "discussions" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="comms-toolbar">
            <div className="comms-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search forum topics or course..."
                value={discSearch}
                onChange={(e) => setDiscSearch(e.target.value)}
              />
            </div>
            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              {filteredDiscussions.length} discussion threads
            </div>
          </div>

          <div>
            {filteredDiscussions.map((d) => (
              <div key={d.id} className="disc-item">
                <div className="disc-avatar">
                  {d.author.charAt(0)}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    {d.isPinned && (
                      <span style={{ fontSize: 11, background: "var(--accent-soft)", color: "var(--accent-text)", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
                        📌 Pinned
                      </span>
                    )}
                    {d.isLocked && (
                      <span style={{ fontSize: 11, background: "var(--surface-2)", color: "var(--muted)", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
                        🔒 Locked
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{d.course}</span>
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                    {d.title}
                  </h4>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    Started by <strong>{d.author}</strong> ({d.authorRole}) · Last updated: {d.lastActivity}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                    {d.repliesCount}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>replies</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATION TEMPLATES */}
      {activeTab === "templates" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="comms-table-wrap">
            <table className="comms-table">
              <thead>
                <tr>
                  <th>Event Trigger</th>
                  <th>Sent To</th>
                  <th>Email Subject</th>
                  <th>Enabled</th>
                  <th>Last Modified</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong style={{ display: "block" }}>{t.event}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>ID: {t.id}</span>
                    </td>
                    <td>{t.sentTo}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12.5 }}>{t.subject}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleTemplateEnabled(t.id)}
                        style={{
                          background: t.isEnabled ? "var(--success-soft)" : "var(--surface-2)",
                          color: t.isEnabled ? "var(--success-text)" : "var(--muted)",
                          border: "none",
                          borderRadius: 4,
                          padding: "3px 8px",
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {t.isEnabled ? "On" : "Off"}
                      </button>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{t.lastModified}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => setEditingTemplate(t)}
                        >
                          Edit Template
                        </button>
                        <button
                          type="button"
                          className="btn sm ghost"
                          onClick={() => alert(`Test notification for "${t.event}" dispatched to admin inbox!`)}
                        >
                          Send Test
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SENT LOG */}
      {activeTab === "log" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="comms-table-wrap">
            <table className="comms-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Notification Event</th>
                  <th>Subject Line</th>
                  <th>Dispatched Timestamp</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {sentLog.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong style={{ display: "block" }}>{log.recipient}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{log.recipientEmail}</span>
                    </td>
                    <td>{log.event}</td>
                    <td style={{ fontSize: 13 }}>{log.subject}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{log.sentAt}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 7px",
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background:
                            log.status === "Delivered"
                              ? "var(--success-soft)"
                              : log.status === "Bounced"
                              ? "var(--danger-soft)"
                              : "var(--warn-soft)",
                          color:
                            log.status === "Delivered"
                              ? "var(--success-text)"
                              : log.status === "Bounced"
                              ? "var(--danger-text)"
                              : "var(--warn-text)",
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE ANNOUNCEMENT */}
      {isNewAnnModalOpen && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <form className="modal" onSubmit={handleCreateAnnouncement} style={{ width: "100%", maxWidth: 580, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Create Platform Announcement</h2>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Scheduled Maintenance Window"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Target Audience</label>
                <select
                  value={newAnnAudience}
                  onChange={(e) => setNewAnnAudience(e.target.value as any)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                >
                  <option>All Learners</option>
                  <option>Engineering Cohort</option>
                  <option>Leadership Team</option>
                  <option>New Hires</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Priority Level</label>
                <select
                  value={newAnnPriority}
                  onChange={(e) => setNewAnnPriority(e.target.value as any)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                >
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Expiration Date</label>
              <input
                type="date"
                value={newAnnEndDate}
                onChange={(e) => setNewAnnEndDate(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div className="field">
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Announcement Message Body *</label>
              <textarea
                rows={4}
                required
                placeholder="Details of the announcement displayed in learner notification banners..."
                value={newAnnMessage}
                onChange={(e) => setNewAnnMessage(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setIsNewAnnModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Publish Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: EDIT TEMPLATE */}
      {editingTemplate && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <form className="modal" onSubmit={handleSaveTemplateEdit} style={{ width: "100%", maxWidth: 840, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase" }}>Notification Template Editor</span>
                <h2 style={{ margin: "2px 0 0", fontSize: 18 }}>{editingTemplate.event}</h2>
              </div>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => setEditingTemplate(null)}
              >
                ✕
              </button>
            </div>

            <div className="tpl-edit-grid">
              <div style={{ display: "grid", gap: 14 }}>
                <div className="field">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Subject *</label>
                  <input
                    type="text"
                    required
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                  />
                </div>

                <div className="field">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Body Content (Plain text / Markdown) *</label>
                  <textarea
                    rows={8}
                    required
                    value={editingTemplate.body}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", fontFamily: "monospace", fontSize: 13, resize: "vertical" }}
                  />
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>Available Placeholders</h4>
                <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--muted)" }}>
                  Click to copy tag into template:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {[
                    "{course name}",
                    "{learner name}",
                    "{learner email}",
                    "{session name}",
                    "{session start}",
                    "{location or meeting link}",
                    "{certificate name}",
                    "{site URL}",
                    "{password reset link}",
                  ].map((ph) => (
                    <span
                      key={ph}
                      className="ph-chip"
                      onClick={() => {
                        setEditingTemplate({
                          ...editingTemplate,
                          body: editingTemplate.body + " " + ph,
                        });
                      }}
                      title="Click to append to email body"
                    >
                      {ph}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setEditingTemplate(null)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Save Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
