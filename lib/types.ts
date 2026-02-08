// Retailer types
export type Retailer =
  | "amazon"
  | "newegg"
  | "bhphoto"
  | "bestbuy"
  | "microcenter";

export interface RetailerPrice {
  retailer: Retailer;
  price: number;
  inStock: boolean;
  url: string;
  lastUpdated: string;
}

// Component types
export type ComponentCategory =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "cooler"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "headset";

export interface TrustFactors {
  failureRate: number; // percentage (0-100)
  warrantyYears: number;
  brandReputation: number; // 1-100
  rmaRating: number; // 1-5
}

export interface Component {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  model: string;
  specs: Record<string, string | number | boolean>;
  trustScore: number;
  trustFactors: TrustFactors;
  retailers: RetailerPrice[];
  alternativeIds: string[];
  imageUrl?: string;
}

// Build types
export type TargetResolution = "1080p" | "1440p" | "4K";

export interface PriceRange {
  min: number;
  max: number;
}

export interface Build {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetResolution: TargetResolution;
  targetFps: number;
  priceRange: PriceRange;
  trustScore: number;
  componentIds: string[];
  lastUpdated: string;
  imageUrl?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  useCase: string;
}

// Enriched types for display (components resolved)
export interface EnrichedBuild extends Omit<Build, "componentIds"> {
  components: Component[];
  totalPrice: number;
  lowestTotalPrice: number;
}

// Retailer info
export interface RetailerInfo {
  id: Retailer;
  name: string;
  logo: string;
  affiliateBaseUrl: string;
}
