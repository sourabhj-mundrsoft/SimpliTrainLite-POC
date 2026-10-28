"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./quizzes.css";

interface Assessment {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  passingScore: number;
  questionsCount: number;
  created: string;
  modified: string;
}

interface Survey {
  id: string;
  name: string;
  type: "5-Star Likert" | "NPS (0-10)" | "Course Feedback";
  responsesCount: number;
  averageRating: string;
  status: "Active" | "Closed";
  created: string;
}

interface QuizResult {
  id: string;
  learnerName: string;
  learnerEmail: string;
  quizName: string;
  score: number;
  passingScore: number;
  passed: boolean;
  timeSpent: string;
  date: string;
}

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "q-001",
    name: "Customer Service Scenarios & Escalations",
    desc: "Role-play scenarios for front-desk and support teams.",
    enabled: true,
    passingScore: 80,
    questionsCount: 10,
    created: "2026-10-08",
    modified: "2026-10-12 09:05",
  },
  {
    id: "q-002",
    name: "Data Privacy & GDPR Fundamentals Assessment",
    desc: "PRIV-110 mandatory final check, 20 questions.",
    enabled: true,
    passingScore: 85,
    questionsCount: 20,
    created: "2026-06-14",
    modified: "2026-10-02 16:30",
  },
  {
    id: "q-003",
    name: "Workplace Safety & Ergonomics Final Exam",
    desc: "SAFE-101 comprehensive final assessment.",
    enabled: true,
    passingScore: 80,
    questionsCount: 15,
    created: "2026-09-12",
    modified: "2026-10-09 10:20",
  },
  {
    id: "q-004",
    name: "Fire Warden Annual Certification Check",
    desc: "Retired in 2026, replaced by Workplace Safety exam.",
    enabled: false,
    passingScore: 90,
    questionsCount: 12,
    created: "2025-11-18",
    modified: "2026-08-30 17:10",
  },
  {
    id: "q-005",
    name: "Leadership Foundations & Mentorship Quiz",
    desc: "LEAD-200 module 3 check for new managers.",
    enabled: true,
    passingScore: 75,
    questionsCount: 8,
    created: "2026-08-03",
    modified: "2026-08-03 15:25",
  },
];

const INITIAL_SURVEYS: Survey[] = [
  {
    id: "sur-01",
    name: "Post-Course Evaluation: Workplace Safety",
    type: "Course Feedback",
    responsesCount: 142,
    averageRating: "4.8 / 5.0",
    status: "Active",
    created: "2026-09-15",
  },
  {
    id: "sur-02",
    name: "Instructor Effectiveness & Engagement Rating",
    type: "5-Star Likert",
    responsesCount: 89,
    averageRating: "4.9 / 5.0",
    status: "Active",
    created: "2026-09-20",
  },
  {
    id: "sur-03",
    name: "LMS Platform Satisfaction & Net Promoter Score",
    type: "NPS (0-10)",
    responsesCount: 310,
    averageRating: "+64 NPS",
    status: "Active",
    created: "2026-08-01",
  },
];

const INITIAL_RESULTS: QuizResult[] = [
  {
    id: "res-01",
    learnerName: "Aarav Sharma",
    learnerEmail: "aarav.sharma@example.com",
    quizName: "Workplace Safety & Ergonomics Final Exam",
    score: 93,
    passingScore: 80,
    passed: true,
    timeSpent: "14m 20s",
    date: "2026-10-26 15:40",
  },
  {
    id: "res-02",
    learnerName: "Priya Patel",
    learnerEmail: "priya.patel@example.com",
    quizName: "Data Privacy & GDPR Fundamentals Assessment",
    score: 88,
    passingScore: 85,
    passed: true,
    timeSpent: "22m 10s",
    date: "2026-10-25 11:15",
  },
  {
    id: "res-03",
    learnerName: "Jordan Hayes",
    learnerEmail: "jordan.hayes@example.com",
    quizName: "Customer Service Scenarios & Escalations",
    score: 70,
    passingScore: 80,
    passed: false,
    timeSpent: "18m 05s",
    date: "2026-10-24 16:30",
  },
  {
    id: "res-04",
    learnerName: "Elena Rostova",
    learnerEmail: "elena.rostova@example.com",
    quizName: "Leadership Foundations & Mentorship Quiz",
    score: 100,
    passingScore: 75,
    passed: true,
    timeSpent: "09m 45s",
    date: "2026-10-23 14:00",
  },
];

