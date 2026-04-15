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
    title: "Will it fit in a van or car?",
    description:
      "It is designed for vans, cars, and similarly small cabin spaces where a compact filter setup makes sense for everyday use.",
  },
  {
    title: "How is it powered?",
    description:
      "It uses USB power, which keeps it simple for daily use inside the vehicle or another compact setup.",
  },
  {
    title: "Can it help during hay fever season?",
    description:
      "It is designed for spring driving when dust and pollen can feel more noticeable in enclosed cabin spaces. It is not presented as a medical treatment.",
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

function getVisiblePurchaseLabel(): string {
  return "Cabin Pollen Catcher";
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
  const [selectedVariantId] = useState(
    getInitialVariant(product.variants)?.id ?? "",
  );

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    getInitialVariant(product.variants);
  const selectedImage = product.images[selectedImageIndex] ?? product.images[0];
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
  const visiblePurchaseLabel = getVisiblePurchaseLabel();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,240,213,0.95),transparent_38%),radial-gradient(circle_at_top_right,rgba(252,247,192,0.9),transparent_34%),linear-gradient(180deg,#fbfcf8_0%,#f4f8ef_38%,#f7f5e9_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
      >
        <div className="absolute left-[-8%] top-8 h-[280px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(173,208,163,0.18)_0%,rgba(173,208,163,0)_72%)] blur-2xl sm:h-[360px] sm:w-[300px]" />
        <div className="absolute right-[-6%] top-0 h-[320px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(250,237,170,0.26)_0%,rgba(250,237,170,0)_74%)] blur-3xl sm:h-[420px] sm:w-[340px]" />
        <div className="absolute inset-x-0 top-[120px] h-[220px] bg-[radial-gradient(circle_at_20%_40%,rgba(118,154,101,0.09)_0%,rgba(118,154,101,0)_48%),radial-gradient(circle_at_72%_18%,rgba(195,214,145,0.1)_0%,rgba(195,214,145,0)_42%)] blur-3xl" />
        <div className="absolute left-[-20px] top-[90px] h-[240px] w-[180px] rotate-[-12deg] bg-[linear-gradient(180deg,rgba(98,128,80,0.12)_0%,rgba(98,128,80,0)_100%)] [clip-path:ellipse(35%_48%_at_50%_50%)] blur-xl sm:left-[20px] sm:h-[320px] sm:w-[220px]" />
        <div className="absolute left-[70px] top-[120px] h-[220px] w-[150px] rotate-[10deg] bg-[linear-gradient(180deg,rgba(116,151,96,0.08)_0%,rgba(116,151,96,0)_100%)] [clip-path:ellipse(30%_46%_at_50%_50%)] blur-xl sm:left-[140px] sm:h-[300px] sm:w-[180px]" />
        <div className="absolute right-[20px] top-[110px] h-[240px] w-[170px] rotate-[14deg] bg-[linear-gradient(180deg,rgba(144,171,111,0.08)_0%,rgba(144,171,111,0)_100%)] [clip-path:ellipse(32%_46%_at_50%_50%)] blur-xl sm:right-[90px] sm:h-[320px] sm:w-[210px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-16">
        <header className="flex items-center justify-between py-4 sm:py-5">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-[0.34em] text-slate-700"
          >
            Zataus
          </Link>
        </header>

        <section className="grid gap-6 py-3 sm:gap-8 sm:py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:items-center lg:gap-10 lg:py-10">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-8%] -z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(244,242,171,0.48)_0%,rgba(207,232,194,0.34)_34%,rgba(207,232,194,0)_68%)] blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[6%] top-[8%] z-10 h-[42%] w-[18%] rotate-[-14deg] bg-[linear-gradient(180deg,rgba(117,152,94,0.14)_0%,rgba(117,152,94,0)_100%)] [clip-path:ellipse(34%_48%_at_50%_50%)] blur-xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[8%] top-[14%] z-10 h-[36%] w-[15%] rotate-[12deg] bg-[linear-gradient(180deg,rgba(131,166,108,0.1)_0%,rgba(131,166,108,0)_100%)] [clip-path:ellipse(34%_48%_at_50%_50%)] blur-xl"
              />
              <div className="overflow-hidden rounded-[2rem] bg-white/62 p-2 shadow-[0_26px_80px_-42px_rgba(38,52,33,0.3)] ring-1 ring-slate-200/60 backdrop-blur sm:rounded-[2.25rem] sm:p-3">
                <div className="relative aspect-[1/1.02] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#eef6e8_0%,#eaf2de_100%)] sm:rounded-[1.8rem]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_28%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_32%,rgba(28,39,27,0.06)_100%)]"
                  />
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
            </div>

            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 sm:gap-3 lg:max-w-[88%]">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-18 min-w-[4.6rem] overflow-hidden rounded-[0.95rem] border bg-white/78 transition sm:h-22 sm:min-w-[5.6rem] ${
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
              <h1 className="max-w-[12ch] font-[family-name:var(--font-display)] text-[2.9rem] leading-[0.9] text-slate-950 sm:text-[3.8rem] lg:text-[4.7rem]">
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

              <p className="mt-4 text-sm font-medium text-slate-600">
                {visiblePurchaseLabel}
              </p>

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

        <section className="relative grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-6 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.24)_100%)]"
          />
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

        <section className="relative grid gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-start lg:gap-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[linear-gradient(90deg,rgba(148,163,184,0)_0%,rgba(148,163,184,0.28)_18%,rgba(148,163,184,0.28)_82%,rgba(148,163,184,0)_100%)]"
          />
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

          <div className="rounded-[2rem] bg-white/58 p-5 shadow-[0_24px_70px_-42px_rgba(40,60,34,0.25)] ring-1 ring-slate-200/60 backdrop-blur sm:p-6">
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
