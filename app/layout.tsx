import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustBuilds.gg - Curated Gaming PC Builds with Trust Scores",
  description:
    "Zero-research gaming PC builds with reliability data. See brand failure rates, warranty quality, and buy with confidence.",
  keywords: [
    "gaming PC",
    "PC builds",
    "reliability",
    "trust score",
    "gaming computer",
  ],
  openGraph: {
    title: "TrustBuilds.gg",
    description: "Curated Gaming PC Builds with Trust Scores",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
