"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustScore from "@/components/TrustScore";
import componentsData from "@/data/components.json";
import type { Component } from "@/lib/types";

const allComponents = componentsData as unknown as Component[];

// Group components by category
const componentsByCategory = allComponents.reduce((acc, component) => {
  if (!acc[component.category]) {
    acc[component.category] = [];
  }
  acc[component.category].push(component);
  return acc;
}, {} as Record<string, Component[]>);

const categoryLabels: Record<string, string> = {
  cpu: "CPU (Processor)",
  gpu: "Graphics Card",
  motherboard: "Motherboard",
  ram: "Memory (RAM)",
  storage: "Storage (SSD)",
  psu: "Power Supply",
  case: "Case",
  cooler: "CPU Cooler",
};

const categoryOrder = ["cpu", "gpu", "motherboard", "ram", "storage", "psu", "case", "cooler"];

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

interface UpgradeRecommendation {
  category: string;
  currentComponent: Component | null;
  recommendedComponent: Component;
  reason: string;
  priority: "high" | "medium" | "low";
  performanceGain: string;
  price: number;
}

function analyzeUpgrades(
  currentParts: Record<string, string>,
  budget: number
): UpgradeRecommendation[] {
  const recommendations: UpgradeRecommendation[] = [];

  // Find current components
  const currentComponents: Record<string, Component | null> = {};
  for (const category of categoryOrder) {
    currentComponents[category] = currentParts[category]
      ? allComponents.find((c) => c.id === currentParts[category]) || null
      : null;
  }

  // Analyze GPU first (usually biggest gaming impact)
  const currentGpu = currentComponents.gpu;
  if (currentGpu) {
    const betterGpus = (componentsByCategory.gpu || [])
      .filter((g) => g.trustScore > currentGpu.trustScore)
      .filter((g) => getLowestPrice(g) <= budget)
      .sort((a, b) => b.trustScore - a.trustScore);

    if (betterGpus.length > 0) {
      const recommended = betterGpus[0];
      const currentPrice = getLowestPrice(currentGpu);
      const newPrice = getLowestPrice(recommended);

      recommendations.push({
        category: "gpu",
        currentComponent: currentGpu,
        recommendedComponent: recommended,
        reason: `Upgrade from ${currentGpu.model} to ${recommended.model} for significantly better gaming performance.`,
        priority: "high",
        performanceGain: `+${Math.round(((recommended.trustScore - currentGpu.trustScore) / currentGpu.trustScore) * 100)}% reliability`,
        price: newPrice,
      });
    }
  }

  // Analyze CPU
  const currentCpu = currentComponents.cpu;
  if (currentCpu) {
    const betterCpus = (componentsByCategory.cpu || [])
      .filter((c) => c.trustScore > currentCpu.trustScore)
      .filter((c) => getLowestPrice(c) <= budget * 0.6) // CPU shouldn't eat whole budget
      .sort((a, b) => b.trustScore - a.trustScore);

    if (betterCpus.length > 0) {
      const recommended = betterCpus[0];

      recommendations.push({
        category: "cpu",
        currentComponent: currentCpu,
        recommendedComponent: recommended,
        reason: `Upgrade to ${recommended.model} for better multi-threaded performance and gaming.`,
        priority: currentCpu.trustScore < 85 ? "high" : "medium",
        performanceGain: `+${Number(recommended.specs.cores || 0) - Number(currentCpu.specs.cores || 0)} cores`,
        price: getLowestPrice(recommended),
      });
    }
  }

  // Analyze RAM
  const currentRam = currentComponents.ram;
  if (currentRam) {
    const betterRams = (componentsByCategory.ram || [])
      .filter((r) => r.trustScore > currentRam.trustScore)
      .filter((r) => getLowestPrice(r) <= budget * 0.3)
      .sort((a, b) => b.trustScore - a.trustScore);

    if (betterRams.length > 0) {
      const recommended = betterRams[0];

      recommendations.push({
        category: "ram",
        currentComponent: currentRam,
        recommendedComponent: recommended,
        reason: `Faster RAM can improve gaming performance, especially with AMD CPUs.`,
        priority: "low",
        performanceGain: `${recommended.specs.speed}`,
        price: getLowestPrice(recommended),
      });
    }
  }

  // Analyze Storage
  const currentStorage = currentComponents.storage;
  if (currentStorage) {
    const betterStorage = (componentsByCategory.storage || [])
      .filter((s) => s.trustScore > currentStorage.trustScore)
      .filter((s) => getLowestPrice(s) <= budget * 0.25)
      .sort((a, b) => b.trustScore - a.trustScore);

    if (betterStorage.length > 0) {
      const recommended = betterStorage[0];

      recommendations.push({
        category: "storage",
        currentComponent: currentStorage,
        recommendedComponent: recommended,
        reason: `Faster SSD for quicker load times and better overall system responsiveness.`,
        priority: "low",
        performanceGain: `${recommended.specs.readSpeed} read`,
        price: getLowestPrice(recommended),
      });
    }
  }

  // Analyze PSU (important for GPU upgrades)
  const currentPsu = currentComponents.psu;
  const gpuRecommendation = recommendations.find((r) => r.category === "gpu");
  if (currentPsu && gpuRecommendation) {
    const recommendedGpuTdp = Number(gpuRecommendation.recommendedComponent.specs.tdp || 0);
    const currentPsuWattage = Number(currentPsu.specs.wattage || 0);

    // If recommended GPU needs more power, suggest PSU upgrade
    if (recommendedGpuTdp > currentPsuWattage * 0.5) {
      const betterPsus = (componentsByCategory.psu || [])
        .filter((p) => Number(p.specs.wattage || 0) >= recommendedGpuTdp * 2)
        .filter((p) => getLowestPrice(p) <= budget * 0.3)
        .sort((a, b) => Number(a.specs.wattage || 0) - Number(b.specs.wattage || 0));

      if (betterPsus.length > 0) {
        const recommended = betterPsus[0];

        recommendations.push({
          category: "psu",
          currentComponent: currentPsu,
          recommendedComponent: recommended,
          reason: `Higher wattage PSU needed to support the GPU upgrade safely.`,
          priority: "high",
          performanceGain: `${recommended.specs.wattage}W`,
          price: getLowestPrice(recommended),
        });
      }
    }
  }

  // Analyze Cooler
  const currentCooler = currentComponents.cooler;
  const cpuRecommendation = recommendations.find((r) => r.category === "cpu");
  if (currentCooler && cpuRecommendation) {
    const recommendedCpuTdp = Number(cpuRecommendation.recommendedComponent.specs.tdp || 0);
    const currentCoolerTdp = currentCooler.specs.tdpRating
      ? parseInt(String(currentCooler.specs.tdpRating))
      : 150;

    if (recommendedCpuTdp > currentCoolerTdp * 0.8) {
      const betterCoolers = (componentsByCategory.cooler || [])
        .filter((c) => parseInt(String(c.specs.tdpRating || "0")) >= recommendedCpuTdp)
        .filter((c) => getLowestPrice(c) <= budget * 0.2)
        .sort((a, b) => b.trustScore - a.trustScore);

      if (betterCoolers.length > 0) {
        const recommended = betterCoolers[0];

        recommendations.push({
          category: "cooler",
          currentComponent: currentCooler,
          recommendedComponent: recommended,
          reason: `Better cooling needed for the upgraded CPU.`,
          priority: "medium",
          performanceGain: String(recommended.specs.tdpRating || "High TDP"),
          price: getLowestPrice(recommended),
        });
      }
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Filter to fit budget
  let runningTotal = 0;
  const affordableRecommendations: UpgradeRecommendation[] = [];

  for (const rec of recommendations) {
    if (runningTotal + rec.price <= budget) {
      affordableRecommendations.push(rec);
      runningTotal += rec.price;
    }
  }

  return affordableRecommendations;
}

export default function UpgradeAdvisorPage() {
  const [currentParts, setCurrentParts] = useState<Record<string, string>>({});
  const [budget, setBudget] = useState<number>(500);
  const [inputValue, setInputValue] = useState<string>("500");
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<UpgradeRecommendation[]>([]);

  const handlePartChange = (category: string, componentId: string) => {
    setCurrentParts((prev) => ({
      ...prev,
      [category]: componentId,
    }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(value);
    if (value) {
      setBudget(parseInt(value, 10));
    }
  };

  const handleAnalyze = () => {
    const results = analyzeUpgrades(currentParts, budget);
    setRecommendations(results);
    setShowResults(true);
  };

  const totalCost = recommendations.reduce((sum, r) => sum + r.price, 0);
  const selectedPartsCount = Object.values(currentParts).filter(Boolean).length;

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Upgrade Advisor
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Tell us what&apos;s in your PC and your budget. We&apos;ll recommend the best upgrades for maximum performance gain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Current Parts Form */}
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Your Current Parts
              </h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                Select the components you currently have. Leave empty if you don&apos;t have that part or want us to recommend one.
              </p>

              <div className="space-y-4">
                {categoryOrder.map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      {categoryLabels[category]}
                    </label>
                    <select
                      value={currentParts[category] || ""}
                      onChange={(e) => handlePartChange(category, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="">Select your {categoryLabels[category]}</option>
                      {(componentsByCategory[category] || []).map((component) => (
                        <option key={component.id} value={component.id}>
                          {component.name}
                        </option>
                      ))}
                      <option value="other">Other / Not Listed</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget & Analyze */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Upgrade Budget
                </h2>

                <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                  How much do you want to spend?
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl text-[var(--muted)]">$</span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleBudgetChange}
                    className="flex-1 text-3xl font-bold text-white bg-transparent border-none outline-none"
                    placeholder="500"
                  />
                </div>

                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={budget}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setBudget(value);
                    setInputValue(value.toString());
                  }}
                  className="w-full h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-sm text-[var(--muted)] mt-2">
                  <span>$100</span>
                  <span>$3,000</span>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={selectedPartsCount === 0}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  selectedPartsCount > 0
                    ? "bg-[var(--accent)] hover:bg-[var(--accent-light)] text-black"
                    : "bg-[var(--card-border)] text-[var(--muted)] cursor-not-allowed"
                }`}
              >
                Analyze My System
              </button>

              {selectedPartsCount === 0 && (
                <p className="text-sm text-center text-[var(--muted)]">
                  Select at least one current part to get recommendations
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div className="max-w-4xl mx-auto mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Upgrade Recommendations
                </h2>
                {recommendations.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-[var(--muted)]">Total Cost</div>
                    <div className="text-xl font-bold text-white">
                      {formatPrice(totalCost)}
                    </div>
                  </div>
                )}
              </div>

              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-[var(--muted)] uppercase">
                              {categoryLabels[rec.category]}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                priorityColors[rec.priority]
                              }`}
                            >
                              {rec.priority} priority
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            {rec.recommendedComponent.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <TrustScore score={rec.recommendedComponent.trustScore} size="sm" />
                          <div className="text-right">
                            <div className="text-xl font-bold text-white">
                              {formatPrice(rec.price)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {rec.currentComponent && (
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-3">
                          <span>Replacing:</span>
                          <span className="text-white">{rec.currentComponent.name}</span>
                          <span className="text-[var(--accent)]">→</span>
                          <span className="text-green-400">{rec.performanceGain}</span>
                        </div>
                      )}

                      <p className="text-[var(--muted)]">{rec.reason}</p>

                      {/* Quick Buy Links */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {rec.recommendedComponent.retailers
                          .filter((r) => r.inStock)
                          .slice(0, 3)
                          .map((retailer) => (
                            <a
                              key={retailer.retailer}
                              href={retailer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[var(--background)] hover:bg-[var(--accent)]/20 text-sm text-[var(--muted)] hover:text-white transition-colors"
                            >
                              {retailer.retailer.charAt(0).toUpperCase() +
                                retailer.retailer.slice(1)}{" "}
                              - {formatPrice(retailer.price)}
                            </a>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Your System is Already Great!
                  </h3>
                  <p className="text-[var(--muted)]">
                    Based on your current parts and budget, we don&apos;t have any
                    significant upgrade recommendations. Your system is already
                    well-optimized for gaming!
                  </p>
                </div>
              )}
            </div>
          )}
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
