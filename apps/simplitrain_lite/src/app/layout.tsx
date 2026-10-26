import type { Metadata } from "next";
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
    <html lang="en">
      <body>
        <QueryProvider>
          <SimpliTrainLiteAdminShell>{children}</SimpliTrainLiteAdminShell>
        </QueryProvider>
      </body>
    </html>
  );
}
