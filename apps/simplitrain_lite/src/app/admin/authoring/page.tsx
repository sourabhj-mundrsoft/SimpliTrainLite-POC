"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./authoring.css";

interface Lesson {
  id: string;
  title: string;
  status: "Published" | "Draft";
  hasUnpublishedChanges?: boolean;
  version: number;
  duration: number; // in minutes
  blocks: number;
  usedInCourses: number;
  modified: string;
  author: string;
  summary: string;
}

interface ContentPackage {
  id: string;
  title: string;
  standard: "SCORM 1.2" | "SCORM 2004" | "xAPI" | "CMI5" | "AICC";
  version: string;
  entryPoint: string;
  modulesCount: number;
  uploadedDate: string;
  masteryScore: number;
  author: string;
  status: "Active" | "Archived";
}

const INITIAL_LESSONS: Lesson[] = [
  {
    id: "les-001",
    title: "Workplace Health, Safety & Ergonomics",
    status: "Published",
    version: 3,
    duration: 25,
    blocks: 8,
    usedInCourses: 4,
    modified: "2026-10-24 14:20",
    author: "Elena Rostova",
    summary: "Ergonomic chair setups, screen height guidelines, and incident reporting protocols.",
  },
  {
    id: "les-002",
    title: "Phishing & Social Engineering Defense",
    status: "Published",
    hasUnpublishedChanges: true,
    version: 2,
    duration: 30,
    blocks: 11,
    usedInCourses: 6,
    modified: "2026-10-26 09:45",
    author: "Marcus Vance",
    summary: "Recognizing malicious attachments, urgent sender spoofing, and 2FA credential harvesting.",
  },
  {
    id: "les-003",
    title: "Customer Support De-escalation Strategies",
    status: "Draft",
    version: 1,
    duration: 40,
    blocks: 6,
    usedInCourses: 1,
    modified: "2026-10-25 18:10",
    author: "Sarah Lin",
    summary: "Active listening, empathy validation, and clear next steps during escalations.",
  },
  {
    id: "les-004",
    title: "Code Review Standards & Pull Request Hygiene",
    status: "Published",
    version: 4,
    duration: 35,
    blocks: 12,
    usedInCourses: 3,
    modified: "2026-10-22 11:30",
    author: "Elena Rostova",
    summary: "PR size limits, automated linters, constructive criticism, and regression testing rules.",
  },
  {
    id: "les-005",
    title: "Data Privacy & GDPR Fundamentals for SaaS",
    status: "Draft",
    version: 1,
    duration: 20,
    blocks: 5,
    usedInCourses: 0,
    modified: "2026-10-27 10:15",
    author: "David Kim",
    summary: "Subject access requests, data minimization principles, and audit log policies.",
  },
];

const INITIAL_PACKAGES: ContentPackage[] = [
  {
    id: "pkg-101",
    title: "SOC 2 Type II Compliance & Evidence Gathering",
    standard: "SCORM 2004",
    version: "4th Edition",
    entryPoint: "index_scorm2004.html",
    modulesCount: 5,
    uploadedDate: "2026-09-14",
    masteryScore: 80,
    author: "Compliance Dept",
    status: "Active",
  },
  {
    id: "pkg-102",
    title: "AWS Cloud Architecture & Disaster Recovery",
    standard: "xAPI",
    version: "1.0.3",
    entryPoint: "launch.html",
    modulesCount: 8,
    uploadedDate: "2026-08-30",
    masteryScore: 85,
    author: "DevOps Academy",
    status: "Active",
  },
  {
    id: "pkg-103",
    title: "Anti-Bribery, FCPA & Whistleblower Procedures",
    standard: "SCORM 1.2",
    version: "1.2",
    entryPoint: "story_html5.html",
    modulesCount: 4,
    uploadedDate: "2026-10-02",
    masteryScore: 75,
    author: "Legal & Ethics Team",
    status: "Active",
  },
  {
    id: "pkg-104",
    title: "Managerial 1-on-1 Frameworks & Feedback Loops",
    standard: "CMI5",
    version: "1.0",
    entryPoint: "course/default.html",
    modulesCount: 6,
    uploadedDate: "2026-07-19",
    masteryScore: 80,
    author: "People Ops",
    status: "Archived",
  },
];

