import type { Metadata } from "next";
import { getPage } from "@/lib/shopify-cms";
import { RetournerenContent } from "./RetournerenContent";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Retourbeleid | Vino per Lei",
  description:
    "Informatie over retourneren bij Vino per Lei. 14 dagen bedenktijd op ongeopende producten.",
};

export default async function RetournerenPage() {
  const page = await getPage("retourbeleid");

  return <RetournerenContent pageBody={page?.body ?? null} pageTitle={page?.title ?? null} />;
}
