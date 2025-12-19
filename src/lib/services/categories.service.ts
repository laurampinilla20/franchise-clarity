// HubSpot-ready category service
// This service handles fetching category data and related franchises

export interface CategoryStats {
  totalInvestment: { min: number; max: number };
  avgRevenue: { min: number; max: number };
  avgProfit: { min: number; max: number };
}

export interface PerformanceMetrics {
  revenue: number;
  profit: number;
  roi: number;
}

export interface SectorMetrics {
  initialFranchiseFee: { average: number; median: number; range: { min: number; max: number } };
  royaltyRate: { average: number; median: number; range: { min: number; max: number } };
  nationalAdvertisingRate: { average: number; median: number };
  localAdvertisingRate: { average: number; median: number };
  initialTerm: { average: number; median: number; range: { min: number; max: number } };
  renewalTerm: { average: number; median: number };
  additionalFunds: { average: number; median: number; range: { min: number; max: number } };
  trainingHours: { sectorAverage: number; industryAverage: number };
  territoryRights: { percentage: number };
  franchiseeTurnoverRate: { average: number; data: Array<{ year: number; rate: number }> };
  growthRate: { average: number; data: Array<{ year: number; rate: number }> };
  totalOutlets: { current: number; growth5Year: number };
  legalActions: { average: number; median: number };
}

export interface CategoryData {
  slug: string;
  name: string;
  description: string;
  heroImage?: string;
  stats: CategoryStats;
  benefits: string[];
  alternatives?: string[];
  performanceMetrics: PerformanceMetrics;
  franchises: string[]; // Array of brand slugs
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  sectorMetrics?: SectorMetrics; // HubSpot-ready detailed metrics
}

