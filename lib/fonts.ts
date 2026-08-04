import { Manrope, Montserrat } from "next/font/google";

/**
 * All-sans, minimalist system. `--font-serif-family` now carries Montserrat
 * (heading/display/hero) rather than an actual serif — the variable name is
 * unchanged so every existing `font-serif` utility class keeps working; only
 * the typeface behind it changed. `--font-grotesque-family` (Manrope) stays
 * the body/UI/caption workhorse.
 */
export const heading = Montserrat({
  subsets: ["latin"],
  variable: "--font-serif-family",
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const grotesque = Manrope({
  subsets: ["latin"],
  variable: "--font-grotesque-family",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const fontVariables = `${heading.variable} ${grotesque.variable}`;