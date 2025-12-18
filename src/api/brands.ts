// Type definition for brand data from API (may be partial)
export type BrandDataInput = {
  id?: string;
  name?: string;
  tagline?: string;
  description?: string;
  logo?: string | null;
  grade?: "A" | "B" | "C" | "D" | "F" | "?";
  sector?: string;
  category?: string;
  investment?: {
    min?: number;
    max?: number;
    franchiseFee?: number;
    workingCapital?: number;
    royalty?: string;
    marketing?: string;
    initialTerm?: string;
    renewalTerm?: string;
  };
  profitability?: {
    item19Disclosed?: string;
    benchmarkVsCategory?: string;
    ownerWorkloadImpact?: string;
  };
  locations?: number;
  founded?: number;
  franchisedSince?: number;
  item19Disclosed?: string;
  snapshot?: string;
  topAdvantages?: string;
  whyBuyersLike?: string[];
  comparisonStrengths?: string[];
  industryBenchmarking?: string;
  competitorsRoyaltyRate?: number;
  competitorsInitialTerm?: number;
  territories?: {
    locationsInUSA?: number;
    statesWithLocations?: number;
    largestRegion?: string;
    regionLocationsCount?: number;
    fddYear?: number;
  };
  similarBrands?: Array<{
    name?: string;
    description?: string;
    logoColor?: string;
  }>;
  comparison?: {
    openUnitsLastYear?: { average?: string; brand?: string; percentage?: string };
    marketingFees?: { average?: string; brand?: string; percentage?: string };
  };
};

// Normalized brand data type (always complete with defaults)
export type BrandData = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  grade: "A" | "B" | "C" | "D" | "F" | "?";
  sector: string;
  category: string;
  investment: {
    min: number;
    max: number;
    franchiseFee: number;
    workingCapital: number;
    royalty: string;
    marketing: string;
    initialTerm: string;
    renewalTerm: string;
  };
  profitability: {
    item19Disclosed: string;
    benchmarkVsCategory: string;
    ownerWorkloadImpact: string;
  };
  locations: number;
  founded: number;
  franchisedSince: number;
  item19Disclosed: string;
  snapshot: string;
  topAdvantages: string;
  whyBuyersLike: string[];
  comparisonStrengths: string[];
  industryBenchmarking: string;
  competitorsRoyaltyRate: number;
  competitorsInitialTerm: number;
  territories: {
    locationsInUSA: number;
    statesWithLocations: number;
    largestRegion: string;
    regionLocationsCount: number;
    fddYear: number;
  };
  similarBrands: Array<{
    name: string;
    description: string;
    logoColor: string;
  }>;
  comparison: {
    openUnitsLastYear: { average: string; brand: string; percentage: string };
    marketingFees: { average: string; brand: string; percentage: string };
  };
};

/**
 * Normalizes brand data by applying default values for missing or partial fields
 * This ensures the component never receives undefined or null values that could cause runtime errors
 */
export function normalizeBrandData(data: BrandDataInput | null | undefined): BrandData {
  if (!data) {
    data = {};
  }

  return {
    id: data.id || "unknown",
    name: data.name || "N/A",
    tagline: data.tagline || "N/A",
    description: data.description || "N/A",
    logo: data.logo ?? null,
    grade: data.grade || "?",
    sector: data.sector || "N/A",
    category: data.category || "N/A",
    investment: {
      min: data.investment?.min ?? 0,
      max: data.investment?.max ?? 0,
      franchiseFee: data.investment?.franchiseFee ?? 0,
      workingCapital: data.investment?.workingCapital ?? 0,
      royalty: data.investment?.royalty || "N/A",
      marketing: data.investment?.marketing || "N/A",
      initialTerm: data.investment?.initialTerm || "N/A",
      renewalTerm: data.investment?.renewalTerm || "N/A",
    },
    profitability: {
      item19Disclosed: data.profitability?.item19Disclosed || "N/A",
      benchmarkVsCategory: data.profitability?.benchmarkVsCategory || "N/A",
      ownerWorkloadImpact: data.profitability?.ownerWorkloadImpact || "N/A",
    },
    locations: data.locations ?? 0,
    founded: data.founded ?? 0,
    franchisedSince: data.franchisedSince ?? 0,
    item19Disclosed: data.item19Disclosed || "N/A",
    snapshot: data.snapshot || "N/A",
    topAdvantages: data.topAdvantages || "N/A",
    whyBuyersLike: Array.isArray(data.whyBuyersLike) ? data.whyBuyersLike.filter(Boolean) : [],
    comparisonStrengths: Array.isArray(data.comparisonStrengths) ? data.comparisonStrengths.filter(Boolean) : [],
    industryBenchmarking: data.industryBenchmarking || "N/A",
    competitorsRoyaltyRate: data.competitorsRoyaltyRate ?? 0,
    competitorsInitialTerm: data.competitorsInitialTerm ?? 0,
    territories: {
      locationsInUSA: data.territories?.locationsInUSA ?? 0,
      statesWithLocations: data.territories?.statesWithLocations ?? 0,
      largestRegion: data.territories?.largestRegion || "N/A",
      regionLocationsCount: data.territories?.regionLocationsCount ?? 0,
      fddYear: data.territories?.fddYear ?? new Date().getFullYear(),
    },
    similarBrands: Array.isArray(data.similarBrands)
      ? data.similarBrands
          .filter((brand) => brand && (brand.name || brand.description))
          .map((brand) => ({
            name: brand?.name || "N/A",
            description: brand?.description || "N/A",
            logoColor: brand?.logoColor || "#dee8f2",
          }))
      : [],
    comparison: {
      openUnitsLastYear: {
        average: data.comparison?.openUnitsLastYear?.average || "N/A",
        brand: data.comparison?.openUnitsLastYear?.brand || "N/A",
        percentage: data.comparison?.openUnitsLastYear?.percentage || "N/A",
      },
      marketingFees: {
        average: data.comparison?.marketingFees?.average || "N/A",
        brand: data.comparison?.marketingFees?.brand || "N/A",
        percentage: data.comparison?.marketingFees?.percentage || "N/A",
      },
    },
  };
}

