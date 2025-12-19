import MockContactService from './contacts.service';
import MockEngagementService from './engagements.service';
import MockBrandService from './brands.service';
import type { ContactService, EngagementService, BrandService } from './types';

/**
 * Service Configuration and Factory
 * 
 * Currently returns mock services.
 * When HubSpot is ready, update this to switch based on environment variables:
 * 
 * export const getContactService = (): ContactService => {
 *   if (import.meta.env.VITE_USE_HUBSPOT === 'true') {
 *     return new HubSpotContactService();
 *   }
 *   return new MockContactService();
 * };
 */

export const getContactService = (): ContactService => {
  return new MockContactService();
};

export const getEngagementService = (): EngagementService => {
  return new MockEngagementService();
};

export const getBrandService = (): BrandService => {
  return new MockBrandService();
};

