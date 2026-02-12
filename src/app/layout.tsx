import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorcery Solutions",
  description: "A fun demo application by your friends at Wiz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="aws_client_id" content="AKIA6KJQR5EG6EUOCYVX" />
        <meta name="aws_client_secret" content="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" />
        <meta name="gh_pat" content="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" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}