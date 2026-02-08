import { getComponentById, getLowestPrice, formatPrice } from "@/lib/data";
import TrustScore from "./TrustScore";

interface AlternativesListProps {
  alternativeIds: string[];
}

export default function AlternativesList({
  alternativeIds,
}: AlternativesListProps) {
  const alternatives = alternativeIds
    .map((id) => getComponentById(id))
    .filter((c) => c !== undefined);

  if (alternatives.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {alternatives.map((alt) => {
        const price = getLowestPrice(alt);
        const hasStock = alt.retailers.some((r) => r.inStock);

        return (
          <div
            key={alt.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
              hasStock
                ? "border-[var(--card-border)] bg-[var(--background)]"
                : "border-red-500/30 bg-red-500/5"
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {alt.brand} {alt.model.split(" ").slice(0, 2).join(" ")}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[var(--muted)]">
                  {formatPrice(price)}
                </span>
                {!hasStock && (
                  <span className="text-xs text-red-400">OOS</span>
                )}
              </div>
            </div>
            <TrustScore score={alt.trustScore} size="sm" />
          </div>
        );
      })}
    </div>
  );
}
