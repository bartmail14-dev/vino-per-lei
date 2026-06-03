import { notFound } from "next/navigation";

export const revalidate = 3600; // 1 hour — static content

export default function ShowcasePage() {
  notFound();
}
