import { notFound } from "next/navigation";
import { ProductStorefront } from "@/components/product-storefront";
import { getShopifyConfig } from "@/lib/shopify/client";
import { getProductByHandle } from "@/lib/shopify/products";

export const revalidate = 300;

type ProductPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const config = getShopifyConfig();

  if (!config) {
    notFound();
  }

  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductStorefront product={product} storeDomain={config.storeDomain} />;
}
