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
    grade: data.grade || "A",
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

/**
 * Generate default brand data for testing based on slug
 * HubSpot-friendly: This structure matches HubSpot contact properties
 * Only used for testing - will be replaced with real database/API calls
 * 
 * @param slug - Brand slug identifier
 * @returns BrandDataInput with default values specific to the slug
 */
function generateDefaultBrandData(slug: string): BrandDataInput {
  // Generate consistent "random" values based on slug for testing
  // This ensures the same slug always gets the same default data
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Brand name from slug (capitalize first letter of each word)
  const brandName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Generate consistent data based on hash
  const grades: ("A" | "B" | "C" | "D" | "F" | "?")[] = ["A", "B", "C", "D"];
  const grade = grades[hash % 4] as "A" | "B" | "C" | "D";
  
  // Sectors and categories
  const sectors = ["Food & Beverage", "Health & Fitness", "Home Services", "Retail", "Education", "Automotive"];
  const categories = ["Quick Service", "Full Service", "Retail", "Service", "Education", "Automotive"];
  const sector = sectors[hash % sectors.length];
  const category = categories[hash % categories.length];
  
  // Investment ranges based on hash
  const investmentRanges = [
    { min: 50000, max: 150000 },
    { min: 150000, max: 350000 },
    { min: 350000, max: 700000 },
    { min: 700000, max: 1500000 },
    { min: 1500000, max: 3000000 },
  ];
  const investmentRange = investmentRanges[hash % investmentRanges.length];
  
  // Franchise fee (typically 5-15% of min investment)
  const franchiseFee = Math.round(investmentRange.min * (0.05 + (hash % 10) * 0.01));
  
  // Working capital (typically 20-40% of min investment)
  const workingCapital = Math.round(investmentRange.min * (0.2 + (hash % 20) * 0.01));
  
  // Marketing fee percentages
  const marketingFees = ["2%", "3%", "4%", "5%"];
  const marketingFee = marketingFees[hash % marketingFees.length];
  
  // Initial terms
  const initialTerms = ["10 Years", "15 Years", "20 Years", "25 Years"];
  const initialTerm = initialTerms[hash % initialTerms.length];
  
  // Royalty percentages
  const royalties = ["4%", "5%", "6%", "7%", "8%"];
  const royalty = royalties[hash % royalties.length];
  
  // Locations (generate realistic number)
  const locations = 100 + (hash % 900) * 10;
  
  // Founded year (between 1950 and 2010)
  const founded = 1950 + (hash % 60);
  const franchisedSince = founded + 5 + (hash % 20);
  
  // Item 19 disclosure
  const item19Options = ["Yes", "No", "Partial"];
  const item19Disclosed = item19Options[hash % item19Options.length];
  
  // Benchmark options
  const benchmarks = ["A - Strong", "B - Good", "C - Average", "D - Below Average"];
  const benchmark = benchmarks[hash % benchmarks.length];
  
  // Owner workload impact
  const workloadImpacts = ["12 - 18 months", "18 - 24 months", "24 - 36 months", "36+ months"];
  const ownerWorkloadImpact = workloadImpacts[hash % workloadImpacts.length];
  
  // Why Buyers Like reasons
  const whyBuyersLikeOptions = [
    ["Simple and proven operating model", "Strong category demand", "Predictable owner role and support"],
    ["Established market presence", "Ongoing support", "Marketing assistance"],
    ["Scalable operations", "Brand equity", "Proven profitability"],
    ["Territory protection", "Training programs", "Marketing support"],
  ];
  const whyBuyersLike = whyBuyersLikeOptions[hash % whyBuyersLikeOptions.length];
  
  // Comparison Strengths
  const comparisonStrengthsOptions = [
    ["Performs above category benchmarks", "Stronger growth and consistent performance", "Lower risk indicators"],
    ["Higher revenue potential", "Better franchisee satisfaction", "Stronger brand recognition"],
    ["More locations available", "Better training programs", "Lower initial investment"],
  ];
  const comparisonStrengths = comparisonStrengthsOptions[hash % comparisonStrengthsOptions.length];
  
  // Territories
  const regions = ["West", "East", "South", "North", "Midwest"];
  const largestRegion = regions[hash % regions.length];
  const locationsInUSA = locations;
  const statesWithLocations = 10 + (hash % 40);
  const regionLocationsCount = Math.floor(locationsInUSA * (0.2 + (hash % 30) * 0.01));
  
  // Competitors data
  const competitorsRoyaltyRate = 4 + (hash % 4);
  const competitorsInitialTerm = 10 + (hash % 10);
  
  // Comparison data
  const openUnitsLastYear = {
    average: `${5 + (hash % 10)} Units`,
    brand: `${10 + (hash % 20)} Units`,
    percentage: `+${20 + (hash % 30)}%`,
  };
  
  const marketingFeesComparison = {
    average: `${5 + (hash % 3)}.${hash % 10}%`,
    brand: marketingFee,
    percentage: `-${10 + (hash % 20)}%`,
  };
  
  // Similar brands
  const similarBrandNames = [
    "All American Pet Resort",
    "Celebree School",
    "Fitness First",
    "Home Care Plus",
    "Auto Service Pro",
  ];
  const similarBrands = [
    {
      name: similarBrandNames[hash % similarBrandNames.length],
      description: "A leading franchise in the industry with proven success...",
      logoColor: "#dee8f2",
    },
    {
      name: similarBrandNames[(hash + 1) % similarBrandNames.length],
      description: "Established brand with strong market presence...",
      logoColor: "#4F7AA5",
    },
  ];
  
  // Taglines
  const taglines = [
    "Eat Fresh",
    "Your Success, Our Mission",
    "Building Better Futures",
    "Quality You Can Trust",
    "Excellence in Every Detail",
  ];
  const tagline = taglines[hash % taglines.length];
  
  // Descriptions
  const descriptions = [
    `${brandName} is a leading franchise in the ${sector} sector, with a proven track record of success.`,
    `${brandName} offers franchise opportunities in the ${category} category with comprehensive support.`,
    `Join ${brandName}, a trusted name in ${sector} with ${locations}+ locations nationwide.`,
  ];
  const description = descriptions[hash % descriptions.length];
  
  // Snapshots
  const snapshots = [
    `This franchise is a ${category.toLowerCase()} business that offers a wide variety of products and services in the ${sector} sector.`,
    `A ${category.toLowerCase()} franchise opportunity with strong brand recognition and comprehensive training programs.`,
    `Established ${sector} franchise with proven business model and ongoing support for franchisees.`,
  ];
  const snapshot = snapshots[hash % snapshots.length];
  
  // Top Advantages
  const topAdvantages = `${brandName} stands out because it's a recognizable brand in a growing category, supported by years of steady system performance. Buyers appreciate the structured onboarding, predictable startup path, and long-term stability indicators. Its model works well for owners who want a reliable business with strong support from day one.`;
  
  // Industry Benchmarking
  const industryBenchmarking = `${sector} Industry Benchmarking`;
  
  return {
    id: `${slug}-1`,
    name: brandName,
    tagline,
    description,
    logo: null,
    grade,
    sector,
    category,
    investment: {
      min: investmentRange.min,
      max: investmentRange.max,
      franchiseFee,
      workingCapital,
      royalty,
      marketing: marketingFee,
      initialTerm,
      renewalTerm: "0 Years",
    },
    profitability: {
      item19Disclosed,
      benchmarkVsCategory: benchmark,
      ownerWorkloadImpact,
    },
    locations,
    founded,
    franchisedSince,
    item19Disclosed,
    snapshot,
    topAdvantages,
    whyBuyersLike,
    comparisonStrengths,
    industryBenchmarking,
    competitorsRoyaltyRate,
    competitorsInitialTerm,
    territories: {
      locationsInUSA,
      statesWithLocations,
      largestRegion,
      regionLocationsCount,
      fddYear: new Date().getFullYear(),
    },
    similarBrands,
    comparison: {
      openUnitsLastYear,
      marketingFees: marketingFeesComparison,
    },
  };
}