// Mock data - This simulates data that would come from the database
const mockBrandData: BrandData = {
  id: "subway-1",
  name: "Subway",
  tagline: "Eat Fresh",
  description: "Subway is the world's largest submarine sandwich franchise, with more than 37,000 locations in over 100 countries.",
  logo: null,
  grade: "B" as const,
  sector: "Food & Beverage",
  category: "Quick Service",
  investment: {
    min: 4926000,
    max: 7136000,
    franchiseFee: 115000,
    workingCapital: 321000,
    royalty: "5%",
    marketing: "3%",
    initialTerm: "20 Years",
    renewalTerm: "0 Years",
  },
  profitability: {
    item19Disclosed: "Yes",
    benchmarkVsCategory: "A - Strong",
    ownerWorkloadImpact: "18 - 24 months",
  },
  locations: 50,
  founded: 1986,
  franchisedSince: 2004,
  item19Disclosed: "Yes",
  snapshot: "This franchise is a full service, premium casual restaurant and lounge that offers a wide variety of food products and services.",
  topAdvantages: "Moxies stands out because it's a recognizable brand in a growing category, supported by years of steady system performance. Buyers appreciate the structured onboarding, predictable startup path, and long-term stability indicators. Its model works well for owners who want a reliable business with strong support from day one.",
  whyBuyersLike: [
    "Simple and proven operating model",
    "Strong category demand in Bar and Grill",
    "Predictable owner role and support",
  ],
  comparisonStrengths: [
    "Performs above category benchmarks in {top strengths}",
    "Stronger growth and more consistent performance in {top strengths}",
    "Lower risk indicators than similar brands in {top strengths}",
  ],
  industryBenchmarking: "Grill & Bar Industry Benchmarking",
  competitorsRoyaltyRate: 6,
  competitorsInitialTerm: 15,
  territories: {
    locationsInUSA: 0,
    statesWithLocations: 0,
    largestRegion: "West",
    regionLocationsCount: 0,
    fddYear: 2024,
  },
  similarBrands: [
    {
      name: "All American Pet Resort",
      description: "All American Pet Resorts offer pet boarding, daycare, and grooming...",
      logoColor: "#dee8f2",
    },
    {
      name: "Celebree School",
      description: "Infant care, pre-school, before and after-school programs for school...",
      logoColor: "#dee8f2",
    },
    {
      name: "All American Pet Resort",
      description: "All American Pet Resorts offer pet boarding, daycare, and grooming...",
      logoColor: "#4F7AA5",
    },
    {
      name: "Celebree School",
      description: "Infant care, pre-school, before and after-school programs for school...",
      logoColor: "#dee8f2",
    },
  ],
  comparison: {
    openUnitsLastYear: { average: "5 Units", brand: "17 Units", percentage: "+45%" },
    marketingFees: { average: "6.5%", brand: "3%", percentage: "-25%" },
  },
};

/**
 * Fetches brand data by slug from the API
 * 
 * @param slug - The brand slug identifier
 * @returns Promise resolving to BrandData
 * @throws Error if slug is invalid or API request fails
 * 
 * @example
 * ```typescript
 * try {
 *   const brandData = await fetchBrandBySlug('subway');
 *   console.log(brandData.name);
 * } catch (error) {
 *   console.error('Failed to fetch brand:', error);
 * }
 * ```
 * 
 * TODO: Replace mock implementation with real API call:
 * ```typescript
 * const response = await fetch(`${API_BASE_URL}/api/brands/${slug}`);
 * if (!response.ok) {
 *   throw new Error(`Failed to fetch brand: ${response.statusText}`);
 * }
 * return response.json();
 * ```
 */
export async function fetchBrandBySlug(slug: string): Promise<BrandData> {
  // Validate slug
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    throw new Error('Brand slug is required and must be a non-empty string');
  }

  // TODO: Replace this mock implementation with real API call
  // Example implementation:
  // const API_BASE_URL = process.env.VITE_API_BASE_URL || '';
  // const response = await fetch(`${API_BASE_URL}/api/brands/${slug}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // Add authentication headers if needed
  //     // 'Authorization': `Bearer ${token}`,
  //   },
  // });
  // 
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({}));
  //   throw new Error(errorData.message || `Failed to fetch brand: ${response.statusText}`);
  // }
  // 
  // const rawData: BrandDataInput = await response.json();
  // // Normalize the data to ensure all fields have defaults
  // return normalizeBrandData(rawData);

  // Mock implementation - Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return normalized mock data (in production, this would fetch from database via API)
  return normalizeBrandData(mockBrandData);
}
