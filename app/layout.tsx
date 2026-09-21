import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Lalibela | Mining Intelligence",
  description: "Interactive prototype for satellite monitoring, suspected mining violations and field investigations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
