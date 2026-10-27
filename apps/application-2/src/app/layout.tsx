import { AppShell, ThemeSyncProvider } from "@lms/shared-ui";
import type { Metadata } from "next";
import { QueryProvider } from "@/components/query-provider";
import { navigation } from "@/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimpliTrain · Application 2",
  description: "Application 2 of the SimpliTrain platform proof of concept.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeSyncProvider>
            <AppShell
              cartCount={3}
              hasUnreadNotifications
              navigation={navigation}
              user={{ name: "Demo User", initials: "DU" }}
            >
              {children}
            </AppShell>
          </ThemeSyncProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
