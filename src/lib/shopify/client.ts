export type ShopifyConfig = {
  storeDomain: string;
  storefrontApiToken: string;
  apiVersion: string;
};

type ShopifyFetchOptions<TVariables> = {
  query: string;
  variables?: TVariables;
  cache?: RequestCache;
  revalidate?: number;
};

type ShopifyGraphQLResponse<TData> = {
  data?: TData;
  errors?: Array<{
    message: string;
  }>;
};

function normalizeStoreDomain(value: string): string {
  return value.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function getShopifyConfig(): ShopifyConfig | null {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontApiToken = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION;

  if (!storeDomain || !storefrontApiToken || !apiVersion) {
    return null;
  }

  return {
    storeDomain: normalizeStoreDomain(storeDomain),
    storefrontApiToken,
    apiVersion,
  };
}

export function getShopifyEndpoint(config: ShopifyConfig): string {
  return `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
}

export async function shopifyFetch<TData, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = "force-cache",
  revalidate = 300,
}: ShopifyFetchOptions<TVariables>): Promise<TData> {
  const config = getShopifyConfig();

  if (!config) {
    throw new Error(
      "Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_TOKEN, and SHOPIFY_API_VERSION.",
    );
  }

  const response = await fetch(getShopifyEndpoint(config), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.storefrontApiToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront API request failed with ${response.status} ${response.statusText}.`,
    );
  }

  const payload =
    (await response.json()) as ShopifyGraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(" "));
  }

  if (!payload.data) {
    throw new Error("Shopify Storefront API response did not include data.");
  }

  return payload.data;
}
