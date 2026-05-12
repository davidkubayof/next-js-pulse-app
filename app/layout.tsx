import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pulse Dashboard',
    default: 'Pulse Dashboard',
  },
  description: "Pulse - Scalable Task Management System with Audit Logs.",
};

// @/app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* הסרת flex-col ו-min-h-full כדי למנוע גלילה כפולה מהשורש */}
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}