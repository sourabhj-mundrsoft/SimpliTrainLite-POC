"use client";

import type { BrandingSettings } from "../types";
import { SectionCard, TextField } from "./ui-fields";

export type BrandingTabProps = {
  settings: BrandingSettings;
  onChange: (updated: BrandingSettings) => void;
};

const presetColors = [
  { name: "Indigo (Lite)", hex: "#4F46E5" },
  { name: "Ocean Blue", hex: "#1D4ED8" },
  { name: "Forest Green", hex: "#15803D" },
  { name: "Purple Twilight", hex: "#7E22CE" },
  { name: "Crimson", hex: "#BE123C" },
  { name: "Slate", hex: "#334155" },
];

export function BrandingTab({ settings, onChange }: BrandingTabProps) {
  function update<K extends keyof BrandingSettings>(key: K, value: BrandingSettings[K]) {
    onChange({
      ...settings,
      [key]: value,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Theme & Brand Appearance"
        description="Configure your learning portal title, accent color, and login screen customization."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            id="brand-title"
            label="Site Title"
            value={settings.siteTitle}
            required
            hint="Displayed in the header and browser title bar."
            onChange={(v) => update("siteTitle", v)}
          />

          <TextField
            id="brand-logo"
            label="Logo URL / Path"
            value={settings.logoUrl}
            placeholder="e.g. https://domain.com/logo.svg"
            hint="Leave blank to use default SimpliTrain cloud logo."
            onChange={(v) => update("logoUrl", v)}
          />

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--color-text)]">
              Primary Brand Accent Color
            </label>
            <p className="mb-2 text-xs text-[var(--color-text-muted)]">
              Used for primary buttons, active tabs, and navigation focus indicators.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {presetColors.map((color) => {
                const isSelected = settings.primaryAccent.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => update("primaryAccent", color.hex)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      isSelected
                        ? "border-[var(--color-text)] ring-2 ring-[var(--color-primary)] ring-offset-1"
                        : "border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primaryAccent}
                  onChange={(e) => update("primaryAccent", e.target.value)}
                  className="size-8 cursor-pointer rounded-md border border-[var(--color-border)] p-0.5"
                  title="Pick custom color"
                />
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {settings.primaryAccent}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <TextField
              id="brand-login"
              label="Login Page Title / Banner Message"
              value={settings.loginPageTitle}
              hint="Heading displayed above the sign-in form."
              onChange={(v) => update("loginPageTitle", v)}
            />
          </div>

          <div className="sm:col-span-2">
            <TextField
              id="brand-reg-link"
              label="External Registration URL (Optional)"
              type="url"
              value={settings.externalRegistrationLink}
              placeholder="https://..."
              hint="When configured, the Register button redirects visitors to this URL."
              onChange={(v) => update("externalRegistrationLink", v)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Live Preview Card */}
      <SectionCard title="Live Brand Preview" description="How your brand accents look across UI elements.">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
          <button
            type="button"
            style={{ backgroundColor: settings.primaryAccent }}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:opacity-90"
          >
            Primary Action
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]"
          >
            Secondary Button
          </button>
          <span
            style={{ color: settings.primaryAccent }}
            className="text-sm font-semibold underline cursor-pointer"
          >
            Active Link Example
          </span>
          <span
            style={{
              backgroundColor: `${settings.primaryAccent}1a`,
              color: settings.primaryAccent,
            }}
            className="rounded-full px-3 py-1 text-xs font-bold"
          >
            Live Badge
          </span>
        </div>
      </SectionCard>
    </div>
  );
}
