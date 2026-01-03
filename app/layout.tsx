import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vertex - DSA Tracker",
  description: "Track your LeetCode, Codeforces, and DSA progress with Vertex. The ultimate developer activity tracker.",
  keywords: ["DSA", "LeetCode", "Tracker", "Programming", "Coding", "Developer Tools"],
  authors: [{ name: "Vertex Team" }],
  openGraph: {
    title: "Vertex - DSA Tracker",
    description: "Track your LeetCode and DSA progress efficiently.",
    type: "website",
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
