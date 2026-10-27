"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./payments.css";

interface Invoice {
  id: string; // Order ID
  customerName: string;
  customerEmail: string;
  company: string;
  items: string;
  amount: number;
  currency: string;
  paymentMethod: "Stripe Card" | "Bank Wire / Invoice" | "Corporate Credit" | "PayPal";
  status: "Paid" | "Unpaid" | "Partial" | "Refunded";
  date: string;
}

interface CoursePrice {
  id: string;
  courseTitle: string;
  inrPrice: number;
  usdPrice: number;
  taxRate: string;
  tier: "Standard" | "Compliance Bundle" | "Executive Cohort";
}

interface Coupon {
  id: string;
  name: string;
  code: string;
  mode: "Percentage" | "Amount";
  value: number;
  startDate: string;
  expireDate: string;
  usedCount: number;
  isEnabled: boolean;
}

interface CreditPool {
  id: string;
  companyName: string;
  allocatedCredits: number;
  consumedCredits: number;
  ratePerCredit: number;
  renewalDate: string;
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-8812",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    company: "Acme Corp Tech",
    items: "Workplace Safety & Ergonomics (Cohort 4)",
    amount: 14500,
    currency: "INR",
    paymentMethod: "Stripe Card",
    status: "Paid",
    date: "2026-10-26",
  },
  {
    id: "INV-2026-8813",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@example.com",
    company: "Fintech Global",
    items: "SOC 2 Type II Compliance & Certification Exam",
    amount: 28000,
    currency: "INR",
    paymentMethod: "Bank Wire / Invoice",
    status: "Paid",
    date: "2026-10-25",
  },
  {
    id: "INV-2026-8814",
    customerName: "Jordan Hayes",
    customerEmail: "jordan.hayes@example.com",
    company: "CloudScale Systems",
    items: "Customer Service Scenarios + 5 Seat Licenses",
    amount: 42000,
    currency: "INR",
    paymentMethod: "Corporate Credit",
    status: "Unpaid",
    date: "2026-10-24",
  },
  {
    id: "INV-2026-8815",
    customerName: "Sarah Lin",
    customerEmail: "sarah.lin@example.com",
    company: "Nexis Health",
    items: "Data Privacy & GDPR Fundamentals",
    amount: 9500,
    currency: "INR",
    paymentMethod: "Stripe Card",
    status: "Paid",
    date: "2026-10-22",
  },
  {
    id: "INV-2026-8816",
    customerName: "David Kim",
    customerEmail: "david.kim@example.com",
    company: "Self-sponsored",
    items: "Code Review Standards & PR Hygiene",
    amount: 6000,
    currency: "INR",
    paymentMethod: "PayPal",
    status: "Refunded",
    date: "2026-10-20",
  },
];

const INITIAL_PRICES: CoursePrice[] = [
  {
    id: "pr-1",
    courseTitle: "Workplace Health, Safety & Ergonomics",
    inrPrice: 14500,
    usdPrice: 175,
    taxRate: "18% GST",
    tier: "Standard",
  },
  {
    id: "pr-2",
    courseTitle: "Phishing & Social Engineering Defense",
    inrPrice: 18000,
    usdPrice: 220,
    taxRate: "18% GST",
    tier: "Compliance Bundle",
  },
  {
    id: "pr-3",
    courseTitle: "SOC 2 Type II Compliance & Evidence Gathering",
    inrPrice: 28000,
    usdPrice: 340,
    taxRate: "18% GST",
    tier: "Executive Cohort",
  },
  {
    id: "pr-4",
    courseTitle: "Customer Support De-escalation Strategies",
    inrPrice: 12000,
    usdPrice: 145,
    taxRate: "18% GST",
    tier: "Standard",
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c1",
    name: "Diwali Fest Offer",
    code: "DIWALI10",
    mode: "Percentage",
    value: 10,
    startDate: "2026-10-10",
    expireDate: "2026-11-15",
    usedCount: 14,
    isEnabled: true,
  },
  {
    id: "c2",
    name: "New Learner Welcome Voucher",
    code: "WELCOME500",
    mode: "Amount",
    value: 500,
    startDate: "2026-09-01",
    expireDate: "2026-12-31",
    usedCount: 38,
    isEnabled: true,
  },
  {
    id: "c3",
    name: "Early Bird Leadership Cohort",
    code: "EARLY15",
    mode: "Percentage",
    value: 15,
    startDate: "2026-10-01",
    expireDate: "2026-10-31",
    usedCount: 7,
    isEnabled: true,
  },
  {
    id: "c4",
    name: "Enterprise Partner Referral",
    code: "PARTNER20",
    mode: "Percentage",
    value: 20,
    startDate: "2026-06-01",
    expireDate: "2026-09-30",
    usedCount: 22,
    isEnabled: false,
  },
];

