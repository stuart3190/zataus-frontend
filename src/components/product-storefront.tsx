"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type {
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductVariant,
} from "@/lib/shopify/products";

type ProductStorefrontProps = {
  product: ShopifyProduct;
  storeDomain: string;
};

type DetailItem = {
  title: string;
  description: string;
};

type ParsedDescriptionSection = {
  title: string | null;
  paragraphs: string[];
  bullets: string[];
};

const heroPoints = [
  "Built for spring driving",
  "Compact cabin filter for vans and cars",
  "USB powered for simple everyday use",
];

const benefitItems: DetailItem[] = [
  {
    title: "For the cabin, not the whole room",
    description:
      "Cabin Pollen Catcher is designed for vans, cars, and small personal spaces where the air around you matters most.",
  },
  {
    title: "Helps catch dust and pollen",
    description:
      "A straightforward way to help reduce the particles that can build up during spring driving and daily commuting.",
  },
  {
    title: "Easy to power and place",
    description:
      "USB power keeps setup simple so it fits into real vehicle use rather than feeling like a bulky gadget.",
  },
];

const reassuranceItems: DetailItem[] = [
  {
    title: "Compact footprint",
    description:
      "Sized for tighter interiors where large air devices feel impractical or out of place.",
  },
  {
    title: "Clear purchase flow",
    description:
      "Price, product details, and the main action stay together so the page feels direct and easy to act on.",
  },
  {
    title: "Shopify checkout",
    description:
      "When you click through, checkout continues on Shopify with the selected product already prepared.",
  },
];

const faqItems: DetailItem[] = [
  {
    title: "Is this made for vans only?",
    description:
      "No. It is designed for vans, cars, and other small personal spaces where a compact cabin filter makes sense.",
  },
  {
    title: "How is it powered?",
    description:
      "Cabin Pollen Catcher uses USB power, which makes it easier to use in a vehicle cabin or other compact setup.",
  },
  {
    title: "What does it help catch?",
    description:
      "It is made to help catch dust and pollen in smaller spaces. It is not presented as a medical device or treatment product.",
  },
  {
    title: "What happens after I click Buy Now?",
    description:
      "You continue to Shopify with the selected product ready in the cart flow, where you can review the order and complete checkout.",
  },
];

function formatMoney(money: ShopifyMoney): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

function getVariantCartUrl(storeDomain: string, variantId: string): string {
  const numericVariantId = variantId.split("/").pop();

  if (!numericVariantId) {
    return `https://${storeDomain}`;
  }

  return `https://${storeDomain}/cart/${numericVariantId}:1`;
}

function getInitialVariant(
  variants: ShopifyProductVariant[],
): ShopifyProductVariant | undefined {
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
}

function normalizeVariantTitle(title: string): string | null {
  const normalized = title.trim().toLowerCase();

  if (!normalized || normalized === "default title") {
    return null;
  }

  if (
    normalized === "default" ||
    normalized === "standard" ||
    normalized === "single" ||
    normalized === "1 pack"
  ) {
    return "Cabin Pollen Catcher";
  }

  return title.trim();
}

function getShortDescription(description: string): string {
  const firstLine = description
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .find(Boolean);

  if (!firstLine) {
    return "A compact USB-powered filter made for spring driving, daily commutes, and smaller cabin spaces.";
  }

  return firstLine;
}

