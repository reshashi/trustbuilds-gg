import type { Component } from "@/lib/types";
import { formatPrice, getLowestPrice } from "@/lib/data";
import TrustScore from "./TrustScore";
import RetailerPriceTable from "./RetailerPriceTable";
import AlternativesList from "./AlternativesList";

interface ComponentListProps {
  components: Component[];
  showDetails?: boolean;
}

const categoryLabels: Record<Component["category"], string> = {
  cpu: "CPU",
  gpu: "Graphics Card",
  motherboard: "Motherboard",
  ram: "Memory",
  storage: "Storage",
  psu: "Power Supply",
  case: "Case",
  cooler: "CPU Cooler",
};

const categoryIcons: Record<Component["category"], string> = {
  cpu: "🔲",
  gpu: "🎮",
  motherboard: "📋",
  ram: "💾",
  storage: "💿",
  psu: "⚡",
  case: "🖥️",
  cooler: "❄️",
};

interface ComponentRowProps {
  component: Component;
  showDetails?: boolean;
}

function ComponentRow({ component, showDetails = false }: ComponentRowProps) {
  const lowestPrice = getLowestPrice(component);
  const hasOos = !component.retailers.some((r) => r.inStock);

  return (
    <div className="border-b border-[var(--card-border)] last:border-b-0">
      <div className="flex items-start gap-4 p-4">
        {/* Category Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--background)] flex items-center justify-center text-lg">
          {categoryIcons[component.category]}
        </div>

        {/* Component Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-0.5">
                {categoryLabels[component.category]}
              </div>
              <h4 className="font-semibold text-white break-words">
                {component.name}
              </h4>
              {hasOos && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">
                  Check Availability
                </span>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-4">
              <TrustScore score={component.trustScore} size="sm" />
              <div className="text-right">
                <div className="font-semibold text-white">
                  {formatPrice(lowestPrice)}
                </div>
                <div className="text-xs text-[var(--muted)]">lowest price</div>
              </div>
            </div>
          </div>

          {/* Specs Preview (collapsed view) */}
          {!showDetails && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(component.specs)
                .slice(0, 4)
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="text-xs text-[var(--muted)] bg-[var(--background)] px-2 py-0.5 rounded"
                  >
                    {String(value)}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-4 pb-4 pt-0 space-y-4">
          {/* Specs Grid */}
          <div className="ml-14">
            <h5 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
              Specifications
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(component.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="text-xs bg-[var(--background)] px-2 py-1.5 rounded"
                >
                  <span className="text-[var(--muted)] capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>{" "}
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Breakdown */}
          <div className="ml-14">
            <h5 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
              Trust Factors
            </h5>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-xs bg-[var(--background)] px-2 py-1.5 rounded">
                <span className="text-[var(--muted)]">Failure Rate:</span>{" "}
                <span className="text-white">{component.trustFactors.failureRate}%</span>
              </div>
              <div className="text-xs bg-[var(--background)] px-2 py-1.5 rounded">
                <span className="text-[var(--muted)]">Warranty:</span>{" "}
                <span className="text-white">{component.trustFactors.warrantyYears}yr</span>
              </div>
              <div className="text-xs bg-[var(--background)] px-2 py-1.5 rounded">
                <span className="text-[var(--muted)]">Brand Rep:</span>{" "}
                <span className="text-white">{component.trustFactors.brandReputation}/100</span>
              </div>
              <div className="text-xs bg-[var(--background)] px-2 py-1.5 rounded">
                <span className="text-[var(--muted)]">RMA:</span>{" "}
                <span className="text-white">{component.trustFactors.rmaRating}/5</span>
              </div>
            </div>
          </div>

          {/* Retailer Prices */}
          <div className="ml-14">
            <h5 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
              Compare Prices
            </h5>
            <RetailerPriceTable retailers={component.retailers} />
          </div>

          {/* Alternatives */}
          {component.alternativeIds.length > 0 && (
            <div className="ml-14">
              <h5 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
                Alternatives
              </h5>
              <AlternativesList alternativeIds={component.alternativeIds} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ComponentList({
  components,
  showDetails = false,
}: ComponentListProps) {
  // Sort components by category order
  const categoryOrder: Component["category"][] = [
    "cpu",
    "gpu",
    "motherboard",
    "ram",
    "storage",
    "psu",
    "case",
    "cooler",
  ];

  const sortedComponents = [...components].sort(
    (a, b) =>
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  );

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
      {sortedComponents.map((component) => (
        <ComponentRow
          key={component.id}
          component={component}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
}
