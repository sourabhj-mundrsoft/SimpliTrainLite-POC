"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import "../app/dashboard.css";

const FULL_DATA = {
  courses: 48,
  users: 1284,
  instructors: 12,
  admins: 4,
  students: 1268,
  classEnrollment: 114,
  classroom: 64,
  online: 38,
  blended: 12,
  courseEnrollments: 3962,
  completed: 2418,
  inProgress: 1196,
};

const ACTIVITY_DATA = {
  s: { name: "sessions", today: 2, weekly: 14, trendT: "up", trendW: "up", days: [2, 3, 2, 2, 1, 2, 2] },
  c: { name: "course completions", today: 11, weekly: 73, trendT: "dn", trendW: "up", days: [9, 14, 8, 12, 10, 9, 11] },
  l: { name: "user logins", today: 168, weekly: 412, trendT: "up", trendW: "dn", days: [41, 52, 38, 57, 35, 21, 168] },
};

const DAY_LABELS = ["Thu 8", "Fri 9", "Sat 10", "Sun 11", "Mon 12", "Tue 13", "Today"];

const POPULAR_COURSES = [
  { name: "Health and Safety", enrollments: 438 },
  { name: "Leadership and Management", enrollments: 301 },
  { name: "Compliance", enrollments: 266 },
  { name: "Onboarding", enrollments: 201 },
  { name: "First Aid", enrollments: 150 },
];

const UPCOMING_SESSIONS = [
  {
    id: "cls-1",
    day: "18",
    mon: "OCT",
    dowDate: "Monday 18 Oct",
    time: "09:00 to 17:00",
    name: "Fire Safety Basics",
    sessionNum: 1,
    sessionOf: 2,
    where: "Classroom A",
    instructor: "Rahul Mehta",
    enrolled: 12,
    max: 20,
    status: "Published",
    badge: "success",
  },
  {
    id: "cls-2",
    day: "20",
    mon: "OCT",
    dowDate: "Wednesday 20 Oct",
    time: "10:00 to 12:30",
    name: "Forklift Refresher",
    sessionNum: 1,
    sessionOf: 1,
    where: "Virtual Zoom Room",
    instructor: "Meera Iyer",
    enrolled: 8,
    max: 15,
    status: "Draft",
    badge: "warn",
  },
  {
    id: "cls-3",
    day: "22",
    mon: "OCT",
    dowDate: "Friday 22 Oct",
    time: "14:00 to 16:00",
    name: "First Aid at Work",
    sessionNum: 2,
    sessionOf: 3,
    where: "Lab 204",
    instructor: "Sana Khan",
    enrolled: 21,
    max: 25,
    status: "Open",
    badge: "info",
  },
  {
    id: "cls-4",
    day: "25",
    mon: "OCT",
    dowDate: "Monday 25 Oct",
    time: "09:30 to 11:30",
    name: "Leadership Essentials",
    sessionNum: 1,
    sessionOf: 4,
    where: "Executive Suite",
    instructor: "Arjun Nair",
    enrolled: 15,
    max: 16,
    status: "Published",
    badge: "success",
  },
  {
    id: "cls-5",
    day: "28",
    mon: "OCT",
    dowDate: "Thursday 28 Oct",
    time: "13:00 to 15:00",
    name: "Hazardous Materials Safety",
    sessionNum: 1,
    sessionOf: 2,
    where: "Classroom B",
    instructor: "Rahul Mehta",
    enrolled: 10,
    max: 18,
    status: "Open",
    badge: "info",
  },
];

const ANNOUNCEMENTS = [
  { title: "Diwali holiday schedule", by: "Priya Shah", when: "5 days ago" },
  { title: "Leadership Foundations Cohort 4: venue change", by: "Priya Shah", when: "5 days ago" },
  { title: "New learning catalog is live", by: "Priya Shah", when: "15 days ago" },
  { title: "Data Privacy Basics: updated module", by: "Meera Iyer", when: "3 days ago" },
  { title: "Safety drill this Friday", by: "Rahul Mehta", when: "1 day ago" },
];

const INSTRUCTORS = [
  { name: "Rahul Mehta", sessions: 2 },
  { name: "Meera Iyer", sessions: 1 },
  { name: "Sana Khan", sessions: 1 },
  { name: "Arjun Nair", sessions: 1 },
];

