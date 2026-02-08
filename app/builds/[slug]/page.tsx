import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustScore, { TrustScoreBreakdown } from "@/components/TrustScore";
import ComponentList from "@/components/ComponentList";
import { BuyAllButton } from "@/components/AffiliateButton";
import { getEnrichedBuild, getAllBuilds, formatPrice } from "@/lib/data";
import { generateBuildJsonLd } from "@/lib/structuredData";

interface BuildPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const builds = getAllBuilds();
  return builds.map((build) => ({
    slug: build.slug,
  }));
}

export async function generateMetadata({ params }: BuildPageProps) {
  const { slug } = await params;
  const build = getEnrichedBuild(slug);

  if (!build) {
    return {
      title: "Build Not Found | TrustBuilds.gg",
    };
  }

  return {
    title: `${build.name} - ${build.targetResolution} Gaming PC | TrustBuilds.gg`,
    description: build.description,
    openGraph: {
      title: `${build.name} Gaming PC Build`,
      description: build.description,
      type: "website",
    },
  };
}

export default async function BuildPage({ params }: BuildPageProps) {
  const { slug } = await params;
  const build = getEnrichedBuild(slug);

  if (!build) {
    notFound();
  }

  const jsonLd = generateBuildJsonLd(build);

  const resolutionBadgeColors = {
    "1080p": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "1440p": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "4K": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  // Calculate aggregate trust factors (average of all components)
  const avgTrustFactors = {
    failureRate:
      build.components.reduce((sum, c) => sum + c.trustFactors.failureRate, 0) /
      build.components.length,
    warrantyYears:
      build.components.reduce(
        (sum, c) => sum + c.trustFactors.warrantyYears,
        0
      ) / build.components.length,
    brandReputation:
      build.components.reduce(
        (sum, c) => sum + c.trustFactors.brandReputation,
        0
      ) / build.components.length,
    rmaRating:
      build.components.reduce((sum, c) => sum + c.trustFactors.rmaRating, 0) /
      build.components.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Breadcrumb */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <nav className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-white transition-colors">
                Builds
              </Link>
              <span>/</span>
              <span className="text-white">{build.name}</span>
            </nav>
          </div>

          {/* Hero Section */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                      resolutionBadgeColors[build.targetResolution]
                    }`}
                  >
                    {build.targetResolution} @ {build.targetFps} FPS
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {build.name}
                </h1>

                <p className="text-lg text-[var(--muted)] mb-6">
                  {build.description}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <TrustScore score={build.trustScore} size="lg" showLabel />
                  </div>
                  <div className="text-sm text-[var(--muted)]">
                    {build.components.length} components
                  </div>
                  <div className="text-sm text-[var(--muted)]">
                    Last updated:{" "}
                    {new Date(build.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Price Card */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-sm text-[var(--muted)] mb-1">
                      Best Price Available
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {formatPrice(build.lowestTotalPrice)}
                    </div>
                    <div className="text-sm text-[var(--muted)] mt-1">
                      Range: {formatPrice(build.priceRange.min)} -{" "}
                      {formatPrice(build.priceRange.max)}
                    </div>
                  </div>

                  <BuyAllButton
                    components={build.components}
                    totalPrice={build.lowestTotalPrice}
                  />

                  <p className="text-xs text-center text-[var(--muted)] mt-4">
                    Opens each component&apos;s best price in new tabs
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Score Breakdown */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Build Trust Score Breakdown
            </h2>
            <div className="max-w-2xl">
              <TrustScoreBreakdown trustFactors={avgTrustFactors} />
            </div>
          </section>

          {/* Components List */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Complete Parts List
              </h2>
              <span className="text-sm text-[var(--muted)]">
                Showing prices from 5 retailers
              </span>
            </div>

            <ComponentList components={build.components} showDetails />
          </section>

          {/* Use Case Section */}
          <section className="border-t border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Best For
              </h2>
              <p className="text-[var(--muted)] max-w-2xl">
                {build.useCase}. This build targets {build.targetResolution} gaming
                at {build.targetFps} FPS with high-reliability components selected
                for long-term performance.
              </p>
            </div>
          </section>

          {/* Back to Builds */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors font-medium"
            >
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              View All Builds
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
