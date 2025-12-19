/**
 * Type definitions for service layer
 * These interfaces are designed to match HubSpot API structure for easy integration later
 */

export interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  // Custom properties that match HubSpot structure
  franchiseInterests?: string[];
  investmentRange?: string;
  unlockedBrands?: string[];
  signUpDate?: string;
  lastActivityDate?: string;
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  franchiseInterests?: string[];
  investmentRange?: string;
  unlockedBrands?: string[];
  signUpDate?: string;
  lastActivityDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngagementData {
  type: 'page_view' | 'unlock' | 'save' | 'compare' | 'sign_up' | 'sign_in';
  brandId?: string;
  brandName?: string;
  timestamp: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface Engagement {
  id: string;
  type: EngagementData['type'];
  brandId?: string;
  brandName?: string;
  timestamp: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Contact Service Interface
 * Matches HubSpot Contacts API patterns
 */
export interface ContactService {
  createOrUpdate(contact: ContactData): Promise<Contact>;
  getByEmail(email: string): Promise<Contact | null>;
  getById(id: string): Promise<Contact | null>;
  updateLastActivity(email: string): Promise<void>;
}

/**
 * Engagement Service Interface
 * Matches HubSpot Engagements API patterns
 */
export interface EngagementService {
  track(engagement: EngagementData): Promise<Engagement>;
  trackPageView(userId: string, brandId?: string, brandName?: string): Promise<Engagement>;
  trackUnlock(userId: string, brandId: string, brandName: string): Promise<Engagement>;
  trackSave(userId: string, brandId: string, brandName: string): Promise<Engagement>;
  getByUserId(userId: string): Promise<Engagement[]>;
}

/**
 * Brand Grade Data
 */
export type BrandGrade = "A" | "B" | "C" | "D" | "F";

export interface BrandGradeData {
  brandId: string;
  brandSlug: string;
  grade: BrandGrade;
  lastUpdated: string;
}

/**
 * Brand Service Interface
 * For fetching brand grades and other brand-related data
 * Matches HubSpot Custom Objects API patterns
 */
export interface BrandService {
  getGrade(brandSlug: string): Promise<BrandGrade | null>;
  getGradeByBrandId(brandId: string): Promise<BrandGrade | null>;
  updateGrade(brandSlug: string, grade: BrandGrade): Promise<BrandGradeData>;
}