export function AssessmentsPanel() {
  const [activeTab, setActiveTab] = useState<"assessments" | "surveys" | "results" | "builder">("assessments");

  // Assessments state
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [selectedAssessmentForDelete, setSelectedAssessmentForDelete] = useState<Assessment | null>(null);

  // Builder state
  const [builderTitle, setBuilderTitle] = useState("");
  const [builderDesc, setBuilderDesc] = useState("");
  const [builderPassingScore, setBuilderPassingScore] = useState(80);
  const [builderQuestions, setBuilderQuestions] = useState([
    {
      id: 1,
      text: "What is the recommended screen distance for optimal visual comfort?",
      options: [
        { id: "a", text: "10 to 15 inches", isCorrect: false },
        { id: "b", text: "20 to 30 inches (approximately arm's length)", isCorrect: true },
        { id: "c", text: "40 inches or further", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "How often should you follow the 20-20-20 rule during screen work?",
      options: [
        { id: "a", text: "Every 20 minutes, look at an object 20 feet away for 20 seconds", isCorrect: true },
        { id: "b", text: "Every 20 hours, take a 20-minute rest", isCorrect: false },
        { id: "c", text: "Every 20 days, undergo an optical evaluation", isCorrect: false },
      ],
    },
  ]);

  // Filter assessments
  const filteredAssessments = assessments.filter((a) => {
    if (enabledFilter === "enabled" && !a.enabled) return false;
    if (enabledFilter === "disabled" && a.enabled) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.desc.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Toggle enabled
  const toggleEnabled = (id: string) => {
    setAssessments(
      assessments.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  // Delete assessment
  const handleDeleteAssessment = () => {
    if (!selectedAssessmentForDelete) return;
    setAssessments(assessments.filter((a) => a.id !== selectedAssessmentForDelete.id));
    setSelectedAssessmentForDelete(null);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ["ID", "Name", "Description", "Enabled", "Passing Score", "Questions", "Created", "Last Modified"];
    const rows = assessments.map((a) => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.desc.replace(/"/g, '""')}"`,
      a.enabled ? "Yes" : "No",
      `${a.passingScore}%`,
      a.questionsCount,
      a.created,
      a.modified,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Assessments_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save from builder
  const handleSaveAssessmentFromBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderTitle.trim()) {
      alert("Please provide an assessment title.");
      return;
    }

    const newA: Assessment = {
      id: `q-${Date.now().toString().slice(-4)}`,
      name: builderTitle.trim(),
      desc: builderDesc.trim() || "Created via interactive quiz builder.",
      enabled: true,
      passingScore: builderPassingScore,
      questionsCount: builderQuestions.length,
      created: new Date().toISOString().slice(0, 10),
      modified: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setAssessments([newA, ...assessments]);
    setActiveTab("assessments");
    setBuilderTitle("");
    setBuilderDesc("");
  };

  // Add question in builder
  const handleAddQuestion = () => {
    const newId = builderQuestions.length + 1;
    setBuilderQuestions([
      ...builderQuestions,
      {
        id: newId,
        text: `New Assessment Question ${newId}`,
        options: [
          { id: "a", text: "Option A", isCorrect: true },
          { id: "b", text: "Option B", isCorrect: false },
        ],
      },
    ]);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard</Link>
        <span>/</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Assessments &amp; Surveys</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>{activeTab}</span>
      </nav>

      {/* Header */}
      <div className="quiz-header">
        <div>
          <h1>Assessments &amp; Surveys</h1>
          <p className="sub">
            Build scored assessments, compliance examinations, learner sentiment surveys, and monitor certification grade books.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn"
            onClick={handleExportCsv}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => setActiveTab("builder")}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Assessment
          </button>
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="quiz-subnav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "assessments" ? "active" : ""}`}
          onClick={() => setActiveTab("assessments")}
        >
          <span>Assessments</span>
          <span className="count-badge">{assessments.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "surveys" ? "active" : ""}`}
          onClick={() => setActiveTab("surveys")}
        >
          <span>Surveys &amp; Feedback</span>
          <span className="count-badge">{INITIAL_SURVEYS.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          <span>Learner Results</span>
          <span className="count-badge">{INITIAL_RESULTS.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "builder" ? "active" : ""}`}
          onClick={() => setActiveTab("builder")}
        >
          <span>Interactive Quiz Builder</span>
        </button>
      </div>

      {/* TAB 1: ASSESSMENTS LIST */}
      {activeTab === "assessments" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="quiz-toolbar">
            <div className="quiz-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Assessment name contains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Status:</span>
              <select
                value={enabledFilter}
                onChange={(e) => setEnabledFilter(e.target.value as "all" | "enabled" | "disabled")}
                style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              >
                <option value="all">All</option>
                <option value="enabled">Enabled only</option>
                <option value="disabled">Disabled only</option>
              </select>
            </div>

            {(searchQuery || enabledFilter !== "all") && (
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => {
                  setSearchQuery("");
                  setEnabledFilter("all");
                }}
              >
                Clear filters
              </button>
            )}

            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              Showing <strong>{filteredAssessments.length}</strong> of {assessments.length} assessments
            </div>
          </div>

          <div className="quiz-table-wrap">
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>Assessment Name</th>
                  <th>Status</th>
                  <th>Questions</th>
                  <th>Pass Threshold</th>
                  <th>Created</th>
                  <th>Last Modified</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
                      No assessments found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <span className="quiz-cell-title">{a.name}</span>
                        <div className="quiz-cell-sub">{a.desc}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleEnabled(a.id)}
                          style={{
                            background: a.enabled ? "var(--success-soft)" : "var(--surface-2)",
                            color: a.enabled ? "var(--success-text)" : "var(--muted)",
                            border: "none",
                            borderRadius: 4,
                            padding: "3px 8px",
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                          title="Click to toggle status"
                        >
                          {a.enabled ? "Enabled" : "Disabled"}
                        </button>
                      </td>
                      <td>{a.questionsCount} questions</td>
                      <td style={{ fontWeight: 600 }}>{a.passingScore}%</td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{a.created}</td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{a.modified}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => {
                              setBuilderTitle(a.name);
                              setBuilderDesc(a.desc);
                              setBuilderPassingScore(a.passingScore);
                              setActiveTab("builder");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn sm ghost"
                            style={{ color: "var(--danger-text)" }}
                            onClick={() => setSelectedAssessmentForDelete(a)}
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

      {/* TAB 2: SURVEYS */}
      {activeTab === "surveys" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="quiz-table-wrap">
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>Survey Name</th>
                  <th>Evaluation Format</th>
                  <th>Submissions</th>
                  <th>Aggregate Score</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_SURVEYS.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="quiz-cell-title">{s.name}</span>
                      <div className="quiz-cell-sub">ID: {s.id}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11.5,
                          background: "var(--accent-soft)",
                          color: "var(--accent-text)",
                          fontWeight: 500,
                        }}
                      >
                        {s.type}
                      </span>
                    </td>
                    <td>{s.responsesCount} responses</td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>{s.averageRating}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 7px",
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: s.status === "Active" ? "var(--success-soft)" : "var(--surface-2)",
                          color: s.status === "Active" ? "var(--success-text)" : "var(--muted)",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{s.created}</td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" className="btn sm">View Analytics</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEARNER RESULTS */}
      {activeTab === "results" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="quiz-table-wrap">
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Assessment Taken</th>
                  <th>Score</th>
                  <th>Outcome</th>
                  <th>Time Taken</th>
                  <th>Completed At</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_RESULTS.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ display: "block" }}>{r.learnerName}</strong>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.learnerEmail}</span>
                    </td>
                    <td>{r.quizName}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, minWidth: 36 }}>{r.score}%</span>
                        <div style={{ flex: 1, maxWidth: 100, height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${r.score}%`,
                              height: "100%",
                              background: r.passed ? "var(--success)" : "var(--danger)",
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: r.passed ? "var(--success-soft)" : "var(--danger-soft)",
                          color: r.passed ? "var(--success-text)" : "var(--danger-text)",
                        }}
                      >
                        {r.passed ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{r.timeSpent}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ BUILDER */}
      {activeTab === "builder" && (
        <form onSubmit={handleSaveAssessmentFromBuilder} style={{ maxWidth: 840, display: "grid", gap: 20 }}>
          <div className="card">
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Assessment Configuration</h2>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Assessment Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Q4 Information Security Certification"
                value={builderTitle}
                onChange={(e) => setBuilderTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Description / Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Instructions displayed to learners prior to initiating the assessment..."
                value={builderDesc}
                onChange={(e) => setBuilderDesc(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", resize: "vertical" }}
              />
            </div>

            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Passing Score Required</span>
                <span style={{ fontWeight: 700, color: "var(--accent)" }}>{builderPassingScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={builderPassingScore}
                onChange={(e) => setBuilderPassingScore(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          </div>

          {/* Questions builder */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Questions ({builderQuestions.length})</h3>
              <button
                type="button"
                className="btn sm"
                onClick={handleAddQuestion}
              >
                + Add Question
              </button>
            </div>

            {builderQuestions.map((q, qIdx) => (
              <div key={q.id} className="qb-card">
                <div className="qb-card-header">
                  <strong style={{ fontSize: 14, color: "var(--accent)" }}>Question {qIdx + 1}</strong>
                  <button
                    type="button"
                    className="btn xs ghost"
                    style={{ color: "var(--danger-text)" }}
                    onClick={() => {
                      if (builderQuestions.length > 1) {
                        setBuilderQuestions(builderQuestions.filter((_, i) => i !== qIdx));
                      }
                    }}
                  >
                    Delete Question
                  </button>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => {
                      const updated = [...builderQuestions];
                      updated[qIdx].text = e.target.value;
                      setBuilderQuestions(updated);
                    }}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>
                    Select the radio button next to the correct answer:
                  </label>
                  {q.options.map((opt, optIdx) => (
                    <div key={opt.id} className="qb-opt-row">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={opt.isCorrect}
                        onChange={() => {
                          const updated = [...builderQuestions];
                          updated[qIdx].options.forEach((o, idx) => {
                            o.isCorrect = idx === optIdx;
                          });
                          setBuilderQuestions(updated);
                        }}
                      />
                      <input
                        type="text"
                        className="qb-opt-input"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...builderQuestions];
                          updated[qIdx].options[optIdx].text = e.target.value;
                          setBuilderQuestions(updated);
                        }}
                      />
                      <span style={{ fontSize: 12, color: opt.isCorrect ? "var(--success)" : "var(--muted)", textAlign: "center" }}>
                        {opt.isCorrect ? "✓" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn"
              onClick={() => setActiveTab("assessments")}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save Assessment
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {selectedAssessmentForDelete && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <div className="modal" style={{ width: "100%", maxWidth: 480, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 18, color: "var(--danger-text)" }}>Confirm Deletion</h2>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--text)" }}>
              Are you sure you want to delete <strong>{selectedAssessmentForDelete.name}</strong>? This action will permanently remove all associated response history and certificate records.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedAssessmentForDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={handleDeleteAssessment}
              >
                Delete Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssessmentsPanel;
