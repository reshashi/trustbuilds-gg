"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustScore from "@/components/TrustScore";
import { getAllParts } from "@/lib/partsLoader";
import { getLowestPrice, formatPrice } from "@/lib/data";
import type { Component } from "@/lib/types";

const allComponents = getAllParts();

const componentsByCategory = allComponents.reduce((acc, component) => {
  if (!acc[component.category]) {
    acc[component.category] = [];
  }
  acc[component.category].push(component);
  return acc;
}, {} as Record<string, Component[]>);

const categoryLabels: Record<string, string> = {
  cpu: "CPU",
  gpu: "Graphics Card",
  motherboard: "Motherboard",
  ram: "RAM",
  storage: "Storage",
  psu: "Power Supply",
  case: "Case",
  cooler: "CPU Cooler",
  monitor: "Monitor",
  keyboard: "Keyboard",
  mouse: "Mouse",
  headset: "Headset",
};

const categoryPlaceholders: Record<string, string> = {
  cpu: "e.g. Ryzen 5 7600, i5-14400F...",
  gpu: "e.g. RTX 4070, RX 7800 XT...",
  motherboard: "e.g. B650 Tomahawk, X670E...",
  ram: "e.g. 32GB DDR5-6000...",
  storage: "e.g. Samsung 980 Pro 1TB...",
  psu: "e.g. Corsair RM750x...",
  case: "e.g. Corsair 4000D, Fractal North...",
  cooler: "e.g. Noctua NH-D15, AIO 360...",
  monitor: "e.g. LG 27GP850, Samsung G7...",
  keyboard: "e.g. Wooting 60HE, Corsair K70...",
  mouse: "e.g. Logitech G Pro X Superlight...",
  headset: "e.g. HyperX Cloud III, Arctis Nova...",
};

const categoryOrder = ["cpu", "gpu", "motherboard", "ram", "storage", "psu", "case", "cooler", "monitor", "keyboard", "mouse", "headset"];

// --- Autocomplete Component ---

interface PartSelection {
  componentId: string | null; // null = custom text entry
  displayText: string;
}