// Default category data (HubSpot-ready with fallbacks)
const defaultCategoryData: Record<string, CategoryData> = {
  investment: {
    slug: "investment",
    name: "Investment",
    description: "Discover franchises with attractive investment opportunities. From low-cost options to high-ROI opportunities, find the perfect investment level for your budget and goals.",
    stats: {
      totalInvestment: { min: 50000, max: 200000 },
      avgRevenue: { min: 250000, max: 1000000 },
      avgProfit: { min: 100000, max: 500000 }
    },
    benefits: [
      "Low Investment",
      "High ROI",
      "Proven System",
      "Dedicated Support",
      "Quick ROI"
    ],
    alternatives: [
      "High Investment",
      "Uncertain ROI",
      "Unproven System",
      "Limited Support",
      "Long Payback"
    ],
    performanceMetrics: {
      revenue: 650000,
      profit: 300000,
      roi: 45
    },
    franchises: [],
    features: [
      {
        icon: "DollarSign",
        title: "Affordable Entry",
        description: "Low initial investment requirements"
      },
      {
        icon: "TrendingUp",
        title: "High Returns",
        description: "Strong ROI potential"
      },
      {
        icon: "Shield",
        title: "Proven Track Record",
        description: "Established franchise systems"
      },
      {
        icon: "Users",
        title: "Support Network",
        description: "Comprehensive franchise support"
      }
    ],
    sectorMetrics: {
      initialFranchiseFee: { average: 35000, median: 32000, range: { min: 0, max: 200000 } },
      royaltyRate: { average: 8, median: 7, range: { min: 0, max: 25 } },
      nationalAdvertisingRate: { average: 2, median: 2 },
      localAdvertisingRate: { average: 1, median: 1 },
      initialTerm: { average: 10, median: 10, range: { min: 5, max: 20 } },
      renewalTerm: { average: 10, median: 10 },
      additionalFunds: { average: 25000, median: 15000, range: { min: 0, max: 200000 } },
      trainingHours: { sectorAverage: 85, industryAverage: 129 },
      territoryRights: { percentage: 52 },
      franchiseeTurnoverRate: {
        average: 10,
        data: [
          { year: 2015, rate: 11 },
          { year: 2016, rate: 9 },
          { year: 2017, rate: 10 },
          { year: 2018, rate: 10 },
          { year: 2019, rate: 11 },
          { year: 2020, rate: 10 }
        ]
      },
      growthRate: {
        average: 28,
        data: [
          { year: 2015, rate: 20 },
          { year: 2016, rate: 22 },
          { year: 2017, rate: 25 },
          { year: 2018, rate: 50 },
          { year: 2019, rate: 15 },
          { year: 2020, rate: 25 }
        ]
      },
      totalOutlets: { current: 45000, growth5Year: 1250 },
      legalActions: { average: 2, median: 0 }
    }
  },
  lifestyle: {
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Franchises that fit your lifestyle goals. Whether you're looking for semi-absentee ownership, passive income, or flexible schedules, find opportunities that align with how you want to live.",
    stats: {
      totalInvestment: { min: 75000, max: 300000 },
      avgRevenue: { min: 200000, max: 800000 },
      avgProfit: { min: 80000, max: 400000 }
    },
    benefits: [
      "Flexible Schedule",
      "Work-Life Balance",
      "Passive Income Options",
      "Location Independence",
      "Semi-Absentee Friendly"
    ],
    alternatives: [
      "Rigid Schedule",
      "Work-Life Conflict",
      "Active Management Required",
      "Location Dependent",
      "Full-Time Commitment"
    ],
    performanceMetrics: {
      revenue: 500000,
      profit: 240000,
      roi: 38
    },
    franchises: [],
    features: [
      {
        icon: "Home",
        title: "Home-Based Options",
        description: "Work from anywhere"
      },
      {
        icon: "Clock",
        title: "Flexible Hours",
        description: "Control your schedule"
      },
      {
        icon: "DollarSign",
        title: "Passive Income",
        description: "Build wealth passively"
      },
      {
        icon: "Heart",
        title: "Life Balance",
        description: "Time for what matters"
      }
    ],
    sectorMetrics: {
      initialFranchiseFee: { average: 42000, median: 38000, range: { min: 0, max: 250000 } },
      royaltyRate: { average: 10, median: 8, range: { min: 0, max: 30 } },
      nationalAdvertisingRate: { average: 2, median: 2 },
      localAdvertisingRate: { average: 2, median: 1 },
      initialTerm: { average: 9.5, median: 10, range: { min: 3, max: 25 } },
      renewalTerm: { average: 8, median: 8 },
      additionalFunds: { average: 32000, median: 20000, range: { min: 0, max: 250000 } },
      trainingHours: { sectorAverage: 95, industryAverage: 129 },
      territoryRights: { percentage: 48 },
      franchiseeTurnoverRate: {
        average: 11,
        data: [
          { year: 2015, rate: 12 },
          { year: 2016, rate: 10 },
          { year: 2017, rate: 11 },
          { year: 2018, rate: 11 },
          { year: 2019, rate: 12 },
          { year: 2020, rate: 11 }
        ]
      },
      growthRate: {
        average: 32,
        data: [
          { year: 2015, rate: 22 },
          { year: 2016, rate: 25 },
          { year: 2017, rate: 28 },
          { year: 2018, rate: 55 },
          { year: 2019, rate: 18 },
          { year: 2020, rate: 28 }
        ]
      },
      totalOutlets: { current: 52000, growth5Year: 1800 },
      legalActions: { average: 2, median: 0 }
    }
  },
  performance: {
    slug: "performance",
    name: "Performance",
    description: "Top-performing franchises with strong growth, high margins, and proven validation. These opportunities offer exceptional performance metrics and recession-resistant business models.",
    stats: {
      totalInvestment: { min: 100000, max: 500000 },
      avgRevenue: { min: 500000, max: 2000000 },
      avgProfit: { min: 200000, max: 800000 }
    },
    benefits: [
      "High Margin",
      "Fastest Growing",
      "High Validation",
      "Recession Resistant",
      "Top Rated"
    ],
    alternatives: [
      "Low Margin",
      "Slow Growth",
      "Limited Validation",
      "Economic Sensitivity",
      "Average Ratings"
    ],
    performanceMetrics: {
      revenue: 1250000,
      profit: 500000,
      roi: 52
    },
    franchises: [],
    features: [
      {
        icon: "TrendingUp",
        title: "Rapid Growth",
        description: "Fastest growing franchises"
      },
      {
        icon: "BarChart",
        title: "High Margins",
        description: "Strong profitability"
      },
      {
        icon: "Star",
        title: "Top Rated",
        description: "Highest validation scores"
      },
      {
        icon: "Shield",
        title: "Recession Proof",
        description: "Economic resilience"
      }
    ],
    sectorMetrics: {
      initialFranchiseFee: { average: 45000, median: 40000, range: { min: 0, max: 300000 } },
      royaltyRate: { average: 7, median: 6, range: { min: 0, max: 20 } },
      nationalAdvertisingRate: { average: 2, median: 2 },
      localAdvertisingRate: { average: 2, median: 2 },
      initialTerm: { average: 10.5, median: 10, range: { min: 5, max: 30 } },
      renewalTerm: { average: 10, median: 10 },
      additionalFunds: { average: 35000, median: 22000, range: { min: 0, max: 300000 } },
      trainingHours: { sectorAverage: 110, industryAverage: 129 },
      territoryRights: { percentage: 55 },
      franchiseeTurnoverRate: {
        average: 9,
        data: [
          { year: 2015, rate: 10 },
          { year: 2016, rate: 8 },
          { year: 2017, rate: 9 },
          { year: 2018, rate: 9 },
          { year: 2019, rate: 10 },
          { year: 2020, rate: 9 }
        ]
      },
      growthRate: {
        average: 35,
        data: [
          { year: 2015, rate: 25 },
          { year: 2016, rate: 28 },
          { year: 2017, rate: 32 },
          { year: 2018, rate: 60 },
          { year: 2019, rate: 20 },
          { year: 2020, rate: 30 }
        ]
      },
      totalOutlets: { current: 68000, growth5Year: 3200 },
      legalActions: { average: 1, median: 0 }
    }
  },
  "business-setup": {
    slug: "business-setup",
    name: "Business Setup",
    description: "Franchises designed for different experience levels and operational models. From turnkey solutions for beginners to flexible setups for experienced entrepreneurs.",
    stats: {
      totalInvestment: { min: 60000, max: 250000 },
      avgRevenue: { min: 300000, max: 1200000 },
      avgProfit: { min: 120000, max: 500000 }
    },
    benefits: [
      "For Beginners",
      "Turnkey Solutions",
      "Multiple Formats",
      "Comprehensive Training",
      "Ongoing Support"
    ],
    alternatives: [
      "Experience Required",
      "Complex Setup",
      "Limited Formats",
      "Minimal Training",
      "Limited Support"
    ],
    performanceMetrics: {
      revenue: 750000,
      profit: 310000,
      roi: 41
    },
    franchises: [],
    features: [
      {
        icon: "GraduationCap",
        title: "Beginner Friendly",
        description: "No experience needed"
      },
      {
        icon: "Package",
        title: "Turnkey Ready",
        description: "Complete setup included"
      },
      {
        icon: "Building",
        title: "Multiple Formats",
        description: "Brick-and-mortar, mobile, online"
      },
      {
        icon: "Book",
        title: "Full Training",
        description: "Comprehensive education"
      }
    ],
    sectorMetrics: {
      initialFranchiseFee: { average: 38000, median: 35000, range: { min: 0, max: 180000 } },
      royaltyRate: { average: 9, median: 8, range: { min: 0, max: 25 } },
      nationalAdvertisingRate: { average: 2, median: 2 },
      localAdvertisingRate: { average: 1.5, median: 1 },
      initialTerm: { average: 9.8, median: 10, range: { min: 3, max: 20 } },
      renewalTerm: { average: 8, median: 8 },
      additionalFunds: { average: 28000, median: 18000, range: { min: 0, max: 200000 } },
      trainingHours: { sectorAverage: 100, industryAverage: 129 },
      territoryRights: { percentage: 50 },
      franchiseeTurnoverRate: {
        average: 10.5,
        data: [
          { year: 2015, rate: 11 },
          { year: 2016, rate: 9.5 },
          { year: 2017, rate: 10.5 },
          { year: 2018, rate: 10.5 },
          { year: 2019, rate: 11 },
          { year: 2020, rate: 10.5 }
        ]
      },
      growthRate: {
        average: 30,
        data: [
          { year: 2015, rate: 18 },
          { year: 2016, rate: 20 },
          { year: 2017, rate: 25 },
          { year: 2018, rate: 52 },
          { year: 2019, rate: 12 },
          { year: 2020, rate: 22 }
        ]
      },
      totalOutlets: { current: 42000, growth5Year: 950 },
      legalActions: { average: 2, median: 0 }
    }
  }
};

