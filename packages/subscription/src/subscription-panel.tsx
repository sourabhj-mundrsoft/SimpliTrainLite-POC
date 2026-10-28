"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./subscription.css";

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  learnerLimit: string;
  instructorLimit: string;
  features: string[];
  isCurrent?: boolean;
}

interface SubscriptionInvoice {
  invoiceNo: string;
  date: string;
  amount: number;
  planDescription: string;
  status: "Paid" | "Pending";
}

const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Ideal for boutique training academies and small teams.",
    monthlyPrice: 1900,
    annualPrice: 19000,
    learnerLimit: "Up to 50 active learners",
    instructorLimit: "2 instructor seats",
    features: [
      "Standard course catalog & quizzes",
      "Certificates of completion",
      "Classroom schedule management",
      "Standard email notifications",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Our most popular tier for growing training enterprises.",
    monthlyPrice: 4500,
    annualPrice: 45000,
    learnerLimit: "Up to 250 active learners",
    instructorLimit: "15 instructor seats",
    features: [
      "Full AI Course Assistant studio",
      "SCORM 1.2 & SCORM 2004 packages",
      "White-label branding & custom themes",
      "Corporate credit pools & discount coupons",
      "Advanced audit reports & CSV exports",
    ],
    isCurrent: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Unlimited scale and governance for global organizations.",
    monthlyPrice: 11000,
    annualPrice: 110000,
    learnerLimit: "Unlimited active learners",
    instructorLimit: "Unlimited instructor seats",
    features: [
      "Everything in Professional",
      "Custom CNAME domain & SAML / Okta SSO",
      "Multi-tenant center partitioning",
      "Dedicated account manager & 99.9% SLA",
      "REST API access & webhook triggers",
    ],
  },
];

const INVOICES: SubscriptionInvoice[] = [
  {
    invoiceNo: "ST-INV-2026-0091",
    date: "2026-10-15",
    amount: 53100, // 45000 + 18% GST
    planDescription: "SimpliTrain Lite Professional (Annual Renewal)",
    status: "Paid",
  },
  {
    invoiceNo: "ST-INV-2025-0042",
    date: "2025-10-15",
    amount: 53100,
    planDescription: "SimpliTrain Lite Professional (Annual Renewal)",
    status: "Paid",
  },
];