function AutocompleteInput({
  category,
  value,
  onChange,
}: {
  category: string;
  value: PartSelection;
  onChange: (selection: PartSelection) => void;
}) {
  const [query, setQuery] = useState(value.displayText);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryComponents = componentsByCategory[category] || [];

  const filtered = query.trim()
    ? categoryComponents.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.model.toLowerCase().includes(query.toLowerCase()) ||
        c.brand.toLowerCase().includes(query.toLowerCase())
      )
    : categoryComponents;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectComponent = useCallback((component: Component) => {
    setQuery(component.name);
    onChange({ componentId: component.id, displayText: component.name });
    setIsOpen(false);
    setHighlightIndex(-1);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setHighlightIndex(-1);
    // If text doesn't match any component exactly, treat as custom
    const exact = categoryComponents.find(
      (c) => c.name.toLowerCase() === val.toLowerCase()
    );
    if (exact) {
      onChange({ componentId: exact.id, displayText: exact.name });
    } else {
      onChange({ componentId: null, displayText: val });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filtered.length) {
        selectComponent(filtered[highlightIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    setQuery("");
    onChange({ componentId: null, displayText: "" });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={categoryPlaceholders[category]}
          className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent)] pr-10 transition-colors"
        />
        {query && (
          <button
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white transition-colors"
            aria-label="Clear"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl">
          {filtered.map((component, index) => (
            <button
              key={component.id}
              onClick={() => selectComponent(component)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                index === highlightIndex
                  ? "bg-[var(--accent)]/10 text-white"
                  : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-white"
              } ${index > 0 ? "border-t border-[var(--card-border)]" : ""}`}
            >
              <div className="min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  {component.name}
                </div>
                <div className="text-xs text-[var(--muted)] truncate">
                  {Object.entries(component.specs)
                    .slice(0, 3)
                    .map(([, v]) => String(v))
                    .join(" · ")}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <TrustScore score={component.trustScore} size="sm" />
                <span className="text-xs text-[var(--muted)]">
                  {formatPrice(getLowestPrice(component))}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected indicator */}
      {value.componentId && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-green-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-green-400">Matched</span>
        </div>
      )}
      {!value.componentId && value.displayText && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-xs text-yellow-400">Custom part — we&apos;ll suggest the best upgrade</span>
        </div>
      )}
    </div>
  );
}

// --- Analysis Logic ---

interface UpgradeRecommendation {
  category: string;
  currentComponent: Component | null;
  currentCustomName: string | null;
  recommendedComponent: Component;
  reason: string;
  priority: "high" | "medium" | "low";
  performanceGain: string;
  price: number;
}

function analyzeUpgrades(
  parts: Record<string, PartSelection>,
  budget: number
): UpgradeRecommendation[] {
  const recommendations: UpgradeRecommendation[] = [];

  const filledCategories = categoryOrder.filter(
    (cat) => parts[cat] && parts[cat].displayText.trim() !== ""
  );

  if (filledCategories.length === 0) return [];

  for (const category of filledCategories) {
    const selection = parts[category];
    const currentComponent = selection.componentId
      ? allComponents.find((c) => c.id === selection.componentId) || null
      : null;

    const categoryParts = componentsByCategory[category] || [];
    if (categoryParts.length === 0) continue;

    let upgrades: Component[];

    if (currentComponent) {
      // Known component: find strictly better ones
      upgrades = categoryParts
        .filter((c) => c.id !== currentComponent.id)
        .filter((c) => c.trustScore > currentComponent.trustScore)
        .filter((c) => getLowestPrice(c) <= budget)
        .sort((a, b) => b.trustScore - a.trustScore);
    } else {
      // Custom / unknown component: recommend the best one in the category that fits budget
      upgrades = categoryParts
        .filter((c) => getLowestPrice(c) <= budget)
        .sort((a, b) => b.trustScore - a.trustScore);
    }

    if (upgrades.length === 0) continue;

    const recommended = upgrades[0];
    const price = getLowestPrice(recommended);

    let priority: "high" | "medium" | "low" = "medium";
    let reason = "";
    let performanceGain = "";

    switch (category) {
      case "gpu":
        priority = "high";
        reason = currentComponent
          ? `Upgrade from ${currentComponent.model} to ${recommended.model} for significantly better gaming performance and ray tracing.`
          : `The ${recommended.model} is the best GPU we recommend within your budget. Major gaming performance boost.`;
        performanceGain = currentComponent
          ? `${recommended.specs.vram} VRAM`
          : `${recommended.specs.vram} VRAM, ${recommended.specs.boostClock} boost`;
        break;
      case "cpu":
        priority = currentComponent && currentComponent.trustScore < 85 ? "high" : "medium";
        reason = currentComponent
          ? `Upgrade to ${recommended.model} for better multi-threaded performance and gaming.`
          : `The ${recommended.model} offers excellent gaming and productivity performance.`;
        performanceGain = `${recommended.specs.cores} cores, ${recommended.specs.boostClock}`;
        break;
      case "ram":
        priority = "low";
        reason = `Faster RAM improves gaming performance, especially with AMD CPUs.`;
        performanceGain = `${recommended.specs.capacity} ${recommended.specs.speed}`;
        break;
      case "storage":
        priority = "low";
        reason = `Faster NVMe SSD for quicker game load times and system responsiveness.`;
        performanceGain = `${recommended.specs.capacity}, ${recommended.specs.readSpeed} read`;
        break;
      case "psu":
        priority = "medium";
        reason = currentComponent
          ? `More headroom for upgrades and better efficiency with ${recommended.specs.efficiency}.`
          : `The ${recommended.model} provides reliable, efficient power for your system.`;
        performanceGain = `${recommended.specs.wattage}W ${recommended.specs.efficiency}`;
        break;
      case "case":
        priority = "low";
        reason = `Better airflow and build quality for cooler, quieter operation.`;
        performanceGain = `${recommended.specs.gpuClearance} GPU clearance`;
        break;
      case "cooler":
        priority = "medium";
        reason = currentComponent
          ? `Better cooling for lower temps and quieter operation under load.`
          : `The ${recommended.model} keeps your CPU cool and quiet.`;
        performanceGain = `${recommended.specs.type}, ${recommended.specs.tdpRating} TDP`;
        break;
      case "motherboard":
        priority = "low";
        reason = currentComponent
          ? `Better VRM, more features, and improved connectivity.`
          : `The ${recommended.model} offers great features and reliability for your build.`;
        performanceGain = `${recommended.specs.socket}, ${recommended.specs.wifi}`;
        break;
      case "monitor":
        priority = "high";
        reason = currentComponent
          ? `Upgrade to ${recommended.model} for a better display experience with higher refresh rate and better colors.`
          : `The ${recommended.model} delivers stunning visuals to match your gaming rig.`;
        performanceGain = `${recommended.specs.resolution} ${recommended.specs.refreshRate} ${recommended.specs.panelType}`;
        break;
      case "keyboard":
        priority = "medium";
        reason = currentComponent
          ? `Upgrade to ${recommended.model} for faster switches and better build quality.`
          : `The ${recommended.model} is a top-tier gaming keyboard for competitive play.`;
        performanceGain = `${recommended.specs.switches}, ${recommended.specs.size}`;
        break;
      case "mouse":
        priority = "medium";
        reason = currentComponent
          ? `Upgrade to ${recommended.model} for better sensor accuracy and lower weight.`
          : `The ${recommended.model} gives you competitive precision and comfort.`;
        performanceGain = `${recommended.specs.weight}, ${recommended.specs.connection}`;
        break;
      case "headset":
        priority = "low";
        reason = currentComponent
          ? `Upgrade to ${recommended.model} for better audio quality and comfort.`
          : `The ${recommended.model} delivers immersive audio for gaming.`;
        performanceGain = `${recommended.specs.driver} driver, ${recommended.specs.connection}`;
        break;
    }

    recommendations.push({
      category,
      currentComponent,
      currentCustomName: !currentComponent ? selection.displayText : null,
      recommendedComponent: recommended,
      reason,
      priority,
      performanceGain,
      price,
    });
  }

  // Sort by priority (high first)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Filter to fit within total budget
  let runningTotal = 0;
  const affordable: UpgradeRecommendation[] = [];
  for (const rec of recommendations) {
    if (runningTotal + rec.price <= budget) {
      affordable.push(rec);
      runningTotal += rec.price;
    }
  }

  return affordable;
}

// --- Page Component ---

export default function UpgradeAdvisorPage() {
  const [parts, setParts] = useState<Record<string, PartSelection>>({});
  const [budget, setBudget] = useState<number>(500);
  const [budgetInput, setBudgetInput] = useState<string>("500");
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<UpgradeRecommendation[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePartChange = (category: string, selection: PartSelection) => {
    setParts((prev) => ({ ...prev, [category]: selection }));
    // Reset results when parts change
    if (showResults) setShowResults(false);
  };

  const selectedPartsCount = Object.values(parts).filter(
    (p) => p && p.displayText.trim() !== ""
  ).length;

  const handleAnalyze = () => {
    const results = analyzeUpgrades(parts, budget);
    setRecommendations(results);
    setShowResults(true);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const totalCost = recommendations.reduce((sum, r) => sum + r.price, 0);

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Upgrade Advisor
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Type in your current parts and budget. We&apos;ll tell you exactly what to upgrade for the biggest performance gain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Parts Input - 2 columns */}
            <div className="lg:col-span-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Your Current Parts
              </h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                Start typing to search. If your exact part isn&apos;t listed, just type its name.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {categoryOrder.map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">
                      {categoryLabels[category]}
                    </label>
                    <AutocompleteInput
                      category={category}
                      value={parts[category] || { componentId: null, displayText: "" }}
                      onChange={(sel) => handlePartChange(category, sel)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Budget & Analyze - 1 column */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Upgrade Budget
                </h2>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl text-[var(--muted)]">$</span>
                  <input
                    type="text"
                    value={budgetInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setBudgetInput(val);
                      if (val) setBudget(parseInt(val, 10));
                    }}
                    onBlur={() => {
                      const val = Math.min(Math.max(parseInt(budgetInput, 10) || 100, 100), 5000);
                      setBudget(val);
                      setBudgetInput(val.toString());
                    }}
                    className="flex-1 text-3xl font-bold text-white bg-transparent border-none outline-none"
                    placeholder="500"
                  />
                </div>

                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={Math.min(budget, 3000)}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setBudget(value);
                    setBudgetInput(value.toString());
                  }}
                  className="w-full h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                  <span>$100</span>
                  <span>$3,000</span>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={selectedPartsCount === 0}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  selectedPartsCount > 0
                    ? "bg-[var(--accent)] hover:bg-[var(--accent-light)] text-black cursor-pointer active:scale-[0.98]"
                    : "bg-[var(--card-border)] text-[var(--muted)] cursor-not-allowed"
                }`}
              >
                {selectedPartsCount > 0
                  ? `Analyze ${selectedPartsCount} Part${selectedPartsCount > 1 ? "s" : ""}`
                  : "Enter Your Parts Above"}
              </button>

              {selectedPartsCount > 0 && !showResults && (
                <p className="text-xs text-center text-[var(--muted)]">
                  {selectedPartsCount} part{selectedPartsCount > 1 ? "s" : ""} entered
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div ref={resultsRef} className="max-w-4xl mx-auto mt-12 scroll-mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Upgrade Recommendations
                </h2>
                {recommendations.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-[var(--muted)]">Total Cost</div>
                    <div className="text-xl font-bold text-white">
                      {formatPrice(totalCost)}
                      <span className="text-sm font-normal text-[var(--muted)] ml-2">
                        / {formatPrice(budget)} budget
                      </span>
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

                      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-3">
                        <span>Replacing:</span>
                        <span className="text-white">
                          {rec.currentComponent
                            ? rec.currentComponent.name
                            : rec.currentCustomName || "Current part"}
                        </span>
                        <span className="text-[var(--accent)]">→</span>
                        <span className="text-green-400">{rec.performanceGain}</span>
                      </div>

                      <p className="text-[var(--muted)]">{rec.reason}</p>

                      {/* Buy Links */}
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
                  <div className="text-5xl mb-4">&#x1f4aa;</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Upgrades Fit Your Budget
                  </h3>
                  <p className="text-[var(--muted)]">
                    Your current parts are already top-tier, or upgrades exceed your budget.
                    Try increasing your budget to see recommendations.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Back */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to All Builds
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
