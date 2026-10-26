"use client";

import { useState } from "react";
import type { OrganizationSettings } from "../types";
import {
  NumberField,
  SectionCard,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "./ui-fields";

export type OrganizationTabProps = {
  settings: OrganizationSettings;
  onChange: (updated: OrganizationSettings) => void;
};

const cultureOptions = [
  { label: "English (United States) — en-US", value: "en-US" },
  { label: "English (United Kingdom) — en-GB", value: "en-GB" },
  { label: "English (Canada) — en-CA", value: "en-CA" },
  { label: "Spanish (Spain) — es-ES", value: "es-ES" },
  { label: "French (France) — fr-FR", value: "fr-FR" },
  { label: "German (Germany) — de-DE", value: "de-DE" },
];

const timeZoneOptions = [
  { label: "Eastern Time (US & Canada) — America/New_York", value: "America/New_York (EST)" },
  { label: "Central Time (US & Canada) — America/Chicago", value: "America/Chicago (CST)" },
  { label: "Pacific Time (US & Canada) — America/Los_Angeles", value: "America/Los_Angeles (PST)" },
  { label: "Greenwich Mean Time — Europe/London", value: "Europe/London (GMT)" },
  { label: "Central European Time — Europe/Paris", value: "Europe/Paris (CET)" },
  { label: "India Standard Time — Asia/Kolkata", value: "Asia/Kolkata (IST)" },
];

const recordingModeOptions = [
  { label: "Automatic (Start on class join)", value: "Automatic" },
  { label: "Manual (Instructor triggers recording)", value: "Manual" },
  { label: "Disabled (No recordings)", value: "Disabled" },
];

const classStatusOptions = [
  { label: "Scheduled", value: "Scheduled" },
  { label: "Guaranteed to Run", value: "Guaranteed to Run" },
  { label: "Tentative", value: "Tentative" },
];

export function OrganizationTab({ settings, onChange }: OrganizationTabProps) {
  const [activeSection, setActiveSection] = useState<string>("identity");

  function update<K extends keyof OrganizationSettings>(key: K, value: OrganizationSettings[K]) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  const sections = [
    { id: "identity", label: "Identity & Region", icon: "🏢" },
    { id: "contact", label: "Contact & Address", icon: "📍" },
    { id: "access", label: "Access & Signup", icon: "🔐" },
    { id: "catalog", label: "Catalog & Classes", icon: "📚" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Side Rail Navigation (like in setup_folder settings-org.html) */}
      <aside aria-label="Settings sections" className="hidden lg:block">
        <div className="sticky top-20 flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Sections
          </p>
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setActiveSection(sec.id);
                const el = document.getElementById(sec.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                activeSection === sec.id
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-xs"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Sections */}
      <div className="flex flex-col gap-6">
        {/* Section 1: Identity & Region */}
        <SectionCard
          id="identity"
          title="Center Identity & Regional Presets"
          description="Your organization is managed as one Center in SimpliTrain Lite."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              id="org-name"
              label="Center Name"
              value={settings.name}
              required
              hint="Official display name across learner and admin portals."
              onChange={(v) => update("name", v)}
            />
            <TextField
              id="org-abbr"
              label="Abbreviation"
              value={settings.abbreviation}
              required
              hint="Short code (e.g. ATC) used for badges and invoices."
              onChange={(v) => update("abbreviation", v)}
            />
            <TextField
              id="org-owner"
              label="Owner / Primary Contact"
              value={settings.ownerName}
              hint="Authorized account owner."
              onChange={(v) => update("ownerName", v)}
            />
            <TextField
              id="org-franchise"
              label="Franchise ID"
              value={settings.franchiseId}
              hint="External franchise or corporate identifier."
              onChange={(v) => update("franchiseId", v)}
            />
            <div className="sm:col-span-2">
              <TextAreaField
                id="org-desc"
                label="Center Description"
                value={settings.description}
                rows={2}
                placeholder="Brief summary of your learning center..."
                onChange={(v) => update("description", v)}
              />
            </div>
            <SelectField
              id="org-culture"
              label="Culture & Language Format"
              value={settings.culture}
              options={cultureOptions}
              onChange={(v) => update("culture", v)}
            />
            <SelectField
              id="org-tz"
              label="Default Time Zone"
              value={settings.timeZone}
              options={timeZoneOptions}
              onChange={(v) => update("timeZone", v)}
            />
          </div>
        </SectionCard>

        {/* Section 2: Contact & Address */}
        <SectionCard
          id="contact"
          title="Contact & Location"
          description="Shown on student receipts, emails, and course confirmation notifications."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              id="org-email"
              label="Support Email"
              type="email"
              value={settings.email}
              required
              hint="Learners receive emails from this address."
              onChange={(v) => update("email", v)}
            />
            <TextField
              id="org-phone"
              label="Phone Number"
              value={settings.phone}
              onChange={(v) => update("phone", v)}
            />
            <div className="sm:col-span-2">
              <TextField
                id="org-addr1"
                label="Street Address Line 1"
                value={settings.addressLine1}
                onChange={(v) => update("addressLine1", v)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                id="org-addr2"
                label="Suite / Unit / Line 2"
                value={settings.addressLine2}
                onChange={(v) => update("addressLine2", v)}
              />
            </div>
            <TextField
              id="org-city"
              label="City"
              value={settings.city}
              onChange={(v) => update("city", v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                id="org-state"
                label="State / Province"
                value={settings.state}
                onChange={(v) => update("state", v)}
              />
              <TextField
                id="org-zip"
                label="Postal / ZIP Code"
                value={settings.zipCode}
                onChange={(v) => update("zipCode", v)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                id="org-country"
                label="Country"
                value={settings.country}
                onChange={(v) => update("country", v)}
              />
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Access & Registration */}
        <SectionCard
          id="access"
          title="Access & User Signup Policy"
          description="Control how learners access and register for your Center."
        >
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            <SwitchField
              id="sw-assignable"
              label="Assignable to Users"
              description="Allow administrators and managers to assign learners to this Center."
              checked={settings.assignableToUsers}
              onChange={(val) => update("assignableToUsers", val)}
            />
            <SwitchField
              id="sw-anon-reg"
              label="Enable Anonymous User Self-Registration"
              description="Allows new learners to create accounts without requiring an administrator invitation."
              checked={settings.enableAnonymousRegistration}
              onChange={(val) => update("enableAnonymousRegistration", val)}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <TextField
              id="org-terms"
              label="Terms and Conditions URL"
              type="url"
              value={settings.termsUrl}
              hint="Learners must accept these terms during account creation or enrollment."
              onChange={(v) => update("termsUrl", v)}
            />
          </div>
        </SectionCard>

        {/* Section 4: Catalog & Classes Defaults */}
        <SectionCard
          id="catalog"
          title="Course Catalog & Class Defaults"
          description="Default parameters automatically applied when creating new courses or scheduled classes."
        >
          <div className="flex flex-col divide-y divide-[var(--color-border)] mb-5">
            <SwitchField
              id="sw-catalog"
              label="Enable Course Catalog"
              description="Make courses publicly discoverable through the public catalog."
              checked={settings.enableCourseCatalog}
              onChange={(val) => update("enableCourseCatalog", val)}
            />
            <SwitchField
              id="sw-price"
              label="Show Prices on Catalog"
              description="Display standard tuition and seat pricing on catalog course cards."
              checked={settings.showPriceOnCatalog}
              onChange={(val) => update("showPriceOnCatalog", val)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[var(--color-border)]">
            <NumberField
              id="min-cap"
              label="Default Class Minimum Capacity"
              value={settings.defaultClassMinCapacity}
              min={1}
              max={100}
              hint="Minimum attendees required to run a class."
              onChange={(v) => update("defaultClassMinCapacity", v)}
            />
            <NumberField
              id="max-cap"
              label="Default Class Maximum Capacity"
              value={settings.defaultClassMaxCapacity}
              min={1}
              max={500}
              hint="Maximum attendee threshold per class."
              onChange={(v) => update("defaultClassMaxCapacity", v)}
            />
            <NumberField
              id="late-cancel"
              label="Late Cancel Window (Days)"
              value={settings.lateCancelWindowDays}
              min={0}
              max={60}
              hint="Days before class start when cancellations trigger a penalty notice."
              onChange={(v) => update("lateCancelWindowDays", v)}
            />
            <SelectField
              id="rec-mode"
              label="Default Class Recording Mode"
              value={settings.defaultClassRecordingMode}
              options={recordingModeOptions}
              onChange={(v) =>
                update(
                  "defaultClassRecordingMode",
                  v as OrganizationSettings["defaultClassRecordingMode"]
                )
              }
            />
            <SelectField
              id="class-status"
              label="Default New Class Status"
              value={settings.defaultClassStatus}
              options={classStatusOptions}
              onChange={(v) => update("defaultClassStatus", v)}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                id="hrs-start"
                label="Day Start Time"
                value={settings.businessHoursStart}
                hint="e.g. 08:00"
                onChange={(v) => update("businessHoursStart", v)}
              />
              <TextField
                id="hrs-end"
                label="Day End Time"
                value={settings.businessHoursEnd}
                hint="e.g. 17:00"
                onChange={(v) => update("businessHoursEnd", v)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextAreaField
                id="cancel-warn"
                label="Late Cancellation Warning Message"
                value={settings.lateCancelWarning}
                rows={2}
                hint="Message shown to learners when attempting to cancel within the window."
                onChange={(v) => update("lateCancelWarning", v)}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
