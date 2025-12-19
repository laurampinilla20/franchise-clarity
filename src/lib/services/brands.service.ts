import type { BrandGrade, BrandGradeData, BrandService } from './types';

/**
 * Mock Brand Service Implementation
 * Uses localStorage for persistence
 * Can be replaced with HubSpotBrandService when ready
 */
class MockBrandService implements BrandService {
  private readonly STORAGE_KEY = 'franchise_clarity_brand_grades';
  private readonly DEFAULT_GRADE: BrandGrade = 'A';

  private getGrades(): Map<string, BrandGradeData> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return new Map();
    
    try {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    } catch {
      return new Map();
    }
  }

  private saveGrades(grades: Map<string, BrandGradeData>): void {
    const data = Object.fromEntries(grades);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async getGrade(brandSlug: string): Promise<BrandGrade | null> {
    const grades = this.getGrades();
    const gradeData = grades.get(brandSlug);
    
    if (gradeData) {
      return gradeData.grade;
    }
    
    // Return default grade if not found
    // In production, this would fetch from HubSpot/database
    return this.DEFAULT_GRADE;
  }

  async getGradeByBrandId(brandId: string): Promise<BrandGrade | null> {
    const grades = this.getGrades();
    
    // Find by brandId
    for (const gradeData of grades.values()) {
      if (gradeData.brandId === brandId) {
        return gradeData.grade;
      }
    }
    
    // Return default grade if not found
    return this.DEFAULT_GRADE;
  }

  async updateGrade(brandSlug: string, grade: BrandGrade): Promise<BrandGradeData> {
    const grades = this.getGrades();
    const now = new Date().toISOString();
    
    const gradeData: BrandGradeData = {
      brandId: `brand_${brandSlug}`, // Mock brandId, would come from HubSpot
      brandSlug,
      grade,
      lastUpdated: now,
    };

    grades.set(brandSlug, gradeData);
    this.saveGrades(grades);

    return gradeData;
  }
}

export default MockBrandService;



