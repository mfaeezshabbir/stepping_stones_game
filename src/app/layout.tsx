import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Github } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stepping Stones - by mfaeezshabbir",
  description:
    "Stepping Stones - a lightweight board game built with Next.js and Tailwind CSS.",
  keywords: [
    "Stepping Stones",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "React",
  ],
  icons: {
    icon: "/logo.png",
  },
  authors: [{ name: "mfaeezshabbir", url: "https://github.com/mfaeezshabbir" }],
  openGraph: {
    title: "Stepping Stones",
    description: "A lightweight board game built with Next.js and Tailwind CSS",
    url: "https://example.com",
    siteName: "Stepping Stones",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepping Stones",
    description: "A lightweight board game built with Next.js and Tailwind CSS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        {/* GitHub ribbon / badge (top-right) */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="https://github.com/mfaeezshabbir"
            target="_blank"
            rel="noreferrer"
            aria-label="View Stepping Stones on GitHub (mfaeezshabbir)"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg hover:scale-105 transition-transform ring-1 ring-slate-200"
          >
            <Github className="w-5 h-5 text-gray-800" />
          </a>
        </div>

        <main className="flex-1">{children}</main>

        <footer className="w-full border-t bg-background/80 text-sm text-center py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            <img src="/logo.png" alt="Stepping Stones" className="h-8 w-auto" />
            <div>
              <div className="font-medium">Stepping Stones</div>
              <a
                href="https://github.com/mfaeezshabbir"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground"
              >
                @mfaeezshabbir
              </a>
            </div>
          </div>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}
