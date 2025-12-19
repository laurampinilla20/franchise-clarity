import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEngagementService } from "@/lib/services";
import { getUserData, setUserData } from "@/utils/userStorage";

/**
 * Franchise Preference Interface
 * HubSpot-friendly structure for database integration
 */
export interface FranchisePreference {
  id: string; // Brand ID (e.g., "subway-1")
  name: string; // Brand name
  logo?: string | null; // Brand logo URL
  timestamp?: string; // ISO timestamp when preference was set
}

const DEFAULT_LIKES: FranchisePreference[] = [
  { id: "mcdonalds-1", name: "McDonald's", logo: null },
  { id: "starbucks-1", name: "Starbucks", logo: null },
  { id: "dominos-1", name: "Domino's Pizza", logo: null },
];

const DEFAULT_DISLIKES: FranchisePreference[] = [
  { id: "kfc-1", name: "KFC", logo: null },
  { id: "pizzahut-1", name: "Pizza Hut", logo: null },
];

/**
 * Preferences Hook
 * 
 * Manages user likes/dislikes for franchises.
 * HubSpot-friendly: Ready for database integration.
 * 
 * TODO: Replace localStorage with API calls:
 * - POST /api/preferences/like - Add like
 * - DELETE /api/preferences/like/:id - Remove like
 * - POST /api/preferences/dislike - Add dislike
 * - DELETE /api/preferences/dislike/:id - Remove dislike
 * - GET /api/preferences - Get all preferences
 * 
 * HubSpot Integration Points:
 * - Track like/dislike events in HubSpot
 * - Store preferences in HubSpot contact properties
 * - Sync preferences across devices via API
 */
