import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSignInModal } from "@/contexts/SignInModalContext";
import { fetchBrandBySlug, type BrandData } from "@/api/brands";
import { getUserData, setUserData } from "@/utils/userStorage";
import { useToast } from "@/hooks/use-toast";

export interface CompareFranchise {
  id: string;
  name: string;
  logo?: string | null;
  grade?: "A" | "B" | "C" | "D";
  investmentMin?: number;
  investmentMax?: number;
  franchiseFee?: number;
  workingCapital?: number;
  marketingFee?: string;
  initialTerm?: string;
  locations?: number;
  founded?: number;
  item19Disclosed?: string;
  avgRevenue?: number;
  avgProfit?: number;
  royalty?: string;
  lifestyle?: string;
  territory?: string;
  candidateFit?: string;
  whyYes?: string[];
  whyNot?: string[];
}

const MAX_COMPARE_ITEMS = 4;

// Removed global storage function - now using user-specific storage

/**
 * Default Brand Data Generator
 * HubSpot-friendly: Generates realistic default data for testing when API is unavailable
 * This provides fallback data without touching the dynamic database function
 * Can be easily replaced with database/HubSpot data when ready
 * 
 * Uses brand name/id to generate consistent random data for testing
 */
const getDefaultBrandData = (franchise: CompareFranchise): CompareFranchise => {
  // Generate consistent "random" values based on brand ID for testing
  // This ensures the same brand always gets the same default data
  const hash = franchise.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate realistic default values based on hash
  const grades: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const grade = franchise.grade || grades[hash % 4];
  
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
  const franchiseFee = franchise.franchiseFee || Math.round(investmentRange.min * (0.05 + (hash % 10) * 0.01));
  
  // Working capital (typically 20-40% of min investment)
  const workingCapital = franchise.workingCapital || Math.round(investmentRange.min * (0.2 + (hash % 20) * 0.01));
  
  // Marketing fee percentages
  const marketingFees = ["2%", "3%", "4%", "5%"];
  const marketingFee = franchise.marketingFee || marketingFees[hash % marketingFees.length];
  
  // Initial terms
  const initialTerms = ["10 Years", "15 Years", "20 Years", "25 Years"];
  const initialTerm = franchise.initialTerm || initialTerms[hash % initialTerms.length];
  
  // Royalty percentages
  const royalties = ["4%", "5%", "6%", "7%", "8%"];
  const royalty = franchise.royalty || royalties[hash % royalties.length];
  
  // Locations (generate realistic number)
  const locations = franchise.locations || (100 + (hash % 900) * 10);
  
  // Founded year (between 1950 and 2010)
  const founded = franchise.founded || (1950 + (hash % 60));
  
  // Item 19 disclosure
  const item19Options = ["Yes", "No", "Partial"];
  const item19Disclosed = franchise.item19Disclosed || item19Options[hash % item19Options.length];
  
  // Why Yes reasons (realistic franchise benefits)
  const whyYesOptions = [
    ["Proven business model", "Strong brand recognition", "Comprehensive training"],
    ["Established market presence", "Ongoing support", "Marketing assistance"],
    ["Scalable operations", "Brand equity", "Proven profitability"],
    ["Territory protection", "Training programs", "Marketing support"],
    ["Low competition", "Growing market", "Flexible operations"],
  ];
  const whyYes = franchise.whyYes || whyYesOptions[hash % whyYesOptions.length];
  
  // Why Not reasons (realistic concerns)
  const whyNotOptions = [
    ["Initial investment required", "Ongoing royalty fees", "Territory restrictions"],
    ["Market saturation", "High competition", "Location dependent"],
    ["Capital intensive", "Long payback period", "Operational complexity"],
    ["Franchise restrictions", "Ongoing fees", "Limited flexibility"],
    ["Initial setup costs", "Training requirements", "Brand compliance"],
  ];
  const whyNot = franchise.whyNot || whyNotOptions[hash % whyNotOptions.length];
  
  // Average revenue (if not provided, generate based on investment)
  const avgRevenue = franchise.avgRevenue || Math.round(investmentRange.min * (8 + (hash % 5)));
  
  // Average profit (typically 10-20% of revenue)
  const avgProfit = franchise.avgProfit || Math.round(avgRevenue * (0.1 + (hash % 10) * 0.01));
  
  // Lifestyle options
  const lifestyleOptions = ["Full-time", "Part-time", "Semi-absentee", "Passive"];
  const lifestyle = franchise.lifestyle || lifestyleOptions[hash % lifestyleOptions.length];
  
  // Territory options
  const territoryOptions = ["Available", "Limited", "Exclusive"];
  const territory = franchise.territory || territoryOptions[hash % territoryOptions.length];
  
  // Candidate fit
  const candidateFitOptions = ["Strong", "Good", "Fair"];
  const candidateFit = franchise.candidateFit || candidateFitOptions[hash % candidateFitOptions.length];
  
  // HubSpot-ready: These fields match the database structure
  return {
    id: franchise.id,
    name: franchise.name,
    logo: franchise.logo || null,
    grade,
    investmentMin: franchise.investmentMin || investmentRange.min,
    investmentMax: franchise.investmentMax || investmentRange.max,
    franchiseFee,
    workingCapital,
    marketingFee,
    initialTerm,
    royalty,
    locations,
    founded,
    item19Disclosed,
    whyYes,
    whyNot,
    avgRevenue,
    avgProfit,
    lifestyle,
    territory,
    candidateFit,
  };
};

