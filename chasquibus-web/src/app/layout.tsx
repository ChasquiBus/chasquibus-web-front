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
  title: "ChasquiBus",
  description: "Tu plataforma de viajes en bus por Ecuador",
  icons: {
    icon: "/chasquibus_circular.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
      style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </body>
    </html>
  );
}