export default function AuthoringPage() {
  const [activeTab, setActiveTab] = useState<"lessons" | "ai" | "packages">("lessons");

  // Lessons state
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [lessonSearch, setLessonSearch] = useState("");
  const [lessonStatusFilter, setLessonStatusFilter] = useState("");
  const [isNewLessonOpen, setIsNewLessonOpen] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [selectedStarter, setSelectedStarter] = useState("blank");
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  // AI Assistant state
  const [aiTopic, setAiTopic] = useState("AI-Assisted Workplace Safety & Ergonomics");
  const [aiAudience, setAiAudience] = useState("General Employees");
  const [aiTone, setAiTone] = useState("Engaging & Practical");
  const [aiDuration, setAiDuration] = useState(30);
  const [aiLessonCount, setAiLessonCount] = useState(4);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStageText, setAiStageText] = useState("");
  const [, setHasGeneratedAi] = useState(true);

  const [aiOutline, setAiOutline] = useState([
    { id: "o1", title: "Recognizing Ergonomic Risk Factors in Remote Work", min: 8 },
    { id: "o2", title: "Optimizing Chair, Monitor & Keyboard Geometry", min: 10 },
    { id: "o3", title: "The 20-20-20 Rule: Eye Strain & Micro-Breaks", min: 6 },
    { id: "o4", title: "Reporting Discomfort & Workplace Accommodations", min: 6 },
  ]);

  const [activeAiTab, setActiveAiTab] = useState<"outline" | "blocks" | "quiz">("outline");
  const [selectedKcChoice, setSelectedKcChoice] = useState<number | null>(null);

  // Packages state
  const [packages, setPackages] = useState<ContentPackage[]>(INITIAL_PACKAGES);
  const [pkgSearch, setPkgSearch] = useState("");
  const [pkgStandardFilter, setPkgStandardFilter] = useState("");
  const [isUploadPkgOpen, setIsUploadPkgOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [simulatedPkgDetails, setSimulatedPkgDetails] = useState<{
    title: string;
    standard: "SCORM 1.2" | "SCORM 2004" | "xAPI" | "CMI5" | "AICC";
    entryPoint: string;
    modulesCount: number;
    masteryScore: number;
  } | null>(null);
  const [previewPackage, setPreviewPackage] = useState<ContentPackage | null>(null);

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    if (lessonStatusFilter && l.status !== lessonStatusFilter) return false;
    if (lessonSearch && !l.title.toLowerCase().includes(lessonSearch.toLowerCase()) && !l.author.toLowerCase().includes(lessonSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Filter packages
  const filteredPackages = packages.filter((p) => {
    if (pkgStandardFilter && p.standard !== pkgStandardFilter) return false;
    if (pkgSearch && !p.title.toLowerCase().includes(pkgSearch.toLowerCase()) && !p.author.toLowerCase().includes(pkgSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Handle Create Lesson
  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const newL: Lesson = {
      id: `les-${Date.now().toString().slice(-4)}`,
      title: newLessonTitle.trim(),
      status: "Draft",
      version: 1,
      duration: selectedStarter === "blank" ? 15 : 30,
      blocks: selectedStarter === "blank" ? 1 : 6,
      usedInCourses: 0,
      modified: new Date().toISOString().slice(0, 16).replace("T", " "),
      author: "Admin User",
      summary: `Created from starter: ${selectedStarter}`,
    };

    setLessons([newL, ...lessons]);
    setNewLessonTitle("");
    setIsNewLessonOpen(false);
  };

  // Handle Publish / Unpublish Lesson
  const togglePublishLesson = (id: string) => {
    setLessons(
      lessons.map((l) =>
        l.id === id
          ? {
              ...l,
              status: l.status === "Published" ? "Draft" : "Published",
              version: l.status === "Draft" ? l.version + 1 : l.version,
              hasUnpublishedChanges: false,
              modified: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : l
      )
    );
  };

  // Handle Delete Lesson
  const handleDeleteLesson = (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      setLessons(lessons.filter((l) => l.id !== id));
    }
  };

  // Handle AI Generation simulation
  const handleGenerateAi = () => {
    setIsAiGenerating(true);
    setAiProgress(10);
    setAiStageText("Analyzing topic domain and learning objectives...");

    setTimeout(() => {
      setAiProgress(40);
      setAiStageText("Generating modular syllabus and lesson outlines...");
    }, 600);

    setTimeout(() => {
      setAiProgress(75);
      setAiStageText("Synthesizing interactive content blocks and callouts...");
    }, 1200);

    setTimeout(() => {
      setAiProgress(100);
      setAiStageText("Formulating comprehension checks & assessment questions...");
    }, 1700);

    setTimeout(() => {
      setIsAiGenerating(false);
      setHasGeneratedAi(true);
      // Auto populate outlines based on topic
      setAiOutline([
        { id: "o1", title: `Fundamentals: Introduction to ${aiTopic}`, min: Math.round(aiDuration * 0.25) },
        { id: "o2", title: "Core Protocols, Best Practices & Standards", min: Math.round(aiDuration * 0.35) },
        { id: "o3", title: "Common Pitfalls & Real-World Case Studies", min: Math.round(aiDuration * 0.2) },
        { id: "o4", title: "Practical Application & Actionable Checklist", min: Math.round(aiDuration * 0.2) },
      ]);
    }, 2100);
  };

  // Handle saving AI lesson to Lessons catalog
  const handleSaveAiToLessons = () => {
    const newL: Lesson = {
      id: `les-ai-${Date.now().toString().slice(-4)}`,
      title: `${aiTopic} (AI Generated)`,
      status: "Draft",
      version: 1,
      duration: aiDuration,
      blocks: 9,
      usedInCourses: 0,
      modified: new Date().toISOString().slice(0, 16).replace("T", " "),
      author: "AI Assistant",
      summary: `Course generated for ${aiAudience} with a ${aiTone} tone.`,
    };

    setLessons([newL, ...lessons]);
    setActiveTab("lessons");
  };

  // Handle simulated package upload
  const handleFileDropSimulation = (fileName: string) => {
    setUploadFileName(fileName);
    setSimulatedPkgDetails({
      title: fileName.replace(/\.(zip|pkg)$/i, "").replace(/[-_]/g, " "),
      standard: fileName.toLowerCase().includes("xapi") ? "xAPI" : "SCORM 2004",
      entryPoint: "index.html",
      modulesCount: 5,
      masteryScore: 80,
    });
  };

  const handleSaveUploadedPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedPkgDetails) return;

    const newP: ContentPackage = {
      id: `pkg-${Date.now().toString().slice(-4)}`,
      title: simulatedPkgDetails.title,
      standard: simulatedPkgDetails.standard,
      version: "1.0",
      entryPoint: simulatedPkgDetails.entryPoint,
      modulesCount: simulatedPkgDetails.modulesCount,
      uploadedDate: new Date().toISOString().slice(0, 10),
      masteryScore: simulatedPkgDetails.masteryScore,
      author: "Admin User",
      status: "Active",
    };

    setPackages([newP, ...packages]);
    setIsUploadPkgOpen(false);
    setUploadFileName("");
    setSimulatedPkgDetails(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumbs */}
      <nav className="breadcrumb" style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard</Link>
        <span>/</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Authoring</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>{activeTab}</span>
      </nav>

      {/* Header */}
      <div className="auth-header">
        <div>
          <h1>Authoring Studio</h1>
          <p className="sub">
            Craft custom modular lessons, generate complete curricula with our AI assistant, or upload and validate enterprise SCORM &amp; xAPI content packages.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {activeTab === "lessons" && (
            <button
              type="button"
              className="btn primary"
              onClick={() => setIsNewLessonOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Lesson
            </button>
          )}
          {activeTab === "packages" && (
            <button
              type="button"
              className="btn primary"
              onClick={() => setIsUploadPkgOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Package (.zip)
            </button>
          )}
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="auth-subnav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "lessons" ? "active" : ""}`}
          onClick={() => setActiveTab("lessons")}
        >
          <span>Lessons</span>
          <span className="count-badge">{lessons.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          <span>AI Assistant</span>
          <span className="count-badge" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>AI</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "packages" ? "active" : ""}`}
          onClick={() => setActiveTab("packages")}
        >
          <span>Content Packages (SCORM/xAPI)</span>
          <span className="count-badge">{packages.length}</span>
        </button>
      </div>

      {/* TAB 1: LESSONS */}
      {activeTab === "lessons" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Toolbar */}
          <div className="auth-toolbar">
            <div className="auth-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search lessons by title or author..."
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Status:</span>
              <select
                value={lessonStatusFilter}
                onChange={(e) => setLessonStatusFilter(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              >
                <option value="">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            {(lessonSearch || lessonStatusFilter) && (
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => {
                  setLessonSearch("");
                  setLessonStatusFilter("");
                }}
              >
                Clear filters
              </button>
            )}

            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              Showing <strong>{filteredLessons.length}</strong> of {lessons.length} lessons
            </div>
          </div>

          {/* Lessons Table */}
          <div className="auth-table-wrap">
            <table className="auth-table">
              <thead>
                <tr>
                  <th>Lesson Title</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Est. Duration</th>
                  <th>Blocks</th>
                  <th>Used In</th>
                  <th>Last Modified</th>
                  <th>Author</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
                      No lessons match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredLessons.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => setPreviewLesson(l)}
                          className="auth-cell-title"
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                        >
                          {l.title}
                        </button>
                        <div className="auth-cell-sub">{l.summary}</div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background: l.status === "Published" ? "var(--success-soft)" : "var(--warn-soft)",
                              color: l.status === "Published" ? "var(--success-text)" : "var(--warn-text)",
                            }}
                          >
                            {l.status}
                          </span>
                          {l.hasUnpublishedChanges && (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontSize: 11,
                                background: "var(--info-soft)",
                                color: "var(--info-text)",
                              }}
                            >
                              Unpublished Changes
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>v{l.version}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{l.duration} min</td>
                      <td>{l.blocks} blocks</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {l.usedInCourses > 0 ? (
                          <span style={{ color: "var(--accent)", fontWeight: 500 }}>{l.usedInCourses} courses</span>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>Not used</span>
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{l.modified}</td>
                      <td>{l.author}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => setPreviewLesson(l)}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            className="btn sm ghost"
                            onClick={() => togglePublishLesson(l.id)}
                            title={l.status === "Published" ? "Revert to draft" : "Publish lesson"}
                          >
                            {l.status === "Published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            className="btn sm ghost"
                            style={{ color: "var(--danger-text)" }}
                            onClick={() => handleDeleteLesson(l.id)}
                            title="Delete lesson"
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

      {/* TAB 2: AI ASSISTANT */}
      {activeTab === "ai" && (
        <div className="ai-layout">
          {/* Controls Column */}
          <div className="ai-controls">
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>AI Course Generator</h3>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                Describe any subject, and the assistant will architect a comprehensive curriculum with outline, drafts, and knowledge check questions.
              </p>
            </div>

            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Topic / Learning Goal
              </label>
              <textarea
                rows={3}
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Workplace Cybersecurity and Phishing Defense"
                style={{ width: "100%", padding: 10, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", fontSize: 13.5, resize: "vertical" }}
              />
            </div>

            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Target Audience</label>
              <select
                value={aiAudience}
                onChange={(e) => setAiAudience(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", fontSize: 13.5 }}
              >
                <option>General Employees</option>
                <option>Engineering & Technical Teams</option>
                <option>People Managers & Executives</option>
                <option>Customer Support Agents</option>
                <option>New Hire Onboarding</option>
              </select>
            </div>

            <div className="field">
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Instructional Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", fontSize: 13.5 }}
              >
                <option>Engaging & Practical</option>
                <option>Formal Compliance & Legal</option>
                <option>Conversational & Story-Driven</option>
                <option>Concise & Direct (Micro-learning)</option>
              </select>
            </div>

            <div className="field">
              <div className="ai-slider-row">
                <span style={{ fontWeight: 600 }}>Total Course Duration</span>
                <span>{aiDuration} mins</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                className="ai-range-input"
                value={aiDuration}
                onChange={(e) => setAiDuration(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="ai-slider-row">
                <span style={{ fontWeight: 600 }}>Number of Modules</span>
                <span>{aiLessonCount} lessons</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                className="ai-range-input"
                value={aiLessonCount}
                onChange={(e) => setAiLessonCount(Number(e.target.value))}
              />
            </div>

            <button
              type="button"
              className="btn primary"
              disabled={isAiGenerating}
              onClick={handleGenerateAi}
              style={{ width: "100%", padding: 12, justifyContent: "center" }}
            >
              {isAiGenerating ? "Generating Content..." : "✨ Generate Curriculum"}
            </button>

            {isAiGenerating && (
              <div style={{ background: "var(--surface-2)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{aiStageText}</span>
                  <span>{aiProgress}%</span>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${aiProgress}%`, height: "100%", background: "var(--accent)", transition: "width 0.3s ease" }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="ai-results-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Generated: {aiTopic}</h2>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Audience: <strong>{aiAudience}</strong> · Tone: <strong>{aiTone}</strong> · {aiDuration} mins
                </div>
              </div>

              <button
                type="button"
                className="btn primary"
                onClick={handleSaveAiToLessons}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save as Lesson
              </button>
            </div>

            {/* AI Results Subtabs */}
            <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
              <button
                type="button"
                className={`btn sm ${activeAiTab === "outline" ? "primary" : "ghost"}`}
                onClick={() => setActiveAiTab("outline")}
              >
                1. Curriculum Outline ({aiOutline.length})
              </button>
              <button
                type="button"
                className={`btn sm ${activeAiTab === "blocks" ? "primary" : "ghost"}`}
                onClick={() => setActiveAiTab("blocks")}
              >
                2. Lesson Draft &amp; Blocks
              </button>
              <button
                type="button"
                className={`btn sm ${activeAiTab === "quiz" ? "primary" : "ghost"}`}
                onClick={() => setActiveAiTab("quiz")}
              >
                3. Knowledge Checks (2)
              </button>
            </div>

            {/* Outline View */}
            {activeAiTab === "outline" && (
              <div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--muted)" }}>
                  Review and customize the proposed lesson structure. You can rename modules or adjust individual time budgets.
                </p>
                <ul className="outline-list">
                  {aiOutline.map((item, idx) => (
                    <li key={item.id} className="outline-item">
                      <span className="outline-index">{idx + 1}</span>
                      <input
                        type="text"
                        className="outline-input"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...aiOutline];
                          updated[idx].title = e.target.value;
                          setAiOutline(updated);
                        }}
                      />
                      <span className="outline-min">{item.min} mins</span>
                      <button
                        type="button"
                        className="btn sm ghost"
                        style={{ color: "var(--danger-text)", padding: "4px 8px" }}
                        onClick={() => {
                          if (aiOutline.length > 1) {
                            setAiOutline(aiOutline.filter((_, i) => i !== idx));
                          }
                        }}
                        title="Remove lesson"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Blocks View */}
            {activeAiTab === "blocks" && (
              <div style={{ display: "grid", gap: 12 }}>
                <div className="block-card">
                  <div className="block-header">
                    <h4>
                      <span style={{ color: "var(--accent)" }}>Text Block:</span> Overview &amp; Learning Objectives
                    </h4>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Draft generated</span>
                  </div>
                  <div className="block-body">
                    <p>
                      Welcome to <strong>{aiTopic}</strong>. In modern organizational environments, cultivating proactive habits directly prevents fatigue, mitigates systemic security liabilities, and safeguards sustained productivity.
                    </p>
                    <p style={{ margin: 0 }}>
                      By the end of this module, learners will identify primary risk indicators, implement self-correcting mechanisms, and leverage internal tools to report discrepancies.
                    </p>
                  </div>
                </div>

                <div className="block-card" style={{ borderColor: "var(--accent)" }}>
                  <div className="block-header" style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}>
                    <h4>
                      <span>💡 Best Practice Callout:</span> Core Rule of Thumb
                    </h4>
                  </div>
                  <div className="block-body">
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      Never postpone adjustments. Whenever a standard threshold is breached, trigger a 2-minute posture recalibration or notify security operations immediately.
                    </p>
                  </div>
                </div>

                <div className="block-card">
                  <div className="block-header">
                    <h4>
                      <span style={{ color: "var(--accent)" }}>Actionable Steps:</span> Three-Stage Implementation
                    </h4>
                  </div>
                  <div className="block-body">
                    <ol style={{ margin: 0, paddingLeft: 20 }}>
                      <li style={{ marginBottom: 6 }}><strong>Audit your immediate environment:</strong> Verify hardware height, lighting levels, and access credentials.</li>
                      <li style={{ marginBottom: 6 }}><strong>Establish automated reminders:</strong> Utilize calendar recurring pings every 45 minutes.</li>
                      <li><strong>Document findings:</strong> Submit verification tickets into the employee portal.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz View */}
            {activeAiTab === "quiz" && (
              <div>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)" }}>
                  Interactive questions generated based on the draft content. Learners must achieve 80% to certify completion.
                </p>

                <div className="kc-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>Question 1 · Multiple Choice</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Points: 10</span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 600 }}>
                    When observing an unexpected system prompt requesting elevated 2FA tokens, what is the required protocol?
                  </p>

                  <div className="kc-opts">
                    {[
                      { id: 1, text: "Enter credentials to ensure continuity of current work", correct: false },
                      { id: 2, text: "Reject the prompt, disconnect from VPN, and alert Security Ops via out-of-band chat", correct: true },
                      { id: 3, text: "Wait 24 hours to see if the notification clears on its own", correct: false },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`kc-opt ${selectedKcChoice === opt.id ? (opt.correct ? "correct" : "") : ""}`}
                        onClick={() => setSelectedKcChoice(opt.id)}
                      >
                        <input
                          type="radio"
                          name="kc1"
                          checked={selectedKcChoice === opt.id}
                          onChange={() => setSelectedKcChoice(opt.id)}
                        />
                        <span>{opt.text}</span>
                        {selectedKcChoice === opt.id && opt.correct && (
                          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--success)" }}>✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT PACKAGES */}
      {activeTab === "packages" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="auth-toolbar">
            <div className="auth-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search packages by title or author..."
                value={pkgSearch}
                onChange={(e) => setPkgSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Standard:</span>
              <select
                value={pkgStandardFilter}
                onChange={(e) => setPkgStandardFilter(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              >
                <option value="">All Standards</option>
                <option value="SCORM 1.2">SCORM 1.2</option>
                <option value="SCORM 2004">SCORM 2004</option>
                <option value="xAPI">xAPI (Tin Can)</option>
                <option value="CMI5">CMI5</option>
                <option value="AICC">AICC</option>
              </select>
            </div>

            {(pkgSearch || pkgStandardFilter) && (
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => {
                  setPkgSearch("");
                  setPkgStandardFilter("");
                }}
              >
                Clear filters
              </button>
            )}

            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              Showing <strong>{filteredPackages.length}</strong> of {packages.length} packages
            </div>
          </div>

          <div className="auth-table-wrap">
            <table className="auth-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Standard</th>
                  <th>Specification</th>
                  <th>Entry Point</th>
                  <th>SCOs / Modules</th>
                  <th>Passing Score</th>
                  <th>Uploaded Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
                      No content packages found. Upload a ZIP containing imsmanifest.xml or tincan.xml.
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <button
                          type="button"
                          className="auth-cell-title"
                          onClick={() => setPreviewPackage(p)}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                        >
                          {p.title}
                        </button>
                        <div className="auth-cell-sub">ID: {p.id} · By: {p.author}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            background: "var(--accent-soft)",
                            color: "var(--accent-text)",
                          }}
                        >
                          {p.standard}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{p.version}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{p.entryPoint}</td>
                      <td>{p.modulesCount} modules</td>
                      <td>{p.masteryScore}%</td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{p.uploadedDate}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 7px",
                            borderRadius: 4,
                            fontSize: 11.5,
                            fontWeight: 600,
                            background: p.status === "Active" ? "var(--success-soft)" : "var(--surface-2)",
                            color: p.status === "Active" ? "var(--success-text)" : "var(--muted)",
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => setPreviewPackage(p)}
                          >
                            Preview Player
                          </button>
                          <button
                            type="button"
                            className="btn sm ghost"
                            style={{ color: "var(--danger-text)" }}
                            onClick={() => {
                              if (confirm(`Delete package "${p.title}"?`)) {
                                setPackages(packages.filter((item) => item.id !== p.id));
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

      {/* MODAL 1: NEW LESSON */}
      {isNewLessonOpen && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <form className="modal" onSubmit={handleCreateLesson} style={{ width: "100%", maxWidth: 580, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Create New Lesson</h2>

            <div className="field" style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Lesson Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Conflict Resolution & De-escalation"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Start From Template</label>
              <div className="starter-grid">
                <div
                  className={`starter-card ${selectedStarter === "blank" ? "selected" : ""}`}
                  onClick={() => setSelectedStarter("blank")}
                >
                  <h4>Blank Canvas</h4>
                  <p>Start with a clean slate. Add blocks, media, and quizzes manually.</p>
                </div>
                <div
                  className={`starter-card ${selectedStarter === "onboarding" ? "selected" : ""}`}
                  onClick={() => setSelectedStarter("onboarding")}
                >
                  <h4>Employee Onboarding</h4>
                  <p>Includes company overview, culture video, policies, and sign-off check.</p>
                </div>
                <div
                  className={`starter-card ${selectedStarter === "technical" ? "selected" : ""}`}
                  onClick={() => setSelectedStarter("technical")}
                >
                  <h4>Technical SOP</h4>
                  <p>Step-by-step procedural guide with code snippets, alerts, and verification test.</p>
                </div>
                <div
                  className={`starter-card ${selectedStarter === "compliance" ? "selected" : ""}`}
                  onClick={() => setSelectedStarter("compliance")}
                >
                  <h4>Annual Compliance</h4>
                  <p>Regulatory overview, real scenario case study, and 10-point mastery quiz.</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button type="button" className="btn" onClick={() => setIsNewLessonOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Create Lesson
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: LESSON PREVIEW */}
      {previewLesson && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "grid", placeItems: "center", padding: 20 }}>
          <div className="modal" style={{ width: "100%", maxWidth: 740, maxHeight: "90vh", overflowY: "auto", background: "var(--surface)", borderRadius: "var(--radius)", padding: 28, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase" }}>Learner Preview Mode</span>
                <h2 style={{ margin: "4px 0 0", fontSize: 22 }}>{previewLesson.title}</h2>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                  Estimated time: {previewLesson.duration} mins · {previewLesson.blocks} blocks · Author: {previewLesson.author}
                </div>
              </div>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => setPreviewLesson(null)}
                style={{ fontSize: 16, padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "grid", gap: 16 }}>
              <div style={{ background: "var(--surface-2)", padding: 16, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>Module Summary</h4>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--text)" }}>{previewLesson.summary}</p>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ margin: "0 0 10px", fontSize: 15 }}>Section 1: Core Instructions</h4>
                <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.6 }}>
                  Follow the structured sequence outlined below. All employees are required to verify their workstation alignment and digital credential storage before completing the final questionnaire.
                </p>
                <div style={{ background: "var(--accent-soft)", padding: 12, borderRadius: 6, fontSize: 13.5, color: "var(--accent-text)", fontWeight: 500 }}>
                  🔔 Reminder: In case of discrepancies, contact IT support immediately via ticket.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button type="button" className="btn primary" onClick={() => setPreviewLesson(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD PACKAGE (.ZIP) */}
      {isUploadPkgOpen && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <form className="modal" onSubmit={handleSaveUploadedPackage} style={{ width: "100%", maxWidth: 620, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: 18 }}>Upload Content Package (SCORM / xAPI)</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--muted)" }}>
              Upload an enterprise e-learning package in .ZIP format. SimpliTrain Lite inspects the manifest structure and configures tracking automatically.
            </p>

            {/* Dropzone */}
            <div
              className="pkg-dropzone"
              onClick={() => handleFileDropSimulation("cybersecurity_scorm2004_v4.zip")}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <div>
                <strong style={{ fontSize: 14 }}>
                  {uploadFileName ? uploadFileName : "Click to select or drag & drop .ZIP package"}
                </strong>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  Supports SCORM 1.2, SCORM 2004 (2nd/3rd/4th Ed), xAPI / Tin Can, CMI5, AICC up to 250MB
                </div>
              </div>
            </div>

            {/* Quick preset tests for simulation */}
            <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", fontSize: 12, color: "var(--muted)" }}>
              <span>Sample packages:</span>
              <button
                type="button"
                className="btn xs ghost"
                onClick={() => handleFileDropSimulation("iso27001_security_scorm2004.zip")}
              >
                Sample SCORM 2004
              </button>
              <button
                type="button"
                className="btn xs ghost"
                onClick={() => handleFileDropSimulation("sales_enablement_xapi_tincan.zip")}
              >
                Sample xAPI
              </button>
            </div>

            {/* Manifest inspection results */}
            {simulatedPkgDetails && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "var(--accent)" }}>
                  ✓ Manifest Validated: imsmanifest.xml
                </h4>
                <dl className="pkg-inspector">
                  <dt>Course Title:</dt>
                  <dd>{simulatedPkgDetails.title}</dd>
                  <dt>Detected Standard:</dt>
                  <dd>{simulatedPkgDetails.standard}</dd>
                  <dt>Launch File:</dt>
                  <dd>{simulatedPkgDetails.entryPoint}</dd>
                  <dt>Modules (SCOs):</dt>
                  <dd>{simulatedPkgDetails.modulesCount} navigable sections</dd>
                  <dt>Mastery Score:</dt>
                  <dd>{simulatedPkgDetails.masteryScore}% required to pass</dd>
                </dl>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setIsUploadPkgOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={!simulatedPkgDetails}>
                Import to Library
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: PACKAGE PLAYER PREVIEW */}
      {previewPackage && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "grid", placeItems: "center", padding: 20 }}>
          <div className="modal" style={{ width: "100%", maxWidth: 860, background: "var(--surface)", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong style={{ fontSize: 15 }}>{previewPackage.title}</strong>
                <span style={{ marginLeft: 8, fontSize: 12, color: "var(--muted)" }}>({previewPackage.standard})</span>
              </div>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => setPreviewPackage(null)}
              >
                Close Player
              </button>
            </div>

            <div style={{ height: 420, background: "#0f172a", display: "grid", placeItems: "center", color: "#f8fafc", textAlign: "center", padding: 24 }}>
              <div>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>Interactive SCORM Player Simulation</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", maxWidth: 440 }}>
                  Ready to launch: <code style={{ color: "#38bdf8" }}>{previewPackage.entryPoint}</code>. Telemetry and completion hooks (cmi.core.lesson_status, cmi.score.raw) are connected.
                </p>
                <div style={{ marginTop: 18, display: "inline-flex", gap: 10 }}>
                  <button type="button" className="btn primary sm" onClick={() => alert("Simulated: Package completed with score 92%!")}>
                    Simulate Complete (Pass)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
