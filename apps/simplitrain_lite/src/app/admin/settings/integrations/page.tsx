"use client";

import Link from "next/link";
import { useState } from "react";

type IntegrationTab = "hosts" | "sso" | "email" | "payments" | "video" | "connections";

type MeetingHost = {
  id: string;
  name: string;
  provider: "Zoom" | "Microsoft Teams" | "Webex";
  accountEmail: string;
  status: "Connected" | "Needs Attention" | "Inactive";
  activeMeetings: number;
};

const initialHosts: MeetingHost[] = [
  {
    id: "h-1",
    name: "Primary Zoom Corporate Account",
    provider: "Zoom",
    accountEmail: "virtual-train@acmetraining.example",
    status: "Connected",
    activeMeetings: 6,
  },
  {
    id: "h-2",
    name: "Executive Teams Classroom Tenant",
    provider: "Microsoft Teams",
    accountEmail: "msteams@acmetraining.example",
    status: "Connected",
    activeMeetings: 2,
  },
  {
    id: "h-3",
    name: "Backup Zoom Breakout Pool",
    provider: "Zoom",
    accountEmail: "backup-zoom@acmetraining.example",
    status: "Needs Attention",
    activeMeetings: 0,
  },
];

export default function IntegrationsSettingsPage() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("hosts");
  const [hosts, setHosts] = useState<MeetingHost[]>(initialHosts);

  // Email SMTP settings
  const [emailForm, setEmailForm] = useState({
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    smtpUser: "apikey",
    smtpPass: "SG.secret_key_prod_8941029",
    fromEmail: "notifications@acmetraining.example",
    fromName: "Acme Training Center",
    encryption: "TLS",
  });
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  // Payment settings
  const [paymentForm, setPaymentForm] = useState({
    gateway: "Stripe",
    publishableKey: "pk_live_51M0...92b",
    secretKey: "sk_live_51M0...81x",
    currency: "USD ($)",
    taxRate: "0.00",
    allowOffline: true,
  });
  const [showStripeSecret, setShowStripeSecret] = useState(false);

  // SSO settings
  const [ssoProviders, setSsoProviders] = useState([
    { id: "sso-1", name: "Microsoft Entra ID (Azure AD)", type: "OpenID Connect", status: "Active", users: 142 },
    { id: "sso-2", name: "Google Workspace for Education", type: "SAML 2.0", status: "Active", users: 89 },
  ]);

  // Add Host Modal
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [newHost, setNewHost] = useState({
    name: "",
    provider: "Zoom" as const,
    accountEmail: "",
  });

  const [toast, setToast] = useState<string | null>(null);

  function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    setToast("Email SMTP configuration saved successfully.");
    setTimeout(() => setToast(null), 3000);
  }

  function handleSendTestEmail() {
    setToast(`Sent verification test email to ${emailForm.fromEmail}`);
    setTimeout(() => setToast(null), 3500);
  }

  function handleSavePayments(e: React.FormEvent) {
    e.preventDefault();
    setToast("Payment gateway configuration updated.");
    setTimeout(() => setToast(null), 3000);
  }

  function handleAddHost(e: React.FormEvent) {
    e.preventDefault();
    if (!newHost.name) return;
    const added: MeetingHost = {
      id: `h-${Date.now().toString().slice(-4)}`,
      name: newHost.name,
      provider: newHost.provider,
      accountEmail: newHost.accountEmail,
      status: "Connected",
      activeMeetings: 0,
    };
    setHosts([...hosts, added]);
    setHostModalOpen(false);
    setNewHost({ name: "", provider: "Zoom", accountEmail: "" });
    setToast(`Added ${added.provider} host: "${added.name}".`);
    setTimeout(() => setToast(null), 3000);
  }

  function handleDeleteHost(id: string) {
    setHosts(hosts.filter((h) => h.id !== id));
    setToast("Removed virtual meeting host.");
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="integrations-page" style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/settings" style={{ marginLeft: 6 }}>
          Settings
        </Link>
        <span>Integrations</span>
      </nav>

      {/* Page Head */}
      <div className="page-head">
        <div>
          <div className="head-row">
            <h1>Integrations</h1>
            <span className="badge info" style={{ marginLeft: 8 }}>
              Connected services
            </span>
          </div>
          <p className="sub" style={{ margin: "4px 0 0", color: "var(--muted)" }}>
            Connect virtual meeting platforms, identity providers (SSO), transactional mail servers, and payment processors.
          </p>
        </div>
        <div className="actions">
          {activeTab === "hosts" && (
            <button
              type="button"
              className="btn primary"
              onClick={() => setHostModalOpen(true)}
              style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
            >
              + Add meeting host
            </button>
          )}
        </div>
      </div>

      {/* Tabs matching wireframe */}
      <div
        className="tabs"
        role="tablist"
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginBottom: 20,
          gap: 4,
          overflowX: "auto",
        }}
      >
        {[
          { key: "hosts", label: "Meeting hosts" },
          { key: "email", label: "Email (SMTP)" },
          { key: "payments", label: "Payments" },
          { key: "sso", label: "Single sign-on" },
          { key: "video", label: "Video & SCORM" },
          { key: "connections", label: "API & Webhooks" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === tab.key ? "2px solid var(--accent, #4F46E5)" : "2px solid transparent",
              background: "none",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              color: activeTab === tab.key ? "var(--accent-text)" : "var(--muted)",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: MEETING HOSTS ===================== */}
      {activeTab === "hosts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="card" style={{ borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16 }}>Configured Meeting Hosts</h2>
              <span className="small muted">{hosts.length} hosts active</span>
            </div>
            <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Host Name</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Provider</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Account Email</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Active Runs</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((h) => (
                  <tr key={h.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>{h.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        className="badge"
                        style={{
                          background: h.provider === "Zoom" ? "#e0f2fe" : "#f1f5f9",
                          color: h.provider === "Zoom" ? "#0284c7" : "#475569",
                          fontSize: 11,
                        }}
                      >
                        {h.provider}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)" }}>{h.accountEmail}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{h.activeMeetings} meetings</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`badge ${h.status === "Connected" ? "success" : "warn"}`} style={{ fontSize: 11 }}>
                        {h.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => {
                            setToast(`Testing connection to ${h.name}... OK (200ms latency)`);
                            setTimeout(() => setToast(null), 3000);
                          }}
                        >
                          Test
                        </button>
                        <button
                          type="button"
                          className="btn sm danger"
                          onClick={() => handleDeleteHost(h.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Virtual meeting reports card matching wireframe */}
          <section className="card" style={{ padding: 20, borderRadius: 10 }}>
            <h2 style={{ fontSize: 16, marginBottom: 8 }}>Virtual meeting reports & host audit</h2>
            <p className="small muted" style={{ margin: "0 0 14px" }}>
              Real-time audit screens: Virtual Meeting Host Statistics (# Active Meetings, # Active Users), access logs, and recording durations.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/reports" className="btn sm">
                Virtual Meeting Host Statistics
              </Link>
              <Link href="/reports" className="btn sm">
                Meeting access times
              </Link>
              <Link href="/reports" className="btn sm">
                Cloud recording storage
              </Link>
              <button
                type="button"
                className="btn sm"
                onClick={() => {
                  setToast("Demote Zoom Host executed. Token refreshed.");
                  setTimeout(() => setToast(null), 3000);
                }}
              >
                Demote Zoom Host
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ===================== TAB 2: EMAIL SMTP ===================== */}
      {activeTab === "email" && (
        <form onSubmit={handleSaveEmail}>
          <section className="card" style={{ padding: 20, borderRadius: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16 }}>SMTP Email Server Credentials</h2>
                <p className="small muted" style={{ marginTop: 2 }}>
                  System sends transactional receipts, class reminder notices, and enrollment approvals through this server.
                </p>
              </div>
              <button type="button" className="btn sm" onClick={handleSendTestEmail}>
                Send Test Email
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  SMTP Host *
                </label>
                <input
                  type="text"
                  required
                  value={emailForm.smtpHost}
                  onChange={(e) => setEmailForm({ ...emailForm, smtpHost: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  SMTP Port *
                </label>
                <input
                  type="text"
                  required
                  value={emailForm.smtpPort}
                  onChange={(e) => setEmailForm({ ...emailForm, smtpPort: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Authentication Username *
                </label>
                <input
                  type="text"
                  required
                  value={emailForm.smtpUser}
                  onChange={(e) => setEmailForm({ ...emailForm, smtpUser: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 500 }}>Password / API Key *</label>
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    style={{ background: "none", border: "none", color: "var(--accent-text)", fontSize: 11, cursor: "pointer" }}
                  >
                    {showSmtpPass ? "Mask" : "Show"}
                  </button>
                </div>
                <input
                  type={showSmtpPass ? "text" : "password"}
                  required
                  value={emailForm.smtpPass}
                  onChange={(e) => setEmailForm({ ...emailForm, smtpPass: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Default Sender Address (From) *
                </label>
                <input
                  type="email"
                  required
                  value={emailForm.fromEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Sender Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={emailForm.fromName}
                  onChange={(e) => setEmailForm({ ...emailForm, fromName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn primary"
                style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
              >
                Save email configuration
              </button>
            </div>
          </section>
        </form>
      )}

      {/* ===================== TAB 3: PAYMENTS ===================== */}
      {activeTab === "payments" && (
        <form onSubmit={handleSavePayments}>
          <section className="card" style={{ padding: 20, borderRadius: 10, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, marginBottom: 14 }}>Payment Gateway & Merchant Settings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Active Gateway Provider
                </label>
                <select
                  value={paymentForm.gateway}
                  onChange={(e) => setPaymentForm({ ...paymentForm, gateway: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  <option value="Stripe">Stripe (Credit / Debit / Apple Pay)</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Authorize.Net">Authorize.Net</option>
                  <option value="Offline Only">Offline Corporate Invoicing Only</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Billing Currency
                </label>
                <select
                  value={paymentForm.currency}
                  onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="CAD ($)">CAD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="AUD ($)">AUD ($)</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Public Publishable Key
                </label>
                <input
                  type="text"
                  value={paymentForm.publishableKey}
                  onChange={(e) => setPaymentForm({ ...paymentForm, publishableKey: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 500 }}>Secret API Key</label>
                  <button
                    type="button"
                    onClick={() => setShowStripeSecret(!showStripeSecret)}
                    style={{ background: "none", border: "none", color: "var(--accent-text)", fontSize: 11, cursor: "pointer" }}
                  >
                    {showStripeSecret ? "Mask" : "Show"}
                  </button>
                </div>
                <input
                  type={showStripeSecret ? "text" : "password"}
                  value={paymentForm.secretKey}
                  onChange={(e) => setPaymentForm({ ...paymentForm, secretKey: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={paymentForm.allowOffline}
                    onChange={(e) => setPaymentForm({ ...paymentForm, allowOffline: e.target.checked })}
                  />
                  <span>Allow corporate purchase order (PO) & invoice checkout on public schedule</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn primary"
                style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
              >
                Save payment settings
              </button>
            </div>
          </section>
        </form>
      )}

      {/* ===================== TAB 4: SSO ===================== */}
      {activeTab === "sso" && (
        <section className="card" style={{ padding: 20, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16 }}>Single Sign-On (SSO) Providers</h2>
              <p className="small muted" style={{ marginTop: 2 }}>
                Allow enterprise learners to authenticate using corporate Microsoft 365 or Google Workspace accounts.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ssoProviders.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 18px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div className="small muted" style={{ fontSize: 12, marginTop: 2 }}>
                    Protocol: <strong>{s.type}</strong> · {s.users} authenticated users
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="badge success" style={{ fontSize: 11 }}>{s.status}</span>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => {
                      setToast(`Test SSO callback for ${s.name}: Succeeded.`);
                      setTimeout(() => setToast(null), 3000);
                    }}
                  >
                    Test Flow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================== TAB 5: VIDEO & SCORM ===================== */}
      {activeTab === "video" && (
        <section className="card" style={{ padding: 20, borderRadius: 10 }}>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>External Video & SCORM Storage</h2>
          <p className="small muted" style={{ marginBottom: 16 }}>
            Connect cloud asset stores for large video streaming and SCORM package delivery.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>AWS S3 Content Bucket</strong>
                <span className="badge success">Connected</span>
              </div>
              <p className="small muted" style={{ margin: "8px 0 0" }}>
                Bucket: <code>acme-training-scorm-prod</code> · Region: us-east-2
              </p>
            </div>
            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Vimeo Video OTT</strong>
                <span className="badge" style={{ background: "#f1f5f9", color: "#64748b" }}>Not Connected</span>
              </div>
              <p className="small muted" style={{ margin: "8px 0 0" }}>
                Connect Vimeo account for private domain-restricted video embeds.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ===================== TAB 6: CONNECTIONS & API ===================== */}
      {activeTab === "connections" && (
        <section className="card" style={{ padding: 20, borderRadius: 10 }}>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Center API Keys & Webhooks</h2>
          <p className="small muted" style={{ marginBottom: 16 }}>
            Programmatic REST endpoints for creating enrollments and synchronizing completion logs.
          </p>
          <div style={{ padding: 14, background: "var(--surface-2)", borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Production Read-Only API Key</div>
            <code style={{ fontSize: 12, background: "var(--surface)", padding: "4px 8px", borderRadius: 4, display: "inline-block" }}>
              stl_live_948f29c0182bbad381903e102
            </code>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                setToast("Copied API key to clipboard.");
                setTimeout(() => setToast(null), 2500);
              }}
            >
              Copy API Key
            </button>
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                setToast("Rotated new API key.");
                setTimeout(() => setToast(null), 2500);
              }}
            >
              Rotate Key
            </button>
          </div>
        </section>
      )}

      {/* Add Host Modal */}
      {hostModalOpen && (
        <div
          role="dialog"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
          }}
        >
          <div className="card" style={{ padding: 24, maxWidth: 420, width: "90%", borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>Connect Meeting Host</h3>
            <form onSubmit={handleAddHost} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Host Friendly Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zoom Industrial Training Pool 2"
                  value={newHost.name}
                  onChange={(e) => setNewHost({ ...newHost, name: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Virtual Platform *
                </label>
                <select
                  value={newHost.provider}
                  onChange={(e) => setNewHost({ ...newHost, provider: e.target.value as any })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                >
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Webex">Cisco Webex</option>
                </select>
              </div>

              <div className="field">
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Account Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. training-host@acmetraining.example"
                  value={newHost.accountEmail}
                  onChange={(e) => setNewHost({ ...newHost, accountEmail: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => setHostModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  style={{ backgroundColor: "var(--accent, #4F46E5)", color: "#fff" }}
                >
                  Authorize Host
                </button>
              </div>
            </form>
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
            zIndex: 9999,
            fontWeight: 500,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#22c55e" }}>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
