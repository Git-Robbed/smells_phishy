import "~/styles/globals.css";

import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Smells Phishy | Privacy-First Phishing Detection",
  description: "Instant, accurate phishing detection powered by AI. Combining real-time threat intelligence with LLM-based behavioral analysis. Zero data stored. Maximum protection.",
  keywords: ["phishing detection", "email security", "cyber security", "AI security", "privacy"],
  authors: [{ name: "Rob Porter" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Smells Phishy | Privacy-First Phishing Detection",
    description: "Instant, accurate phishing detection powered by AI. Zero data stored.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
