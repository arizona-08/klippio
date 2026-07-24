import type { Metadata } from "next";
import "./globals.css";
import { Albert_Sans } from "next/font/google";
import AuthUserProvider from "./Context/AuthContext/AuthUserProvider";
import ModalOverlay from "./components/organisms/ModalOverlay/ModalOverlay";
import ClientTopLoader from "./components/ClientTopLoader";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  // weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.klippio.sajed-engineering.com"),
  title: "Klippio App | Suivi de chantier sur plan",
  description: "Accédez à Klippio, l'application SAJED Engineering pour gérer les observations et photos de chantier directement sur plan.",
  icons: {
    icon: "/logos/logo_icon_green.svg",
    shortcut: "/favicon-16x16.png",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`min-h-screen relative overflow-x-hidden ${albertSans.className} bg-white`}>
        <ClientTopLoader />
        <ModalOverlay />
        <AuthUserProvider>
          {children}
        </AuthUserProvider>
      </body>
    </html>
  );
}
