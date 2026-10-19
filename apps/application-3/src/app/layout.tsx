import { AppShell } from "@lms/shared-ui";
import type { Metadata } from "next";
import { navigation } from "@/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimpliTrain · Application 3",
  description: "Application 3 of the SimpliTrain platform proof of concept.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell
          cartCount={3}
          hasUnreadNotifications
          navigation={navigation}
          user={{ name: "Demo User", initials: "DU" }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