const INITIAL_POOLS: CreditPool[] = [
  {
    id: "pool-01",
    companyName: "Acme Corp Tech",
    allocatedCredits: 500,
    consumedCredits: 385,
    ratePerCredit: 1200,
    renewalDate: "2026-12-31",
  },
  {
    id: "pool-02",
    companyName: "CloudScale Systems",
    allocatedCredits: 1000,
    consumedCredits: 620,
    ratePerCredit: 1100,
    renewalDate: "2027-03-31",
  },
  {
    id: "pool-03",
    companyName: "Fintech Global",
    allocatedCredits: 250,
    consumedCredits: 210,
    ratePerCredit: 1250,
    renewalDate: "2026-11-30",
  },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "pricing" | "coupons" | "credits">("invoices");

  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // New Invoice form state
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newAmount, setNewAmount] = useState(15000);
  const [newPaymentStatus, setNewPaymentStatus] = useState<"Paid" | "Unpaid" | "Partial">("Paid");

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [couponSearch, setCouponSearch] = useState("");
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponMode, setNewCouponMode] = useState<"Percentage" | "Amount">("Percentage");
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponExpire, setNewCouponExpire] = useState("2026-12-31");

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (
      searchQuery &&
      !inv.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inv.company.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Filter coupons
  const filteredCoupons = coupons.filter((c) => {
    if (
      couponSearch &&
      !c.code.toLowerCase().includes(couponSearch.toLowerCase()) &&
      !c.name.toLowerCase().includes(couponSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Toggle coupon enabled
  const toggleCouponEnabled = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  };

  // Create invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newItemTitle.trim()) return;

    const newInv: Invoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustomerName.trim(),
      customerEmail: `${newCustomerName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      company: newCompany.trim() || "Independent",
      items: newItemTitle.trim(),
      amount: Number(newAmount),
      currency: "INR",
      paymentMethod: "Bank Wire / Invoice",
      status: newPaymentStatus,
      date: new Date().toISOString().slice(0, 10),
    };

    setInvoices([newInv, ...invoices]);
    setIsNewInvoiceOpen(false);
    setNewCustomerName("");
    setNewCompany("");
    setNewItemTitle("");
  };

  // Create coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponTitle.trim() || !newCouponCode.trim()) return;

    const newC: Coupon = {
      id: `c-${Date.now().toString().slice(-4)}`,
      name: newCouponTitle.trim(),
      code: newCouponCode.trim().toUpperCase(),
      mode: newCouponMode,
      value: Number(newCouponValue),
      startDate: new Date().toISOString().slice(0, 10),
      expireDate: newCouponExpire,
      usedCount: 0,
      isEnabled: true,
    };

    setCoupons([newC, ...coupons]);
    setIsNewCouponOpen(false);
    setNewCouponTitle("");
    setNewCouponCode("");
  };

  // Export CSV
  const handleExportInvoicesCsv = () => {
    const headers = ["Order ID", "Customer Name", "Company", "Items", "Amount", "Currency", "Payment Method", "Status", "Date"];
    const rows = invoices.map((i) => [
      i.id,
      `"${i.customerName.replace(/"/g, '""')}"`,
      `"${i.company.replace(/"/g, '""')}"`,
      `"${i.items.replace(/"/g, '""')}"`,
      i.amount,
      i.currency,
      i.paymentMethod,
      i.status,
      i.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Invoices_Orders_Export.csv");
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
        <span style={{ color: "var(--text)", fontWeight: 500 }}>Payments &amp; Monetization</span>
        <span>/</span>
        <span style={{ textTransform: "capitalize" }}>{activeTab}</span>
      </nav>

      {/* Header */}
      <div className="pay-header">
        <div>
          <h1>Payments &amp; Monetization</h1>
          <p className="sub">
            Track learner order fulfillments, manage course catalog pricing tiers, configure promotional discount coupons, and oversee corporate credit wallets.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {activeTab === "invoices" && (
            <>
              <button
                type="button"
                className="btn"
                onClick={handleExportInvoicesCsv}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => setIsNewInvoiceOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Invoice
              </button>
            </>
          )}
          {activeTab === "coupons" && (
            <button
              type="button"
              className="btn primary"
              onClick={() => setIsNewCouponOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create Coupon
            </button>
          )}
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="pay-subnav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "invoices" ? "active" : ""}`}
          onClick={() => setActiveTab("invoices")}
        >
          <span>Invoices &amp; Orders</span>
          <span className="count-badge">{invoices.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "pricing" ? "active" : ""}`}
          onClick={() => setActiveTab("pricing")}
        >
          <span>Course Pricing</span>
          <span className="count-badge">{INITIAL_PRICES.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "coupons" ? "active" : ""}`}
          onClick={() => setActiveTab("coupons")}
        >
          <span>Discount Coupons</span>
          <span className="count-badge">{coupons.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "credits" ? "active" : ""}`}
          onClick={() => setActiveTab("credits")}
        >
          <span>Corporate Credit Pools</span>
          <span className="count-badge">{INITIAL_POOLS.length}</span>
        </button>
      </div>

      {/* TAB 1: INVOICES & ORDERS */}
      {activeTab === "invoices" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="pay-toolbar">
            <div className="pay-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search by Order ID, customer, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Payment Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              >
                <option value="all">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {(searchQuery || statusFilter !== "all") && (
              <button
                type="button"
                className="btn sm ghost"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </button>
            )}

            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              Showing <strong>{filteredInvoices.length}</strong> of {invoices.length} orders
            </div>
          </div>

          <div className="pay-table-wrap">
            <table className="pay-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer / Company</th>
                  <th>Product / Line Item</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "36px 16px", color: "var(--muted)" }}>
                      No orders or invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <button
                          type="button"
                          className="pay-cell-title"
                          onClick={() => setSelectedInvoice(inv)}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "monospace" }}
                        >
                          {inv.id}
                        </button>
                      </td>
                      <td>
                        <strong style={{ display: "block" }}>{inv.customerName}</strong>
                        <span className="pay-cell-sub">{inv.company}</span>
                      </td>
                      <td>
                        <div style={{ maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={inv.items}>
                          {inv.items}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                        ₹{inv.amount.toLocaleString()}
                      </td>
                      <td style={{ fontSize: 12.5, color: "var(--muted)" }}>{inv.paymentMethod}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 11.5,
                            fontWeight: 600,
                            background:
                              inv.status === "Paid"
                                ? "var(--success-soft)"
                                : inv.status === "Unpaid"
                                ? "var(--warn-soft)"
                                : "var(--surface-2)",
                            color:
                              inv.status === "Paid"
                                ? "var(--success-text)"
                                : inv.status === "Unpaid"
                                ? "var(--warn-text)"
                                : "var(--muted)",
                          }}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{inv.date}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            className="btn sm"
                            onClick={() => setSelectedInvoice(inv)}
                          >
                            Receipt
                          </button>
                          {inv.status === "Paid" && (
                            <button
                              type="button"
                              className="btn sm ghost"
                              style={{ color: "var(--danger-text)" }}
                              onClick={() => {
                                if (confirm(`Issue refund for Order ${inv.id}?`)) {
                                  setInvoices(
                                    invoices.map((item) => (item.id === inv.id ? { ...item, status: "Refunded" } : item))
                                  );
                                }
                              }}
                            >
                              Refund
                            </button>
                          )}
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

      {/* TAB 2: COURSE PRICING */}
      {activeTab === "pricing" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="pay-table-wrap">
            <table className="pay-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Price (INR ₹)</th>
                  <th>Price (USD $)</th>
                  <th>Applicable Taxes</th>
                  <th>Pricing Tier</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_PRICES.map((pr) => (
                  <tr key={pr.id}>
                    <td>
                      <strong style={{ display: "block" }}>{pr.courseTitle}</strong>
                      <span className="pay-cell-sub">ID: {pr.id}</span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 14 }}>₹{pr.inrPrice.toLocaleString()}</td>
                    <td style={{ color: "var(--muted)", fontSize: 13.5 }}>${pr.usdPrice}</td>
                    <td>{pr.taxRate}</td>
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
                        {pr.tier}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" className="btn sm">Edit Price</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISCOUNT COUPONS */}
      {activeTab === "coupons" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="pay-toolbar">
            <div className="pay-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search coupon by code or campaign name..."
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
              />
            </div>
            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
              {filteredCoupons.length} promotional coupons
            </div>
          </div>

          <div className="pay-table-wrap">
            <table className="pay-table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Campaign Name</th>
                  <th>Discount Value</th>
                  <th>Valid From</th>
                  <th>Expires On</th>
                  <th>Redemptions</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <code style={{ fontSize: 13, fontWeight: 700, background: "var(--surface-2)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 4 }}>
                        {c.code}
                      </code>
                    </td>
                    <td>{c.name}</td>
                    <td style={{ fontWeight: 600 }}>
                      {c.mode === "Percentage" ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{c.startDate}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{c.expireDate}</td>
                    <td>{c.usedCount} times used</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleCouponEnabled(c.id)}
                        style={{
                          background: c.isEnabled ? "var(--success-soft)" : "var(--surface-2)",
                          color: c.isEnabled ? "var(--success-text)" : "var(--muted)",
                          border: "none",
                          borderRadius: 4,
                          padding: "3px 8px",
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {c.isEnabled ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn sm ghost"
                        style={{ color: "var(--danger-text)" }}
                        onClick={() => {
                          if (confirm(`Delete coupon "${c.code}"?`)) {
                            setCoupons(coupons.filter((item) => item.id !== c.id));
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CREDIT POOLS */}
      {activeTab === "credits" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="pay-table-wrap">
            <table className="pay-table">
              <thead>
                <tr>
                  <th>Corporate Account</th>
                  <th>Allocated Credits</th>
                  <th>Consumed Credits</th>
                  <th>Remaining Balance</th>
                  <th>Contract Unit Value</th>
                  <th>Contract Renewal</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_POOLS.map((pool) => {
                  const remaining = pool.allocatedCredits - pool.consumedCredits;
                  const pctUsed = Math.round((pool.consumedCredits / pool.allocatedCredits) * 100);
                  return (
                    <tr key={pool.id}>
                      <td>
                        <strong style={{ display: "block" }}>{pool.companyName}</strong>
                        <span className="pay-cell-sub">Contract ID: {pool.id}</span>
                      </td>
                      <td>{pool.allocatedCredits} credits</td>
                      <td>{pool.consumedCredits} ({pctUsed}%)</td>
                      <td>
                        <span style={{ fontWeight: 700, color: remaining < 100 ? "var(--warn-text)" : "var(--success-text)" }}>
                          {remaining} credits
                        </span>
                      </td>
                      <td>₹{pool.ratePerCredit.toLocaleString()} / seat</td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--muted)" }}>{pool.renewalDate}</td>
                      <td style={{ textAlign: "right" }}>
                        <button type="button" className="btn sm">Top-up Balance</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE INVOICE */}
      {isNewInvoiceOpen && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <form className="modal" onSubmit={handleCreateInvoice} style={{ width: "100%", maxWidth: 560, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Create Custom Invoice / Order</h2>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Jane Doe"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Company / Organization</label>
              <input
                type="text"
                placeholder="e.g., Acme Corp Tech"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Course / Product *</label>
              <input
                type="text"
                required
                placeholder="e.g., SOC 2 Type II Compliance & Certification"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Price Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Payment Status</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setIsNewInvoiceOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Generate Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: RECEIPT / INVOICE VIEW */}
      {selectedInvoice && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "grid", placeItems: "center", padding: 20 }}>
          <div className="modal" style={{ width: "100%", maxWidth: 680, background: "var(--surface)", borderRadius: "var(--radius)", padding: 28, border: "1px solid var(--border)" }}>
            <div className="receipt-header">
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase" }}>Official Receipt</span>
                <h2 style={{ margin: "2px 0 0", fontSize: 22, fontFamily: "monospace" }}>{selectedInvoice.id}</h2>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Date: {selectedInvoice.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    background: selectedInvoice.status === "Paid" ? "var(--success-soft)" : "var(--warn-soft)",
                    color: selectedInvoice.status === "Paid" ? "var(--success-text)" : "var(--warn-text)",
                  }}
                >
                  {selectedInvoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13, margin: "16px 0" }}>
              <div>
                <strong style={{ color: "var(--muted)" }}>Billed To:</strong>
                <div>{selectedInvoice.customerName}</div>
                <div style={{ color: "var(--muted)" }}>{selectedInvoice.customerEmail}</div>
                <div>{selectedInvoice.company}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong style={{ color: "var(--muted)" }}>Payment Method:</strong>
                <div>{selectedInvoice.paymentMethod}</div>
                <div style={{ color: "var(--muted)" }}>Currency: {selectedInvoice.currency}</div>
              </div>
            </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedInvoice.items}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>₹{selectedInvoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid var(--border)", paddingTop: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Total Paid:</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>
                ₹{selectedInvoice.amount.toLocaleString()}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button type="button" className="btn" onClick={() => window.print()}>
                Print / Save PDF
              </button>
              <button type="button" className="btn primary" onClick={() => setSelectedInvoice(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE COUPON */}
      {isNewCouponOpen && (
        <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "grid", placeItems: "center", padding: 16 }}>
          <form className="modal" onSubmit={handleCreateCoupon} style={{ width: "100%", maxWidth: 520, background: "var(--surface)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Create Promotional Coupon</h2>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Campaign Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Year End Special"
                value={newCouponTitle}
                onChange={(e) => setNewCouponTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g., YEAREND25"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", textTransform: "uppercase", fontFamily: "monospace" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Discount Mode</label>
                <select
                  value={newCouponMode}
                  onChange={(e) => setNewCouponMode(e.target.value as any)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Amount">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Value</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
                />
              </div>
            </div>

            <div className="field">
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Expiration Date</label>
              <input
                type="date"
                value={newCouponExpire}
                onChange={(e) => setNewCouponExpire(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setIsNewCouponOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Activate Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
