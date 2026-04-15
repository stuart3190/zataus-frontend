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
  bullets: string[];
};

const quickBenefits = [
  "Made for vans and cars",
  "USB powered",
  "Helps catch dust and pollen",
];

const practicalReasons: DetailItem[] = [
  {
    title: "Spring driving feels closer in the cabin",
    description:
      "Dust and pollen can feel more noticeable when the space around the driver stays compact and enclosed.",
  },
  {
    title: "Small enough for everyday placement",
    description:
      "Cabin Pollen Catcher is built for vans, cars, and other personal spaces where a full-size unit feels out of place.",
  },
  {
    title: "Simple to power and use",
    description:
      "USB power keeps the setup practical for regular driving instead of turning it into a technical install project.",
  },
];

const faqItems: DetailItem[] = [
  {
    title: "What is it for?",
    description:
      "Cabin Pollen Catcher is a compact USB cabin filter for vans, cars, and other small personal spaces.",
  },
  {
    title: "Is it only for vans?",
    description:
      "No. It is designed for vans, cars, and similarly small spaces where a compact filter setup makes sense.",
  },
  {
    title: "How is it powered?",
    description:
      "It uses USB power, which keeps it simple for daily use inside the vehicle or another compact setup.",
  },
  {
    title: "What size is it?",
    description:
      "It is intended as a compact cabin product rather than a large device for full-room coverage.",
  },
  {
    title: "Does it cure hay fever?",
    description:
      "No. It is not a treatment or medical device and is not presented as curing hay fever or any other condition.",
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

  if (
    !normalized ||
    normalized === "default title" ||
    normalized === "default" ||
    normalized === "standard" ||
    normalized === "single" ||
    normalized === "1 pack"
  ) {
    return null;
  }

  return title.trim();
}

function getShortDescription(description: string): string {
  const firstLine = description
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .find(Boolean);

  if (!firstLine) {
    return "Designed for spring driving in vans, cars, and other small personal spaces.";
  }

  return firstLine;
}

function parseDescription(description: string): ParsedDescriptionSection[] {
  const normalized = description.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((block) => block.length > 0)
    .map((block) => {
      const firstLine = block[0];
      const headingCandidate = firstLine.replace(/:$/, "");
      const hasHeading =
        block.length > 1 &&
        !/^[-*•]/.test(firstLine) &&
        headingCandidate.length <= 60 &&
        headingCandidate.split(" ").length <= 6;
      const contentLines = hasHeading ? block.slice(1) : block;

      return {
        title: hasHeading ? headingCandidate : null,
        bullets: contentLines
          .map((line) => line.replace(/^[-*•]\s*/, "").trim())
          .filter(Boolean),
      };
    })
    .filter((section) => section.bullets.length > 0);
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
  const normalizedVariantTitle = selectedVariant
    ? normalizeVariantTitle(selectedVariant.title)
    : null;
  const compareAtPrice =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) >
      Number(selectedVariant.price.amount)
      ? selectedVariant.compareAtPrice
      : null;
  const descriptionSections = parseDescription(product.description);
  const ctaHref = selectedVariant
    ? getVariantCartUrl(storeDomain, selectedVariant.id)
    : `https://${storeDomain}`;
  const shortDescription = getShortDescription(product.description);
  const ctaLabel = selectedVariant?.availableForSale
    ? "Buy Cabin Pollen Catcher"
    : "Sold Out";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(220,240,213,0.95),transparent_38%),radial-gradient(circle_at_top_right,rgba(252,247,192,0.9),transparent_34%),linear-gradient(180deg,#fbfcf8_0%,#f4f8ef_38%,#f7f5e9_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-16">
        <header className="flex items-center justify-between py-4 sm:py-5">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-[0.34em] text-slate-700"
          >
            Zataus
          </Link>
          <div className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 backdrop-blur sm:px-4 sm:text-[11px]">
            Cabin Pollen Catcher
          </div>
        </header>

        <section className="grid gap-6 py-3 sm:gap-8 sm:py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:items-center lg:gap-10 lg:py-10">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem] bg-white/65 p-2 shadow-[0_24px_70px_-42px_rgba(38,52,33,0.28)] ring-1 ring-slate-200/60 backdrop-blur sm:rounded-[2.25rem] sm:p-3">
              <div className="relative aspect-[1/1.02] overflow-hidden rounded-[1.5rem] bg-[#edf4e7] sm:rounded-[1.8rem]">
                {selectedImage ? (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.altText ?? product.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.24em] text-slate-500">
                    No product image
                  </div>
                )}
              </div>
            </div>

            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 sm:gap-3 lg:max-w-[88%]">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-18 min-w-[4.6rem] overflow-hidden rounded-[0.95rem] border bg-white/80 transition sm:h-22 sm:min-w-[5.6rem] ${
                      index === selectedImageIndex
                        ? "border-slate-950 shadow-[0_14px_28px_-20px_rgba(15,23,42,0.35)]"
                        : "border-slate-200/80 hover:border-slate-400"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? `${product.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 74px, 94px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="order-1 lg:order-2">
            <div className="max-w-[34rem]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white">
                  Spring driving
                </span>
                <span className="rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-slate-700 ring-1 ring-slate-200/70">
                  USB cabin filter
                </span>
              </div>

              <h1 className="mt-5 max-w-[12ch] font-[family-name:var(--font-display)] text-[2.9rem] leading-[0.9] text-slate-950 sm:text-[3.8rem] lg:text-[4.7rem]">
                {product.title}
              </h1>

              <p className="mt-4 max-w-[28rem] text-[15px] leading-7 text-slate-700 sm:text-lg sm:leading-8">
                Designed for spring driving when dust and pollen feel heavier in
                enclosed cabin spaces. Helps the cabin feel fresher and more
                manageable.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {[
                  "Helps catch dust and pollen",
                  "Designed for spring driving",
                  "Made for vans, cars, and small personal spaces",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/70 px-3.5 py-2 text-sm font-medium text-slate-800 ring-1 ring-slate-200/70"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-end gap-3">
                {selectedVariant ? (
                  <div className="text-[2.1rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.7rem]">
                    {formatMoney(selectedVariant.price)}
                  </div>
                ) : null}
                {compareAtPrice ? (
                  <div className="pb-1 text-base text-slate-400 line-through sm:text-lg">
                    {formatMoney(compareAtPrice)}
                  </div>
                ) : null}
              </div>

              {hasMultipleVariants ? (
                <div className="mt-5 flex flex-col gap-3">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariant?.id;
                    const variantLabel =
                      normalizeVariantTitle(variant.title) ?? "Cabin Pollen Catcher";

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`flex items-center justify-between rounded-full px-4 py-3 text-left text-sm transition ${
                          active
                            ? "bg-slate-950 text-white"
                            : "bg-white/80 text-slate-800 ring-1 ring-slate-200/80 hover:ring-slate-400"
                        }`}
                        >
                          <span className="font-medium">{variantLabel}</span>
                          <span className="opacity-80">
                          {variant.availableForSale
                            ? formatMoney(variant.price)
                            : "Sold out"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm font-medium text-slate-600">
                  Compact USB cabin filter
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={ctaHref}
                  className={`inline-flex min-h-13 items-center justify-center rounded-full px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] transition sm:min-w-[260px] ${
                    selectedVariant?.availableForSale
                      ? "bg-slate-950 text-white shadow-[0_20px_40px_-18px_rgba(15,23,42,0.45)] hover:bg-slate-800"
                      : "pointer-events-none bg-slate-300 text-slate-500"
                  }`}
                >
                  {ctaLabel}
                </a>
                <p className="max-w-xs text-sm leading-6 text-slate-600">
                  Checkout opens on Shopify with the product ready to go.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Why Drivers Like It
            </p>
            <h2 className="mt-3 max-w-[12ch] font-[family-name:var(--font-display)] text-[2.1rem] leading-[0.95] text-slate-950 sm:text-[2.8rem]">
              Cleaner, calmer, and easier to live with in the cabin.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
            {practicalReasons.map((item) => (
              <div key={item.title}>
                <p className="text-base font-semibold text-slate-950">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-start lg:gap-14">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Product Details
            </p>
            <h2 className="mt-3 max-w-[12ch] font-[family-name:var(--font-display)] text-[2.1rem] leading-[0.95] text-slate-950 sm:text-[2.8rem]">
              Quick product details.
            </h2>

            <div className="mt-6 grid gap-6">
              {descriptionSections.length > 0 ? (
                descriptionSections.map((section, index) => (
                  <div
                    key={`${section.title ?? "section"}-${index}`}
                    className="rounded-[1.2rem] bg-white/55 px-4 py-4 ring-1 ring-slate-200/60 sm:px-5"
                  >
                    {section.title ? (
                      <h3 className="text-lg font-semibold text-slate-950">
                        {section.title}
                      </h3>
                    ) : null}
                    <ul className="mt-3 grid gap-2.5">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-[15px] leading-7 text-slate-700 sm:text-base"
                        >
                          <span className="pt-1 text-emerald-500">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="grid gap-3 rounded-[1.2rem] bg-white/55 px-4 py-4 ring-1 ring-slate-200/60 sm:px-5">
                  <li className="flex gap-3 text-[15px] leading-7 text-slate-700 sm:text-base">
                    <span className="pt-1 text-emerald-500">•</span>
                    <span>{product.description}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/62 p-5 shadow-[0_24px_70px_-42px_rgba(40,60,34,0.25)] ring-1 ring-slate-200/60 backdrop-blur sm:p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              FAQ
            </p>
            <div className="mt-4 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.title}
                  className="group rounded-[1.2rem] bg-white/80 px-4 py-4 ring-1 ring-slate-200/70"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-950">
                    <span>{item.title}</span>
                    <span className="text-slate-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/80 bg-white/92 px-4 py-3 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.25)] backdrop-blur lg:hidden">
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
