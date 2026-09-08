import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "KEHENFacture",
  description: "Logiciel de facturation pour entrepreneurs africains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-gray-50">{children}</body>
    </html>
  );
}
