import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopifyPageContent } from "@/components/cms/ShopifyPageContent";
import { getPage } from "@/lib/shopify-cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("retourbeleid");
  return page?.title ? { title: page.title } : {};
}

export default async function RetournerenPage() {
  const page = await getPage("retourbeleid");
  if (!page?.body) notFound();
  return <ShopifyPageContent title={page.title} body={page.body} updatedAt={page.updatedAt} />;
}
