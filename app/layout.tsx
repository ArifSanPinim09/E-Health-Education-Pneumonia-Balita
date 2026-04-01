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
  title: "ENIS-Pneumonia Care",
  description: "Early Notification & Intervention System for Pneumonia Care - Platform edukasi kesehatan tentang pneumonia pada balita untuk ibu Indonesia",
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/logo.ico" type="image/x-icon" />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${lora.variable} antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
