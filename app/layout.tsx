import type { Metadata } from "next";
import "./globals.css";
import "./triggers.css";

export const metadata: Metadata = {
  title: "Triggers Nation — Built for Performance.",
  description: "Tactical gear, military equipment and outdoor essentials for serious customers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
