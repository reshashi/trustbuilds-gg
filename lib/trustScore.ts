import type { TrustFactors, Component } from "./types";

/**
 * Calculate trust score for a component based on its trust factors.
 *
 * Formula:
 * Trust Score = (100 - FailureRate*10) * 0.4
 *             + (WarrantyYears/5 * 100) * 0.3
 *             + BrandReputation * 0.2
 *             + RMArating * 20 * 0.1
 */
export function calculateTrustScore(factors: TrustFactors): number {
  const failureComponent = (100 - factors.failureRate * 10) * 0.4;
  const warrantyComponent = (Math.min(factors.warrantyYears, 5) / 5) * 100 * 0.3;
  const reputationComponent = factors.brandReputation * 0.2;
  const rmaComponent = factors.rmaRating * 20 * 0.1;

  const score = failureComponent + warrantyComponent + reputationComponent + rmaComponent;

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate aggregate trust score for a build (average of all components)
 */
export function calculateBuildTrustScore(components: Component[]): number {
  if (components.length === 0) return 0;

  const totalScore = components.reduce((sum, comp) => sum + comp.trustScore, 0);
  return Math.round(totalScore / components.length);
}

/**
 * Get trust score rating label
 */
export function getTrustLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Below Average";
}

/**
 * Get trust score color class for Tailwind
 */
export function getTrustColorClass(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 80) return "text-green-500";
  if (score >= 70) return "text-yellow-400";
  if (score >= 60) return "text-orange-400";
  return "text-red-400";
}

/**
 * Get trust score background color class for Tailwind
 */
export function getTrustBgClass(score: number): string {
  if (score >= 90) return "bg-green-400/20";
  if (score >= 80) return "bg-green-500/20";
  if (score >= 70) return "bg-yellow-400/20";
  if (score >= 60) return "bg-orange-400/20";
  return "bg-red-400/20";
}

/**
 * Format failure rate for display
 */
export function formatFailureRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * Format warranty years for display
 */
export function formatWarranty(years: number): string {
  if (years === 1) return "1 year";
  return `${years} years`;
}

/**
 * Format RMA rating for display
 */
export function formatRmaRating(rating: number): string {
  return `${rating.toFixed(1)}/5`;
}
