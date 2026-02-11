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

export const metadata: Metadata = {
  title: "Vino per Lei | Authentieke Italiaanse Wijnen",
  description:
    "Ontdek onze zorgvuldig geselecteerde collectie authentieke Italiaanse wijnen. Van Barolo tot Primitivo — La Dolce Vita in elk glas.",
  keywords: ["Italiaanse wijn", "Barolo", "Primitivo", "Chianti", "Prosecco", "wijn cadeau", "wijnwinkel"],
  authors: [{ name: "Vino per Lei" }],
  openGraph: {
    title: "Vino per Lei | Authentieke Italiaanse Wijnen",
    description: "La Dolce Vita in elk glas. Authentieke Italiaanse wijnen, zorgvuldig geselecteerd.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
    url: "https://vinoperlei.nl",
  },
  robots: {
    index: true,
    follow: true,
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
        <SmoothScrollProvider>
          <AgeGate />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSlideOut />
          <LoginModal />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