export function SubscriptionPanel() {
  const [activeTab, setActiveTab] = useState<"overview" | "plans" | "billing">("overview");

  // Plan state
  const [currentPlan, setCurrentPlan] = useState<string>("professional");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [autoRenew, setAutoRenew] = useState(true);

  // Selected plan to switch
  const [planToSwitch, setPlanToSwitch] = useState<PlanTier | null>(null);

  // Confirm plan change
  const handleConfirmPlanChange = () => {
    if (!planToSwitch) return;
    setCurrentPlan(planToSwitch.id);
    setPlanToSwitch(null);
    alert(`Successfully switched subscription to ${planToSwitch.name} (${billingCycle})!`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard</Link>
        <span>/</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Subscription</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>{activeTab}</span>
      </nav>

      {/* Header */}
      <div className="sub-header">
        <div>
          <h1>Subscription &amp; Platform Licensing</h1>
          <p className="sub">
            Manage your center&apos;s active subscription to SimpliTrain Lite: plan tier, seat capacity utilization, and billing records.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {activeTab !== "plans" && (
            <button
              type="button"
              className="btn primary"
              onClick={() => setActiveTab("plans")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Change Plan
            </button>
          )}
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="sub-subnav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "plans" ? "active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          <span>Compare Plans</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "billing" ? "active" : ""}`}
          onClick={() => setActiveTab("billing")}
        >
          <span>Billing &amp; Invoices</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gap: 20 }}>
          <div className="ov-top">
            {/* Current Plan Card */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>Professional Plan</h2>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>Annual Billing Cycle · 18% GST Applicable</div>
                </div>
                <span
                  style={{
                    background: "var(--success-soft)",
                    color: "var(--success-text)",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  ACTIVE
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, margin: "16px 0", padding: "14px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                <div>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Annual Rate</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>₹45,000 / yr</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Next Renewal</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>Oct 15, 2027</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Payment Method</span>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Visa ending 4242</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <div>
                  <strong style={{ fontSize: 14 }}>Automatic Renewal</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {autoRenew ? "Your card on file will be charged automatically on renewal date." : "Manual renewal required prior to expiration."}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRenew(!autoRenew)}
                  style={{
                    background: autoRenew ? "var(--success-soft)" : "var(--surface-2)",
                    color: autoRenew ? "var(--success-text)" : "var(--muted)",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {autoRenew ? "Auto-Renew On" : "Auto-Renew Off"}
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card">
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Quick Actions</h3>
              <div style={{ display: "grid", gap: 10 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setActiveTab("plans")}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  Change Plan Tier
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => alert("Seat expansion pack requested: 50 additional learner seats added to quote.")}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  Add +50 Learner Seats
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setActiveTab("billing")}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  Update Payment Card
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => alert("Downloading latest invoice ST-INV-2026-0091.pdf...")}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  Download Latest Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Seats Usage Card */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: 16 }}>Active Seats Capacity</h3>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  Only active users consume licensing capacity. Deactivated users are exempt.
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div className="meter-row">
                <div className="meter-header">
                  <strong>Learners</strong>
                  <span>142 of 250 seats used (56%)</span>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: "56%", background: "var(--accent)" }}></div>
                </div>
              </div>

              <div className="meter-row">
                <div className="meter-header">
                  <strong>Instructors</strong>
                  <span>8 of 15 seats used (53%)</span>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: "53%", background: "var(--accent)" }}></div>
                </div>
              </div>

              <div className="meter-row">
                <div className="meter-header">
                  <strong>Department Managers</strong>
                  <span>4 of 10 seats used (40%)</span>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: "40%", background: "var(--accent)" }}></div>
                </div>
              </div>

              <div className="meter-row">
                <div className="meter-header">
                  <strong>System Administrators</strong>
                  <span>2 of 5 seats used (40%)</span>
                </div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: "40%", background: "var(--accent)" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPARE PLANS */}
      {activeTab === "plans" && (
        <div>
          {/* Billing Cycle Switch */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 14, fontWeight: billingCycle === "monthly" ? 700 : 400 }}>Monthly Billing</span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
              style={{
                width: 52,
                height: 28,
                borderRadius: 14,
                background: "var(--accent)",
                position: "relative",
                border: "none",
                cursor: "pointer",
                padding: 2,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#fff",
                  transform: billingCycle === "annual" ? "translateX(24px)" : "translateX(0)",
                  transition: "transform 0.2s ease",
                }}
              ></div>
            </button>
            <span style={{ fontSize: 14, fontWeight: billingCycle === "annual" ? 700 : 400 }}>
              Annual Billing <span style={{ color: "var(--success-text)", fontSize: 12, fontWeight: 700 }}>(Save 20%)</span>
            </span>
          </div>

          {/* 3 Plan Cards */}
          <div className="plan-cards-grid">
            {PLANS.map((plan) => {
              const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
              const period = billingCycle === "annual" ? "/ year" : "/ month";
              const isCurrent = currentPlan === plan.id;

              return (
                <div key={plan.id} className={`plan-card ${isCurrent ? "current" : ""}`}>
                  {isCurrent && <span className="plan-badge">Current Plan</span>}
                  <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>{plan.name}</h3>
                  <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                    {plan.tagline}
                  </p>

                  <div style={{ margin: "10px 0" }}>
                    <span style={{ fontSize: 28, fontWeight: 800 }}>₹{price.toLocaleString()}</span>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}> {period}</span>
                  </div>

                  <div style={{ padding: "8px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", margin: "10px 0", fontSize: 13, fontWeight: 600 }}>
                    <div>{plan.learnerLimit}</div>
                    <div style={{ color: "var(--muted)", marginTop: 2 }}>{plan.instructorLimit}</div>
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feat, i) => (
                      <li key={i}>
                        <span style={{ color: "var(--success)" }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "auto", paddingTop: 16 }}>
                    <button
                      type="button"
                      disabled={isCurrent}
                      className={`btn ${isCurrent ? "ghost" : "primary"}`}
                      onClick={() => setPlanToSwitch(plan)}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      {isCurrent ? "Active Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BILLING & INVOICES */}
      {activeTab === "billing" && (
        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Payment Method Card */}
            <div className="card">
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Payment Method on File</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "var(--surface-2)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
                <div style={{ width: 44, height: 30, background: "#1a1f71", borderRadius: 4, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                  VISA
                </div>
                <div>
                  <strong style={{ display: "block" }}>Visa ending in 4242</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Expires 08/2029</span>
                </div>
              </div>
              <button
                type="button"
                className="btn sm"
                onClick={() => alert("Stripe customer card update modal initiated.")}
              >
                Update Credit Card
              </button>
            </div>

            {/* Tax & Billing Details Card */}
            <div className="card">
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Billing Details &amp; Tax GSTIN</h3>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text)" }}>
                <div><strong>Acme Training Solutions Pvt Ltd</strong></div>
                <div>Tower 4, Level 8, Business Bay</div>
                <div>Pune, Maharashtra 411006, India</div>
                <div style={{ marginTop: 6 }}>
                  GSTIN: <code style={{ background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>27AABCU9603R1ZM</code>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Subscription Billing History</h3>
            </div>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "10px 16px", fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>Invoice ID</th>
                    <th style={{ padding: "10px 16px", fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>Description</th>
                    <th style={{ padding: "10px 16px", fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>Date</th>
                    <th style={{ padding: "10px 16px", fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>Amount</th>
                    <th style={{ padding: "10px 16px", fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>Status</th>
                    <th style={{ padding: "10px 16px", fontSize: 12, textTransform: "uppercase", color: "var(--muted)", textAlign: "right" }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv) => (
                    <tr key={inv.invoiceNo} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 600 }}>{inv.invoiceNo}</td>
                      <td style={{ padding: "12px 16px" }}>{inv.planDescription}</td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)", whiteSpace: "nowrap" }}>{inv.date}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700 }}>₹{inv.amount.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "var(--success-soft)", color: "var(--success-text)", padding: "2px 8px", borderRadius: 4, fontSize: 11.5, fontWeight: 600 }}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn sm ghost"
                          onClick={() => alert(`Downloading ${inv.invoiceNo}.pdf...`)}
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Plan Switch Confirmation Modal */}
      {planToSwitch && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <div className="modal" style={{ width: "100%", maxWidth: 480, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>Confirm Plan Upgrade</h2>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--text)" }}>
              Are you sure you want to change your center&apos;s subscription to the <strong>{planToSwitch.name}</strong> tier ({billingCycle} billing)?
            </p>
            <div style={{ background: "var(--surface-2)", padding: 12, borderRadius: 6, fontSize: 13, marginBottom: 20 }}>
              Price: <strong>₹{(billingCycle === "annual" ? planToSwitch.annualPrice : planToSwitch.monthlyPrice).toLocaleString()}</strong> {billingCycle === "annual" ? "/ year" : "/ month"} + 18% GST.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn"
                onClick={() => setPlanToSwitch(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={handleConfirmPlanChange}
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPanel;
