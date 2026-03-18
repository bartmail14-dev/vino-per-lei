import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestelling geslaagd | Vino per Lei",
  description: "Je bestelling bij Vino per Lei is succesvol geplaatst. Je ontvangt een bevestigingsmail.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
