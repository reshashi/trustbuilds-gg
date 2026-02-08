"use client";

import type { Component } from "@/lib/types";
import { getLowestPrice, formatPrice } from "@/lib/data";

interface AffiliateButtonProps {
  component: Component;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export default function AffiliateButton({
  component,
  variant = "primary",
  fullWidth = false,
}: AffiliateButtonProps) {
  const inStockRetailer = component.retailers.find((r) => r.inStock);
  const lowestPrice = getLowestPrice(component);

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200";

  const variantClasses = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] shadow-lg shadow-[var(--accent)]/25",
    secondary:
      "bg-[var(--card-bg)] text-white border border-[var(--card-border)] hover:border-[var(--accent)]",
  };

  const sizeClasses = fullWidth ? "w-full px-6 py-3" : "px-4 py-2 text-sm";

  if (!inStockRetailer) {
    return (
      <button
        disabled
        className={`${baseClasses} ${sizeClasses} bg-[var(--card-bg)] text-[var(--muted)] cursor-not-allowed opacity-50`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <a
      href={inStockRetailer.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}
    >
      <span>Buy for {formatPrice(lowestPrice)}</span>
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
          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </a>
  );
}

interface BuyAllButtonProps {
  components: Component[];
  totalPrice: number;
}

export function BuyAllButton({ components, totalPrice }: BuyAllButtonProps) {
  // For now, link to first component's best retailer
  // In production, this would create a shopping cart or open multiple tabs
  const allInStock = components.every((c) =>
    c.retailers.some((r) => r.inStock)
  );

  const handleBuyAll = () => {
    // Open each component's best price in a new tab
    components.forEach((component) => {
      const inStockRetailer = component.retailers
        .filter((r) => r.inStock)
        .sort((a, b) => a.price - b.price)[0];

      if (inStockRetailer) {
        window.open(inStockRetailer.url, "_blank");
      }
    });
  };

  if (!allInStock) {
    return (
      <button
        disabled
        className="w-full px-6 py-4 rounded-xl bg-[var(--card-bg)] text-[var(--muted)] cursor-not-allowed opacity-50 text-lg font-semibold"
      >
        Some Components Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleBuyAll}
      className="w-full px-6 py-4 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] transition-all duration-200 shadow-lg shadow-[var(--accent)]/25 text-lg font-semibold flex items-center justify-center gap-3"
    >
      <span>Buy All Components • {formatPrice(totalPrice)}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
    </button>
  );
}