const CALENDAR_EVENTS: Record<string, string[]> = {
  "2026-10-18": ["Fire Safety Basics (Session 1 of 2)"],
  "2026-10-20": ["Forklift Refresher (Session 1 of 1)"],
  "2026-10-22": ["First Aid at Work (Session 2 of 3)"],
  "2026-10-25": ["Leadership Essentials (Session 1 of 4)"],
  "2026-10-28": ["Hazardous Materials Safety (Session 1 of 2)"],
};

const SUGGESTIONS = [
  ["Quick Actions Bar", "Add a customizable top action bar for frequent workflows like inviting a cohort or printing session sign-in rosters."],
  ["Capacity Alerts", "Highlight upcoming classroom sessions that are near 100% full or below minimum quorum so admins can intervene early."],
  ["AI Attendance Forecast", "Predict expected attendance rates for future cohorts based on previous learner completion trends."],
];

export function AdminDashboard() {
  const [empty, setEmpty] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activityMetric, setActivityMetric] = useState<"s" | "c" | "l">("s");
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Calendar state
  const [calMonth, setCalMonth] = useState(9); // October
  const [calYear, setCalYear] = useState(2026);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>("2026-10-18");

  const act = ACTIVITY_DATA[activityMetric];
  const maxActVal = useMemo(() => {
    const mx = Math.max(...act.days);
    return Math.max(4, Math.ceil(mx / 4) * 4) || 4;
  }, [act]);

  // Calendar grid calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    return { firstDay, totalDays };
  }, [calMonth, calYear]);

  return (
    <div className="dashboard-content" style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: 60 }}>
      {/* Hero Banner */}
      <section className="hero" aria-labelledby="heroH">
        <div>
          <h1 id="heroH">Welcome, Priya!</h1>
          <p className="hero-sub" id="heroSub">
            Courses: <strong>{empty ? 0 : FULL_DATA.courses}</strong> | Users:{" "}
            <strong>{empty ? 0 : FULL_DATA.users.toLocaleString()}</strong> | Class Enrollment:{" "}
            <strong>{empty ? 0 : FULL_DATA.classEnrollment}</strong>
          </p>
        </div>
      </section>

      {/* Head Tools */}
      <div className="head-tools" style={{ margin: "-6px 0 16px" }}>
        <label className="switch" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showReview}
            onChange={(e) => setShowReview(e.target.checked)}
            role="switch"
          />
          <span className="track"></span>
          <span>Review: show LMS source</span>
        </label>
        <span className="aid">A review aid for the owner, not a product feature.</span>
        <a href="#sugg" style={{ color: "var(--accent-text)", fontWeight: 500 }}>
          Suggestions ({SUGGESTIONS.length})
        </a>
        <button
          type="button"
          className="btn ghost sm"
          style={{ marginLeft: "auto" }}
          onClick={() => setEmpty(!empty)}
          aria-pressed={empty}
        >
          {empty ? "Show normal example" : "Show empty state example"}
        </button>
      </div>

      {showReview && (
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px dashed var(--accent)",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          LMS source mapping: Cards map to Courses (Row 16), Users (Row 151), Class Enrollments, Course Enrollments. Chart is an owner-requested visual upgrade over legacy tables.
        </div>
      )}

      {/* 4 Summary Cards (KPIs) */}
      <section aria-label="Summary" className="grid c4">
        {/* Card 1: Courses */}
        <div className="card tile">
          <Link className="tlink" href="/admin/courses">
            <span className="tile-top">
              <span className="tico indigo">
                <svg className="i" viewBox="0 0 24 24">
                  <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
                  <path d="M4 19V5" />
                </svg>
              </span>
              <span className="l">Courses</span>
            </span>
            <span className="v">{empty ? 0 : FULL_DATA.courses}</span>
          </Link>
          <Link className="plus" href="/admin/courses" aria-label="Create Course">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>

        {/* Card 2: Users */}
        <div className="card tile">
          <Link className="tlink" href="/admin/users">
            <span className="tile-top">
              <span className="tico teal">
                <svg className="i" viewBox="0 0 24 24">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
                  <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
                </svg>
              </span>
              <span className="l">Users</span>
            </span>
            <span className="v">{empty ? 0 : FULL_DATA.users.toLocaleString()}</span>
            <span className="split">
              <span>
                <i className="dot" style={{ background: "var(--s2)" }} />
                <b>{empty ? 0 : FULL_DATA.instructors}</b> Instructors
              </span>
              <span>
                <i className="dot" style={{ background: "var(--s3)" }} />
                <b>{empty ? 0 : FULL_DATA.admins}</b> Admins
              </span>
              <span>
                <i className="dot" style={{ background: "var(--s1)" }} />
                <b>{empty ? 0 : FULL_DATA.students.toLocaleString()}</b> Students
              </span>
            </span>
            <span className="mbar" aria-hidden="true">
              <i style={{ flex: empty ? 1 : FULL_DATA.instructors, background: "var(--s2)" }} />
              <i style={{ flex: empty ? 1 : FULL_DATA.admins, background: "var(--s3)" }} />
              <i style={{ flex: empty ? 1 : FULL_DATA.students, background: "var(--s1)" }} />
            </span>
          </Link>
          <Link className="plus" href="/admin/users" aria-label="Create User">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>

        {/* Card 3: Class Enrollment */}
        <div className="card tile">
          <Link className="tlink" href="/admin/courses">
            <span className="tile-top">
              <span className="tico amber">
                <svg className="i" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="14" height="17" rx="2" />
                  <path d="M9 4V3h6v1M9 11h6M9 15h4" />
                </svg>
              </span>
              <span className="l">Class Enrollment</span>
            </span>
            <span className="v">{empty ? 0 : FULL_DATA.classEnrollment}</span>
            <span className="split">
              <span>
                <i className="dot" style={{ background: "var(--s1)" }} />
                <b>{empty ? 0 : FULL_DATA.classroom}</b> Classroom
              </span>
              <span>
                <i className="dot" style={{ background: "var(--s3)" }} />
                <b>{empty ? 0 : FULL_DATA.online}</b> Online
              </span>
              <span>
                <i className="dot" style={{ background: "var(--s2)" }} />
                <b>{empty ? 0 : FULL_DATA.blended}</b> Blended
              </span>
            </span>
            <span className="mbar" aria-hidden="true">
              <i style={{ flex: empty ? 1 : FULL_DATA.classroom, background: "var(--s1)" }} />
              <i style={{ flex: empty ? 1 : FULL_DATA.online, background: "var(--s3)" }} />
              <i style={{ flex: empty ? 1 : FULL_DATA.blended, background: "var(--s2)" }} />
            </span>
          </Link>
          <Link className="plus" href="/admin/courses" aria-label="Create Class Enrollment">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>

        {/* Card 4: Course Enrollments */}
        <div className="card tile">
          <Link className="tlink" href="/admin/courses">
            <span className="tile-top">
              <span className="tico green">
                <svg className="i" viewBox="0 0 24 24">
                  <circle cx="12" cy="9" r="6" />
                  <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
                </svg>
              </span>
              <span className="l">Course Enrollments</span>
            </span>
            <span className="v">{empty ? 0 : FULL_DATA.courseEnrollments.toLocaleString()}</span>
            <span className="split">
              <span>
                <i className="dot" style={{ background: "var(--s1)" }} />
                <b>{empty ? 0 : FULL_DATA.completed.toLocaleString()}</b> Completed
              </span>
              <span>
                <i className="dot" style={{ background: "var(--s3)" }} />
                <b>{empty ? 0 : FULL_DATA.inProgress.toLocaleString()}</b> In Progress
              </span>
            </span>
            <span className="mbar" aria-hidden="true">
              <i style={{ flex: empty ? 1 : FULL_DATA.completed, background: "var(--s1)" }} />
              <i style={{ flex: empty ? 1 : FULL_DATA.inProgress, background: "var(--s3)" }} />
            </span>
          </Link>
          <Link className="plus" href="/admin/courses" aria-label="Create Course Enrollment">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 3-Column Charts Section: Recent Activity, Performance, Popular Courses */}
      <section className="grid c3" style={{ marginTop: 16 }} aria-label="Activity and statistics">
        {/* Card 1: Recent Activity */}
        <div className="card">
          <div className="card-head">
            <h2>Recent Activity</h2>
          </div>
          <div className="card-body">
            <div className="seg-row">
              <div className="segmented" role="group" aria-label="Chart metric">
                <button
                  type="button"
                  className={activityMetric === "s" ? "on" : ""}
                  onClick={() => setActivityMetric("s")}
                >
                  Sessions
                </button>
                <button
                  type="button"
                  className={activityMetric === "c" ? "on" : ""}
                  onClick={() => setActivityMetric("c")}
                >
                  Completions
                </button>
                <button
                  type="button"
                  className={activityMetric === "l" ? "on" : ""}
                  onClick={() => setActivityMetric("l")}
                >
                  Logins
                </button>
              </div>
              <span className="small muted">Last 7 days</span>
            </div>

            {/* Column Bar Chart (SVG) */}
            <div className="chart-wrap">
              <svg viewBox="0 0 360 170" role="img" aria-label="Column chart of 7-day activity">
                <g className="ax">
                  {[0, 0.5, 1].map((f) => {
                    const y = 170 - 24 - (170 - 24 - 14) * f;
                    return (
                      <g key={f}>
                        <line x1="30" x2="360" y1={y} y2={y} className={f === 0 ? "base" : ""} />
                        <text x="24" y={y + 4} textAnchor="end">
                          {Math.round(maxActVal * f)}
                        </text>
                      </g>
                    );
                  })}
                  {act.days.map((val, i) => {
                    const v = empty ? 0 : val;
                    const cw = (360 - 30 - 4) / 7;
                    const bw = Math.min(30, cw - 10);
                    const bh = ((170 - 24 - 14) * v) / maxActVal;
                    const x = 30 + 2 + i * cw + (cw - bw) / 2;
                    const y = 170 - 24 - bh;
                    const isToday = i === 6;

                    return (
                      <g key={i}>
                        <path
                          className={`col ${isToday ? "today" : ""}`}
                          tabIndex={0}
                          d={`M${x} ${170 - 24}V${y + 4}Q${x} ${y} ${x + 4} ${y}H${x + bw - 4}Q${x + bw} ${y} ${x + bw} ${y + 4}V${170 - 24}Z`}
                          onMouseEnter={(e) => {
                            setTooltip({
                              text: `${DAY_LABELS[i]}: ${v} ${act.name}`,
                              x: e.clientX,
                              y: e.clientY,
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                        <text x={x + bw / 2} y={170 - 8} textAnchor="middle">
                          {isToday ? "Today" : DAY_LABELS[i].slice(0, 3)}
                        </text>
                        {isToday && v > 0 && (
                          <text className="vlab" x={x + bw / 2} y={y - 5}>
                            {v}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Totals Table */}
            <table className="table mini-t">
              <thead>
                <tr>
                  <th scope="col">Activity</th>
                  <th scope="col">Today</th>
                  <th scope="col">Weekly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" style={{ fontWeight: 500 }}>
                    Number of Sessions
                  </th>
                  <td>
                    <strong>{empty ? 0 : 2}</strong>{" "}
                    {!empty && <span className="tr up">▲</span>}
                  </td>
                  <td>
                    <strong>{empty ? 0 : 14}</strong>{" "}
                    {!empty && <span className="tr up">▲</span>}
                  </td>
                </tr>
                <tr>
                  <th scope="row" style={{ fontWeight: 500 }}>
                    Course Completion
                  </th>
                  <td>
                    <strong>{empty ? 0 : 11}</strong>{" "}
                    {!empty && <span className="tr dn">▼</span>}
                  </td>
                  <td>
                    <strong>{empty ? 0 : 73}</strong>{" "}
                    {!empty && <span className="tr up">▲</span>}
                  </td>
                </tr>
                <tr>
                  <th scope="row" style={{ fontWeight: 500 }}>
                    User Logins
                  </th>
                  <td>
                    <strong>{empty ? 0 : 168}</strong>{" "}
                    {!empty && <span className="tr up">▲</span>}
                  </td>
                  <td>
                    <strong>{empty ? 0 : 412}</strong>{" "}
                    {!empty && <span className="tr dn">▼</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Performances & Statistics */}
        <div className="card">
          <div className="card-head">
            <h2>Performances &amp; Statistics</h2>
            <Link href="/admin/courses" className="small" style={{ color: "var(--accent-text)" }}>
              View all
            </Link>
          </div>
          <div className="card-body">
            <h3 style={{ fontSize: 14, margin: "0 0 10px", fontWeight: 600 }}>Course Completion</h3>
            <div className="donut-wrap">
              <div className="chart-wrap">
                <svg className="donut" viewBox="0 0 150 150">
                  <g transform="rotate(-90 75 75)">
                    <circle className="trk" cx="75" cy="75" r="54" />
                    {!empty && (
                      <>
                        {/* Segment 1: In progress */}
                        <circle
                          className="seg"
                          cx="75"
                          cy="75"
                          r="54"
                          stroke="var(--s1)"
                          strokeDasharray="116 223"
                          strokeDashoffset="0"
                        />
                        {/* Segment 2: Completed */}
                        <circle
                          className="seg"
                          cx="75"
                          cy="75"
                          r="54"
                          stroke="var(--accent)"
                          strokeDasharray="189 150"
                          strokeDashoffset="-118"
                        />
                        {/* Segment 3: Expired */}
                        <circle
                          className="seg"
                          cx="75"
                          cy="75"
                          r="54"
                          stroke="var(--warn)"
                          strokeDasharray="10 329"
                          strokeDashoffset="-309"
                        />
                      </>
                    )}
                  </g>
                  <text className="big" x="75" y="77">
                    {empty ? "0" : "2,120"}
                  </text>
                  <text className="sm" x="75" y="95">
                    total
                  </text>
                </svg>
              </div>

              <ul className="lg">
                <li>
                  <span className="sw" style={{ background: "var(--s1)" }}></span>
                  <span>In Progress</span>
                  <span>
                    <span className="pc">{empty ? "0%" : "34.25%"}</span>
                    <span className="us">{empty ? 0 : "726"} users</span>
                  </span>
                </li>
                <li>
                  <span className="sw" style={{ background: "var(--accent)" }}></span>
                  <span>Completed</span>
                  <span>
                    <span className="pc">{empty ? "0%" : "55.85%"}</span>
                    <span className="us">{empty ? 0 : "1,184"} users</span>
                  </span>
                </li>
                <li>
                  <span className="sw" style={{ background: "var(--warn)" }}></span>
                  <span>Expired</span>
                  <span>
                    <span className="pc">{empty ? "0%" : "2.74%"}</span>
                    <span className="us">{empty ? 0 : "58"} users</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="boxes">
              <div>
                <span className="num" style={{ color: "var(--accent)" }}>
                  {empty ? 0 : 3}
                </span>
                <span className="lab">Discussion Forums</span>
              </div>
              <div>
                <span className="num" style={{ color: "var(--accent)" }}>
                  {empty ? 0 : 1}
                </span>
                <span className="lab">Live Online Classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Popular Courses */}
        <div className="card">
          <div className="card-head">
            <h2>Popular Courses</h2>
            <Link href="/admin/courses" className="small" style={{ color: "var(--accent-text)" }}>
              View all
            </Link>
          </div>
          <div className="card-body">
            {empty ? (
              <div style={{ padding: "24px 0", textAlign: "center", color: "var(--muted)" }}>
                No Result Found
              </div>
            ) : (
              POPULAR_COURSES.map((p) => {
                const widthPercent = ((p.enrollments / POPULAR_COURSES[0].enrollments) * 100).toFixed(1);
                return (
                  <button key={p.name} type="button" className="hbar">
                    <span className="top">
                      <span className="pn">{p.name}</span>
                      <span className="pc">{p.enrollments} enrollments</span>
                    </span>
                    <span className="tr2">
                      <span style={{ width: `${widthPercent}%` }} />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Sessions Section */}
      <section className="card" style={{ marginTop: 16 }} id="upcoming">
        <div className="card-head">
          <h2 style={{ fontSize: 16, margin: 0 }}>Upcoming sessions</h2>
          <span
            className="badge warn"
            style={{
              background: "var(--warn-soft)",
              color: "var(--warn-text)",
              padding: "2px 8px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Owner request, not in the LMS
          </span>
          <Link href="/admin/courses" className="small" style={{ marginLeft: "auto", color: "var(--accent-text)" }}>
            View all classes
          </Link>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Class</th>
                <th scope="col">Where</th>
                <th scope="col">Instructor</th>
                <th scope="col">Enrolled</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {empty ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "30px 0", color: "var(--muted)" }}>
                    No upcoming sessions scheduled.
                  </td>
                </tr>
              ) : (
                UPCOMING_SESSIONS.map((sess) => (
                  <tr key={sess.id}>
                    <td className="nowrap">
                      <span className="dwrap">
                        <span className="dblk" aria-hidden="true">
                          <b>{sess.day}</b>
                          {sess.mon}
                        </span>
                        <span>
                          <strong>{sess.dowDate}</strong>
                          <div className="cell-sub">{sess.time}</div>
                        </span>
                      </span>
                    </td>
                    <td>
                      <Link className="cell-main" href="/admin/courses">
                        {sess.name}
                      </Link>
                      <div className="cell-sub">
                        Session {sess.sessionNum} of {sess.sessionOf}
                      </div>
                    </td>
                    <td>{sess.where}</td>
                    <td>{sess.instructor}</td>
                    <td>
                      {sess.enrolled} / {sess.max}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            sess.badge === "success"
                              ? "var(--success-soft)"
                              : sess.badge === "warn"
                              ? "var(--warn-soft)"
                              : "var(--info-soft)",
                          color:
                            sess.badge === "success"
                              ? "var(--success-text)"
                              : sess.badge === "warn"
                              ? "var(--warn-text)"
                              : "var(--info-text)",
                          padding: "2px 8px",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {sess.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3-Column Bottom Section: Announcements, Instructors, Training Calendar */}
      <section className="grid c3" style={{ marginTop: 16 }} aria-label="Announcements, instructors and calendar">
        {/* Card 1: Announcements */}
        <div className="card">
          <div className="card-head">
            <h2>Announcements</h2>
            <Link href="/admin/comms" className="small" style={{ color: "var(--accent-text)" }}>
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">By</th>
                  <th scope="col">When</th>
                </tr>
              </thead>
              <tbody>
                {empty ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "20px 0", color: "var(--muted)" }}>
                      No announcements posted.
                    </td>
                  </tr>
                ) : (
                  ANNOUNCEMENTS.map((ann, i) => (
                    <tr key={i}>
                      <td>
                        <Link className="cell-main" href="/admin/comms">
                          {ann.title}
                        </Link>
                      </td>
                      <td className="nowrap">{ann.by}</td>
                      <td className="nowrap muted">{ann.when}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Instructors */}
        <div className="card">
          <div className="card-head">
            <h2>Instructors</h2>
            <Link href="/admin/users" className="small" style={{ color: "var(--accent-text)" }}>
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Instructor</th>
                  <th scope="col">Upcoming sessions</th>
                </tr>
              </thead>
              <tbody>
                {empty ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", padding: "20px 0", color: "var(--muted)" }}>
                      No active instructors found.
                    </td>
                  </tr>
                ) : (
                  INSTRUCTORS.map((ins, i) => {
                    const initials = ins.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("");
                    return (
                      <tr key={i}>
                        <td>
                          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className="avatar">{initials}</span>
                            <span>{ins.name}</span>
                          </span>
                        </td>
                        <td>{ins.sessions}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 3: Training Calendar */}
        <div className="card">
          <div className="card-head">
            <h2>Training Calendar</h2>
            <div style={{ display: "flex", gap: 6 }}>
              <select
                value={calMonth}
                onChange={(e) => setCalMonth(Number(e.target.value))}
                style={{ width: "auto", height: 32, padding: "0 8px", fontSize: 13 }}
              >
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ].map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={calYear}
                onChange={(e) => setCalYear(Number(e.target.value))}
                style={{ width: "auto", height: 32, padding: "0 8px", fontSize: 13 }}
              >
                {[2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="minical" role="group" aria-label="Calendar">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dow) => (
                <div key={dow} className="dow">
                  {dow}
                </div>
              ))}
              {Array.from({ length: calendarDays.firstDay }).map((_, i) => (
                <button key={`off-${i}`} type="button" className="off" tabIndex={-1} disabled />
              ))}
              {Array.from({ length: calendarDays.totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const dStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const mStr = calMonth + 1 < 10 ? `0${calMonth + 1}` : `${calMonth + 1}`;
                const dateKey = `${calYear}-${mStr}-${dStr}`;
                const isToday = calYear === 2026 && calMonth === 9 && dayNum === 14;
                const isSelected = selectedDayKey === dateKey;
                const hasEvents = !empty && !!CALENDAR_EVENTS[dateKey];

                return (
                  <button
                    key={dayNum}
                    type="button"
                    className={`${isToday ? "today " : ""}${isSelected ? "sel" : ""}`}
                    onClick={() => setSelectedDayKey(dateKey)}
                  >
                    {dayNum}
                    {hasEvents && <span className="dot" />}
                  </button>
                );
              })}
            </div>

            <h3 style={{ fontSize: 14, margin: "14px 0 6px", fontWeight: 600 }}>
              Events:{" "}
              <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                {selectedDayKey || "None selected"}
              </span>
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
              {selectedDayKey && CALENDAR_EVENTS[selectedDayKey] && !empty ? (
                CALENDAR_EVENTS[selectedDayKey].map((ev, i) => (
                  <li key={i} style={{ padding: "4px 0" }}>
                    <Link className="cell-main" href="/admin/courses">
                      {ev}
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ color: "var(--muted)", padding: "4px 0" }}>
                  {empty ? "No events available." : "No events for this day."}
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Reports Section */}
      <h2 className="sec-h" style={{ margin: "24px 0 12px" }}>
        Quick Reports
      </h2>
      <section className="qr-grid" aria-label="Quick Reports">
        <Link className="qr-box" href="/admin/courses">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <rect x="5" y="4" width="14" height="17" rx="2" />
              <path d="M9 4V3h6v1M9 11h6M9 15h4" />
            </svg>
          </span>
          <span>User Course Enrollments</span>
        </Link>
        <Link className="qr-box" href="/admin/courses">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3.5" />
              <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            </svg>
          </span>
          <span>User Class Enrollments</span>
        </Link>
        <Link className="qr-box" href="/admin/courses">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
            </svg>
          </span>
          <span>Courses</span>
        </Link>
        <Link className="qr-box" href="/admin/courses">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M2 9l10-5 10 5-10 5z" />
              <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
            </svg>
          </span>
          <span>Learning Plan</span>
        </Link>
        <Link className="qr-box" href="/admin/users">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </span>
          <span>User Learning Plan</span>
        </Link>
        <Link className="qr-box" href="/admin/quizzes">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01" />
            </svg>
          </span>
          <span>User Assessments</span>
        </Link>
        <Link className="qr-box" href="/admin/comms">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" />
            </svg>
          </span>
          <span>Sent Notifications</span>
        </Link>
        <Link className="qr-box" href="/admin/courses">
          <span className="qi">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M6 3h8l5 5v13H6z" />
              <path d="M14 3v5h5" />
            </svg>
          </span>
          <span>SCORM Attempt</span>
        </Link>
      </section>

      {/* Suggestions Details */}
      <details className="sug-section" id="sugg" style={{ marginTop: 24 }}>
        <summary>
          <span
            className="badge accent"
            style={{
              background: "var(--accent)",
              color: "var(--on-accent)",
              padding: "2px 8px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Claude
          </span>
          <h2 style={{ fontSize: 17, margin: 0 }}>Suggestions from Claude</h2>
          <span className="small muted">These are not LMS features. They are ideas for you to accept or reject.</span>
        </summary>
        <div className="sug-body">
          <ul className="sug-list">
            {SUGGESTIONS.map(([title, desc], i) => (
              <li key={i}>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span
                  className="badge warn"
                  style={{
                    background: "var(--warn-soft)",
                    color: "var(--warn-text)",
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Not in the LMS today
                </span>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {/* Floating Chart Tooltip */}
      {tooltip && (
        <div
          className="chart-tip"
          style={{
            position: "fixed",
            left: Math.min(window.innerWidth - 200, tooltip.x + 12),
            top: Math.max(10, tooltip.y - 30),
            zIndex: 99999,
            pointerEvents: "none",
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border-strong)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            fontWeight: 500,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
