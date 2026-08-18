import type { Metadata } from "next";
import { Inter, Oswald, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/public/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SDWA | Salem District Weightlifting Association",
    template: "%s | SDWA",
  },
  description:
    "Official website of Salem District Weightlifting Association (SDWA) — Affiliated to Tamil Nadu State Weightlifting Association. Reg. No: 112 / 2020.",
  keywords: [
    "Salem District Weightlifting Association",
    "SDWA",
    "Weightlifting Tamil Nadu",
    "Salem Weightlifting Championship",
    "Tamil Nadu State Weightlifting Association",
    "Weightlifting India",
    "Salem Sports Academy",
  ],
  authors: [{ name: "SDWA" }],
  icons: {
    icon: "/images/sdwa-logo.png",
    shortcut: "/images/sdwa-logo.png",
    apple: "/images/sdwa-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Salem District Weightlifting Association",
    title: "Salem District Weightlifting Association (SDWA)",
    description:
      "Official governing body for weightlifting across Salem District. Affiliated to Tamil Nadu State Weightlifting Association. Reg No: 112 / 2020.",
    images: [
      {
        url: "/images/sdwa-logo.png",
        width: 800,
        height: 800,
        alt: "SDWA Official Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salem District Weightlifting Association (SDWA)",
    description:
      "Affiliated to Tamil Nadu State Weightlifting Association. Promoting athletic excellence, championships, and athlete welfare.",
    images: ["/images/sdwa-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${cinzel.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A] selection:bg-[#FDE68A] selection:text-[#78350F]">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
