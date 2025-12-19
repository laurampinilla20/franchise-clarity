import type { Engagement, EngagementData, EngagementService } from './types';

/**
 * Mock Engagement Service Implementation
 * Uses localStorage for persistence
 * Can be replaced with HubSpotEngagementService when ready
 */
class MockEngagementService implements EngagementService {
  private readonly STORAGE_KEY = 'franchise_clarity_engagements';

  private getEngagements(): Engagement[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  private saveEngagements(engagements: Engagement[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(engagements));
  }

  async track(engagementData: EngagementData): Promise<Engagement> {
    const engagements = this.getEngagements();
    const now = new Date().toISOString();

    const engagement: Engagement = {
      id: `engagement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: engagementData.type,
      brandId: engagementData.brandId,
      brandName: engagementData.brandName,
      timestamp: engagementData.timestamp || now,
      userId: engagementData.userId,
      metadata: engagementData.metadata || {},
    };

    engagements.push(engagement);
    this.saveEngagements(engagements);

    return engagement;
  }

  async trackPageView(userId: string, brandId?: string, brandName?: string): Promise<Engagement> {
    return this.track({
      type: 'page_view',
      userId,
      brandId,
      brandName,
      timestamp: new Date().toISOString(),
    });
  }

  async trackUnlock(userId: string, brandId: string, brandName: string): Promise<Engagement> {
    return this.track({
      type: 'unlock',
      userId,
      brandId,
      brandName,
      timestamp: new Date().toISOString(),
    });
  }

  async trackSave(userId: string, brandId: string, brandName: string): Promise<Engagement> {
    return this.track({
      type: 'save',
      userId,
      brandId,
      brandName,
      timestamp: new Date().toISOString(),
    });
  }

  async getByUserId(userId: string): Promise<Engagement[]> {
    const engagements = this.getEngagements();
    return engagements.filter(e => e.userId === userId);
  }
}

export default MockEngagementService;


