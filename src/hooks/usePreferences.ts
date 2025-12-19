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

// No default data - users start with empty likes/dislikes
// HubSpot-friendly: All preferences are user-generated and tracked

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
  // HubSpot-friendly: Loads user preferences from storage (can be replaced with HubSpot API)
  useEffect(() => {
    if (isLoggedIn && user) {
      // Load user-specific data - start with empty arrays for new users
      // HubSpot-friendly: Can fetch from HubSpot contact properties
      // const hubspotLikes = await fetch(`/api/hubspot/user/${user.id}/likes`);
      // const hubspotDislikes = await fetch(`/api/hubspot/user/${user.id}/dislikes`);
      const userLikes = getUserData<FranchisePreference[]>(user.id, 'likes', []);
      const userDislikes = getUserData<FranchisePreference[]>(user.id, 'dislikes', []);
      
      setLikedItems(userLikes);
      setDislikedItems(userDislikes);
      
      console.log(`[usePreferences] Loaded ${userLikes.length} likes and ${userDislikes.length} dislikes for user ${user.id}`);
    } else {
      // Clear preferences for public users
      setLikedItems([]);
      setDislikedItems([]);
    }
  }, [isLoggedIn, user]);

  // Listen for storage changes to sync across tabs and components
  // This ensures that rapid clicks across different components are all captured
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    const userLikesKey = `franchise_clarity_${user.id}_likes`;
    const userDislikesKey = `franchise_clarity_${user.id}_dislikes`;
    
    const handleStorageChange = (e: StorageEvent) => {
      // Handle cross-tab synchronization
      if (e.key === userLikesKey && e.newValue) {
        try {
          const newLikes = JSON.parse(e.newValue);
          setLikedItems(newLikes);
          console.log(`[usePreferences] Synced likes from storage: ${newLikes.length} items`);
        } catch (error) {
          console.error('Failed to parse likes from storage event:', error);
        }
      } else if (e.key === userDislikesKey && e.newValue) {
        try {
          const newDislikes = JSON.parse(e.newValue);
          setDislikedItems(newDislikes);
          console.log(`[usePreferences] Synced dislikes from storage: ${newDislikes.length} items`);
        } catch (error) {
          console.error('Failed to parse dislikes from storage event:', error);
        }
      }
    };

    // Also check localStorage directly for same-tab updates (storage events only fire for other tabs)
    const checkForUpdates = () => {
      const currentLikes = getUserData<FranchisePreference[]>(user.id, 'likes', []);
      const currentDislikes = getUserData<FranchisePreference[]>(user.id, 'dislikes', []);
      
      setLikedItems((prev) => {
        // Only update if there's a meaningful difference
        if (currentLikes.length !== prev.length || 
            currentLikes.some((item, index) => item.id !== prev[index]?.id)) {
          return currentLikes;
        }
        return prev;
      });
      
      setDislikedItems((prev) => {
        if (currentDislikes.length !== prev.length || 
            currentDislikes.some((item, index) => item.id !== prev[index]?.id)) {
          return currentDislikes;
        }
        return prev;
      });
    };

    // Check immediately and then periodically
    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, 100); // Check every 100ms for rapid updates

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
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
   * Ensures all clicks are saved to user account database (HubSpot-friendly)
   */
  const addLike = useCallback(
    async (franchise: FranchisePreference) => {
      // Only allow for logged-in users
      if (!isLoggedIn || !user) {
        console.warn('addLike called but user is not logged in or user data not available');
        return;
      }

      const franchiseWithTimestamp: FranchisePreference = {
        ...franchise,
        timestamp: new Date().toISOString(),
      };

      // Use functional state updates to avoid race conditions with rapid clicks
      // This ensures that even if user clicks 3 likes rapidly, all 3 are saved
      // CRITICAL: Always read from localStorage to get the absolute latest state
      // This prevents losing clicks when multiple components update simultaneously
      setLikedItems((prev) => {
        // Always read fresh from localStorage to get latest state from any component
        const currentLikesFromStorage = getUserData<FranchisePreference[]>(user.id, 'likes', []);
        
        // Use the longer array (either prev or storage) to ensure we have all items
        // This handles rapid clicks across multiple components
        const latestLikes = currentLikesFromStorage.length >= prev.length 
          ? currentLikesFromStorage 
          : prev;
        
        // Check if already liked using latest state - prevents duplicates
        if (latestLikes.some((item) => item.id === franchise.id)) {
          console.log(`Franchise ${franchise.name} already in likes, skipping`);
          return latestLikes; // Already liked, return latest state
        }
        
        // Add to likes using latest state - ensures all rapid clicks are processed
        const newLikes = [...latestLikes, franchiseWithTimestamp];
        
        // Save to localStorage immediately (synchronous) - CRITICAL for data persistence
        // HubSpot-friendly: This data structure is ready for HubSpot contact properties
        setUserData(user.id, 'likes', newLikes);
        
        console.log(`✓ Saved like for ${franchise.name} to user account (${user.id}). Total likes: ${newLikes.length}`);
        
        return newLikes;
      });

      // Remove from dislikes using functional update to ensure we work with latest state
      setDislikedItems((prev) => {
        // Only update if this franchise was in dislikes
        if (prev.some((item) => item.id === franchise.id)) {
          const newDislikes = prev.filter((item) => item.id !== franchise.id);
          // Save to localStorage immediately (synchronous) - CRITICAL
          setUserData(user.id, 'dislikes', newDislikes);
          return newDislikes;
        }
        return prev; // No change needed
      });
      
      // Track to HubSpot asynchronously (doesn't block UI)
      // HubSpot-friendly: This tracks the action for analytics and CRM integration
      trackPreferenceAction("like", franchise).catch((error) => {
        console.error("Failed to track like action:", error);
      });

      // TODO: Replace with HubSpot API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API to store in contact properties
      // Example HubSpot API call:
      // fetch('/api/hubspot/contacts/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     contactId: user.id, // HubSpot contact ID
      //     properties: {
      //       liked_franchises: JSON.stringify(newLikes), // Store as JSON string in HubSpot
      //       last_like_timestamp: franchiseWithTimestamp.timestamp,
      //       total_likes: newLikes.length
      //     }
      //   })
      // }).catch(error => console.error('HubSpot API error:', error));
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
   * Ensures all clicks are saved to user account database (HubSpot-friendly)
   */
  const addDislike = useCallback(
    async (franchise: FranchisePreference) => {
      // Only allow for logged-in users
      if (!isLoggedIn || !user) {
        console.warn('addDislike called but user is not logged in or user data not available');
        return;
      }

      const franchiseWithTimestamp: FranchisePreference = {
        ...franchise,
        timestamp: new Date().toISOString(),
      };

      // Use functional state updates to avoid race conditions with rapid clicks
      // This ensures that even if user clicks 3 dislikes rapidly, all 3 are saved
      // CRITICAL: Always read from localStorage to get the absolute latest state
      // This prevents losing clicks when multiple components update simultaneously
      setDislikedItems((prev) => {
        // Always read fresh from localStorage to get latest state from any component
        const currentDislikesFromStorage = getUserData<FranchisePreference[]>(user.id, 'dislikes', []);
        
        // Use the longer array (either prev or storage) to ensure we have all items
        // This handles rapid clicks across multiple components
        const latestDislikes = currentDislikesFromStorage.length >= prev.length 
          ? currentDislikesFromStorage 
          : prev;
        
        // Check if already disliked using latest state - prevents duplicates
        if (latestDislikes.some((item) => item.id === franchise.id)) {
          console.log(`Franchise ${franchise.name} already in dislikes, skipping`);
          return latestDislikes; // Already disliked, return latest state
        }
        
        // Add to dislikes using latest state - ensures all rapid clicks are processed
        const newDislikes = [...latestDislikes, franchiseWithTimestamp];
        
        // Save to localStorage immediately (synchronous) - CRITICAL for data persistence
        // HubSpot-friendly: This data structure is ready for HubSpot contact properties
        setUserData(user.id, 'dislikes', newDislikes);
        
        console.log(`✓ Saved dislike for ${franchise.name} to user account (${user.id}). Total dislikes: ${newDislikes.length}`);
        
        return newDislikes;
      });

      // Remove from likes using functional update to ensure we work with latest state
      setLikedItems((prev) => {
        // Only update if this franchise was in likes
        if (prev.some((item) => item.id === franchise.id)) {
          const newLikes = prev.filter((item) => item.id !== franchise.id);
          // Save to localStorage immediately (synchronous) - CRITICAL
          setUserData(user.id, 'likes', newLikes);
          return newLikes;
        }
        return prev; // No change needed
      });
      
      // Track to HubSpot asynchronously (doesn't block UI)
      // HubSpot-friendly: This tracks the action for analytics and CRM integration
      trackPreferenceAction("dislike", franchise).catch((error) => {
        console.error("Failed to track dislike action:", error);
      });

      // TODO: Replace with HubSpot API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API to store in contact properties
      // Example HubSpot API call:
      // fetch('/api/hubspot/contacts/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     contactId: user.id, // HubSpot contact ID
      //     properties: {
      //       disliked_franchises: JSON.stringify(newDislikes), // Store as JSON string in HubSpot
      //       last_dislike_timestamp: franchiseWithTimestamp.timestamp,
      //       total_dislikes: newDislikes.length
      //     }
      //   })
      // }).catch(error => console.error('HubSpot API error:', error));
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

