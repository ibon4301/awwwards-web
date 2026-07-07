import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { Noise } from "@/components/ui/noise";
import { AmbientOcean } from "@/components/ui/ambient-ocean";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteMark } from "@/components/layout/site-mark";
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
  title: "Marea — Un Estudio en Profundidad",
  description: "Una interfaz inmersiva y experimental que explora la luz, la profundidad y la corriente del océano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <Noise />
        <AmbientOcean />
        <CustomCursor />
        <ScrollProgress />
        <SiteMark />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
