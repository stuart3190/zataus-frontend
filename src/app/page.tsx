const brandPillars = [
  "Premium-first visual foundation",
  "Built for headless Shopify growth",
  "Fast to ship, simple to extend",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,170,91,0.18),transparent_30%),linear-gradient(180deg,#f7f2e8_0%,#f4efe4_28%,#efe6d8_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-stone-900/10 py-5">
          <div className="text-sm uppercase tracking-[0.38em] text-stone-700">
            Zataus
          </div>
          <div className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
            Storefront Starter
          </div>
        </header>

        <section className="flex flex-1 items-center py-16 sm:py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.75fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-5 text-sm uppercase tracking-[0.32em] text-stone-600">
                Zataus.com
              </p>
              <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-none text-stone-950 sm:text-6xl lg:text-8xl">
                A sharper starting point for a premium online storefront.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                Zataus is positioned with a calm, elevated frontend foundation:
                clean typography, focused messaging, and a structure that is
                ready for Shopify storefront data without rebuilding the app.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:hello@zataus.com"
                  className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
                >
                  Start the build
                </a>
                <a
                  href="#brand-intro"
                  className="inline-flex items-center justify-center rounded-full border border-stone-900/15 px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-900/30 hover:bg-white/70"
                >
                  View the foundation
                </a>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-stone-900/10 bg-white/70 p-6 shadow-[0_30px_90px_-50px_rgba(41,30,12,0.5)] backdrop-blur md:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Ready Next
              </p>
              <div className="mt-6 space-y-4">
                {brandPillars.map((pillar) => (
                  <div
                    key={pillar}
                    className="rounded-2xl border border-stone-900/8 bg-stone-50/80 px-4 py-4 text-sm text-stone-700"
                  >
                    {pillar}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-stone-600">
                The current build stays intentionally lean so collections,
                products, cart, and content modules can be added on top without
                stripping out a bloated template first.
              </p>
            </aside>
          </div>
        </section>

        <section
          id="brand-intro"
          className="grid gap-8 border-t border-stone-900/10 py-10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
              Brand Intro
            </p>
            <h2 className="mt-4 max-w-md font-[family-name:var(--font-display)] text-3xl leading-tight text-stone-950 sm:text-4xl">
              Clean by default, commercial when you need it.
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-7 text-stone-700 sm:grid-cols-2">
            <p>
              This homepage is designed to feel considered rather than
              over-designed: strong spacing, premium contrast, and a clear
              brand tone without placeholder catalog content.
            </p>
            <p>
              Under the surface, the repo is already aligned for the next step:
              wiring Shopify Storefront API utilities, environment variables,
              and route-level commerce features into a stable App Router base.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
