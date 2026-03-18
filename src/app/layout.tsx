import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { HeaderWrapper, FooterWrapper } from "@/components/layout";
import { AgeGate } from "@/components/ui";
import { CartSlideOut } from "@/components/cart";
import { LoginModal } from "@/components/auth";
import { SmoothScrollProvider } from "@/components/providers";
import { CookieConsent } from "@/components/ui/CookieConsent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vinoperlei.nl"),
  title: "Vino per Lei | Italiaanse wijn rechtstreeks van de producent",
  description:
    "19 Italiaanse wijnen uit Piemonte, Veneto en Toscane. Rechtstreeks van familiewijngaarden, persoonlijk geselecteerd door Carla Daniels.",
  keywords: ["Italiaanse wijn", "Barolo", "Amarone", "Chianti", "Prosecco", "wijn cadeau", "wijnimport"],
  authors: [{ name: "Vino per Lei" }],
  openGraph: {
    title: "Vino per Lei | Italiaanse wijn rechtstreeks van de producent",
    description: "19 wijnen uit Piemonte, Veneto en Toscane. Persoonlijk geselecteerd, rechtstreeks geimporteerd.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
    url: "https://vinoperlei.nl",
    images: [
      {
        url: "/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "Vino per Lei — Italiaanse wijnen rechtstreeks van de producent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vino per Lei | Italiaanse wijn rechtstreeks van de producent",
    description:
      "19 Italiaanse wijnen uit Piemonte, Veneto en Toscane. Rechtstreeks van familiewijngaarden, persoonlijk geselecteerd door Carla Daniels.",
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1f3d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:bg-white focus:text-[#1a1f3d] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-medium"
        >
          Ga naar inhoud
        </a>
        <SmoothScrollProvider>
          <AgeGate />
          <HeaderWrapper />
          <main id="main-content" className="flex-1">{children}</main>
          <FooterWrapper />
          <CookieConsent />
          <CartSlideOut />
          <LoginModal />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
