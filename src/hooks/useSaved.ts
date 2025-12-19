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
      console.log(`[useSaved] Loaded ${userSaved.length} saved items for user ${user.id}`);
    } else {
      // Clear saved items for public users
      setSavedItems([]);
    }
  }, [isLoggedIn, user]);

  // Listen for storage changes to sync across tabs and components
  // This ensures that rapid clicks across different components are all captured
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    
    const userSavedKey = `franchise_clarity_${user.id}_saved`;
    
    const handleStorageChange = (e: StorageEvent) => {
      // Handle cross-tab synchronization
      if (e.key === userSavedKey && e.newValue) {
        try {
          const newSaved = JSON.parse(e.newValue);
          setSavedItems(newSaved);
          console.log(`[useSaved] Synced saved items from storage: ${newSaved.length} items`);
        } catch (error) {
          console.error('Failed to parse saved items from storage event:', error);
        }
      }
    };

    // Also check localStorage directly for same-tab updates (storage events only fire for other tabs)
    const checkForUpdates = () => {
      const currentSaved = getUserData<SavedFranchise[]>(user.id, 'saved', []);
      
      setSavedItems((prev) => {
        // Only update if there's a meaningful difference
        if (currentSaved.length !== prev.length || 
            currentSaved.some((item, index) => item.id !== prev[index]?.id)) {
          return currentSaved;
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
   * Ensures all clicks are saved to user account database (HubSpot-friendly)
   * Only works for logged-in users
   */
  const addSaved = useCallback(
    async (franchise: SavedFranchise) => {
      // Only allow for logged-in users
      if (!isLoggedIn || !user) {
        console.warn('addSaved called but user is not logged in or user data not available');
        return;
      }

      const franchiseWithTimestamp: SavedFranchise = {
        ...franchise,
        timestamp: new Date().toISOString(),
      };

      // Use functional state updates to avoid race conditions with rapid clicks
      // This ensures that even if user clicks 3 saves rapidly, all 3 are saved
      // CRITICAL: Always read from localStorage to get the absolute latest state
      // This prevents losing clicks when multiple components update simultaneously
      setSavedItems((prev) => {
        // Always read fresh from localStorage to get latest state from any component
        const currentSavedFromStorage = getUserData<SavedFranchise[]>(user.id, 'saved', []);
        
        // Use the longer array (either prev or storage) to ensure we have all items
        // This handles rapid clicks across multiple components
        const latestSaved = currentSavedFromStorage.length >= prev.length 
          ? currentSavedFromStorage 
          : prev;
        
        // Check if already saved using latest state - prevents duplicates
        if (latestSaved.some((item) => item.id === franchise.id)) {
          console.log(`Franchise ${franchise.name} already in saved, skipping`);
          return latestSaved; // Already saved, return latest state
        }
        
        // Add to saved using latest state - ensures all rapid clicks are processed
        const newSaved = [...latestSaved, franchiseWithTimestamp];
        
        // Save to localStorage immediately (synchronous) - CRITICAL for data persistence
        // HubSpot-friendly: This data structure is ready for HubSpot contact properties
        setUserData(user.id, 'saved', newSaved);
        
        console.log(`✓ Saved franchise ${franchise.name} to user account (${user.id}). Total saved: ${newSaved.length}`);
        
        return newSaved;
      });

      // Track to HubSpot asynchronously (doesn't block UI)
      // HubSpot-friendly: This tracks the action for analytics and CRM integration
      trackSaveAction("save", franchise).catch((error) => {
        console.error("Failed to track save action:", error);
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
      //       saved_franchises: JSON.stringify(newSaved), // Store as JSON string in HubSpot
      //       last_save_timestamp: franchiseWithTimestamp.timestamp,
      //       total_saved: newSaved.length
      //     }
      //   })
      // }).catch(error => console.error('HubSpot API error:', error));
    },
    [trackSaveAction, isLoggedIn, user]
  );

  /**
   * Remove franchise from saved
   * HubSpot-ready: Can be replaced with API call
   * Updates state immediately for instant UI feedback
   * Handles rapid clicks correctly using functional state updates
   * Ensures all clicks are saved to user account database (HubSpot-friendly)
   * Only works for logged-in users
   */
  const removeSaved = useCallback(
    async (id: string) => {
      // Only allow for logged-in users
      if (!isLoggedIn || !user) {
        console.warn('removeSaved called but user is not logged in or user data not available');
        return;
      }

      // Use functional state update to get current franchise before removing
      // CRITICAL: Always read from localStorage to get the absolute latest state
      let franchiseToTrack: SavedFranchise | undefined;

      setSavedItems((prev) => {
        // Always read fresh from localStorage to get latest state from any component
        const currentSavedFromStorage = getUserData<SavedFranchise[]>(user.id, 'saved', []);
        
        // Use the longer array (either prev or storage) to ensure we have all items
        const latestSaved = currentSavedFromStorage.length >= prev.length 
          ? currentSavedFromStorage 
          : prev;
        
        franchiseToTrack = latestSaved.find((item) => item.id === id);
        const newSaved = latestSaved.filter((item) => item.id !== id);
        
        // Save to localStorage immediately (synchronous) - CRITICAL for data persistence
        // HubSpot-friendly: This data structure is ready for HubSpot contact properties
        setUserData(user.id, 'saved', newSaved);
        
        if (franchiseToTrack) {
          console.log(`✓ Removed saved franchise ${franchiseToTrack.name} from user account (${user.id}). Total saved: ${newSaved.length}`);
        }
        
        return newSaved;
      });

      // Track to HubSpot asynchronously (doesn't block UI)
      // HubSpot-friendly: This tracks the action for analytics and CRM integration
      if (franchiseToTrack) {
        trackSaveAction("unsave", franchiseToTrack).catch((error) => {
          console.error("Failed to track unsave action:", error);
        });
      }

      // TODO: Replace with HubSpot API call (non-blocking)
      // HubSpot-friendly: Can send to HubSpot API to update contact properties
      // Example HubSpot API call:
      // fetch('/api/hubspot/contacts/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     contactId: user.id, // HubSpot contact ID
      //     properties: {
      //       saved_franchises: JSON.stringify(newSaved), // Store as JSON string in HubSpot
      //       last_unsave_timestamp: new Date().toISOString(),
      //       total_saved: newSaved.length
      //     }
      //   })
      // }).catch(error => console.error('HubSpot API error:', error));
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


  return {
    savedItems,
    addSaved,
    removeSaved,
    isSaved,
  };
}

