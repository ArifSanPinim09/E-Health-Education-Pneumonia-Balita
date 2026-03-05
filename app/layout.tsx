import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Lora } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Health Education Pneumonia Balita",
  description: "Platform edukasi kesehatan tentang pneumonia pada balita untuk ibu Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${lora.variable} antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
