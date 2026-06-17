import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Club Collaboration Platform",
  description:
    "An all-in-one workspace for student clubs to plan projects, assign tasks, monitor progress, and collaborate seamlessly with real-time insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} antialiased min-h-screen selection:bg-sky-500/30 selection:text-sky-200`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
