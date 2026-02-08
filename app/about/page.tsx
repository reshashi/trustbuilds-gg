import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Trust Methodology | TrustBuilds.gg",
  description:
    "Learn how we calculate Trust Scores for PC components using failure rates, warranty data, and brand reputation.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Trust Score Methodology
          </h1>
          <p className="text-xl text-[var(--muted)]">
            How we measure reliability so you don&apos;t have to research.
          </p>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="prose prose-invert max-w-none">
            {/* Why Trust Scores */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Why Trust Scores?
              </h2>
              <p className="text-[var(--muted)] mb-4">
                When you buy a graphics card or power supply, price and specs
                only tell part of the story. Will it last? What happens if it
                breaks? How painful is the return process?
              </p>
              <p className="text-[var(--muted)]">
                Trust Scores answer these questions by aggregating real
                reliability data from retailers, service centers, and community
                feedback. A component with a high Trust Score isn&apos;t just
                good on paper—it&apos;s proven in the real world.
              </p>
            </div>

            {/* The Formula */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                The Formula
              </h2>
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 font-mono text-sm mb-6">
                <div className="text-[var(--accent)]">Trust Score =</div>
                <div className="ml-4 text-white">
                  (100 - FailureRate × 10) × <span className="text-blue-400">0.4</span>
                </div>
                <div className="ml-4 text-white">
                  + (WarrantyYears / 5 × 100) × <span className="text-purple-400">0.3</span>
                </div>
                <div className="ml-4 text-white">
                  + BrandReputation × <span className="text-green-400">0.2</span>
                </div>
                <div className="ml-4 text-white">
                  + RMArating × 20 × <span className="text-amber-400">0.1</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                    <span className="font-semibold text-white">
                      Failure Rate (40%)
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Percentage of units that fail within warranty. Lower is
                    better. Sourced from retailer return data and repair
                    centers.
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                    <span className="font-semibold text-white">
                      Warranty (30%)
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Length of manufacturer warranty. 5 years is the benchmark
                    for premium components. 1 year = minimum.
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    <span className="font-semibold text-white">
                      Brand Reputation (20%)
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Aggregated review scores and community sentiment. Brands
                    with consistent quality score higher.
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="font-semibold text-white">
                      RMA Experience (10%)
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    How easy is it to return or replace a defective unit?
                    Community-reported RMA experiences on a 1-5 scale.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Data Sources
              </h2>
              <p className="text-[var(--muted)] mb-4">
                We aggregate data from multiple sources to ensure accuracy:
              </p>
              <ul className="space-y-3 text-[var(--muted)]">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
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
                  <span>
                    <strong className="text-white">Retailer Failure Data:</strong>{" "}
                    Published failure rates from major retailers (Tom&apos;s
                    Hardware, Puget Systems)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
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
                  <span>
                    <strong className="text-white">Manufacturer Specs:</strong>{" "}
                    Official warranty terms and support policies
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
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
                  <span>
                    <strong className="text-white">Community Feedback:</strong>{" "}
                    Aggregated RMA experiences from Reddit, forums, and review
                    sites
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
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
                  <span>
                    <strong className="text-white">Professional Reviews:</strong>{" "}
                    Long-term reliability assessments from tech publications
                  </span>
                </li>
              </ul>
            </div>

            {/* Score Ranges */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Understanding Scores
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-400/20 text-green-400">
                    90-100
                  </span>
                  <div>
                    <span className="font-semibold text-white">Excellent</span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      — Best-in-class reliability. Premium brands with proven
                      track records.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-500">
                    80-89
                  </span>
                  <div>
                    <span className="font-semibold text-white">Very Good</span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      — Highly reliable. Minor concerns don&apos;t affect
                      real-world use.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400/20 text-yellow-400">
                    70-79
                  </span>
                  <div>
                    <span className="font-semibold text-white">Good</span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      — Solid choice. Some trade-offs but generally reliable.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-400/20 text-orange-400">
                    60-69
                  </span>
                  <div>
                    <span className="font-semibold text-white">Fair</span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      — Acceptable but with notable concerns. Consider
                      alternatives.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-400/20 text-red-400">
                    Below 60
                  </span>
                  <div>
                    <span className="font-semibold text-white">
                      Below Average
                    </span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      — Not recommended. Significant reliability issues.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Build?
              </h2>
              <p className="text-[var(--muted)] mb-6">
                Browse our curated builds, all featuring high Trust Score
                components.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-light)] transition-colors"
              >
                View All Builds
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
