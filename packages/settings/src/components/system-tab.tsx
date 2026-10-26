"use client";

import type { SystemSettings } from "../types";
import {
  NumberField,
  SectionCard,
  SelectField,
  SwitchField,
  TextAreaField,
} from "./ui-fields";

export type SystemTabProps = {
  settings: SystemSettings;
  onChange: (updated: SystemSettings) => void;
};

const statusOptions = [
  { label: "Active (Operational)", value: "active" },
  { label: "Maintenance Mode (Admins only)", value: "maintenance" },
  { label: "Read-Only (No submissions/enrollments)", value: "read-only" },
];

const workWeekOptions = [
  { label: "Monday", value: "Monday" },
  { label: "Sunday", value: "Sunday" },
];

export function SystemTab({ settings, onChange }: SystemTabProps) {
  function update<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Platform Status & Maintenance"
        description="Global system state controlling learner availability and announcements."
      >
        <div className="flex flex-col gap-4">
          <SelectField
            id="sys-status"
            label="System Availability State"
            value={settings.siteStatus}
            options={statusOptions}
            onChange={(v) => update("siteStatus", v as SystemSettings["siteStatus"])}
          />

          <TextAreaField
            id="sys-maint-msg"
            label="Maintenance Banner Message"
            value={settings.maintenanceMessage}
            rows={2}
            hint="Displayed to visitors when maintenance mode is active."
            onChange={(v) => update("maintenanceMessage", v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Security & Password Policy"
        description="Account lockout criteria and password strength requirements for all portals."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            id="pwd-min"
            label="Minimum Password Length"
            value={settings.passwordMinLength}
            min={6}
            max={32}
            onChange={(v) => update("passwordMinLength", v)}
          />

          <NumberField
            id="pwd-max-fail"
            label="Max Failed Attempts Before Lockout"
            value={settings.maxFailedLogins}
            min={3}
            max={10}
            hint="Account is temporarily locked after reaching this limit."
            onChange={(v) => update("maxFailedLogins", v)}
          />

          <div className="sm:col-span-2 flex flex-col divide-y divide-[var(--color-border)] pt-2 border-t border-[var(--color-border)]">
            <SwitchField
              id="sw-special"
              label="Require Special Character (!@#$%^&*)"
              checked={settings.requireSpecialCharacter}
              onChange={(v) => update("requireSpecialCharacter", v)}
            />
            <SwitchField
              id="sw-number"
              label="Require at least one numeric digit (0-9)"
              checked={settings.requireNumber}
              onChange={(v) => update("requireNumber", v)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Regional & System Defaults"
        description="Global operational settings for surveys, calendars, and credentials."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            id="sys-week-start"
            label="First Day of Work Week"
            value={settings.defaultWorkWeekStart}
            options={workWeekOptions}
            onChange={(v) =>
              update("defaultWorkWeekStart", v as SystemSettings["defaultWorkWeekStart"])
            }
          />
          <div className="sm:col-span-2 flex flex-col divide-y divide-[var(--color-border)] pt-2 border-t border-[var(--color-border)]">
            <SwitchField
              id="sw-simpliassess"
              label="Enable Simpliassess Surveys"
              description="Integrates automated survey schedules upon course and class completion."
              checked={settings.enableSimplassessSurveys}
              onChange={(v) => update("enableSimplassessSurveys", v)}
            />
            <SwitchField
              id="sw-credly"
              label="Enable Credly Digital Badging"
              description="Issue verifiable digital badges automatically on certificate issuance."
              checked={settings.enableCredlyBadging}
              onChange={(v) => update("enableCredlyBadging", v)}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
