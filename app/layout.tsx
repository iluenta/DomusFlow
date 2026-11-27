import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { PwaRegister } from "@/components/pwa/register-sw";
import { ThemeInit } from "@/components/theme-init";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/env";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Hospyia",
    template: "%s · Hospyia",
  },
  description:
    "Panel de gestión de Hospyia para anfitriones y sus propiedades.",
  applicationName: "Hospyia",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Hospyia",
    // Updated on the client for dark mode; light mode must stay legible.
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1013" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} h-full`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <ThemeProvider>
          <ThemeInit />
          <a href="#contenido" className="skip-link">
            Saltar al contenido
          </a>
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
