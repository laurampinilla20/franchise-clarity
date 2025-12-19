/**
 * Match Reasons Generator
 * 
 * Generates personalized "Why Yes" and "Why Not" reasons based on user profile vs brand data.
 * HubSpot-friendly: Can be replaced with AI/ML matching engine.
 * 
 * @param userProfile - User's profile data (budget, location, lifestyle, industries, goals)
 * @param brandData - Brand/franchise data (investment, sector, category, territory, etc.)
 * @param fitChips - Fit indicators (territory, lifestyle, budget)
 * @returns Object with whyYes and whyNot arrays
 */

interface UserProfile {
  budget?: string; // e.g., "$100K – $250K"
  budgetMin?: number;
  budgetMax?: number;
  location?: string; // e.g., "Toronto, ON"
  lifestyle?: string; // e.g., "Full-time", "Part-time", "Semi-absentee"
  industries?: string[]; // e.g., ["Food & Beverage", "Health & Fitness"]
  goals?: string[]; // e.g., ["Financial freedom", "Be my own boss"]
}

interface BrandData {
  investmentMin?: number;
  investmentMax?: number;
  sector?: string;
  category?: string;
  territory?: string;
  lifestyle?: string;
  name?: string;
}

interface FitChips {
  territory: boolean;
  lifestyle: boolean;
  budget: boolean;
}

export function generateMatchReasons(
  userProfile: UserProfile,
  brandData: BrandData,
  fitChips: FitChips
): { whyYes: string[]; whyNot: string[] } {
  const whyYes: string[] = [];
  const whyNot: string[] = [];

  // Parse user budget
  const parseBudget = (budgetStr?: string): { min: number; max: number } | null => {
    if (!budgetStr) return null;
    // Extract numbers from strings like "$100K – $250K" or "$100K-$250K"
    const match = budgetStr.match(/\$?(\d+(?:\.\d+)?)([KMkm]?)\s*[–-]\s*\$?(\d+(?:\.\d+)?)([KMkm]?)/);
    if (match) {
      const min = parseFloat(match[1]) * (match[2].toUpperCase() === 'K' ? 1000 : match[2].toUpperCase() === 'M' ? 1000000 : 1);
      const max = parseFloat(match[3]) * (match[4].toUpperCase() === 'K' ? 1000 : match[4].toUpperCase() === 'M' ? 1000000 : 1);
      return { min, max };
    }
    return null;
  };

  const userBudget = userProfile.budgetMin && userProfile.budgetMax 
    ? { min: userProfile.budgetMin, max: userProfile.budgetMax }
    : parseBudget(userProfile.budget);

  // Budget comparisons
  if (brandData.investmentMin && brandData.investmentMax && userBudget) {
    const brandAvg = (brandData.investmentMin + brandData.investmentMax) / 2;
    const userAvg = (userBudget.min + userBudget.max) / 2;
    const percentageDiff = ((brandAvg - userAvg) / userAvg) * 100;

    if (fitChips.budget) {
      if (percentageDiff < -20) {
        whyYes.push("Lower investment than your budget");
      } else if (percentageDiff <= 20) {
        whyYes.push("Investment fits your budget range");
      } else {
        whyYes.push("Investment aligns with your budget");
      }
    } else {
      if (percentageDiff > 50) {
        whyNot.push(`${Math.round(percentageDiff)}% higher than your budget`);
      } else if (percentageDiff > 20) {
        whyNot.push("Investment exceeds your budget");
      } else if (percentageDiff < -50) {
        whyNot.push(`${Math.abs(Math.round(percentageDiff))}% lower than your budget`);
      }
    }
  } else if (fitChips.budget) {
    whyYes.push("Investment fits your budget range");
  } else if (brandData.investmentMin && userBudget) {
    if (brandData.investmentMin > userBudget.max) {
      const diff = ((brandData.investmentMin - userBudget.max) / userBudget.max) * 100;
      whyNot.push(`${Math.round(diff)}% higher investment required`);
    }
  }

  // Territory/Location
  if (fitChips.territory) {
    whyYes.push("Available in your location");
  } else {
    whyNot.push("Not available in your location");
  }

  // Lifestyle match
  if (fitChips.lifestyle) {
    if (userProfile.lifestyle === "Semi-absentee" || userProfile.lifestyle === "Part-time") {
      whyYes.push("Semi-absentee ownership possible");
    } else if (userProfile.lifestyle === "Full-time") {
      whyYes.push("Matches your full-time commitment");
    } else {
      whyYes.push("Lifestyle requirements align");
    }
  } else {
    if (userProfile.lifestyle === "Semi-absentee" && brandData.lifestyle === "Full-time") {
      whyNot.push("Requires full-time commitment");
    } else if (userProfile.lifestyle === "Full-time" && brandData.lifestyle === "Part-time") {
      whyNot.push("May not match your full-time availability");
    } else {
      whyNot.push("Lifestyle requirements don't align");
    }
  }

  // Industry match
  if (userProfile.industries && brandData.sector) {
    const matchesIndustry = userProfile.industries.some(
      (ind) => ind.toLowerCase() === brandData.sector?.toLowerCase()
    );
    if (matchesIndustry) {
      whyYes.push(`Matches your ${brandData.sector} interest`);
    } else {
      whyNot.push(`Not in your preferred ${userProfile.industries[0]} industry`);
    }
  }

  // Goals alignment
  if (userProfile.goals && userProfile.goals.length > 0) {
    if (userProfile.goals.includes("Financial freedom") || userProfile.goals.includes("Be my own boss")) {
      if (fitChips.budget && fitChips.territory) {
        whyYes.push("Strong potential for your goals");
      }
    }
  }

  // Ensure we have the right number of items
  // Why Yes: 2-3 items (prefer 3)
  while (whyYes.length < 2) {
    if (whyYes.length === 0) {
      whyYes.push("Proven business model");
      whyYes.push("Strong brand recognition");
    } else if (whyYes.length === 1) {
      whyYes.push("Comprehensive training and support");
    }
  }
  if (whyYes.length > 3) {
    whyYes.splice(3);
  }

  // Why Not: 1-2 items (prefer 2)
  while (whyNot.length < 1) {
    whyNot.push("Consider market competition");
  }
  if (whyNot.length > 2) {
    whyNot.splice(2);
  }

  return { whyYes, whyNot };
}