export function useCompare() {
  const { isLoggedIn, user } = useAuth();
  const { openModal } = useSignInModal();
  const { toast } = useToast();
  const [compareItems, setCompareItems] = useState<CompareFranchise[]>([]);

  // Load from user-specific storage on mount - only for logged-in users
  useEffect(() => {
    if (isLoggedIn && user) {
      // Load user-specific compare items
      const userCompare = getUserData<CompareFranchise[]>(user.id, 'compare', []);
      setCompareItems(userCompare);
    } else {
      // Clear compare items for public users
      setCompareItems([]);
    }
  }, [isLoggedIn, user]);

  // Note: We don't sync on every state change here to avoid race conditions
  // Instead, we save directly to localStorage when state changes in addToCompare/removeFromCompare

  // Listen for storage changes to sync across tabs - user-specific
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    const userCompareKey = `franchise_clarity_${user.id}_compare`;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === userCompareKey) {
        setCompareItems(getUserData<CompareFranchise[]>(user.id, 'compare', []));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn, user]);

  const addToCompare = async (franchise: CompareFranchise): Promise<boolean> => {
    // Check if user is logged in
    if (!isLoggedIn || !user) {
      // Open sign-in modal
      openModal();
      return false;
    }

    // CRITICAL: Always read from localStorage first to get the absolute latest state
    // This prevents false "max items" errors when state hasn't synced yet
    const currentCompareFromStorage = getUserData<CompareFranchise[]>(user.id, 'compare', []);
    
    // Check for duplicates using latest storage data
    const isDuplicate = currentCompareFromStorage.some((item) => item.id === franchise.id);
    if (isDuplicate) {
      // Already in list, can navigate
      return true;
    }

    // Check max items using latest storage data
    if (currentCompareFromStorage.length >= MAX_COMPARE_ITEMS) {
      toast({
        title: "Maximum Compare Items Reached",
        description: `You can only compare up to ${MAX_COMPARE_ITEMS} franchises at a time. Please remove a franchise from your comparison list to add this one.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Fetch full brand data from API (HubSpot-friendly, dynamic database)
      // Extract slug from id (handle formats like "subway-1" -> "subway")
      // The id format is typically "brandname-number", we want just "brandname"
      const slug = franchise.id.split('-').slice(0, -1).join('-') || franchise.id;
      
      // TODO: Replace with real API call when database is connected
      // HubSpot-friendly: This will fetch from your database/HubSpot
      // const response = await fetch(`/api/brands/${slug}`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const brandData: BrandData = await response.json();
      
      // For now, try to fetch from API (may return mock data)
      let brandData: BrandData;
      try {
        brandData = await fetchBrandBySlug(slug);
        
        // Check if returned data matches the requested brand
        // If API returns generic mock data, use default generator instead
        if (brandData.id !== franchise.id && brandData.name.toLowerCase() !== franchise.name.toLowerCase()) {
          // API returned wrong brand data, use default generator
          throw new Error("API returned incorrect brand data");
        }
      } catch (apiError) {
        // API failed or returned wrong data, use default generator with actual brand info
        console.log(`Using default data for ${franchise.name} (slug: ${slug})`);
        const defaultData = getDefaultBrandData(franchise);
        
        // Add to compare list using functional update to prevent duplicates
        // Always read from storage first to get latest state
        let added = false;
        setCompareItems((prev) => {
          // Read fresh from storage to ensure we have latest state
          const latestFromStorage = getUserData<CompareFranchise[]>(user.id, 'compare', []);
          
          // Use the longer array (either prev or storage) to ensure we have all items
          const latestItems = latestFromStorage.length >= prev.length ? latestFromStorage : prev;
          
          // Double-check for duplicates using latest state
          if (latestItems.some((item) => item.id === defaultData.id)) {
            added = true; // Already added
            return latestItems;
          }
          
          // Double-check max items using latest state
          if (latestItems.length >= MAX_COMPARE_ITEMS) {
            return latestItems; // Max items reached (shouldn't happen due to check above, but safety)
          }
          
          const newItems = [...latestItems, defaultData];
          // Update user-specific storage immediately (synchronous) - CRITICAL
          setUserData(user.id, 'compare', newItems);
          added = true;
          return newItems;
        });
        
        // Ensure localStorage is written before returning
        // Force a small delay to ensure state and storage are in sync
        await new Promise(resolve => setTimeout(resolve, 50));
        return added;
      }
      
      // Map BrandData to CompareFranchise format
      const fullFranchiseData: CompareFranchise = {
        id: brandData.id || franchise.id, // Use franchise.id if API doesn't match
        name: brandData.name || franchise.name, // Use franchise.name if API doesn't match
        logo: brandData.logo || franchise.logo,
        grade: (brandData.grade as "A" | "B" | "C" | "D") || franchise.grade || "A",
        investmentMin: brandData.investment.min || franchise.investmentMin,
        investmentMax: brandData.investment.max || franchise.investmentMax,
        franchiseFee: brandData.investment.franchiseFee,
        workingCapital: brandData.investment.workingCapital,
        marketingFee: brandData.investment.marketing,
        initialTerm: brandData.investment.initialTerm,
        royalty: brandData.investment.royalty,
        locations: brandData.locations,
        founded: brandData.founded,
        item19Disclosed: brandData.item19Disclosed,
        // Map whyBuyersLike to whyYes and comparisonStrengths to whyNot
        whyYes: brandData.whyBuyersLike || franchise.whyYes || [],
        whyNot: brandData.comparisonStrengths || franchise.whyNot || [],
        // Additional profitability data if available
        avgRevenue: (brandData as any)?.profitability?.avgRevenue || franchise.avgRevenue,
        avgProfit: (brandData as any)?.profitability?.avgProfit || franchise.avgProfit,
      };

      // Add to compare list using functional update to prevent duplicates
      // Always read from storage first to get latest state
      let added = false;
      setCompareItems((prev) => {
        // Read fresh from storage to ensure we have latest state
        const latestFromStorage = getUserData<CompareFranchise[]>(user.id, 'compare', []);
        
        // Use the longer array (either prev or storage) to ensure we have all items
        const latestItems = latestFromStorage.length >= prev.length ? latestFromStorage : prev;
        
        // Double-check for duplicates using latest state
        if (latestItems.some((item) => item.id === fullFranchiseData.id)) {
          added = true; // Already added
          return latestItems;
        }
        
        // Double-check max items using latest state
        if (latestItems.length >= MAX_COMPARE_ITEMS) {
          return latestItems; // Max items reached (shouldn't happen due to check above, but safety)
        }
        
        const newItems = [...latestItems, fullFranchiseData];
        // Update user-specific storage immediately (synchronous) - CRITICAL
        setUserData(user.id, 'compare', newItems);
        added = true;
        return newItems;
      });

      // Ensure localStorage is written before returning
      await new Promise(resolve => setTimeout(resolve, 50));
      return added;
    } catch (error) {
      console.error("Failed to fetch brand data for compare:", error);
      // Fallback: Use default brand data (HubSpot-friendly structure)
      // This uses the actual brand information passed in, not generic Subway data
      const defaultData = getDefaultBrandData(franchise);
      
      // Add to compare list using functional update to prevent duplicates
      // Always read from storage first to get latest state
      let added = false;
      setCompareItems((prev) => {
        // Read fresh from storage to ensure we have latest state
        const latestFromStorage = getUserData<CompareFranchise[]>(user.id, 'compare', []);
        
        // Use the longer array (either prev or storage) to ensure we have all items
        const latestItems = latestFromStorage.length >= prev.length ? latestFromStorage : prev;
        
        // Double-check for duplicates using latest state
        if (latestItems.some((item) => item.id === defaultData.id)) {
          added = true; // Already added
          return latestItems;
        }
        
        // Double-check max items using latest state
        if (latestItems.length >= MAX_COMPARE_ITEMS) {
          return latestItems; // Max items reached (shouldn't happen due to check above, but safety)
        }
        
        const newItems = [...latestItems, defaultData];
        // Update user-specific storage immediately (synchronous) - CRITICAL
        setUserData(user.id, 'compare', newItems);
        added = true;
        return newItems;
      });

      // Ensure localStorage is written before returning
      await new Promise(resolve => setTimeout(resolve, 50));
      return added;
    }
  };

  const removeFromCompare = (id: string) => {
    if (!user) return;
    
    setCompareItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      // Update user-specific storage immediately (synchronous) - CRITICAL
      setUserData(user.id, 'compare', newItems);
      return newItems;
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (id: string): boolean => {
    return compareItems.some((item) => item.id === id);
  };

  return {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore: compareItems.length < MAX_COMPARE_ITEMS,
  };
}

