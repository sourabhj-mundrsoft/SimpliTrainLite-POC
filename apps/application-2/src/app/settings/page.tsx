"use client";

import { SettingsPanel, type AllSettings } from "@lms/settings";
import { useThemeSync } from "@lms/shared-ui";

export default function SettingsPage() {
  const { updateTheme } = useThemeSync();

  async function handleSave(settings: AllSettings) {
    if (settings.branding) {
      await updateTheme({
        primaryAccent: settings.branding.primaryAccent,
        themeMode: settings.branding.themeMode,
        siteTitle: settings.branding.siteTitle,
        logoUrl: settings.branding.logoUrl,
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SettingsPanel onSave={handleSave} />
    </div>
  );
}
