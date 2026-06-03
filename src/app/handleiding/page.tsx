import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopifyPageContent } from "@/components/cms/ShopifyPageContent";
import { getPage } from "@/lib/shopify-cms";

export const revalidate = 3600; // 1 hour — static CMS content

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("handleiding");
  return {
    ...(page?.title ? { title: page.title } : {}),
    robots: { index: false, follow: false },
  };
}

export default async function HandleidingPage() {
  const page = await getPage("handleiding");
  if (!page?.body) notFound();
  return <ShopifyPageContent title={page.title} body={page.body} updatedAt={page.updatedAt} />;
}
