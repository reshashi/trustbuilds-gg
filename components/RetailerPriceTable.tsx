import type { RetailerPrice, Retailer } from "@/lib/types";
import { formatPrice } from "@/lib/data";

interface RetailerPriceTableProps {
  retailers: RetailerPrice[];
}

const retailerDisplayNames: Record<Retailer, string> = {
  amazon: "Amazon",
  newegg: "Newegg",
  bhphoto: "B&H Photo",
  bestbuy: "Best Buy",
  microcenter: "Micro Center",
};

export default function RetailerPriceTable({
  retailers,
}: RetailerPriceTableProps) {
  // Sort by price, in-stock first
  const sortedRetailers = [...retailers].sort((a, b) => {
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;
    return a.price - b.price;
  });

  const lowestInStockPrice = sortedRetailers.find((r) => r.inStock)?.price;

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--card-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--background)]">
            <th className="text-left px-3 py-2 text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Retailer
            </th>
            <th className="text-right px-3 py-2 text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Price
            </th>
            <th className="text-center px-3 py-2 text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Status
            </th>
            <th className="text-right px-3 py-2 text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--card-border)]">
          {sortedRetailers.map((retailer) => {
            const isLowest =
              retailer.inStock && retailer.price === lowestInStockPrice;

            return (
              <tr
                key={retailer.retailer}
                className={`${
                  retailer.inStock
                    ? "bg-[var(--card-bg)]"
                    : "bg-[var(--card-bg)]/50"
                }`}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        retailer.inStock ? "text-white" : "text-[var(--muted)]"
                      }`}
                    >
                      {retailerDisplayNames[retailer.retailer]}
                    </span>
                    {isLowest && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                        Best
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <span
                    className={`font-semibold ${
                      isLowest
                        ? "text-green-400"
                        : retailer.inStock
                        ? "text-white"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {formatPrice(retailer.price)}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  {retailer.inStock ? (
                    <span className="text-xs text-green-400">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-400">Out of Stock</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <a
                    href={retailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
                      retailer.inStock
                        ? "text-[var(--accent)] hover:text-[var(--accent-light)]"
                        : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    {retailer.inStock ? "Buy" : "View"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