function parseDescription(description: string): ParsedDescriptionSection[] {
  const normalized = description.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((block) => block.length > 0);

  return blocks.map((block) => {
    const firstLine = block[0];
    const headingCandidate = firstLine.replace(/:$/, "");
    const hasHeading =
      block.length > 1 &&
      !/^[-*•]/.test(firstLine) &&
      headingCandidate.length <= 60 &&
      headingCandidate.split(" ").length <= 6;
    const contentLines = hasHeading ? block.slice(1) : block;
    const bullets = contentLines
      .filter((line) => /^[-*•]/.test(line))
      .map((line) => line.replace(/^[-*•]\s*/, "").trim());
    const paragraphs = contentLines.filter((line) => !/^[-*•]/.test(line));

    return {
      title: hasHeading ? headingCandidate : null,
      paragraphs,
      bullets,
    };
  });
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-md lg:max-w-sm">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-[2rem] leading-[0.95] text-slate-950 sm:text-[2.4rem]">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export function ProductStorefront({
  product,
  storeDomain,
}: ProductStorefrontProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    getInitialVariant(product.variants)?.id ?? "",
  );

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    getInitialVariant(product.variants);
  const selectedImage = product.images[selectedImageIndex] ?? product.images[0];
  const hasMultipleVariants =
    product.variants.length > 1 ||
    product.variants[0]?.title.toLowerCase() !== "default title";
  const compareAtPrice =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) >
      Number(selectedVariant.price.amount)
      ? selectedVariant.compareAtPrice
      : null;
  const normalizedVariantTitle = selectedVariant
    ? normalizeVariantTitle(selectedVariant.title)
    : null;
  const descriptionSections = parseDescription(product.description);
  const ctaHref = selectedVariant
    ? getVariantCartUrl(storeDomain, selectedVariant.id)
    : `https://${storeDomain}`;
  const ctaLabel = selectedVariant?.availableForSale
    ? "Add To Cart And Checkout"
    : "Sold Out";
  const shortDescription = getShortDescription(product.description);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9fb_0%,#f1f5f4_45%,#eef2f6_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-16">
        <header className="flex items-center justify-between border-b border-slate-200/80 py-4 sm:py-5">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-[0.34em] text-slate-700"
          >
            Zataus
          </Link>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 sm:px-4 sm:text-[11px]">
            Cabin Air
          </div>
        </header>

        <section className="grid gap-6 py-6 sm:gap-8 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-start lg:gap-10 lg:py-12">
          <div className="order-2 space-y-3 sm:space-y-4 lg:order-1 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] sm:rounded-[2rem]">
              <div className="relative aspect-[1/1.08] sm:aspect-[1/1.03] lg:aspect-[1.02/1]">
                {selectedImage ? (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.altText ?? product.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 54vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100 text-sm uppercase tracking-[0.24em] text-slate-500">
                    No product image
                  </div>
                )}
              </div>
            </div>

            {product.images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3 lg:grid lg:grid-cols-4 lg:overflow-visible">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 min-w-[4.8rem] overflow-hidden rounded-[1rem] border bg-white transition sm:h-24 sm:min-w-[5.8rem] lg:h-auto lg:min-w-0 lg:aspect-square ${
                      index === selectedImageIndex
                        ? "border-slate-950 shadow-[0_16px_32px_-18px_rgba(15,23,42,0.35)]"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? `${product.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 76px, 120px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-[1.75rem] border border-slate-200/90 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.22)] sm:rounded-[2rem] sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white">
                  Spring driving
                </span>
                <span className="rounded-full bg-sage-50 border border-emerald-100 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-emerald-800">
                  USB powered
                </span>
              </div>

              <div className="mt-4 sm:mt-5">
                <h1 className="max-w-[14ch] font-[family-name:var(--font-display)] text-[2.6rem] leading-[0.92] text-slate-950 sm:text-[3.4rem] lg:text-[4.4rem]">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-slate-700 sm:text-lg sm:leading-8">
                  Hay fever can feel worse in the van when spring driving traps dust
                  and pollen in a tight cabin. {shortDescription}
                </p>
              </div>

              <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-3">
                {heroPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-3.5 py-3.5 text-sm font-medium text-slate-800"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                <div>
                  {selectedVariant ? (
                    <div className="flex items-end gap-3">
                      <div className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.5rem]">
                        {formatMoney(selectedVariant.price)}
                      </div>
                      {compareAtPrice ? (
                        <div className="pb-1 text-base text-slate-400 line-through sm:text-lg">
                          {formatMoney(compareAtPrice)}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Compact filter for vans, cars, and small personal spaces.
                  </p>
                </div>

                {!hasMultipleVariants && normalizedVariantTitle ? (
                  <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500">
                      Included
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {normalizedVariantTitle}
                    </p>
                  </div>
                ) : null}
              </div>

              {hasMultipleVariants ? (
                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                    Choose option
                  </p>
                  <div className="mt-3 grid gap-3">
                    {product.variants.map((variant) => {
                      const active = variant.id === selectedVariant?.id;
                      const variantLabel =
                        normalizeVariantTitle(variant.title) ?? variant.title;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`flex items-center justify-between rounded-[1.05rem] border px-4 py-4 text-left transition ${
                            active
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          <span className="text-sm font-medium">{variantLabel}</span>
                          <span className="text-sm opacity-80">
                            {variant.availableForSale
                              ? formatMoney(variant.price)
                              : "Sold out"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef4f2_100%)] p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-[30rem]">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                      Ready for spring driving
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Buy now to continue to Shopify with Cabin Pollen Catcher ready
                      in the checkout flow.
                    </p>
                  </div>
                  <a
                    href={ctaHref}
                    className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.18em] transition lg:w-auto lg:min-w-[250px] ${
                      selectedVariant?.availableForSale
                        ? "bg-slate-950 text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.45)] hover:bg-slate-800"
                        : "pointer-events-none bg-slate-300 text-slate-500"
                    }`}
                  >
                    {ctaLabel}
                  </a>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {reassuranceItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.15rem] border border-slate-200 bg-slate-50/70 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-t border-slate-200/80 py-10 sm:py-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <SectionIntro
            eyebrow="Why It Fits"
            title="Designed for the cabin conditions people actually deal with."
            description="The page now speaks to the driver, the vehicle, and the season instead of describing the storefront itself."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {benefitItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.4rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.2)]"
              >
                <p className="text-lg font-semibold leading-6 text-slate-950">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-slate-200/80 py-10 sm:py-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <SectionIntro
            eyebrow="Product Details"
            title="Cleanly rendered from the Shopify product description."
            description="The detail area breaks paragraphs and bullets into readable sections so the information scans properly on mobile and desktop."
          />
          <div className="rounded-[1.6rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.2)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {descriptionSections.length > 0 ? (
              <div className="grid gap-7 lg:gap-8">
                {descriptionSections.map((section, index) => (
                  <div
                    key={`${section.title ?? "section"}-${index}`}
                    className="max-w-3xl"
                  >
                    {section.title ? (
                      <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">
                        {section.title}
                      </h3>
                    ) : null}
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-3 text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets.length > 0 ? (
                      <ul className="mt-4 grid gap-3">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-3 rounded-[1rem] bg-slate-50 px-4 py-3 text-[15px] leading-7 text-slate-700 sm:text-base"
                          >
                            <span className="pt-1 text-slate-400">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="max-w-3xl text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8">
                {product.description}
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-8 border-t border-slate-200/80 py-10 sm:py-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <SectionIntro
            eyebrow="What Buyers Need"
            title="A reassurance section that answers the practical questions."
            description="This section is focused on fit, use, and what happens next instead of sounding like generic luxury-store copy."
          />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
            {reassuranceItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.4rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.2)]"
              >
                <p className="text-base font-semibold text-slate-950">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
            <div className="rounded-[1.4rem] border border-slate-900 bg-slate-950 px-5 py-5 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
              <p className="text-base font-semibold">A clearer path to action.</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The main CTA stays attached to price and product context so the
                buying decision feels immediate instead of buried lower in the page.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-t border-slate-200/80 py-10 sm:py-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <SectionIntro
            eyebrow="FAQ"
            title="Questions buyers usually want answered first."
            description="The FAQ now deals with vehicle fit, power, product purpose, and checkout flow without over-explaining."
          />
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.title}
                className="group rounded-[1.25rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.18)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-950">
                  <span>{item.title}</span>
                  <span className="text-slate-400 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl pr-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.25)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">
              {product.title}
            </p>
            {selectedVariant ? (
              <p className="text-sm text-slate-600">
                {formatMoney(selectedVariant.price)}
              </p>
            ) : null}
          </div>
          <a
            href={ctaHref}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] transition ${
              selectedVariant?.availableForSale
                ? "bg-slate-950 text-white"
                : "pointer-events-none bg-slate-300 text-slate-500"
            }`}
          >
            Buy Now
          </a>
        </div>
      </div>
    </main>
  );
}
