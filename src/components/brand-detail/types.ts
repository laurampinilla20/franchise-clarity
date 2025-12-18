import { BrandData } from "@/api/brands";

export interface BrandDetailSectionProps {
  brandData: BrandData;
  isLoggedIn: boolean;
  onUnlockClick?: (section?: string) => void;
  onSimilarBrandClick?: (brandSlug?: string) => void;
  onCompareClick?: () => void;
  onAffordabilityCalculatorClick?: () => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}


