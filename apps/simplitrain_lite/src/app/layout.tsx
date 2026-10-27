import type { Metadata } from "next";
import { ThemeSyncProvider } from "@lms/shared-ui";
import { SimpliTrainLiteAdminShell } from "@/components/admin-shell";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimpliTrain Lite · Admin Portal",
  description: "SimpliTrain Lite Admin Portal with dynamic course, settings, and learner tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var raw = localStorage.getItem('simplitrain.shared_theme') || localStorage.getItem('lite.v2.branding');
    var rawMode = localStorage.getItem('lite-theme');
    if (raw) {
      var d = JSON.parse(raw);
      var mode = rawMode || d.mode || d.themeMode || 'light';
      document.documentElement.setAttribute('data-theme', mode);
      document.documentElement.style.colorScheme = mode;
      if (d.css) {
        var s = document.createElement('style');
        s.id = 'lite-brand';
        s.textContent = d.css;
        document.head.appendChild(s);
      }
    } else if (rawMode) {
      document.documentElement.setAttribute('data-theme', rawMode);
      document.documentElement.style.colorScheme = rawMode;
    }
  } catch(e) {}
})();
`,
          }}
        />
      </head>
      <body>
        <QueryProvider>
          <ThemeSyncProvider>
            <SimpliTrainLiteAdminShell>{children}</SimpliTrainLiteAdminShell>
          </ThemeSyncProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
