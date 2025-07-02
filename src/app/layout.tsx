import { PostHogProvider } from "@/components/posthogprovider";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Muhammad Dafa Ardiansyah - Portfolio",
  description: "Portfolio of Muhammad Dafa Ardiansyah, a passionate full-stack developer specializing in modern web technologies, React, Next.js, and innovative digital solutions.",
  keywords: "Muhammad Dafa Ardiansyah, Full Stack Developer, React, Next.js, Web Development, Portfolio",
  authors: [{ name: "Muhammad Dafa Ardiansyah" }],
  openGraph: {
    title: "Muhammad Dafa Ardiansyah - Full Stack Developer & DevOps Engineer",
    description: "Portfolio of Muhammad Dafa Ardiansyah, a passionate full-stack developer specializing in modern web technologies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <PostHogProvider>
          <ThemeProvider>
            {/* <AnimatedBackground /> */}
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}