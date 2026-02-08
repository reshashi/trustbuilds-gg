import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuildCard from "@/components/BuildCard";
import { getAllEnrichedBuilds } from "@/lib/data";

export default function HomePage() {
  const builds = getAllEnrichedBuilds();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Gaming PCs with{" "}
                <span className="text-[var(--accent)]">Trust Scores</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto">
                Zero research. Zero guesswork. Curated builds with reliability
                data so you know exactly what you&apos;re getting.
              </p>

              {/* Value Props */}
              <div className="mt-10 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Brand Failure Rates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Warranty Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Multi-Retailer Prices</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Builds Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Curated Builds</h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                {builds.length} builds for every budget and use case
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </section>

        {/* Why Trust Scores Section */}
        <section className="border-t border-[var(--card-border)] bg-[var(--card-bg)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-white">
                Why Trust Scores Matter
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                Other sites show you prices. We show you reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Failure Rate Data
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  Real failure rates from retailers and service centers. Know
                  which brands break and which ones last.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Warranty Quality
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  Not all warranties are equal. We rate the actual RMA
                  experience, not just the length.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Brand Reputation
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  Aggregated reviews and community feedback. Trusted brands get
                  higher scores.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