/**
 * Fetches brand data by slug from the API
 * 
 * HubSpot-friendly: This function is designed to work with HubSpot CRM data.
 * The structure matches HubSpot contact properties and can be easily mapped.
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
 * HubSpot Integration Example:
 * ```typescript
 * // Replace this function with HubSpot API call:
 * const API_BASE_URL = process.env.VITE_API_BASE_URL || '';
 * const response = await fetch(`${API_BASE_URL}/api/hubspot/brands/${slug}`, {
 *   method: 'GET',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${hubspotToken}`,
 *   },
 * });
 * 
 * if (!response.ok) {
 *   const errorData = await response.json().catch(() => ({}));
 *   throw new Error(errorData.message || `Failed to fetch brand: ${response.statusText}`);
 * }
 * 
 * const hubspotData = await response.json();
 * // Map HubSpot properties to BrandDataInput
 * const rawData: BrandDataInput = {
 *   id: hubspotData.properties.brand_id,
 *   name: hubspotData.properties.brand_name,
 *   tagline: hubspotData.properties.tagline,
 *   description: hubspotData.properties.description,
 *   grade: hubspotData.properties.grade,
 *   sector: hubspotData.properties.sector,
 *   category: hubspotData.properties.category,
 *   investment: {
 *     min: hubspotData.properties.investment_min,
 *     max: hubspotData.properties.investment_max,
 *     franchiseFee: hubspotData.properties.franchise_fee,
 *     // ... map other investment properties
 *   },
 *   // ... map other properties
 * };
 * 
 * // Normalize the data to ensure all fields have defaults
 * return normalizeBrandData(rawData);
 * ```
 */
export async function fetchBrandBySlug(slug: string): Promise<BrandData> {
  // Validate slug
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    throw new Error('Brand slug is required and must be a non-empty string');
  }

  // TODO: Replace this mock implementation with real API/HubSpot call
  // For now, use default data generator for testing
  // This ensures each brand gets unique, consistent data based on its slug
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Generate default data for testing (only used when database is not connected)
  // HubSpot-friendly: This structure matches what HubSpot would return
  const defaultData = generateDefaultBrandData(slug);
  
  // Normalize the data to ensure all fields have defaults
  return normalizeBrandData(defaultData);
}
