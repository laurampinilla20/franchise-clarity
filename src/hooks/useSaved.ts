import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEngagementService } from "@/lib/services";
import { getUserData, setUserData } from "@/utils/userStorage";

/**
 * Saved Franchise Interface
 * HubSpot-friendly structure for database integration
 */
export interface SavedFranchise {
  id: string; // Brand ID (e.g., "subway-1")
  name: string; // Brand name
  logo?: string | null; // Brand logo URL
  grade?: "A" | "B" | "C" | "D"; // Brand grade
  investmentMin?: number; // Minimum investment
  investmentMax?: number; // Maximum investment
  sector?: string; // Industry sector
  category?: string; // Category
  fitChips?: {
    territory: boolean;
    lifestyle: boolean;
    budget: boolean;
  };
  timestamp?: string; // ISO timestamp when saved
}

// Removed global storage key - now using user-specific storage

/**
 * Saved Franchises Hook
 * 
 * Manages user saved franchises.
 * HubSpot-friendly: Ready for database integration.
 * 
 * TODO: Replace localStorage with API calls:
 * - POST /api/saved - Add saved franchise
 * - DELETE /api/saved/:id - Remove saved franchise
 * - GET /api/saved - Get all saved franchises
 * 
 * HubSpot Integration Points:
 * - Track save/unsave events in HubSpot
 * - Store saved franchises in HubSpot contact properties
 * - Sync saved items across devices via API
 */
export function useSaved() {
  const { user, isLoggedIn } = useAuth();
  const engagementService = getEngagementService();
  const [savedItems, setSavedItems] = useState<SavedFranchise[]>([]);

  // Load from user-specific storage on mount - only for logged-in users
  useEffect(() => {
    if (isLoggedIn && user) {
      // Load user-specific saved items
      const userSaved = getUserData<SavedFranchise[]>(user.id, 'saved', []);
      setSavedItems(userSaved);
    } else {
      // Clear saved items for public users
      setSavedItems([]);
    }
  }, [isLoggedIn, user]);

  // Note: We don't sync on every state change here to avoid race conditions
  // Instead, we save directly to localStorage when state changes in addSaved/removeSaved

  /**
   * Track save action to HubSpot
   * HubSpot-friendly: Can be sent to HubSpot API
   */
  const trackSaveAction = useCallback(
    async (
      action: "save" | "unsave",
      franchise: SavedFranchise
    ) => {
      if (!isLoggedIn || !user) return;

      try {
        await engagementService.track({
          type: "save", // Reuse existing save type
          userId: user.id,
          brandId: franchise.id,
          brandName: franchise.name,
          timestamp: new Date().toISOString(),
          metadata: {
            saveAction: action,
            franchiseId: franchise.id,
            franchiseName: franchise.name,
            // HubSpot-friendly: These fields can be mapped to HubSpot contact properties
            // e.g., "saved_franchises", "save_timestamp"
          },
        });
      } catch (error) {
        console.error("Failed to track save action:", error);
        // Don't throw - tracking failures shouldn't break the app
      }
    },
    [isLoggedIn, user, engagementService]
  );

  /**
   * Add franchise to saved
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   * Only works for logged-in users
   */
  const addSaved = useCallback(
    async (franchise: SavedFranchise) => {
      // Only allow for logged-in users
      if (!isLoggedIn) {
        return;
      }

      const franchiseWithTimestamp: SavedFranchise = {
        ...franchise,
        timestamp: new Date().toISOString(),
      };

      // Use functional state updates to avoid race conditions with rapid clicks
      setSavedItems((prev) => {
        // Check if already saved using current state (prev)
        if (prev.some((item) => item.id === franchise.id)) {
          return prev; // Already saved, no change
        }
        // Add to saved using current state
        const newSaved = [...prev, franchiseWithTimestamp];
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'saved', newSaved);
        }
        return newSaved;
      });

      // Track to HubSpot asynchronously (doesn't block UI)
      trackSaveAction("save", franchise).catch((error) => {
        console.error("Failed to track save action:", error);
      });

      // TODO: Replace with API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API
      // fetch('/api/saved', {
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
    [trackSaveAction, isLoggedIn, user]
  );

  /**
   * Remove franchise from saved
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   * Only works for logged-in users
   */
  const removeSaved = useCallback(
    async (id: string) => {
      // Only allow for logged-in users
      if (!isLoggedIn) {
        return;
      }

      // Use functional state update to get current franchise before removing
      let franchiseToTrack: SavedFranchise | undefined;

      setSavedItems((prev) => {
        franchiseToTrack = prev.find((item) => item.id === id);
        const newSaved = prev.filter((item) => item.id !== id);
        // Save to localStorage immediately (synchronous) - CRITICAL
        if (user) {
          setUserData(user.id, 'saved', newSaved);
        }
        return newSaved;
      });

      // Track to HubSpot asynchronously (doesn't block UI)
      if (franchiseToTrack) {
        trackSaveAction("unsave", franchiseToTrack).catch((error) => {
          console.error("Failed to track unsave action:", error);
        });
      }

      // TODO: Replace with API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API
      // fetch(`/api/saved/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user?.id, franchiseId: id })
      // }).catch(error => console.error('API error:', error));
    },
    [trackSaveAction, isLoggedIn, user]
  );

  /**
   * Check if franchise is saved
   */
  const isSaved = useCallback(
    (id: string): boolean => {
      return savedItems.some((item) => item.id === id);
    },
    [savedItems]
  );

  // Listen for storage changes to sync across tabs - user-specific
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    const userSavedKey = `franchise_clarity_${user.id}_saved`;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === userSavedKey) {
        setSavedItems(getUserData<SavedFranchise[]>(user.id, 'saved', []));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn, user]);

  return {
    savedItems,
    addSaved,
    removeSaved,
    isSaved,
  };
}

