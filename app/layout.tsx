import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARTCART — Shop Smart. Live Better.",
  description: "A modern marketplace for electronics, fashion, home, beauty, watches and travel products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
