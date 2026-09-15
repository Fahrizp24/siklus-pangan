import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiklusPangan — Zero Organic Waste Platform",
  description: "Platform Rantai Pasok Sirkular Pangan & Biokonversi Limbah Organik (TCC 2026 UTM)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
