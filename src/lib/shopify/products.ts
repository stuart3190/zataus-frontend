import { shopifyFetch } from "@/lib/shopify/client";

type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

type ProductImageNode = {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type ProductVariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
};

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  onlineStoreUrl: string | null;
  images: {
    edges: Array<{
      node: ProductImageNode;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariantNode;
    }>;
  };
};

type ProductByHandleResponse = {
  productByHandle: ProductNode | null;
};

type FirstProductHandleResponse = {
  products: {
    edges: Array<{
      node: {
        handle: string;
      };
    }>;
  };
};

export type ShopifyMoney = MoneyV2;

export type ShopifyProductImage = ProductImageNode;

export type ShopifyProductVariant = ProductVariantNode;

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  onlineStoreUrl: string | null;
  images: ShopifyProductImage[];
  variants: ShopifyProductVariant[];
};

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      description
      onlineStoreUrl
      images(first: 8) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 25) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const FIRST_PRODUCT_HANDLE_QUERY = `
  query FirstProductHandle {
    products(first: 1) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;

function mapProduct(node: ProductNode): ShopifyProduct {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    onlineStoreUrl: node.onlineStoreUrl,
    images: node.images.edges.map(({ node: image }) => image),
    variants: node.variants.edges.map(({ node: variant }) => variant),
  };
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<
    ProductByHandleResponse,
    {
      handle: string;
    }
  >({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: {
      handle,
    },
  });

  return data.productByHandle ? mapProduct(data.productByHandle) : null;
}

export async function getFirstProductHandle(): Promise<string | null> {
  const data = await shopifyFetch<FirstProductHandleResponse>({
    query: FIRST_PRODUCT_HANDLE_QUERY,
  });

  return data.products.edges[0]?.node.handle ?? null;
}
