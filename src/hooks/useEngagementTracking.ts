import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getEngagementService } from '@/lib/services';

/**
 * Engagement Tracking Hook
 * 
 * Tracks user actions and sends them to engagement service.
 * Currently uses mock service (localStorage), ready for HubSpot integration.
 */
export function useEngagementTracking() {
  const { user, isLoggedIn } = useAuth();
  const engagementService = getEngagementService();

  const track = useCallback(
    async (
      type: 'page_view' | 'unlock' | 'save' | 'compare' | 'sign_up' | 'sign_in',
      brandId?: string,
      brandName?: string,
      metadata?: Record<string, unknown>
    ) => {
      if (!isLoggedIn || !user) {
        // Silently skip tracking if user is not logged in
        return;
      }

      try {
        await engagementService.track({
          type,
          userId: user.id,
          brandId,
          brandName,
          timestamp: new Date().toISOString(),
          metadata,
        });
      } catch (error) {
        console.error('Engagement tracking error:', error);
        // Don't throw - tracking failures shouldn't break the app
      }
    },
    [isLoggedIn, user, engagementService]
  );

  const trackPageView = useCallback(
    (brandId?: string, brandName?: string) => {
      return track('page_view', brandId, brandName);
    },
    [track]
  );

  const trackUnlock = useCallback(
    (brandId: string, brandName: string) => {
      return track('unlock', brandId, brandName);
    },
    [track]
  );

  const trackSave = useCallback(
    (brandId: string, brandName: string) => {
      return track('save', brandId, brandName);
    },
    [track]
  );

  const trackCompare = useCallback(
    (brandIds: string[], brandNames: string[]) => {
      return track('compare', undefined, undefined, {
        brandIds,
        brandNames,
        count: brandIds.length,
      });
    },
    [track]
  );

  const trackSignUp = useCallback(() => {
    return track('sign_up');
  }, [track]);

  const trackSignIn = useCallback(() => {
    return track('sign_in');
  }, [track]);

  return {
    track,
    trackPageView,
    trackUnlock,
    trackSave,
    trackCompare,
    trackSignUp,
    trackSignIn,
  };
}



