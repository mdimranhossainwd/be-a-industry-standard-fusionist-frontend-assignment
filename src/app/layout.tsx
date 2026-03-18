import type { Metadata } from "next";
import { Syne, DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
  variable: "--font-syne",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300","400","500"],
  variable: "--font-dm-sans",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal","italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoSpark Hub — Ignite Change",
  description: "A community portal where sustainability meets innovation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(syne.variable, dmSans.variable, instrumentSerif.variable)}>
      <body className={cn("min-h-screen bg-background font-dm antialiased overflow-x-hidden")}>
        {children}
      </body>
    </html>
  );
}