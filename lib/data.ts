import type {
  Build,
  Component,
  RetailerInfo,
  EnrichedBuild,
} from "./types";
import buildsData from "@/data/builds.json";
import retailersData from "@/data/retailers.json";
import { getAllParts, getPartById } from "./partsLoader";

// Type assertions for JSON imports
const builds = buildsData as unknown as Build[];
const retailers = retailersData as unknown as RetailerInfo[];

/**
 * Get all builds
 */
export function getAllBuilds(): Build[] {
  return builds;
}

/**
 * Get a build by slug
 */
export function getBuildBySlug(slug: string): Build | undefined {
  return builds.find((b) => b.slug === slug);
}

/**
 * Get all components (from expanded parts database)
 */
export function getAllComponents(): Component[] {
  return getAllParts();
}

/**
 * Get a component by ID
 */
export function getComponentById(id: string): Component | undefined {
  return getPartById(id);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(
  category: Component["category"]
): Component[] {
  return getAllParts().filter((c) => c.category === category);
}

/**
 * Get alternative components for a given component
 */
export function getAlternatives(componentId: string): Component[] {
  const component = getComponentById(componentId);
  if (!component) return [];

  return component.alternativeIds
    .map((id) => getComponentById(id))
    .filter((c): c is Component => c !== undefined);
}

/**
 * Get lowest price for a component across all retailers
 */
export function getLowestPrice(component: Component): number {
  const inStockPrices = component.retailers
    .filter((r) => r.inStock)
    .map((r) => r.price);

  if (inStockPrices.length === 0) {
    // Return lowest price even if OOS
    return Math.min(...component.retailers.map((r) => r.price));
  }

  return Math.min(...inStockPrices);
}

/**
 * Calculate total price for a build using lowest prices
 */
export function calculateBuildPrice(componentIds: string[]): number {
  return componentIds.reduce((total, id) => {
    const component = getComponentById(id);
    if (!component) return total;
    return total + getLowestPrice(component);
  }, 0);
}

/**
 * Get enriched build with resolved components
 */
export function getEnrichedBuild(slug: string): EnrichedBuild | undefined {
  const build = getBuildBySlug(slug);
  if (!build) return undefined;

  const resolvedComponents = build.componentIds
    .map((id) => getComponentById(id))
    .filter((c): c is Component => c !== undefined);

  const lowestTotalPrice = resolvedComponents.reduce(
    (sum, c) => sum + getLowestPrice(c),
    0
  );

  // Use average of min and max for display total
  const totalPrice = Math.round((build.priceRange.min + build.priceRange.max) / 2);

  return {
    ...build,
    components: resolvedComponents,
    totalPrice,
    lowestTotalPrice,
  };
}

/**
 * Get all enriched builds
 */
export function getAllEnrichedBuilds(): EnrichedBuild[] {
  return builds
    .map((b) => getEnrichedBuild(b.slug))
    .filter((b): b is EnrichedBuild => b !== undefined);
}

/**
 * Get retailer info by ID
 */
export function getRetailerById(id: string): RetailerInfo | undefined {
  return retailers.find((r) => r.id === id);
}

/**
 * Get all retailers
 */
export function getAllRetailers(): RetailerInfo[] {
  return retailers;
}

/**
 * Check if any component in a build is out of stock
 */
export function hasBuildOosComponents(build: Build): boolean {
  return build.componentIds.some((id) => {
    const component = getComponentById(id);
    if (!component) return false;
    return !component.retailers.some((r) => r.inStock);
  });
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