/**
 * Get category data by slug
 * HubSpot-ready: Can be replaced with API call
 * Handles both tag categories (investment, lifestyle, etc.) and sector/category slugs
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  // TODO: Replace with HubSpot API call
  // const response = await fetch(`/api/categories/${slug}`);
  // return response.json();
  
  // Check if it's one of the predefined tag categories
  const category = defaultCategoryData[slug];
  if (category) {
    // HubSpot-friendly: Allow dynamic data override
    // const hubspotData = await fetchHubSpotCategoryData(slug);
    // return { ...category, ...hubspotData };
    return category;
  }
  
  // For sector/category slugs, create dynamic category data
  // HubSpot-ready: This can be replaced with API call to fetch sector/category data
  const dynamicCategory: CategoryData = {
    slug: slug,
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: `Explore ${slug.split('-').join(' ')} franchise opportunities. Find the perfect franchise that matches your goals and investment level.`,
    stats: {
      totalInvestment: { min: 75000, max: 300000 },
      avgRevenue: { min: 300000, max: 1200000 },
      avgProfit: { min: 120000, max: 500000 }
    },
    benefits: [
      "Proven System",
      "Comprehensive Training",
      "Ongoing Support",
      "Brand Recognition",
      "Marketing Support"
    ],
    alternatives: [
      "Unproven System",
      "Limited Training",
      "Minimal Support",
      "Unknown Brand",
      "No Marketing Help"
    ],
    performanceMetrics: {
      revenue: 750000,
      profit: 310000,
      roi: 41
    },
    franchises: [],
    features: [
      {
        icon: "Shield",
        title: "Proven Track Record",
        description: "Established franchise systems"
      },
      {
        icon: "TrendingUp",
        title: "Growth Potential",
        description: "Strong market opportunities"
      },
      {
        icon: "Users",
        title: "Support Network",
        description: "Comprehensive franchise support"
      },
      {
        icon: "Star",
        title: "Brand Strength",
        description: "Recognized brand names"
      }
    ],
    // Add default sector metrics (HubSpot-ready)
    sectorMetrics: {
      initialFranchiseFee: { average: 38666, median: 36000, range: { min: 0, max: 400000 } },
      royaltyRate: { average: 12, median: 9, range: { min: 0, max: 70 } },
      nationalAdvertisingRate: { average: 2, median: 2 },
      localAdvertisingRate: { average: 2, median: 2 },
      initialTerm: { average: 9.6, median: 10, range: { min: 1, max: 35 } },
      renewalTerm: { average: 8, median: 8 },
      additionalFunds: { average: 29820, median: 17000, range: { min: 0, max: 350000 } },
      trainingHours: { sectorAverage: 91, industryAverage: 129 },
      territoryRights: { percentage: 44 },
      franchiseeTurnoverRate: {
        average: 12,
        data: [
          { year: 2015, rate: 13 },
          { year: 2016, rate: 11 },
          { year: 2017, rate: 13 },
          { year: 2018, rate: 12 },
          { year: 2019, rate: 13 },
          { year: 2020, rate: 13 }
        ]
      },
      growthRate: {
        average: 21,
        data: [
          { year: 2015, rate: 15 },
          { year: 2016, rate: 17 },
          { year: 2017, rate: 20 },
          { year: 2018, rate: 45 },
          { year: 2019, rate: 10 },
          { year: 2020, rate: 20 }
        ]
      },
      totalOutlets: { current: 38056, growth5Year: 32 },
      legalActions: { average: 3, median: 0 }
    }
  };
  
  // HubSpot-friendly: Allow dynamic data override
  // const hubspotData = await fetchHubSpotCategoryData(slug);
  // return { ...dynamicCategory, ...hubspotData };
  
  return dynamicCategory;
}

/**
 * Get franchises by category tag
 * HubSpot-ready: Can be replaced with API call
 */
export async function getFranchisesByCategory(categorySlug: string): Promise<any[]> {
  // TODO: Replace with HubSpot API call
  // const response = await fetch(`/api/franchises?category=${categorySlug}`);
  // return response.json();
  
  // For now, return empty array - will be populated from HubSpot
  return [];
}

/**
 * Get all available categories
 */
export function getAllCategories(): CategoryData[] {
  return Object.values(defaultCategoryData);
}

