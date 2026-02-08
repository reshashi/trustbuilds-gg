"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustScore from "@/components/TrustScore";
import ComponentList from "@/components/ComponentList";
import { BuyAllButton } from "@/components/AffiliateButton";
import buildsData from "@/data/builds.json";
import { getAllParts } from "@/lib/partsLoader";
import type { Build, Component, EnrichedBuild } from "@/lib/types";

const builds = buildsData as unknown as Build[];
const components = getAllParts();

function getLowestPrice(component: Component): number {
  const inStockRetailers = component.retailers.filter((r) => r.inStock);
  if (inStockRetailers.length === 0) {
    return Math.min(...component.retailers.map((r) => r.price));
  }
  return Math.min(...inStockRetailers.map((r) => r.price));
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getEnrichedBuild(build: Build): EnrichedBuild {
  const enrichedComponents = build.componentIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is Component => c !== undefined);

  const lowestTotalPrice = enrichedComponents.reduce(
    (sum, c) => sum + getLowestPrice(c),
    0
  );

  const avgTrustScore =
    enrichedComponents.reduce((sum, c) => sum + c.trustScore, 0) /
    enrichedComponents.length;

  return {
    ...build,
    components: enrichedComponents,
    totalPrice: lowestTotalPrice,
    lowestTotalPrice,
    trustScore: Math.round(avgTrustScore),
  };
}

// Find the best build for a given budget
function findBestBuildForBudget(budget: number): EnrichedBuild | null {
  const enrichedBuilds = builds.map(getEnrichedBuild);

  // Filter builds that fit within budget, then sort by price descending (maximize value)
  const affordableBuilds = enrichedBuilds
    .filter((b) => b.lowestTotalPrice <= budget)
    .sort((a, b) => b.lowestTotalPrice - a.lowestTotalPrice);

  return affordableBuilds[0] || null;
}

export default function BudgetBuilderPage() {
  const [budget, setBudget] = useState<number>(1500);
  const [inputValue, setInputValue] = useState<string>("1500");

  const recommendedBuild = useMemo(() => {
    return findBestBuildForBudget(budget);
  }, [budget]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setBudget(value);
    setInputValue(value.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(value);
    if (value) {
      const numValue = Math.min(Math.max(parseInt(value, 10), 500), 10000);
      setBudget(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = Math.min(Math.max(parseInt(inputValue, 10) || 500, 500), 10000);
    setBudget(numValue);
    setInputValue(numValue.toString());
  };

  const resolutionBadgeColors = {
    "1080p": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "1440p": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "4K": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Budget Builder
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Enter your budget and we&apos;ll find the best gaming PC build that maximizes every dollar.
            </p>
          </div>

          {/* Budget Input */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
              <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                Your Budget
              </label>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl text-[var(--muted)]">$</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="flex-1 text-4xl font-bold text-white bg-transparent border-none outline-none"
                  placeholder="1500"
                />
              </div>

              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={budget}
                onChange={handleSliderChange}
                className="w-full h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />

              <div className="flex justify-between text-sm text-[var(--muted)] mt-2">
                <span>$500</span>
                <span>$5,000</span>
              </div>
            </div>
          </div>

          {/* Recommended Build */}
          {recommendedBuild ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Recommended Build
                </h2>
                <div className="text-sm text-[var(--muted)]">
                  Uses {Math.round((recommendedBuild.lowestTotalPrice / budget) * 100)}% of your budget
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
                {/* Build Header */}
                <div className="p-6 border-b border-[var(--card-border)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                            resolutionBadgeColors[recommendedBuild.targetResolution]
                          }`}
                        >
                          {recommendedBuild.targetResolution} @ {recommendedBuild.targetFps} FPS
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {recommendedBuild.name}
                      </h3>
                      <p className="text-[var(--muted)]">
                        {recommendedBuild.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <TrustScore score={recommendedBuild.trustScore} size="lg" showLabel />
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">
                          {formatPrice(recommendedBuild.lowestTotalPrice)}
                        </div>
                        <div className="text-sm text-green-400">
                          ${budget - recommendedBuild.lowestTotalPrice} under budget
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Components */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Components
                  </h4>
                  <ComponentList components={recommendedBuild.components} showDetails />
                </div>

                {/* Actions */}
                <div className="p-6 bg-[var(--background)] border-t border-[var(--card-border)]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href={`/builds/${recommendedBuild.slug}`}
                      className="text-[var(--accent)] hover:text-[var(--accent-light)] font-medium transition-colors"
                    >
                      View Full Build Details
                    </Link>
                    <BuyAllButton
                      components={recommendedBuild.components}
                      totalPrice={recommendedBuild.lowestTotalPrice}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Budget Too Low
                </h3>
                <p className="text-[var(--muted)] mb-4">
                  We recommend a minimum budget of $900 for a quality gaming PC build.
                  Increase your budget to see our recommendations.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-light)] font-medium transition-colors"
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
          )}

          {/* All Builds Preview */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-xl font-bold text-white mb-6">
              All Available Builds by Budget
            </h2>
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
              {builds
                .map(getEnrichedBuild)
                .sort((a, b) => a.lowestTotalPrice - b.lowestTotalPrice)
                .map((build) => (
                  <Link
                    key={build.id}
                    href={`/builds/${build.slug}`}
                    className={`flex items-center justify-between p-4 border-b border-[var(--card-border)] last:border-b-0 hover:bg-[var(--background)] transition-colors ${
                      build.lowestTotalPrice <= budget
                        ? ""
                        : "opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          resolutionBadgeColors[build.targetResolution]
                        }`}
                      >
                        {build.targetResolution}
                      </span>
                      <div>
                        <div className="font-semibold text-white">
                          {build.name}
                        </div>
                        <div className="text-sm text-[var(--muted)]">
                          {build.targetFps} FPS target
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <TrustScore score={build.trustScore} size="sm" />
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          {formatPrice(build.lowestTotalPrice)}
                        </div>
                        {build.lowestTotalPrice <= budget ? (
                          <div className="text-xs text-green-400">
                            Within budget
                          </div>
                        ) : (
                          <div className="text-xs text-red-400">
                            +{formatPrice(build.lowestTotalPrice - budget)} over
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
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
            Back to All Builds
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
