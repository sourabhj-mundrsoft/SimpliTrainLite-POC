"use client";

import { useMemo, useState } from "react";
import { BrandingTab } from "./components/branding-tab";
import { IntegrationsTab } from "./components/integrations-tab";
import { OrganizationTab } from "./components/organization-tab";
import { RolesTab } from "./components/roles-tab";
import { SystemTab } from "./components/system-tab";
import {
  type AllSettings,
  defaultSettings,
  type SettingsTabId,
} from "./types";

export type SettingsPanelProps = {
  initialSettings?: AllSettings;
  initialTab?: SettingsTabId;
  onSave?: (settings: AllSettings) => Promise<void> | void;
};

const tabs: readonly { id: SettingsTabId; label: string; icon: string }[] = [
  { id: "organization", label: "Center / Organization", icon: "🏢" },
  { id: "branding", label: "Branding", icon: "🎨" },
  { id: "system", label: "System", icon: "⚙️" },
  { id: "roles", label: "Roles & Permissions", icon: "👥" },
  { id: "integrations", label: "Integrations", icon: "🔌" },
];

export function SettingsPanel({
  initialSettings = defaultSettings,
  initialTab = "organization",
  onSave,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
  const [currentSettings, setCurrentSettings] = useState<AllSettings>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<AllSettings>(initialSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Check if modified
  const isDirty = useMemo(() => {
    return JSON.stringify(currentSettings) !== JSON.stringify(savedSettings);
  }, [currentSettings, savedSettings]);

  async function handleSave() {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(currentSettings);
      }
      setSavedSettings(currentSettings);
      setToastMessage("Settings saved successfully.");
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setCurrentSettings(savedSettings);
    setToastMessage("Changes reverted.");
    setTimeout(() => setToastMessage(null), 3000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <nav aria-label="Breadcrumb" className="mb-1 text-xs text-[var(--color-text-muted)]">
            <span>Admin</span>
            <span className="mx-1.5">/</span>
            <span className="font-semibold text-[var(--color-text)]">Settings</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Settings
            </h1>
            {isDirty ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                Unsaved changes
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Configure your training organization, branding, catalog defaults, and access policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isDirty ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition"
            >
              Discard Changes
            </button>
          ) : null}
          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-on-primary)] shadow-xs transition hover:opacity-90 disabled:opacity-50"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage ? (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            &times;
          </button>
        </div>
      ) : null}

      {/* Top Tabs Navigation */}
      <div className="border-b border-[var(--color-border)]">
        <nav className="-mb-px flex space-x-2 overflow-x-auto" aria-label="Settings tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab View */}
      <div className="mt-2">
        {activeTab === "organization" ? (
          <OrganizationTab
            settings={currentSettings.organization}
            onChange={(org) => setCurrentSettings({ ...currentSettings, organization: org })}
          />
        ) : null}

        {activeTab === "branding" ? (
          <BrandingTab
            settings={currentSettings.branding}
            onChange={(br) => setCurrentSettings({ ...currentSettings, branding: br })}
          />
        ) : null}

        {activeTab === "system" ? (
          <SystemTab
            settings={currentSettings.system}
            onChange={(sys) => setCurrentSettings({ ...currentSettings, system: sys })}
          />
        ) : null}

        {activeTab === "roles" ? (
          <RolesTab roles={currentSettings.roles} />
        ) : null}

        {activeTab === "integrations" ? (
          <IntegrationsTab integrations={currentSettings.integrations} />
        ) : null}
      </div>
    </div>
  );
}
