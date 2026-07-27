import type { Metadata } from "next";
import "./globals.css";
import { Albert_Sans } from "next/font/google";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  // weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://klippio.sajed-engineering.com"),
  title: {
    default: "Klippio par SAJED Engineering | Suivi de chantier sur plan",
    template: "%s | Klippio",
  },
  description: "Klippio est l'application de suivi de chantier de SAJED Engineering : centralisez les observations, photos et actions directement sur vos plans.",
  keywords: ["Klippio", "SAJED Engineering", "suivi de chantier", "gestion de réserves", "plan de chantier", "observations chantier"],
  icons: {
    icon: "/logos/logo_icon_green.svg",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://klippio.sajed-engineering.com",
    siteName: "Klippio",
    title: "Klippio par SAJED Engineering | Suivi de chantier sur plan",
    description: "Centralisez les observations, photos et actions directement sur les plans de vos chantiers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klippio | Suivi de chantier sur plan",
    description: "La solution SAJED Engineering pour localiser et suivre les observations de chantier.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`antialiased ${albertSans.className}`}>{children}</body>
    </html>
  );
}
