type ShopifyConfig = {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
};

export function getShopifyConfig(): ShopifyConfig | null {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION;

  if (!storeDomain || !storefrontAccessToken || !apiVersion) {
    return null;
  }

  return {
    storeDomain,
    storefrontAccessToken,
    apiVersion,
  };
}

export function getShopifyEndpoint(config: ShopifyConfig): string {
  return `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
}
