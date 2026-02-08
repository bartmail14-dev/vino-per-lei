import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AgeGate } from "@/components/ui";
import { CartSlideOut } from "@/components/cart";
import { LoginModal } from "@/components/auth";
import { SmoothScrollProvider } from "@/components/providers";

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

const SITE_URL = "https://www.vinoperlei.nl";
const SITE_NAME = "Vino per Lei";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1f3d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vino per Lei | Authentieke Italiaanse Wijnen Kopen Online",
    template: "%s | Vino per Lei",
  },
  description:
    "Ontdek onze zorgvuldig geselecteerde collectie authentieke Italiaanse wijnen. Van Barolo tot Primitivo, van Prosecco tot Pinot Grigio — La Dolce Vita in elk glas. Gratis verzending vanaf \u20ac35.",
  keywords: [
    "Italiaanse wijn",
    "Italiaanse wijnen kopen",
    "wijn online bestellen",
    "Barolo",
    "Primitivo",
    "Chianti",
    "Prosecco",
    "Amarone",
    "Valpolicella",
    "Pinot Grigio",
    "wijn cadeau",
    "wijnwinkel online",
    "rode wijn Italie",
    "witte wijn Italie",
    "Piemonte wijn",
    "Toscane wijn",
    "Veneto wijn",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Vino per Lei | Authentieke Italiaanse Wijnen",
    description:
      "La Dolce Vita in elk glas. Ontdek authentieke Italiaanse wijnen, zorgvuldig geselecteerd van familiewijngaarden. Gratis verzending vanaf \u20ac35.",
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vino per Lei - Authentieke Italiaanse Wijnen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vino per Lei | Authentieke Italiaanse Wijnen",
    description:
      "La Dolce Vita in elk glas. Ontdek authentieke Italiaanse wijnen, zorgvuldig geselecteerd van familiewijngaarden.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SmoothScrollProvider>
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="skip-link"
          >
            Ga naar hoofdinhoud
          </a>
          <AgeGate />
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <CartSlideOut />
          <LoginModal />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