export function usePreferences() {
  const { user, isLoggedIn } = useAuth();
  const engagementService = getEngagementService();
  const [likedItems, setLikedItems] = useState<FranchisePreference[]>([]);
  const [dislikedItems, setDislikedItems] = useState<FranchisePreference[]>([]);

  // Load from user-specific storage on mount - only for logged-in users
  useEffect(() => {
    if (isLoggedIn && user) {
      // Load user-specific data
      const userLikes = getUserData<FranchisePreference[]>(user.id, 'likes', DEFAULT_LIKES);
      const userDislikes = getUserData<FranchisePreference[]>(user.id, 'dislikes', DEFAULT_DISLIKES);
      
      setLikedItems(userLikes);
      setDislikedItems(userDislikes);
    } else {
      // Clear preferences for public users
      setLikedItems([]);
      setDislikedItems([]);
    }
  }, [isLoggedIn, user]);

  // Note: We don't sync on every state change here to avoid race conditions
  // Instead, we save directly to localStorage when state changes in addLike/removeLike/addDislike/removeDislike

  /**
   * Track preference action to HubSpot
   * HubSpot-friendly: Can be sent to HubSpot API
   */
  const trackPreferenceAction = useCallback(
    async (
      action: "like" | "dislike" | "unlike" | "undislike",
      franchise: FranchisePreference
    ) => {
      if (!isLoggedIn || !user) return;

      try {
        await engagementService.track({
          type: action === "like" || action === "unlike" ? "save" : "compare", // Reuse existing types
          userId: user.id,
          brandId: franchise.id,
          brandName: franchise.name,
          timestamp: new Date().toISOString(),
          metadata: {
            preferenceAction: action,
            franchiseId: franchise.id,
            franchiseName: franchise.name,
            // HubSpot-friendly: These fields can be mapped to HubSpot contact properties
            // e.g., "liked_franchises", "disliked_franchises", "preference_timestamp"
          },
        });
      } catch (error) {
        console.error("Failed to track preference action:", error);
        // Don't throw - tracking failures shouldn't break the app
      }
    },
    [isLoggedIn, user, engagementService]
  );

  /**
   * Add franchise to likes
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   */
  const addLike = useCallback(
    async (franchise: FranchisePreference) => {
      // Only allow for logged-in users
      if (!isLoggedIn) {
        return;
      }

      const franchiseWithTimestamp: FranchisePreference = {
        ...franchise,
        timestamp: new Date().toISOString(),
      };

      // Use functional state updates to avoid race conditions with rapid clicks
      setLikedItems((prev) => {
        // Check if already liked using current state (prev)
        if (prev.some((item) => item.id === franchise.id)) {
          return prev; // Already liked, no change
        }
        // Add to likes using current state
        const newLikes = [...prev, franchiseWithTimestamp];
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'likes', newLikes);
        }
        return newLikes;
      });

      // Remove from dislikes using functional update to ensure we work with latest state
      setDislikedItems((prev) => {
        const newDislikes = prev.filter((item) => item.id !== franchise.id);
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'dislikes', newDislikes);
        }
        return newDislikes;
      });
      
      // Track to HubSpot asynchronously (doesn't block UI)
      trackPreferenceAction("like", franchise).catch((error) => {
        console.error("Failed to track like action:", error);
      });

      // TODO: Replace with API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API
      // fetch('/api/preferences/like', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     franchiseId: franchise.id, 
      //     franchiseName: franchise.name,
      //     userId: user?.id,
      //     timestamp: franchiseWithTimestamp.timestamp
      //   })
      // }).catch(error => console.error('API error:', error));
    },
    [trackPreferenceAction, isLoggedIn, user]
  );

  /**
   * Remove franchise from likes
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   * Only works for logged-in users
   */
  const removeLike = useCallback(
    async (id: string) => {
      // Only allow for logged-in users
      if (!isLoggedIn) {
        return;
      }

      // Use functional state update to get current franchise before removing
      let franchiseToTrack: FranchisePreference | undefined;
      
      setLikedItems((prev) => {
        franchiseToTrack = prev.find((item) => item.id === id);
        const newLikes = prev.filter((item) => item.id !== id);
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'likes', newLikes);
        }
        return newLikes;
      });
      
      // Track to HubSpot asynchronously (doesn't block UI)
      if (franchiseToTrack) {
        trackPreferenceAction("unlike", franchiseToTrack).catch((error) => {
          console.error("Failed to track unlike action:", error);
        });
      }

      // TODO: Replace with API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API
      // fetch(`/api/preferences/like/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user?.id, franchiseId: id })
      // }).catch(error => console.error('API error:', error));
    },
    [trackPreferenceAction, isLoggedIn, user]
  );

  /**
   * Add franchise to dislikes
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   */
  const addDislike = useCallback(
    async (franchise: FranchisePreference) => {
      // Only allow for logged-in users
      if (!isLoggedIn) {
        return;
      }

      const franchiseWithTimestamp: FranchisePreference = {
        ...franchise,
        timestamp: new Date().toISOString(),
      };

      // Use functional state updates to avoid race conditions with rapid clicks
      setDislikedItems((prev) => {
        // Check if already disliked using current state (prev)
        if (prev.some((item) => item.id === franchise.id)) {
          return prev; // Already disliked, no change
        }
        // Add to dislikes using current state
        const newDislikes = [...prev, franchiseWithTimestamp];
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'dislikes', newDislikes);
        }
        return newDislikes;
      });

      // Remove from likes using functional update to ensure we work with latest state
      setLikedItems((prev) => {
        const newLikes = prev.filter((item) => item.id !== franchise.id);
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'likes', newLikes);
        }
        return newLikes;
      });
      
      // Track to HubSpot asynchronously (doesn't block UI)
      trackPreferenceAction("dislike", franchise).catch((error) => {
        console.error("Failed to track dislike action:", error);
      });

      // TODO: Replace with API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API
      // fetch('/api/preferences/dislike', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     franchiseId: franchise.id,
      //     franchiseName: franchise.name,
      //     userId: user?.id,
      //     timestamp: franchiseWithTimestamp.timestamp
      //   })
      // }).catch(error => console.error('API error:', error));
    },
    [trackPreferenceAction, isLoggedIn, user]
  );

  /**
   * Remove franchise from dislikes
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   * Only works for logged-in users
   */
  const removeDislike = useCallback(
    async (id: string) => {
      // Only allow for logged-in users
      if (!isLoggedIn) {
        return;
      }

      // Use functional state update to get current franchise before removing
      let franchiseToTrack: FranchisePreference | undefined;
      
      setDislikedItems((prev) => {
        franchiseToTrack = prev.find((item) => item.id === id);
        const newDislikes = prev.filter((item) => item.id !== id);
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'dislikes', newDislikes);
        }
        return newDislikes;
      });
      
      // Track to HubSpot asynchronously (doesn't block UI)
      if (franchiseToTrack) {
        trackPreferenceAction("undislike", franchiseToTrack).catch((error) => {
          console.error("Failed to track undislike action:", error);
        });
      }

      // TODO: Replace with API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API
      // fetch(`/api/preferences/dislike/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user?.id, franchiseId: id })
      // }).catch(error => console.error('API error:', error));
    },
    [trackPreferenceAction, isLoggedIn, user]
  );

  // Listen for storage changes to sync across tabs - user-specific
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    const userLikesKey = `franchise_clarity_${user.id}_likes`;
    const userDislikesKey = `franchise_clarity_${user.id}_dislikes`;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === userLikesKey) {
        setLikedItems(getUserData<FranchisePreference[]>(user.id, 'likes', []));
      } else if (e.key === userDislikesKey) {
        setDislikedItems(getUserData<FranchisePreference[]>(user.id, 'dislikes', []));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn, user]);

  return {
    likedItems,
    dislikedItems,
    addLike,
    removeLike,
    addDislike,
    removeDislike,
  };
}

