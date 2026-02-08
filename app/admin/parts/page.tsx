"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustScore from "@/components/TrustScore";
import { getAllParts } from "@/lib/partsLoader";
import { getLowestPrice, formatPrice } from "@/lib/data";
import type { Component } from "@/lib/types";

const allComponents = getAllParts();

const categoryLabels: Record<string, string> = {
  cpu: "CPU",
  gpu: "Graphics Card",
  motherboard: "Motherboard",
  ram: "Memory",
  storage: "Storage",
  psu: "Power Supply",
  case: "Case",
  cooler: "CPU Cooler",
  monitor: "Monitor",
  keyboard: "Keyboard",
  mouse: "Mouse",
  headset: "Headset",
};

const categoryOrder = [
  "cpu", "gpu", "motherboard", "ram", "storage", "psu",
  "case", "cooler", "monitor", "keyboard", "mouse", "headset",
];

export default function AdminPartsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "trust">("name");
  const [showAddForm, setShowAddForm] = useState(false);

  // New part form state
  const [newPart, setNewPart] = useState({
    category: "cpu",
    name: "",
    brand: "",
    model: "",
    trustScore: 85,
  });

  const filteredComponents = useMemo(() => {
    let components = allComponents;

    if (selectedCategory !== "all") {
      components = components.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      components = components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    components = [...components].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return getLowestPrice(a) - getLowestPrice(b);
        case "trust":
          return b.trustScore - a.trustScore;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return components;
  }, [selectedCategory, searchQuery, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allComponents.length };
    for (const c of allComponents) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, []);

  const handleExportJSON = () => {
    const json = JSON.stringify(filteredComponents, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parts-${selectedCategory}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPartTemplate = () => {
    const template = {
      id: `${newPart.category}-${newPart.brand.toLowerCase().replace(/\s+/g, "-")}-${newPart.model.toLowerCase().replace(/\s+/g, "-")}`,
      category: newPart.category,
      name: newPart.name || `${newPart.brand} ${newPart.model}`,
      brand: newPart.brand,
      model: newPart.model,
      specs: {},
      trustScore: newPart.trustScore,
      trustFactors: {
        failureRate: 1.0,
        warrantyYears: 3,
        brandReputation: 85,
        rmaRating: 4.0,
      },
      retailers: [
        {
          retailer: "amazon",
          price: 0,
          inStock: true,
          url: "https://amazon.com/dp/PLACEHOLDER",
          lastUpdated: new Date().toISOString().slice(0, 10),
        },
      ],
      alternativeIds: [],
    };
    navigator.clipboard.writeText(JSON.stringify(template, null, 2));
    alert("Part template copied to clipboard! Paste into the appropriate data/parts/*.json file.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Parts Database
              </h1>
              <p className="text-[var(--muted)]">
                {allComponents.length} components across {categoryOrder.length} categories
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-medium hover:bg-[var(--accent-light)] transition-colors"
              >
                + Add Part
              </button>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--muted)] hover:text-white hover:border-white/30 transition-colors"
              >
                Export JSON
              </button>
            </div>
          </div>

          {/* Add Part Form */}
          {showAddForm && (
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--card-bg)] p-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Add New Part</h2>
              <p className="text-sm text-[var(--muted)] mb-4">
                Fill in the basics and we&apos;ll generate a JSON template you can paste into the data files.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Category</label>
                  <select
                    value={newPart.category}
                    onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
                  >
                    {categoryOrder.map((cat) => (
                      <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Brand</label>
                  <input
                    type="text"
                    value={newPart.brand}
                    onChange={(e) => setNewPart({ ...newPart, brand: e.target.value })}
                    placeholder="e.g. NVIDIA, AMD, Corsair"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm placeholder:text-[var(--muted)]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Model</label>
                  <input
                    type="text"
                    value={newPart.model}
                    onChange={(e) => setNewPart({ ...newPart, model: e.target.value })}
                    placeholder="e.g. RTX 5090, Ryzen 9 9950X"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm placeholder:text-[var(--muted)]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Trust Score</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newPart.trustScore}
                    onChange={(e) => setNewPart({ ...newPart, trustScore: parseInt(e.target.value) || 85 })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleCopyPartTemplate}
                disabled={!newPart.brand || !newPart.model}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  newPart.brand && newPart.model
                    ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-light)]"
                    : "bg-[var(--card-border)] text-[var(--muted)] cursor-not-allowed"
                }`}
              >
                Copy JSON Template to Clipboard
              </button>
              <p className="text-xs text-[var(--muted)] mt-2">
                After copying, paste the template into <code className="text-white">data/parts/{newPart.category === "mouse" ? "mice" : newPart.category + "s"}.json</code> and fill in specs, retailers, and pricing.
              </p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parts by name, model, brand..."
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price" | "trust")}
              className="px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="trust">Sort by Trust Score</option>
            </select>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-[var(--accent)] text-black"
                  : "bg-[var(--background)] text-[var(--muted)] hover:text-white"
              }`}
            >
              All ({categoryCounts["all"] || 0})
            </button>
            {categoryOrder.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-[var(--accent)] text-black"
                    : "bg-[var(--background)] text-[var(--muted)] hover:text-white"
                }`}
              >
                {categoryLabels[cat]} ({categoryCounts[cat] || 0})
              </button>
            ))}
          </div>

          {/* Parts Table */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-[var(--background)] text-xs text-[var(--muted)] uppercase tracking-wide font-medium">
              <div className="col-span-1">Category</div>
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1">Trust</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Retailers</div>
            </div>

            {/* Rows */}
            {filteredComponents.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)]">
                No parts found matching your search.
              </div>
            ) : (
              filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-3 border-t border-[var(--card-border)] hover:bg-[var(--background)]/50 transition-colors items-center"
                >
                  <div className="col-span-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--background)] text-[var(--muted)]">
                      {categoryLabels[component.category] || component.category}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <div className="font-medium text-white text-sm break-words">
                      {component.name}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {component.id}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-[var(--muted)]">
                    {component.brand}
                  </div>
                  <div className="col-span-1">
                    <TrustScore score={component.trustScore} size="sm" />
                  </div>
                  <div className="col-span-2 text-sm font-medium text-white">
                    {formatPrice(getLowestPrice(component))}
                  </div>
                  <div className="col-span-2 text-xs text-[var(--muted)]">
                    {component.retailers.filter((r) => r.inStock).length}/
                    {component.retailers.length} in stock
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 text-sm text-[var(--muted)] text-center">
            Showing {filteredComponents.length} of {allComponents.length} parts
          </div>
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
            Back to Home
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
