import type { EnrichedBuild, Component } from "./types";
import { getLowestPrice } from "./data";

interface JsonLdProduct {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  brand?: {
    "@type": string;
    name: string;
  };
  offers?: {
    "@type": string;
    priceCurrency: string;
    price: number;
    availability: string;
    url?: string;
  } | {
    "@type": string;
    lowPrice: number;
    highPrice: number;
    priceCurrency: string;
    offerCount: number;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  hasPart?: JsonLdProduct[];
}

/**
 * Generate JSON-LD structured data for a build (for AI agents and SEO)
 */
export function generateBuildJsonLd(build: EnrichedBuild): JsonLdProduct {
  const componentProducts: JsonLdProduct[] = build.components.map((component) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: component.name,
    description: `${component.brand} ${component.model} - ${component.category.toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: component.brand,
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: getLowestPrice(component),
      highPrice: Math.max(...component.retailers.map((r) => r.price)),
      priceCurrency: "USD",
      offerCount: component.retailers.length,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: component.trustScore,
      bestRating: 100,
      worstRating: 0,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${build.name} Gaming PC Build`,
    description: build.description,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: build.lowestTotalPrice,
      highPrice: build.priceRange.max,
      priceCurrency: "USD",
      offerCount: build.components.length,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: build.trustScore,
      bestRating: 100,
      worstRating: 0,
    },
    hasPart: componentProducts,
  };
}

/**
 * Generate JSON-LD for a single component
 */
export function generateComponentJsonLd(component: Component): JsonLdProduct {
  const lowestPrice = getLowestPrice(component);
  const inStockRetailer = component.retailers.find((r) => r.inStock);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: component.name,
    description: Object.entries(component.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", "),
    brand: {
      "@type": "Brand",
      name: component.brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: lowestPrice,
      availability: inStockRetailer
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: inStockRetailer?.url,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: component.trustScore,
      bestRating: 100,
      worstRating: 0,
    },
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebSite structured data for homepage
 */
export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TrustBuilds.gg",
    description:
      "Curated gaming PC builds with reliability data. See brand failure rates, warranty quality, and buy with confidence.",
    url: "https://trustbuilds.gg",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://trustbuilds.gg/builds/{search_term}",
      "query-input": "required name=search_term",
    },
  };
}
